'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * 動画データを50件ずつ取得するサーバーアクション
 * @param offset 取得開始位置
 * @returns 動画データの配列
 */
export async function fetchVideos(offset: number) {
  const supabase = createClient();

  // 50件ずつ取得 (.range(offset, offset + 49))
  // 作成日時 (created_at) の降順でソート
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, channel_id, published_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + 49);

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return data || [];
}
