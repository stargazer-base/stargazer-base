'use client';

import { useState } from 'react';
import { GlassButton } from './GlassButton';

export default function VideoActionButtons() {
  // それぞれのボタンの状態管理（本来はPropsやカスタムフックから取得します）
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isTagEditing, setIsTagEditing] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isHelpActive, setIsHelpActive] = useState(false);

  return (
    <div className="flex gap-3 rounded-lg bg-gray-900/30 p-4">
      {/* お気に入り（黄） */}
      <GlassButton
        color="yellow"
        isActive={isFavorite}
        onClick={() => setIsFavorite(!isFavorite)}
        title="お気に入り"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </GlassButton>

      {/* 視聴済み（緑） */}
      <GlassButton
        color="green"
        isActive={isWatched}
        onClick={() => setIsWatched(!isWatched)}
        title="視聴済み"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </GlassButton>

      {/* タグ編集（紫） */}
      <GlassButton
        color="purple"
        isActive={isTagEditing}
        onClick={() => setIsTagEditing(!isTagEditing)}
        title="タグ編集"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
          <path d="M7 7h.01" />
        </svg>
      </GlassButton>

      {/* コメント編集（青） */}
      <GlassButton
        color="blue"
        isActive={isCommentEditing}
        onClick={() => setIsCommentEditing(!isCommentEditing)}
        title="コメント編集"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </GlassButton>

      {/* 検索（水色） */}
      <GlassButton
        color="cyan"
        isActive={isSearchActive}
        onClick={() => setIsSearchActive(!isSearchActive)}
        title="検索"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </GlassButton>
    </div>
  );
}
