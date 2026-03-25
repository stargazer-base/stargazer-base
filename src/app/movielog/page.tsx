import { createClient } from '@/lib/supabase/server';
import { Text } from '@/components/ui/Text';
import MovieLogClient from './components/MovieLogClient';

export default async function MovieLogPage() {
  const supabase = createClient();

  // 動画の取得
  const { data: videos } = await supabase
    .from('videos')
    .select('id, thumbnail_url, channel_id')
    .order('published_at', { ascending: false })
    .limit(300);

  // 推し（チャンネル）の取得
  const { data: channels } = await supabase
    .from('channels')
    .select('id, name_jp, color_code')
    .eq('is_deleted', false)
    .order('disp_order', { ascending: true });

  // タグの取得
  const { data: tags } = await supabase
    .from('tags')
    .select('id, name')
    .eq('is_deleted', false);

  // ログインユーザ情報の取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザの推し（oshis）情報の取得
  let initialUserOshis: string[] = [];
  let initialMostFav: string | null = null;
  if (user) {
    const { data: userOshis } = await supabase
      .from('oshis')
      .select('channel_id, most_fav')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (userOshis) {
      initialUserOshis = userOshis.map((o) => o.channel_id);
      const fav = userOshis.find((o) => o.most_fav);
      if (fav) {
        initialMostFav = fav.channel_id;
      }
    }
  }

  let initialWatchedVideoIds: string[] = [];
  if (user) {
    const { data: videologs } = await supabase
      .from('video_logs')
      .select('youtube_video_id')
      .eq('user_id', user.id)
      .eq('is_watched', true);

    if (videologs) {
      initialWatchedVideoIds = videologs.map((log) => log.youtube_video_id);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-8 py-24">
      {/* タイトルとサブタイトル */}
      <div className="flex flex-col items-center justify-center">
        <Text variant="pageTitle">推し色に染まる</Text>
        <Text variant="subTitle" className="mt-4">
          YouTube動画視聴ログ管理アプリ
        </Text>
      </div>

      {/* クライアント側コンポーネントで検索と動画一覧を管理 */}
      <MovieLogClient
        initialVideos={videos || []}
        oshis={channels || []}
        tags={tags || []}
        initialUserOshis={initialUserOshis}
        initialMostFav={initialMostFav}
        initialWatchedVideoIds={initialWatchedVideoIds}
        userId={user?.id || null}
      />
    </main>
  );
}
