'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import MovieCard from '@/components/ui/MovieCard';
import { fetchVideos } from '@/lib/supabase/queries/videos';
import { FilterState } from './SearchSection';

/**
 * 動画データの型定義
 */
interface Video {
  id: string;
  title: string;
  channel_id: string;
  published_at?: string;
}

/**
 * チャンネル情報の型定義
 */
interface ChannelData {
  id: string;
  name_jp: string;
  color_code: string | null;
}

/**
 * 動画ログ（視聴状態・お気に入り・コメント）の型定義
 */
interface VideoLog {
  is_watched: boolean;
  is_favorite: boolean;
  comment: string;
}

/**
 * タグ関連の型定義
 */
interface Tag {
  id: string;
  name: string;
}

interface VirtualizedVideoListProps {
  userId: string | null;
  initialVideos: Video[];
  filterChannelIds: string[];
  appliedFilters: FilterState | null;
  logs: Record<string, VideoLog>;
  videoTagsMap: Record<string, string[]>;
  userTags: Tag[];
  oshis: ChannelData[];
  glowColor: string | null;
  onWatchChange: (videoId: string, isWatched: boolean) => void | Promise<any>;
  onCommentSave: (videoId: string, comment: string) => void | Promise<any>;
  onFavoriteToggle: (videoId: string, isFavorite: boolean) => void | Promise<any>;
  onTagsSave: (videoId: string, selectedTagIds: string[], newTagNames: string[]) => void | Promise<any>;
}

/**
 * 無限スクロール付き仮想化リストコンポーネント
 * 画面外のDOMを破棄（仮想化）しつつ、最下部到達時に自動で次の50件を取得します。
 */
export default function VirtualizedVideoList({
  userId,
  initialVideos,
  filterChannelIds,
  appliedFilters,
  logs,
  videoTagsMap,
  userTags,
  oshis,
  glowColor,
  onWatchChange,
  onCommentSave,
  onFavoriteToggle,
  onTagsSave,
}: VirtualizedVideoListProps) {
  // --- 状態管理 ---
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const [columns, setColumns] = useState(1);
  const isFirstMount = useRef(true);

  // --- フィルタ更新時のリセットロジック ---
  useEffect(() => {
    // 初回マウント時は page.tsx から受け取った initialVideos を優先するためスキップ
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // 条件（推し設定 or 検索条件）が変わったらリロードして初期化
    const resetAndFetch = async () => {
      setIsLoading(true);
      setVideos([]); // 画面をクリアしてリロード感を出す
      setHasMore(true);
      
      // 検索パネルでの推し選択があればそれを優先、なければ基本の推し設定を使用
      const activeChannelIds = appliedFilters && appliedFilters.selectedOshis.length > 0 
        ? appliedFilters.selectedOshis 
        : filterChannelIds;

      // 最初から(offset: 0)取得
      const newVideos = await fetchVideos(0, userId, activeChannelIds, appliedFilters || undefined);
      setVideos(newVideos);
      
      if (newVideos.length < 50) {
        setHasMore(false);
      }
      setIsLoading(false);
      
      // 最上部へ戻る (絞り込み時は必須)
      window.scrollTo({ top: 0 });
    };

    resetAndFetch();
  }, [filterChannelIds, appliedFilters, userId]);

  // プロップスの initialVideos が変更された場合の同期
  useEffect(() => {
    if (initialVideos.length > 0 && videos.length === 0 && !isLoading) {
      setVideos(initialVideos);
      setHasMore(true);
    }
  }, [initialVideos, videos.length, isLoading]);

  // --- レイアウト・スクロール管理 ---
  useEffect(() => {
    if (parentRef.current) {
      setScrollMargin(parentRef.current.offsetTop);
    }
    
    const updateColumns = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        if (width >= 1024) setColumns(3); // lg
        else if (width >= 640) setColumns(2); // sm
        else setColumns(1);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 行数の計算
  const rowCount = Math.ceil(videos.length / columns);

  // --- 追加データの取得 ---
  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const activeChannelIds = appliedFilters && appliedFilters.selectedOshis.length > 0 
      ? appliedFilters.selectedOshis 
      : filterChannelIds;

    const newVideos = await fetchVideos(videos.length, userId, activeChannelIds, appliedFilters || undefined);
    
    if (newVideos.length === 0) {
      setHasMore(false);
    } else {
      setVideos((prev) => [...prev, ...newVideos]);
    }
    setIsLoading(false);
  }, [videos.length, isLoading, hasMore, filterChannelIds, appliedFilters, userId]);

  // --- 仮想化の設定 ---
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => (typeof window !== 'undefined' ? (window as any) : null),
    estimateSize: () => 450,
    overscan: 5,
    scrollMargin,
    observeElementRect: (instance, cb) => {
      const element = instance.scrollElement;
      if (!element) return;
      if (element instanceof Window) {
        const handler = () => cb({ width: element.innerWidth, height: element.innerHeight });
        handler();
        element.addEventListener('resize', handler);
        return () => element.removeEventListener('resize', handler);
      }
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) cb({ width: entry.contentRect.width, height: entry.contentRect.height });
      });
      observer.observe(element as Element);
      return () => observer.unobserve(element as Element);
    },
    observeElementOffset: (instance, cb) => {
      const element = instance.scrollElement;
      if (!element) return;
      const handler = (isScrolling: boolean) => cb(element instanceof Window ? element.scrollY : (element as any).scrollTop, isScrolling);
      const onScroll = () => handler(true);
      handler(false);
      element.addEventListener('scroll', onScroll, { passive: true });
      return () => element.removeEventListener('scroll', onScroll);
    },
  });

  // --- 無限スクロールの検知 ---
  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    if (virtualItems.length > 0) {
      const lastItem = virtualItems[virtualItems.length - 1];
      // 描画されている最後の要素（lastItem.index）が配列の末尾（rowCount - 1）に近づいたら取得
      if (lastItem && lastItem.index >= rowCount - 1 && hasMore && !isLoading) {
        fetchMore();
      }
    }
  }, [virtualItems, rowCount, hasMore, isLoading, fetchMore]);

  return (
    <div ref={parentRef} className="w-full" style={{ contain: 'none' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const transformY = virtualRow.start - scrollMargin;
          const startIndex = virtualRow.index * columns;
          const rowVideos = videos.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={(node) => {
                if (node) {
                  rowVirtualizer.measureElement(node);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${transformY}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: '1.5rem',
                paddingBottom: '1.5rem',
              }}
            >
              {rowVideos.map((video) => (
                <div key={`${video.id}-${virtualRow.index}`}>
                  <MovieCard
                    video={{
                      id: video.id,
                      title: video.title,
                      channelName: oshis.find((o) => o.id === video.channel_id)?.name_jp || 'Unknown',
                    }}
                    isWatched={logs[video.id]?.is_watched || false}
                    comment={logs[video.id]?.comment || ''}
                    isFavorite={logs[video.id]?.is_favorite || false}
                    videoTags={userTags.filter((t) => (videoTagsMap[video.id] || []).includes(t.id))}
                    userTags={userTags}
                    onWatchChange={(isWatched) => onWatchChange(video.id, isWatched)}
                    onCommentSave={(comment) => onCommentSave(video.id, comment)}
                    onFavoriteToggle={(isFav) => onFavoriteToggle(video.id, isFav)}
                    onTagsSave={(selectedIds, newNames) => onTagsSave(video.id, selectedIds, newNames)}
                    glowColor={glowColor}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 読み込み状態の表示 */}
      <div className="flex h-20 items-center justify-center py-10">
        {isLoading && (
          <div className="flex items-center gap-3 text-indigo-200/80 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
            <span className="text-sm font-medium tracking-widest uppercase">読み込み中...</span>
          </div>
        )}
        {!hasMore && videos.length > 0 && (
          <span className="text-xs uppercase tracking-widest text-white/20">すべての動画を読み込みました</span>
        )}
        {videos.length === 0 && !isLoading && (
          <div className="text-indigo-200/50">動画が見つかりませんでした。</div>
        )}
      </div>
    </div>
  );
}
