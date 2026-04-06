import { createClient } from '@/lib/supabase/client';

/**
 * 全STPRクリエイターの全情報を取得する
 */
export async function getAllChannels() {
  const supabase = createClient();
  const { data, error } = await supabase.from('channels').select('*');

  if (error) {
    throw new Error(
      `全チャンネルの全情報の取得に失敗しました: ${error.message}`
    );
  }
  return data;
}

/**
 * 全STPRクリエイターの論理名とカラーコードを取得する
 */
export async function getAllChannelsNameAndColor() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('channels')
    .select('id, name_jp, color_code')
    .order('disp_order', { ascending: true });

  if (error) {
    throw new Error(
      `全チャンネルの論理名とカラーコードの取得に失敗しました: ${error.message}`
    );
  }
  return data;
}
