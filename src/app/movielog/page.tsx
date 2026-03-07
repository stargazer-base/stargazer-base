'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function MovieLogPage() {
  const [isWatched, setIsWatched] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // カードクリック時のハンドラー
  const handleCardClick = (e: React.MouseEvent) => {
    // リンク等のデフォルト挙動を防いで状態をトグルするデモ
    e.preventDefault();
    setIsWatched(!isWatched);
  };

  // お気に入りクリック時のハンドラー
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // カード自体のクリックイベント（推し色化）への伝播を防ぐ
    setIsFavorite(!isFavorite);
  };
  return (
    <main className="box-border flex min-h-screen flex-col items-center justify-start p-24 text-center">
      <div className="flex flex-col items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <h1 className="text-4xl font-bold tracking-wider text-white">
          推し色に染まる
        </h1>
        <p className="mt-4 text-xl text-indigo-100/90">
          YouTube動画視聴ログ管理アプリ
        </p>
      </div>

      <div className="mt-12 flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ダミーの動画カード 1件目 */}
          <div className="flex h-full w-full">
            <Link
              href="#"
              onClick={handleCardClick}
              className={`group relative flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-2xl border p-4 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-1 ${
                isWatched
                  ? 'border-red-500 bg-red-900/10 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                  : 'border-white/10 bg-white/5 shadow-lg hover:border-indigo-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]'
              }`}
            >
              {/* きらめきアニメーション用エフェクト（視聴済み時） */}
              {isWatched && (
                <div className="pointer-events-none absolute inset-0 -z-10 animate-pulse bg-gradient-to-bl from-red-500/10 via-transparent to-transparent" />
              )}
              {/* サムネイル画像エリア */}
              <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-inner">
                <Image
                  src="/placeholder.svg"
                  alt="動画サムネイルのプレースホルダー"
                  width={640}
                  height={360}
                  className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                />

                {/* 右上のステータスアイコン（★お気に入りのみ） */}
                <div className="absolute right-2 top-2 z-10 flex gap-2">
                  <span
                    onClick={handleFavoriteClick}
                    className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                      isFavorite
                        ? 'bg-yellow-400/20 text-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                        : 'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70'
                    }`}
                    title="お気に入り"
                    aria-label="お気に入り"
                  >
                    ★
                  </span>
                </div>
              </div>

              {/* テキスト情報エリア（推し活特化） */}
              <div className="flex w-full flex-col gap-2">
                {/* ユーザ作成のタグリスト */}
                <div className="flex flex-wrap gap-2 text-[10px] font-medium sm:text-xs">
                  <span className="rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1 text-indigo-200">
                    #初配信
                  </span>
                  <span className="rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1 text-indigo-200">
                    #歌枠
                  </span>
                  <span className="rounded-full border border-indigo-500/30 bg-indigo-900/40 px-2.5 py-1 text-indigo-200">
                    #神セトリ
                  </span>
                </div>

                {/* ユーザのコメント（推奨60文字前後、省略なしで全表示） */}
                <p className="mt-1 text-xs leading-relaxed text-indigo-100/90 sm:text-sm">
                  最高にエモかった！最後の曲泣ける...。推しの歌声が星空みたいにキラキラしてて、何度でも見返したくなる伝説の配信。
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
