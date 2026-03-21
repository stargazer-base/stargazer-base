'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Text } from '@/components/ui/Text';

// Hydration errorを防ぐためにクライアントサイドでのみロードする
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
});

type VideoProps = {
  id: string;
};

export default function MovieCard({
  video,
  isWatched,
  onWatchChange,
  glowColor,
}: {
  video?: VideoProps;
  isWatched?: boolean;
  onWatchChange?: (isWatched: boolean) => void;
  glowColor?: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [internalIsWatched, setInternalIsWatched] = useState(false);

  const watched = isWatched !== undefined ? isWatched : internalIsWatched;

  // カードクリック時のハンドラー
  const handleCardClick = (e: React.MouseEvent) => {
    // ReactPlayer（iframe等）のクリックはここには伝播しないことが多いが
    // カード全体のクリックとして処理する
    e.stopPropagation();
    const newWatched = !watched;
    if (isWatched === undefined) {
      setInternalIsWatched(newWatched);
    }
    if (onWatchChange) {
      onWatchChange(newWatched);
    }
  };

  const videoUrl = video?.id
    ? `https://www.youtube.com/watch?v=${video.id}`
    : '';

  const glowStyle = watched && glowColor ? {
    '--glow-color': glowColor,
    '--glow-bg': `${glowColor}1A`, // 10% opacity
    '--glow-shadow-1': `${glowColor}4D`, // 30% opacity
    '--glow-shadow-2': `${glowColor}66`, // 40% opacity
  } as React.CSSProperties : {};

  return (
    <div className="flex h-full w-full">
      <div
        role="button"
        tabIndex={0}
        style={glowStyle}
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick(e);
        }}
        className={`group relative flex h-full w-full cursor-pointer flex-col items-start justify-start overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-1 ${
          watched
            ? 'border-[var(--glow-color,#ef4444)] bg-[var(--glow-bg,rgba(127,29,29,0.1))] shadow-[0_0_20px_var(--glow-shadow-1,rgba(239,68,68,0.3))] hover:shadow-[0_0_30px_var(--glow-shadow-2,rgba(239,68,68,0.4))]'
            : 'border-white/10 bg-white/5 shadow-lg hover:border-indigo-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]'
        }`}
      >
        {/* サムネイル画像・動画プレイヤーエリア */}
        <div
          className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-inner transition-transform duration-500 group-hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {videoUrl ? (
            <div
              className="absolute inset-0 h-full w-full"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ReactPlayer
                src={videoUrl}
                width="100%"
                height="100%"
                controls={true} // 動画の操作ができる（ミュート、速度変更など）
                light={true} // 軽量表示（クリックで再生できる）
                playing={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
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
          <div
            className="flex flex-wrap gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex items-center rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1">
              <Text variant="detail">#初配信</Text>
            </span>
            <span className="flex items-center rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1">
              <Text variant="detail">#歌枠</Text>
            </span>
            <span className="flex items-center rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1">
              <Text variant="detail">#神セトリ</Text>
            </span>
          </div>

          {/* ユーザのコメント（推奨60文字前後、省略なしで全表示） */}
          <Text variant="body" className="mt-1 leading-relaxed">
            自分用一言コメントを60文字くらいでここに記載できます。Coming soon...
          </Text>
        </div>
      </div>
    </div>
  );
}
