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
  oshis: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  onApply: (filters: FilterState) => void;
}

export default function SearchSection({ oshis, tags, onApply }: SearchSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  
  // フィルター状態
  const [selectedOshis, setSelectedOshis] = useState<string[]>([]);
  const [favoriteFilter, setFavoriteFilter] = useState<'all' | 'favorite' | 'not_favorite'>('all');
  const [watchedFilter, setWatchedFilter] = useState<'all' | 'watched' | 'not_watched'>('all');
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
    <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-white/10 px-8 py-3 text-white/70 shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg" />
        <span className="font-medium tracking-wider">検索</span>
      </button>

      {/* 検索パネル */}
      <div
        className={`mt-6 w-full max-w-2xl overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg shadow-xl">
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-white/90">動画を検索</h3>
            
            {/* キーワード検索 */}
            <div className="flex w-full items-center gap-3 rounded-full bg-black/40 px-4 py-2 border border-white/10 focus-within:border-white/30 transition-colors">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white/40" />
              <input
                type="text"
                placeholder="キーワードを入力..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
            </div>

            {/* 推しフィルター (複数選択チップ) */}
            {oshis.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal text-indigo-200 uppercase tracking-wider">推し</span>
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
                      {oshi.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 単一選択フィルター (お気に入り / 視聴済み) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* お気に入り */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal text-indigo-200 uppercase tracking-wider">お気に入り</span>
                <div className="flex rounded-full bg-black/40 p-1 border border-white/10">
                  <button onClick={() => setFavoriteFilter('all')} className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${favoriteFilter === 'all' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}>すべて</button>
                  <button onClick={() => setFavoriteFilter('favorite')} className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${favoriteFilter === 'favorite' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}>お気に入り</button>
                  <button onClick={() => setFavoriteFilter('not_favorite')} className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${favoriteFilter === 'not_favorite' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}>未お気に入り</button>
                </div>
              </div>

              {/* 視聴済み */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal text-indigo-200 uppercase tracking-wider">視聴済み</span>
                <div className="flex rounded-full bg-black/40 p-1 border border-white/10">
                  <button onClick={() => setWatchedFilter('all')} className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${watchedFilter === 'all' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}>すべて</button>
                  <button onClick={() => setWatchedFilter('watched')} className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${watchedFilter === 'watched' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}>視聴済み</button>
                  <button onClick={() => setWatchedFilter('not_watched')} className={`flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-all ${watchedFilter === 'not_watched' ? 'bg-indigo-500/80 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}>未視聴</button>
                </div>
              </div>
            </div>

            {/* タグフィルター (複数選択チップ) */}
            {tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-normal text-indigo-200 uppercase tracking-wider">タグ</span>
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

            <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-4">
              <button 
                onClick={resetFilters}
                className="text-xs text-white/40 hover:text-white/80 underline underline-offset-2 transition-colors"
              >
                条件をクリア
              </button>
              <button 
                onClick={handleApply}
                className="rounded-full bg-indigo-500/80 hover:bg-indigo-500 px-8 py-2.5 text-sm font-bold text-white transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)] hover:shadow-[0_0_15px_rgba(99,102,241,0.6)]"
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
