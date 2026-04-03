'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Text } from '@/components/ui/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck, faTag, faStar } from '@fortawesome/free-solid-svg-icons';

// Hydration errorを防ぐためにクライアントサイドでのみロードする
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
});

type VideoProps = {
  id: string;
  title?: string;
  channelName?: string;
};

export default function MovieCard({
  video,
  isWatched,
  comment,
  videoTags,
  userTags,
  onWatchChange,
  onCommentSave,
  onTagsSave,
  isFavorite,
  onFavoriteToggle,
  glowColor,
}: {
  video?: VideoProps;
  isWatched?: boolean;
  comment?: string;
  videoTags?: { id: string; name: string }[];
  userTags?: { id: string; name: string }[];
  onWatchChange?: (isWatched: boolean) => void;
  onCommentSave?: (comment: string) => void;
  onTagsSave?: (selectedTagIds: string[], newTagNames: string[]) => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
  glowColor?: string | null;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [internalIsWatched, setInternalIsWatched] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [isEditingTags, setIsEditingTags] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  const isValidComment =
    commentInput.length <= 64 &&
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

  const glowStyle =
    watched && glowColor
      ? ({
          '--glow-color': glowColor,
          '--glow-bg': `${glowColor}1A`, // 10% opacity
          '--glow-shadow-1': `${glowColor}4D`, // 30% opacity
          '--glow-shadow-2': `${glowColor}66`, // 40% opacity
        } as React.CSSProperties)
      : {};

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
        {/* ホバー時に表示されるタイトル・チャンネル名ツールチップ */}
        <div className="pointer-events-none absolute -top-4 left-0 right-0 z-40 mx-4 mt-8 flex translate-y-[-10px] flex-col items-start justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="w-full break-words rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-xs font-medium leading-relaxed text-white shadow-xl backdrop-blur-md">
            <span className="text-indigo-300">{video?.channelName}</span>
            <span className="mx-1 text-white/50">/</span>
            <span className="text-white/90">{video?.title}</span>
          </div>
        </div>

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
        <div className="relative flex w-full flex-col gap-3">
          {/* お気に入りエリア */}
          <div className="flex w-full items-start gap-3">
            {onFavoriteToggle && (
              <div className="mt-0.5 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle(!isFavorite);
                  }}
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                    isFavorite
                      ? 'border border-amber-400 bg-amber-500/30 text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.3)] hover:scale-110 hover:bg-amber-500/50'
                      : 'bg-black/40 text-white/70 backdrop-blur-md hover:scale-110 hover:bg-black/60 hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon icon={faStar} size="xs" />
                </button>
              </div>
            )}
            <div
              className={`flex min-h-[24px] flex-grow flex-col justify-center ${onFavoriteToggle ? 'cursor-pointer' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onFavoriteToggle) onFavoriteToggle(!isFavorite);
              }}
            >
              <Text
                variant="body"
                className={`flex items-center leading-relaxed transition-colors ${
                  isFavorite ? 'text-amber-200/90 font-medium' : 'text-white/40 group-hover:text-white/60'
                }`}
              >
                {isFavorite ? 'お気に入りに追加済み' : 'お気に入りに追加'}
              </Text>
            </div>
          </div>

          {/* タグエリア */}
          <div className="flex w-full items-start gap-3">
            {onTagsSave && (
              <div className="mt-0.5 flex-shrink-0">
                {isEditingTags ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTagNames = newTagInput
                        .split(/[\s　]+/)
                        .map((t) => t.trim())
                        .filter((t) => t.length > 0);
                      onTagsSave(selectedTagIds, newTagNames);
                      setIsEditingTags(false);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/80 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all hover:scale-110 hover:bg-emerald-500"
                  >
                    <FontAwesomeIcon icon={faCheck} size="xs" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTagIds(videoTags?.map((t) => t.id) || []);
                      setNewTagInput('');
                      setIsEditingTags(true);
                      setIsEditingComment(false);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faTag} size="xs" />
                  </button>
                )}
              </div>
            )}

            <div
              className="flex min-h-[24px] flex-grow flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {isEditingTags ? (
                <div className="w-full">
                  <div className="mb-1 text-[10px] text-white/60">
                    タグを選択:
                  </div>
                  <div className="mb-3 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1">
                    {userTags?.map((tag) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              setSelectedTagIds((prev) =>
                                prev.filter((id) => id !== tag.id)
                              );
                            } else {
                              setSelectedTagIds((prev) => [...prev, tag.id]);
                            }
                          }}
                          className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
                            isSelected
                              ? 'border-indigo-400 bg-indigo-500/80 text-white shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                              : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:bg-white/10 hover:text-white/80'
                          }`}
                        >
                          #{tag.name}
                        </button>
                      );
                    })}
                    {(!userTags || userTags.length === 0) && (
                      <span className="text-xs text-white/30">
                        既存のタグはありません
                      </span>
                    )}
                  </div>
                  <div className="mb-1 text-[10px] text-white/60">
                    新規タグを作成 (半角空白区切り):
                  </div>
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="例: 神回 歌枠"
                    className="w-full rounded border border-white/20 bg-black/50 px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-indigo-400"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {videoTags && videoTags.length > 0 ? (
                    videoTags.map((tag) => (
                      <span
                        key={tag.id}
                        className="flex items-center rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1"
                      >
                        <Text variant="detail">#{tag.name}</Text>
                      </span>
                    ))
                  ) : (
                    <Text
                      variant="body"
                      className="min-h-[24px] leading-relaxed text-white/40"
                    >
                      自分用タグをここに表示できます。
                    </Text>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* コメントエリア */}
          <div className="flex w-full items-start gap-3">
            {onCommentSave && (
              <div className="mt-0.5 flex-shrink-0">
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
                        ? 'bg-emerald-500/80 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:scale-110 hover:bg-emerald-500'
                        : 'cursor-not-allowed bg-gray-500/50 text-white/50'
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
                      setIsEditingTags(false);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faPen} size="xs" />
                  </button>
                )}
              </div>
            )}

            <div
              className="flex min-h-[24px] flex-grow flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {isEditingComment ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="一言コメントを入力（64文字まで）"
                    className={`w-full rounded border bg-black/50 px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none transition-colors ${
                      !isValidComment
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/20 focus:border-indigo-400'
                    }`}
                  />
                  {!isValidComment && commentInput.length > 64 && (
                    <span className="mt-1 block text-xs text-red-400">
                      64文字以内で入力してください
                    </span>
                  )}
                  {!isValidComment && commentInput.length <= 64 && (
                    <span className="mt-1 block text-xs text-red-400">
                      不正な入力が含まれています
                    </span>
                  )}
                </div>
              ) : (
                <Text
                  variant="body"
                  className={`min-h-[24px] leading-relaxed ${!comment ? 'text-white/40' : 'text-white/80'}`}
                >
                  {comment || '自分用一言コメントをここに表示できます。'}
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
