import ButtonArea from '@/components/ui/VideoActionButtons';
import MovieCard from '@/components/ui/MovieCard';
import { createClient } from '@/lib/supabase/server';

export default async function MovieLogPage() {
  const supabase = createClient();
  const { data: videos } = await supabase
    .from('videos')
    .select('id, thumbnail_url')
    .order('published_at', { ascending: false })
    .limit(10);

  return (
    <main className="box-border flex min-h-screen flex-col items-center justify-start p-24 text-center">
      <div className="flex flex-col items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <h1 className="text-4xl font-bold tracking-wider text-white">
          推し色に染まる
        </h1>
        <p className="mt-4 text-xl text-indigo-100/90">
          YouTube動画視聴ログ管理アプリ
        </p>
      </div>
      <div className="mt-8">
        <ButtonArea />
      </div>

      <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos?.map((video) => (
            <MovieCard
              key={video.id}
              video={video as { id: string; thumbnail_url: string | null }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
