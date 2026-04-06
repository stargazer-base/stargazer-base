'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import MovieCard from '@/components/ui/MovieCard';

/**
 * 動画データの型定義
 */
interface Video {
  id: string;
  title: string;
  channel_id: string;
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
  videos: Video[];
  logs: Record<string, VideoLog>;
  videoTagsMap: Record<string, string[]>;
  userTags: Tag[];
  oshis: ChannelData[];
  glowColor: string | null;
  onWatchChange: (videoId: string, isWatched: boolean) => void;
  onCommentSave: (videoId: string, comment: string) => void;
  onFavoriteToggle: (videoId: string, isFavorite: boolean) => void;
  onTagsSave: (videoId: string, selectedTagIds: string[], newTagNames: string[]) => void;
}

/**
 * 大量案件のYouTube動画を軽量に描画するための仮想化リストコンポーネント
 * ウィンドウ全体のスクロールに対応しています（Window Virtualization）。
 */
export default function VirtualizedVideoList({
  videos,
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
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = React.useState(0);

  // 初回レンダリング後にリストの上部オフセットを計測
  useEffect(() => {
    if (parentRef.current) {
      setScrollMargin(parentRef.current.offsetTop);
    }
  }, []);

  // コンテナの幅に基づいて列数を決定
  const [columns, setColumns] = React.useState(1);

  useEffect(() => {
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

  // 仮想化の設定（ウィンドウ仮想化）
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => (typeof window !== 'undefined' ? (window as any) : null),
    estimateSize: () => 450,
    overscan: 5,
    scrollMargin,
    // Window仮想化時のResizeObserverエラーを回避するためのカスタムオブザーバー
    observeElementRect: (instance, cb) => {
      const element = instance.scrollElement;
      if (!element) return;

      if (element instanceof Window) {
        const handler = () => {
          cb({ width: element.innerWidth, height: element.innerHeight });
        };
        handler();
        element.addEventListener('resize', handler);
        return () => element.removeEventListener('resize', handler);
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          cb({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      observer.observe(element as Element);
      return () => observer.unobserve(element as Element);
    },
    // Window仮想化時のスクロール位置を正確に取得するためのカスタム実装
    observeElementOffset: (instance, cb) => {
      const element = instance.scrollElement;
      if (!element) return;

      const handler = (isScrolling: boolean) => {
        cb(element instanceof Window ? element.scrollY : (element as any).scrollTop, isScrolling);
      };

      const onScroll = () => handler(true);
      handler(false);
      element.addEventListener('scroll', onScroll, { passive: true });
      return () => element.removeEventListener('scroll', onScroll);
    },
  });

  return (
    <div
      ref={parentRef}
      className="w-full"
      style={{ contain: 'none' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          // scrollMargin を考慮して位置を調整
          const transformY = virtualRow.start - rowVirtualizer.options.scrollMargin;
          // この行に表示する動画のインデックス範囲を計算
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
                <div key={video.id}>
                  <MovieCard
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
                      userTags.filter((t) =>
                        (videoTagsMap[video.id] || []).includes(t.id)
                      )
                    }
                    userTags={userTags}
                    onWatchChange={(isWatched) =>
                      onWatchChange(video.id, isWatched)
                    }
                    onCommentSave={(comment) => onCommentSave(video.id, comment)}
                    onTagsSave={(selectedIds, newNames) =>
                      onTagsSave(video.id, selectedIds, newNames)
                    }
                    onFavoriteToggle={(isFav) =>
                      onFavoriteToggle(video.id, isFav)
                    }
                    glowColor={glowColor}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {videos.length === 0 && (
        <div className="flex h-full items-center justify-center py-20 text-indigo-200/50">
          条件に一致する動画が見つかりませんでした。
        </div>
      )}
    </div>
  );
}
