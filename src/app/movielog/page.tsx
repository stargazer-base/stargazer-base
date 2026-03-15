import MovieCard from '@/components/ui/MovieCard';
import { createClient } from '@/lib/supabase/server';
import { Text } from '@/components/ui/Text';

export default async function MovieLogPage() {
  const supabase = createClient();
  const { data: videos } = await supabase
    .from('videos')
    .select('id, thumbnail_url')
    .order('published_at', { ascending: false })
    .limit(20);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-8 py-24">
      {/* タイトルとサブタイトル */}
      <div className="flex flex-col items-center justify-center">
        <Text variant="pageTitle">推し色に染まる</Text>
        <Text variant="subTitle" className="mt-4">
          YouTube動画視聴ログ管理アプリ
        </Text>
      </div>

      {/* 動画カードリスト */}
      <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos?.map((video) => (
            <MovieCard key={video.id} video={video as { id: string }} />
          ))}
        </div>
      </div>
    </main>
  );
}
