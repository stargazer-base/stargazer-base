import React from 'react';

// ==========================================
// 1. 型定義
// ==========================================
/**
 * Textコンポーネントのバリアント
 * - pageTitle: ページタイトル
 * - subTitle: サブタイトル
 * - heading: 見出し
 * - subHeading: サブ見出し
 * - body: 本文
 * - detail: 詳細
 */
export type TextVariant =
  | 'pageTitle'
  | 'subTitle'
  | 'heading'
  | 'subHeading'
  | 'body'
  | 'detail';

/**
 * TextコンポーネントのProps
 * - variant?: バリアント
 * - children:  子要素
 * - glow?:  発光（true: 発光する, false: 発光しない, undefined: おまかせ）
 * - className?:  クラス名
 */
export interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

// ==========================================
// 2. 静的データ・ロジック
// ==========================================
/**
 * Textコンポーネントのスタイル
 * - pageTitle: 1.875rem (30px) font-weight: 700 text-white tracking-tight
 * - subTitle: 1.25rem (20px) font-weight: 400 text-indigo-300
 * - heading: 1.5rem (24px) font-weight: 600 text-indigo-100
 * - subHeading: 1.125rem (18px) font-weight: 500 text-indigo-200
 * - body: 1rem (16px) font-weight: 400 text-indigo-50
 * - detail: 0.875rem (14px) font-weight: 400 text-indigo-400
 */
const styles: Record<TextVariant, string> = {
  pageTitle: 'text-3xl font-bold text-white tracking-tight',
  subTitle: 'text-xl font-normal text-indigo-300',
  heading: 'text-2xl font-semibold text-indigo-100',
  subHeading: 'text-lg font-medium text-indigo-200',
  body: 'text-base font-normal text-indigo-50',
  detail: 'text-sm font-normal text-indigo-400',
};

/**
 * TextコンポーネントのHTMLタグ
 * - pageTitle: h1
 * - subTitle: p
 * - heading: h2
 * - subHeading: h3
 * - body: p
 * - detail: p
 */
const tags: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  pageTitle: 'h1',
  subTitle: 'p',
  heading: 'h2',
  subHeading: 'h3',
  body: 'p',
  detail: 'p',
};

// ==========================================
// 3. コンポーネント本体
// ==========================================
export const Text = ({
  variant = 'body',
  children,
  glow,
  className = '',
}: TextProps) => {
  const Component = tags[variant];

  // glowが明示的に渡されていなければ、タイトル系だけ自動でtrueにする
  const shouldGlow =
    glow ?? (variant === 'pageTitle' || variant === 'subTitle');

  // 光る場合drop-shadowクラスを付与する
  const glowClass = shouldGlow
    ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]'
    : '';

  return (
    <Component className={`${styles[variant]} ${glowClass} ${className}`}>
      {children}
    </Component>
  );
};
