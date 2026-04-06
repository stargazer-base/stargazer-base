'use client';

import React, { useMemo, useState } from 'react';
import SearchSection, { FilterState } from './SearchSection';
import MovieCard from '@/components/ui/MovieCard';
import { Text } from '@/components/ui/Text';
import { createClient } from '@/lib/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faCrown } from '@fortawesome/free-solid-svg-icons';
import { VideoLog, useVideoLog } from '../hooks/useVideoLog';
import { useVideoTags } from '../hooks/useVideoTags';
import { getAllChannelsNameAndColor } from '@/lib/supabase/queries/channels';

// SQLの型定義から逆算してパラメータの型も定義する
/** 全STPRクリエイターの論理名とカラーコード */
type ChannelData = Awaited<
  ReturnType<typeof getAllChannelsNameAndColor>
>[number];

interface Video {
  id: string;
  thumbnail_url: string | null;
  channel_id: string;
  title: string;
}

interface MovieLogClientProps {
  initialVideos: Video[];
  totalVideoCount: number;
  oshis: ChannelData[];
  tags: { id: string; name: string }[];
  initialUserOshis: string[];
  initialMostFav: string | null;
  initialVideoLogs: VideoLog[];
  initialVideoTags: { youtube_video_id: string; tag_id: string }[];
  userId: string | null;
}

export default function MovieLogClient({
  initialVideos,
  totalVideoCount,
  oshis,
  tags,
  initialUserOshis,
  initialMostFav,
  initialVideoLogs,
  initialVideoTags,
  userId,
}: MovieLogClientProps) {
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null
  );

  const { logs, toggleWatchStatus, updateComment, toggleFavoriteStatus } =
    useVideoLog(initialVideoLogs, userId);
  const { userTags, videoTagsMap, updateVideoTags } = useVideoTags(
    tags,
    initialVideoTags,
    userId
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOshiPanelOpen, setIsOshiPanelOpen] = useState(false);
  const [savedOshis, setSavedOshis] = useState<string[]>(initialUserOshis);
  const [registeredOshis, setRegisteredOshis] =
    useState<string[]>(initialUserOshis);
  const [mostFavOshi, setMostFavOshi] = useState<string | null>(initialMostFav);

  const mostFavColor = useMemo(() => {
    return oshis.find((o) => o.id === mostFavOshi)?.color_code || null;
  }, [mostFavOshi, oshis]);

  const toggleRegisteredOshi = (id: string) => {
    setRegisteredOshis((prev) => {
      if (prev.includes(id)) {
        if (mostFavOshi === id) setMostFavOshi(null);
        return prev.filter((o) => o !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleUpdateOshis = async () => {
    if (!userId) {
      setSavedOshis(registeredOshis);
      alert('※ゲストのため設定は保存されません。保存にはログインが必要です');
      return;
    }

    const supabase = createClient();

    const upsertData: {
      user_id: string;
      channel_id: string;
      most_fav: boolean;
    }[] = [];
    const deleteIds: string[] = [];

    oshis.forEach((oshi) => {
      const isSelected = registeredOshis.includes(oshi.id);
      const wasSelected = savedOshis.includes(oshi.id);
      const isMostFav = mostFavOshi === oshi.id;

      if (isSelected) {
        upsertData.push({
          user_id: userId,
          channel_id: oshi.id,
          most_fav: isMostFav,
        });
      } else if (wasSelected) {
        deleteIds.push(oshi.id);
      }
    });

    let hasError = false;

    if (upsertData.length > 0) {
      const { error } = await supabase
        .from('oshis')
        .upsert(upsertData, { onConflict: 'user_id, channel_id' });
      if (error) {
        console.error('Failed to update oshis:', error);
        hasError = true;
      }
    }

    if (deleteIds.length > 0) {
      const { error } = await supabase
        .from('oshis')
        .delete()
        .eq('user_id', userId)
        .in('channel_id', deleteIds);
      if (error) {
        console.error('Failed to delete oshis:', error);
        hasError = true;
      }
    }

    if (hasError) {
      alert('推しの更新に失敗しました。');
    } else if (upsertData.length > 0 || deleteIds.length > 0) {
      setSavedOshis(registeredOshis);
      alert('推しを更新しました！');
    } else {
      alert('変更がありません。');
    }
  };

  const filteredVideos = useMemo(() => {
    if (!appliedFilters) {
      if (savedOshis && savedOshis.length > 0) {
        return initialVideos.filter((video) =>
          savedOshis.includes(video.channel_id)
        );
      }
      if (!userId) return initialVideos;
      return [];
    }

    return initialVideos.filter((video) => {
      // 推しフィルター: 選択されている推しが1つ以上ある場合、channel_idがいずれかに一致する必要がある
      if (appliedFilters.selectedOshis.length > 0) {
        if (!appliedFilters.selectedOshis.includes(video.channel_id)) {
          return false;
        }
      } else {
        // 検索で「推し」が指定されていない場合は、自分の推しに設定している動画のみ表示
        // これにより、他のメンバーの動画を見るには必ず検索パネルで絞り込む必要がある
        if (savedOshis.length > 0) {
          if (!savedOshis.includes(video.channel_id)) {
            return false;
          }
        } else if (userId) {
          return false;
        }
      }

      // 視聴済みフィルター
      const isWatched = logs[video.id]?.is_watched || false;
      if (appliedFilters.watchedFilter === 'watched') {
        if (!isWatched) return false;
      } else if (appliedFilters.watchedFilter === 'not_watched') {
        if (isWatched) return false;
      }

      // お気に入りフィルター
      const isFavorite = logs[video.id]?.is_favorite || false;
      if (appliedFilters.favoriteFilter === 'favorite') {
        if (!isFavorite) return false;
      } else if (appliedFilters.favoriteFilter === 'not_favorite') {
        if (isFavorite) return false;
      }

      // タグフィルター (AND検索)
      if (
        appliedFilters.selectedTags &&
        appliedFilters.selectedTags.length > 0
      ) {
        const videoTagIds = videoTagsMap[video.id] || [];
        const hasAllTags = appliedFilters.selectedTags.every((t) =>
          videoTagIds.includes(t)
        );
        if (!hasAllTags) return false;
      }

      // キーワードフィルター (タイトル、コメントの部分一致検索・複数キーワード 半角スペース区切りAND検索)
      if (appliedFilters.keyword) {
        const keywords = appliedFilters.keyword
          .toLowerCase()
          .split(' ')
          .filter((k) => k.trim() !== '');
        if (keywords.length > 0) {
          const title = video.title ? video.title.toLowerCase() : '';
          const comment = (logs[video.id]?.comment || '').toLowerCase();

          const targetText = `${title} ${comment}`;

          const isMatch = keywords.every((kw) => targetText.includes(kw));
          if (!isMatch) {
            return false;
          }
        }
      }

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVideos, appliedFilters, savedOshis]);

  const dyedCount = useMemo(() => {
    return initialVideos.filter((v) => logs[v.id]?.is_watched).length;
  }, [initialVideos, logs]);

  return (
    <>
      {/* 染まり度を表示するエリア */}
      <div className="mt-6 flex w-full max-w-5xl flex-col items-center justify-center gap-4">
        <Text variant="subTitle">
          推しへの染まり度 ♡{' '}
          {totalVideoCount > 0
            ? Math.round((dyedCount / totalVideoCount) * 100)
            : 0}
          % ({dyedCount} / {totalVideoCount})
        </Text>
      </div>

      {/* ボタンエリア（推し設定＆検索） */}
      <div className="mt-12 flex w-full max-w-5xl flex-row items-center justify-center gap-6">
        <button
          onClick={() => setIsOshiPanelOpen(!isOshiPanelOpen)}
          disabled={isSearchOpen}
          className={`flex items-center gap-2 rounded-full px-8 py-3 font-medium tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300 ${isSearchOpen ? 'scale-100 cursor-not-allowed bg-white/5 text-white/30' : 'bg-white/10 text-white/70 hover:scale-105 hover:bg-white/20 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
        >
          <FontAwesomeIcon icon={faHeart} size="xl" />
          <span>推し設定</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          disabled={isOshiPanelOpen}
          className={`flex items-center gap-2 rounded-full px-8 py-3 font-medium tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300 ${isOshiPanelOpen ? 'scale-100 cursor-not-allowed bg-white/5 text-white/30' : 'bg-white/10 text-white/70 hover:scale-105 hover:bg-white/20 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />

          <span>検索</span>
        </button>
      </div>

      {/* 推し登録パネル */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center">
        <div
          className={`w-full max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${
            isOshiPanelOpen
              ? 'mt-6 max-h-[1000px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-lg">
            <span className="mb-4 block text-[10px] font-normal uppercase tracking-wider text-indigo-200">
              自分の推しを選択（敬称略）
            </span>
            <div className="flex flex-wrap gap-2">
              {oshis.map((oshi) => (
                <button
                  key={oshi.id}
                  onClick={() => toggleRegisteredOshi(oshi.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    registeredOshis.includes(oshi.id)
                      ? 'border-indigo-400 bg-indigo-500/30 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                      : 'border-white/10 bg-black/20 text-white/50 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {oshi.name_jp}
                </button>
              ))}
            </div>

            <span className="mb-4 mt-8 block text-[10px] font-normal uppercase tracking-wider text-amber-200">
              最推しを選択（1人のみ）
            </span>
            <div className="flex flex-wrap gap-2">
              {registeredOshis.length > 0 ? (
                oshis
                  .filter((oshi) => registeredOshis.includes(oshi.id))
                  .map((oshi) => (
                    <button
                      key={`fav-${oshi.id}`}
                      onClick={() =>
                        setMostFavOshi(mostFavOshi === oshi.id ? null : oshi.id)
                      }
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        mostFavOshi === oshi.id
                          ? 'border-amber-400 bg-amber-500/30 text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                          : 'border-white/10 bg-black/20 text-white/50 hover:border-white/30 hover:text-white/80'
                      }`}
                    >
                      {mostFavOshi === oshi.id && (
                        <FontAwesomeIcon icon={faCrown} />
                      )}
                      {oshi.name_jp}
                    </button>
                  ))
              ) : (
                <span className="text-xs text-white/40">
                  先に上のリストから推しを選択してください
                </span>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdateOshis}
                className="rounded-full bg-indigo-500/80 px-6 py-2 text-xs font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-colors hover:bg-indigo-500"
              >
                更新する
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 検索エリアパネル */}
      <SearchSection
        oshis={oshis.filter((o) => savedOshis.includes(o.id))}
        tags={tags}
        onApply={setAppliedFilters}
        isOpen={isSearchOpen}
      />

      {/* 動画カードリスト */}
      <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <MovieCard
              key={video.id}
              video={{
                id: video.id,
                title: video.title,
                channelName:
                  oshis.find((o) => o.id === video.channel_id)?.name_jp ||
                  'Unknown',
              }}
              isWatched={logs[video.id]?.is_watched || false}
              comment={logs[video.id]?.comment || ''}
              isFavorite={logs[video.id]?.is_favorite || false}
              videoTags={
                videoTagsMap[video.id]
                  ? userTags.filter((t) =>
                      videoTagsMap[video.id]?.includes(t.id)
                    )
                  : []
              }
              userTags={userTags}
              onWatchChange={(isWatched) =>
                toggleWatchStatus(video.id, isWatched)
              }
              onCommentSave={(comment) => updateComment(video.id, comment)}
              onTagsSave={(selectedTagIds: string[], newTagNames: string[]) =>
                updateVideoTags(video.id, selectedTagIds, newTagNames)
              }
              onFavoriteToggle={(isFavorite) =>
                toggleFavoriteStatus(video.id, isFavorite)
              }
              glowColor={mostFavColor}
            />
          ))}
          {filteredVideos.length === 0 && (
            <div className="col-span-full py-12 text-center text-indigo-200/50">
              条件に一致する動画が見つかりませんでした。
            </div>
          )}
        </div>
      </div>
    </>
  );
}
