'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Hydration errorを防ぐためにクライアントサイドでのみロードする
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
});

type VideoProps = {
  id: string;
};

export default function MovieCard({ video }: { video?: VideoProps }) {
  const [isWatched, setIsWatched] = useState(false);

  // カードクリック時のハンドラー
  const handleCardClick = (e: React.MouseEvent) => {
    // ReactPlayer（iframe等）のクリックはここには伝播しないことが多いが
    // カード全体のクリックとして処理する
    e.preventDefault();
    setIsWatched(!isWatched);
  };

  const videoUrl = video?.id
    ? `https://www.youtube.com/watch?v=${video.id}`
    : '';

  return (
    <div className="flex h-full w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === 'Enter'}
        className={`group relative flex h-full w-full cursor-pointer flex-col items-start justify-start overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-1 ${
          isWatched
            ? 'border-red-500 bg-red-900/10 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
            : 'border-white/10 bg-white/5 shadow-lg hover:border-indigo-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]'
        }`}
      >
        {/* サムネイル画像・動画プレイヤーエリア */}
        <div
          className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-inner transition-transform duration-500 group-hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {videoUrl ? (
            <div className="absolute inset-0 h-full w-full">
              <ReactPlayer
                src={videoUrl}
                width="100%"
                height="100%"
                controls={true} // 動画の操作ができる（ミュート、速度変更など）
                light={true} // 軽量表示（クリックで再生できる）
                playing={true} // 自動再生
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              No Video
            </div>
          )}
        </div>

        {/* テキスト情報エリア（推し活特化） */}
        <div className="flex w-full flex-col gap-2">
          {/* ユーザ作成のタグリスト */}
          <div className="flex flex-wrap gap-2 text-[10px] font-medium sm:text-xs">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1 text-indigo-200">
              #初配信
            </span>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1 text-indigo-200">
              #歌枠
            </span>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1 text-indigo-200">
              #神セトリ
            </span>
          </div>

          {/* ユーザのコメント（推奨60文字前後、省略なしで全表示） */}
          <p className="mt-1 text-xs leading-relaxed text-indigo-100/90 sm:text-sm">
            最高にエモかった！最後の曲泣ける...。推しの歌声が星空みたいにキラキラしてて、何度でも見返したくなる伝説の配信。
          </p>
        </div>
      </div>
    </div>
  );
}
