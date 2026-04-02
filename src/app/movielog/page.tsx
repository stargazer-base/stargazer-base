import { createClient } from '@/lib/supabase/server';
import { Text } from '@/components/ui/Text';
import MovieLogClient from './components/MovieLogClient';

import { VideoLog } from './hooks/useVideoLog';

interface VideoTag {
  youtube_video_id: string;
  tag_id: string;
}

interface VideoData {
  id: string;
  thumbnail_url: string | null;
  channel_id: string;
  title: string;
}

export default async function MovieLogPage() {
  const supabase = createClient();

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

  // 動画の取得
  let videos: VideoData[] = [];
  if (initialUserOshis.length > 0) {
    const { data } = await supabase
      .from('videos')
      .select('id, thumbnail_url, channel_id, title')
      .in('channel_id', initialUserOshis)
      .order('published_at', { ascending: false })
      .limit(600);
    if (data) {
      videos = data;
    }
  }

  let initialVideoLogs: VideoLog[] = [];
  let initialVideoTags: VideoTag[] = [];
  if (user) {
    const { data: videologs } = await supabase
      .from('video_logs')
      .select('youtube_video_id, is_watched, comment, is_favorite')
      .eq('user_id', user.id);

    if (videologs) {
      initialVideoLogs = videologs as VideoLog[];
    }

    const { data: videotags } = await supabase
      .from('video_tags')
      .select('youtube_video_id, tag_id')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (videotags) {
      initialVideoTags = videotags as VideoTag[];
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
        initialVideoLogs={initialVideoLogs}
        initialVideoTags={initialVideoTags}
        userId={user?.id || null}
      />
    </main>
  );
}
