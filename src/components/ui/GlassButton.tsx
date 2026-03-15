import React from 'react';

// ① 許容する色の種類を型定義
export type GlassColor = 'yellow' | 'green' | 'purple' | 'blue' | 'cyan';

// ② 引数（Props）の型定義
interface GlassButtonProps {
  isActive: boolean;
  onClick: () => void;
  title: string;
  color: GlassColor;
  children: React.ReactNode; // アイコン(SVGやテキスト)を受け取る
}

// ③ 色ごとの発光スタイルの辞書（ここに書いておけばTailwindに消されません）
const activeStyles: Record<GlassColor, string> = {
  yellow:
    'bg-yellow-400/20 text-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.5)]',
  green:
    'bg-green-400/20 text-green-300 shadow-[0_0_10px_rgba(74,222,128,0.5)]',
  purple:
    'bg-purple-400/20 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.5)]',
  blue: 'bg-blue-400/20 text-blue-300 shadow-[0_0_10px_rgba(96,165,250,0.5)]',
  cyan: 'bg-cyan-400/20 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
};

export const GlassButton = ({
  isActive,
  onClick,
  title,
  color,
  children,
}: GlassButtonProps) => {
  // 共通のベーススタイル
  const baseStyle =
    'group relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110';
  // 非アクティブ時のスタイル
  const inactiveStyle =
    'bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70';

  return (
    <span
      className={`${baseStyle} ${isActive ? activeStyles[color] : inactiveStyle}`}
      aria-label={title}
      onClick={onClick}
    >
      {/* 渡されたアイコン（SVGなど）をここに表示 */}
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/30 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {title}
      </span>
    </span>
  );
};
