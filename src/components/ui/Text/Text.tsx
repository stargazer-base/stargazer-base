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
 * Textコンポーネントのスタイル定義
 * * - pageTitle: 36px (text-4xl) / Bold / ページ最上部用
 * - subTitle:  18px (text-lg)  / Normal / タイトル補足
 * - heading:   24px (text-2xl) / SemiBold / セクション見出し
 * - subHeading: 16px (text-base) / Bold / 小見出し
 * - body:      14px (text-sm)   / Normal / コンテンツ本文
 * - detail:    10px (text-[10px]) / Normal / タグ、注釈、詳細情報
 */
const styles: Record<TextVariant, string> = {
  pageTitle: 'text-4xl font-bold text-indigo-50 tracking-tight',
  subTitle: 'text-lg font-normal text-indigo-200',
  heading: 'text-2xl font-semibold text-indigo-100',
  subHeading: 'text-base font-bold text-indigo-200',
  body: 'text-sm font-normal text-indigo-50 leading-relaxed',
  detail: 'text-[10px] font-normal text-indigo-200 uppercase tracking-wider',
};

/**
 * TextコンポーネントのHTMLタグ
 * - pageTitle: h1
 * - subTitle: p
 * - heading: h2
 * - subHeading: h3
 * - body: p
 * - detail: span
 */
const tags: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  pageTitle: 'h1',
  subTitle: 'p',
  heading: 'h2',
  subHeading: 'h3',
  body: 'p',
  detail: 'span',
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

  // コンポーネント本体の出力
  return (
    <Component className={`${styles[variant]} ${glowClass} ${className}`}>
      {children}
    </Component>
  );
};
