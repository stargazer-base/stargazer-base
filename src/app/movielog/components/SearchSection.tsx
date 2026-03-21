'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export interface FilterState {
  keyword: string;
  selectedOshis: string[];
  favoriteFilter: 'all' | 'favorite' | 'not_favorite';
  watchedFilter: 'all' | 'watched' | 'not_watched';
  selectedTags: string[];
}

interface SearchSectionProps {
  oshis: { id: string; name_jp: string }[];
  tags: { id: string; name: string }[];
  onApply: (filters: FilterState) => void;
  isOpen: boolean;
}

export default function SearchSection({
  oshis,
  tags,
  onApply,
  isOpen,
}: SearchSectionProps) {
  const [keyword, setKeyword] = useState('');

  // フィルター状態
  const [selectedOshis, setSelectedOshis] = useState<string[]>([]);
  const [favoriteFilter, setFavoriteFilter] = useState<
    'all' | 'favorite' | 'not_favorite'
  >('all');
  const [watchedFilter, setWatchedFilter] = useState<
    'all' | 'watched' | 'not_watched'
  >('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 複数選択用のトグル関数
  const toggleOshi = (id: string) => {
    setSelectedOshis((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // フィルターのリセット
  const resetFilters = () => {
    setKeyword('');
    setSelectedOshis([]);
    setFavoriteFilter('all');
    setWatchedFilter('all');
    setSelectedTags([]);

    onApply({
      keyword: '',
      selectedOshis: [],
      favoriteFilter: 'all',
      watchedFilter: 'all',
      selectedTags: [],
    });
  };

  // フィルター適用
  const handleApply = () => {
    onApply({
      keyword,
      selectedOshis,
      favoriteFilter,
      watchedFilter,
      selectedTags,
    });
  };

  return (
    <div className="flex w-full max-w-5xl flex-col items-center justify-center">
      {/* 検索パネル */}
      <div
        className={`w-full max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'mt-6 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-lg">
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-white/90">動画を検索</h3>

            {/* キーワード検索 */}
            <div className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 transition-colors focus-within:border-white/30">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-white/40"
              />
              <input
                type="text"
                placeholder="キーワードを入力..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
              />
            </div>

            {/* 推しフィルター (複数選択チップ) */}
            {oshis.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal uppercase tracking-wider text-indigo-200">
                  推し
                </span>
                <div className="flex flex-wrap gap-2">
                  {oshis.map((oshi) => (
                    <button
                      key={oshi.id}
                      onClick={() => toggleOshi(oshi.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedOshis.includes(oshi.id)
                          ? 'border-indigo-400 bg-indigo-500/30 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                          : 'border-white/10 bg-black/20 text-white/50 hover:border-white/30 hover:text-white/80'
                      }`}
                    >
                      {oshi.name_jp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 単一選択フィルター (お気に入り / 視聴済み) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* お気に入り */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal uppercase tracking-wider text-indigo-200">
                  お気に入り
                </span>
                <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
                  <button
                    onClick={() => setFavoriteFilter('all')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${favoriteFilter === 'all' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => setFavoriteFilter('favorite')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${favoriteFilter === 'favorite' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    お気に入り
                  </button>
                  <button
                    onClick={() => setFavoriteFilter('not_favorite')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${favoriteFilter === 'not_favorite' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    未登録
                  </button>
                </div>
              </div>

              {/* 視聴済み */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal uppercase tracking-wider text-indigo-200">
                  視聴済み
                </span>
                <div className="flex rounded-full border border-white/10 bg-black/40 p-1">
                  <button
                    onClick={() => setWatchedFilter('all')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${watchedFilter === 'all' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => setWatchedFilter('watched')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${watchedFilter === 'watched' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    視聴済み
                  </button>
                  <button
                    onClick={() => setWatchedFilter('not_watched')}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${watchedFilter === 'not_watched' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                  >
                    未視聴
                  </button>
                </div>
              </div>
            </div>

            {/* タグフィルター (複数選択チップ) */}
            {tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal uppercase tracking-wider text-indigo-200">
                  タグ
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedTags.includes(tag.id)
                          ? 'border-fuchsia-400 bg-fuchsia-500/30 text-fuchsia-100 shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                          : 'border-white/10 bg-black/20 text-white/50 hover:border-white/30 hover:text-white/80'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetFilters();
                }}
                className="text-xs text-white/40 underline underline-offset-2 transition-colors hover:text-white/80"
              >
                条件をクリア
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply();
                }}
                onMouseUp={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="rounded-full bg-indigo-500/80 px-8 py-2.5 text-sm font-bold text-white shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-colors hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]"
              >
                絞り込む
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
