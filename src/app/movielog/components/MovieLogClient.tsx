'use client';

import React, { useMemo, useState } from 'react';
import SearchSection, { FilterState } from './SearchSection';
import MovieCard from '@/components/ui/MovieCard';

interface Video {
  id: string;
  thumbnail_url: string | null;
  channel_id: string;
}

interface MovieLogClientProps {
  initialVideos: Video[];
  oshis: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export default function MovieLogClient({ initialVideos, oshis, tags }: MovieLogClientProps) {
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

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

  return (
    <>
      {/* 検索エリア（ボタン＋パネル） */}
      <SearchSection 
        oshis={oshis} 
        tags={tags} 
        onApply={setAppliedFilters}
      />

      {/* 動画カードリスト */}
      <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <MovieCard key={video.id} video={video as { id: string }} />
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
