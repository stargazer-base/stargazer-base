'use client';

import React, { useMemo, useState } from 'react';
import SearchSection, { FilterState } from './SearchSection';
import MovieCard from '@/components/ui/MovieCard';
import { Text } from '@/components/ui/Text';
import { createClient } from '@/lib/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faCrown } from '@fortawesome/free-solid-svg-icons';

interface Video {
  id: string;
  thumbnail_url: string | null;
  channel_id: string;
}

interface MovieLogClientProps {
  initialVideos: Video[];
  oshis: { id: string; name_jp: string; color_code: string }[];
  tags: { id: string; name: string }[];
  initialUserOshis: string[];
  initialMostFav: string | null;
  userId: string | null;
}

export default function MovieLogClient({
  initialVideos,
  oshis,
  tags,
  initialUserOshis,
  initialMostFav,
  userId,
}: MovieLogClientProps) {
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null
  );
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(
    new Set()
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
      alert('ログインが必要です');
      return;
    }

    const supabase = createClient();

    const upsertData = oshis
      .map((oshi) => {
        const isSelected = registeredOshis.includes(oshi.id);
        const wasSelected = savedOshis.includes(oshi.id);
        const isMostFav = mostFavOshi === oshi.id;

        if (isSelected) {
          return { user_id: userId, channel_id: oshi.id, is_deleted: false, most_fav: isMostFav };
        } else if (wasSelected) {
          return { user_id: userId, channel_id: oshi.id, is_deleted: true, most_fav: false };
        }
        return null;
      })
      .filter(Boolean) as {
      user_id: string;
      channel_id: string;
      is_deleted: boolean;
      most_fav: boolean;
    }[];

    if (upsertData.length > 0) {
      const { error } = await supabase
        .from('oshis')
        .upsert(upsertData, { onConflict: 'user_id, channel_id' });
      if (error) {
        console.error('Failed to update oshis:', error);
        alert('推しの更新に失敗しました。');
      } else {
        setSavedOshis(registeredOshis);
        alert('推しを更新しました！');
      }
    } else {
      alert('変更がありません。');
    }
  };

  const handleWatchChange = (id: string, isWatched: boolean) => {
    setWatchedVideoIds((prev) => {
      const next = new Set(prev);
      if (isWatched) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const filteredVideos = useMemo(() => {
    if (!appliedFilters) {
      if (savedOshis && savedOshis.length > 0) {
        return initialVideos.filter((video) =>
          savedOshis.includes(video.channel_id)
        );
      }
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
        } else {
          return false;
        }
      }
      return true;
    });
  }, [initialVideos, appliedFilters, savedOshis]);

  const dyedCount = useMemo(() => {
    return filteredVideos.filter((v) => watchedVideoIds.has(v.id)).length;
  }, [filteredVideos, watchedVideoIds]);

  return (
    <>
      {/* 染まり度を表示するエリア */}
      <div className="mt-6 flex w-full max-w-5xl flex-col items-center justify-center gap-4">
        <Text variant="subTitle">
          推しへの染まり度 ♡{' '}
          {Math.round((dyedCount / filteredVideos.length) * 100) || 0}% (
          {dyedCount} / {filteredVideos.length})
        </Text>
      </div>

      {/* ボタンエリア（推し設定＆検索） */}
      <div className="mt-12 flex w-full max-w-5xl flex-row items-center justify-center gap-6">
        {userId && (
          <button
            onClick={() => setIsOshiPanelOpen(!isOshiPanelOpen)}
            disabled={isSearchOpen}
            className={`flex items-center gap-2 rounded-full px-8 py-3 font-medium tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300 ${isSearchOpen ? 'scale-100 cursor-not-allowed bg-white/5 text-white/30' : 'bg-white/10 text-white/70 hover:scale-105 hover:bg-white/20 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
          >
            <FontAwesomeIcon icon={faHeart} size="xl" />
            <span>推し設定</span>
          </button>
        )}

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
      {userId && (
        <div className="flex w-full max-w-5xl flex-col items-center justify-center">
          <div
            className={`w-full max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${
              isOshiPanelOpen
                ? 'mt-6 max-h-[500px] opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-lg">
              <span className="mb-4 block text-[10px] font-normal uppercase tracking-wider text-indigo-200">
                自分の推しを選択
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
                        onClick={() => setMostFavOshi(mostFavOshi === oshi.id ? null : oshi.id)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          mostFavOshi === oshi.id
                            ? 'border-amber-400 bg-amber-500/30 text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                            : 'border-white/10 bg-black/20 text-white/50 hover:border-white/30 hover:text-white/80'
                        }`}
                      >
                        {mostFavOshi === oshi.id && <FontAwesomeIcon icon={faCrown} />}
                        {oshi.name_jp}
                      </button>
                    ))
                ) : (
                  <span className="text-xs text-white/40">先に上のリストから推しを選択してください</span>
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
      )}

      {/* 検索エリアパネル */}
      <SearchSection
        oshis={oshis}
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
              video={video as { id: string }}
              isWatched={watchedVideoIds.has(video.id)}
              onWatchChange={(isWatched) =>
                handleWatchChange(video.id, isWatched)
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
