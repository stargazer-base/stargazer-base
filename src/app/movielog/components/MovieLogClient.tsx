'use client';

import React, { useMemo, useState } from 'react';
import SearchSection, { FilterState } from './SearchSection';
import MovieCard from '@/components/ui/MovieCard';
import { Text } from '@/components/ui/Text';

interface Video {
  id: string;
  thumbnail_url: string | null;
  channel_id: string;
}

interface MovieLogClientProps {
  initialVideos: Video[];
  oshis: { id: string; name_jp: string }[];
  tags: { id: string; name: string }[];
}

export default function MovieLogClient({
  initialVideos,
  oshis,
  tags,
}: MovieLogClientProps) {
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
    null
  );
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(
    new Set()
  );

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
    if (!appliedFilters) return initialVideos;

    return initialVideos.filter((video) => {
      // 推しフィルター: 選択されている推しが1つ以上ある場合、channel_idがいずれかに一致する必要がある
      if (appliedFilters.selectedOshis.length > 0) {
        if (!appliedFilters.selectedOshis.includes(video.channel_id)) {
          return false;
        }
      }
      return true;
    });
  }, [initialVideos, appliedFilters]);

  const dyedCount = useMemo(() => {
    return filteredVideos.filter((v) => watchedVideoIds.has(v.id)).length;
  }, [filteredVideos, watchedVideoIds]);

  return (
    <>
      {/* 染まり度を表示するエリア */}
      <div className="mt-6 flex w-full max-w-5xl flex-col items-center justify-center">
        <Text variant="subTitle">
          推しへの染まり度 ♡{' '}
          {Math.round((dyedCount / filteredVideos.length) * 100)}% ({dyedCount}{' '}
          / {filteredVideos.length})
        </Text>
      </div>

      {/* 検索エリア（ボタン＋パネル） */}
      <SearchSection oshis={oshis} tags={tags} onApply={setAppliedFilters} />

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
