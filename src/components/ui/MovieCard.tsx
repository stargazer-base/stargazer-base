'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Text } from '@/components/ui/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck } from '@fortawesome/free-solid-svg-icons';

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
  comment,
  onWatchChange,
  onCommentSave,
  glowColor,
}: {
  video?: VideoProps;
  isWatched?: boolean;
  comment?: string;
  onWatchChange?: (isWatched: boolean) => void;
  onCommentSave?: (comment: string) => void;
  glowColor?: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [internalIsWatched, setInternalIsWatched] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const isValidComment = commentInput.length <= 64 && 
    !commentInput.toLowerCase().includes('<script') && 
    !commentInput.toLowerCase().includes('javascript:');

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

          {/* ユーザのコメント */}
          <div className="relative mt-1 flex w-full flex-col">
            {onCommentSave && (
              <div className="absolute -top-1 right-0 z-20">
                {isEditingComment ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isValidComment) {
                        onCommentSave(commentInput);
                        setIsEditingComment(false);
                      }
                    }}
                    disabled={!isValidComment}
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                      isValidComment
                        ? 'bg-emerald-500/80 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:bg-emerald-500 hover:scale-110'
                        : 'bg-gray-500/50 text-white/50 cursor-not-allowed'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCheck} size="xs" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentInput(comment || '');
                      setIsEditingComment(true);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md transition-all hover:bg-black/60 hover:text-white hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faPen} size="xs" />
                  </button>
                )}
              </div>
            )}
            
            {isEditingComment ? (
              <div className="w-full pr-8" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="一言コメントを入力（64文字まで）"
                  className={`w-full rounded border bg-black/50 px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none transition-colors ${
                    !isValidComment ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-indigo-400'
                  }`}
                />
                {!isValidComment && commentInput.length > 64 && (
                  <span className="mt-1 block text-xs text-red-400">64文字以内で入力してください</span>
                )}
                {!isValidComment && commentInput.length <= 64 && (
                  <span className="mt-1 block text-xs text-red-400">不正な入力が含まれています</span>
                )}
              </div>
            ) : (
              <Text variant="body" className={`min-h-[24px] pr-8 leading-relaxed ${!comment ? 'text-white/40' : 'text-white/80'}`}>
                {comment || '自分用一言コメントをここに記載できます。'}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
