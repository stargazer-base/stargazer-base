import { createClient } from '@/lib/supabase/server';
import { Text } from '@/components/ui/Text';
import MovieLogClient from './components/MovieLogClient';

import { VideoLog } from './hooks/useVideoLog';
import { getAllChannelsNameAndColor } from '@/lib/supabase/queries/channels';

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

  /** 全STPRクリエイターの論理名とカラーコードを保持 */
  const channelsAll = await getAllChannelsNameAndColor();

  // タグの取得
  const { data: tags } = await supabase.from('tags').select('id, name');

  // ログインユーザ情報の取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ユーザの推し（oshis）情報の取得
  let initialUserOshis: string[] = [];
  let initialMostFav: string | null = null;
  const isGuest =
    (user as { is_anonymous?: boolean } | null)?.is_anonymous || false;

  if (user && !isGuest) {
    const { data: userOshis } = await supabase
      .from('oshis')
      .select('channel_id, most_fav')
      .eq('user_id', user.id);

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
  let totalVideoCount = 0;

  if (isGuest || !user) {
    // ゲストの場合は全動画から最新50件を取得
    const { count } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true });
    totalVideoCount = count || 0;

    const { data } = await supabase
      .from('videos')
      .select('id, thumbnail_url, channel_id, title')
      .order('published_at', { ascending: false })
      .limit(50);
    if (data) {
      videos = data;
    }
  } else if (initialUserOshis.length > 0) {
    // ログインユーザの場合で、推しが設定されている場合
    const { count } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true })
      .in('channel_id', initialUserOshis);
    totalVideoCount = count || 0;

    const { data } = await supabase
      .from('videos')
      .select('id, thumbnail_url, channel_id, title')
      .in('channel_id', initialUserOshis)
      .order('published_at', { ascending: false })
      .limit(50);
    if (data) {
      videos = data;
    }
  }

  let initialVideoLogs: VideoLog[] = [];
  let initialVideoTags: VideoTag[] = [];
  if (user && !isGuest) {
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
      .eq('user_id', user.id);

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
        totalVideoCount={totalVideoCount}
        oshis={channelsAll || []}
        tags={tags || []}
        initialUserOshis={initialUserOshis}
        initialMostFav={initialMostFav}
        initialVideoLogs={initialVideoLogs}
        initialVideoTags={initialVideoTags}
        userId={!isGuest && user ? user.id : null}
      />
    </main>
  );
}
