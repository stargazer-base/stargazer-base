'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * 動画データを50件ずつ取得するサーバーアクション (フィルター対応)
 * @param offset 取得開始位置
 * @param userId ログインユーザーのID (視聴状態の判定用)
 * @param channelIds チャンネルIDリスト (推しフィルター)
 * @param filters 検索キーワードや視聴状態などの追加フィルター
 * @returns 動画データの配列
 */
export async function fetchVideos(
  offset: number,
  userId: string | null,
  channelIds: string[] | null,
  filters?: {
    keyword?: string;
    watchedFilter?: 'all' | 'watched' | 'not_watched';
    favoriteFilter?: 'all' | 'favorite' | 'not_favorite';
  }
) {
  const supabase = createClient();

  // 基本となる Select 句の決定
  // 絞り込み（'all' 以外）が必要な場合は !inner を使用して、条件に一致するログがあるもののみに制限する
  const isFilteringWatched = filters?.watchedFilter && filters.watchedFilter !== 'all';
  const isFilteringFavorite = filters?.favoriteFilter && filters.favoriteFilter !== 'all';
  const joinType = (isFilteringWatched || isFilteringFavorite) ? '!inner' : '';

  // 基本クエリの構築
  let query = supabase
    .from('videos')
    .select(`
      id, 
      title, 
      channel_id, 
      published_at,
      thumbnail_url,
      video_logs:video_logs${joinType}(is_watched, is_favorite, comment)
    `)
    .order('published_at', { ascending: false })
    .range(offset, offset + 49);

  // 1. チャンネルフィルタ (推し)
  if (channelIds && channelIds.length > 0) {
    query = query.in('channel_id', channelIds);
  }

  // 2. ユーザー関連フィルタ
  if (userId) {
    // 常に自分のログのみを対象にする (左結合時も有効)
    query = query.eq('video_logs.user_id', userId);

    // 視聴済みフィルタ
    if (filters?.watchedFilter === 'watched') {
      query = query.eq('video_logs.is_watched', true);
    } else if (filters?.watchedFilter === 'not_watched') {
      query = query.eq('video_logs.is_watched', false);
    }

    // お気に入りフィルタ
    if (filters?.favoriteFilter === 'favorite') {
      query = query.eq('video_logs.is_favorite', true);
    } else if (filters?.favoriteFilter === 'not_favorite') {
      query = query.eq('video_logs.is_favorite', false);
    }
  }

  // 3. キーワード検索 (タイトル + ユーザーコメント)
  if (filters?.keyword) {
    const kw = `%${filters.keyword}%`;
    // タイトルまたはコメントに含まれる場合
    query = query.or(`title.ilike.${kw},video_logs.comment.ilike.${kw}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  // データの正規化 (VirtualizedVideoList が期待する形式に合わせる)
  return (data || []).map((v: any) => ({
    ...v,
    // VirtualizedVideoList 側で logs プロップスを参照するため、ここではデータのみ返す
  }));
}

/**
 * ユーザーの推し設定に基づいた「染まり度」の統計を取得する
 * @param userId ユーザーID
 * @param channelIds 選択されている推しチャンネルのIDリスト
 * @returns { totalCount, dyedCount }
 */
export async function fetchDyeingStats(userId: string | null, channelIds: string[]) {
  const supabase = createClient();

  if (channelIds.length === 0) {
    return { totalCount: 0, dyedCount: 0 };
  }

  // 1. 分母: 指定されたチャンネルの全動画数
  const { count: totalCount, error: totalError } = await supabase
    .from('videos')
    .select('id', { count: 'exact', head: true })
    .in('channel_id', channelIds);

  if (totalError) {
    console.error('Error fetching total video count:', totalError);
  }

  // 2. 分子: 指定されたチャンネルの中で、自分が視聴済みの動画数
  let dyedCount = 0;
  if (userId) {
    const { count, error: dyedError } = await supabase
      .from('video_logs')
      .select('id, videos!inner(channel_id)', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_watched', true)
      .in('videos.channel_id', channelIds);

    if (dyedError) {
      console.error('Error fetching dyed video count:', dyedError);
    } else {
      dyedCount = count || 0;
    }
  }

  return {
    totalCount: totalCount || 0,
    dyedCount: dyedCount || 0
  };
}
