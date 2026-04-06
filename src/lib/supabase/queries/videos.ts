'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * 動画データを50件ずつ取得するサーバーアクション
 * @param offset 取得開始位置
 * @param channelIds フィルタリングするチャンネルID（オプション）
 * @returns 動画データの配列
 */
export async function fetchVideos(offset: number, channelIds?: string[]) {
  const supabase = createClient();

  let query = supabase
    .from('videos')
    .select('id, title, channel_id, published_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + 49);

  // チャンネルIDが指定されている場合は絞り込む
  if (channelIds && channelIds.length > 0) {
    query = query.in('channel_id', channelIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return data || [];
}
