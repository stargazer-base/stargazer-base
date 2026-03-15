import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

// ==========================================
// 1. カタログの基本設定
// ==========================================
const meta: Meta<typeof Text> = {
  title: 'UI部品/Text', // メニューに表示する名前
  component: Text,
  tags: ['autodocs'], // 仕様書を自動生成
};

export default meta;
type Story = StoryObj<typeof Text>;

// ==========================================
// 2. 各バリアントのカタログ
// ==========================================

export const PageTitleGlow: Story = {
  args: {
    variant: 'pageTitle',
    children: 'タイトル: 推し天文台（発光あり）',
    glow: true,
  },
};

export const PageTitleNotGlow: Story = {
  args: {
    variant: 'pageTitle',
    children: 'タイトル: 推し天文台（発光なし）',
    glow: false,
  },
};

export const SubTitleGlow: Story = {
  args: {
    variant: 'subTitle',
    children: 'サブタイトル: 推し(星)を眺める場所（発光あり）',
    glow: true,
  },
};

export const SubTitleNotGlow: Story = {
  args: {
    variant: 'subTitle',
    children: 'サブタイトル: 推し(星)を眺める場所（発光なし）',
    glow: false,
  },
};

export const HeadingGlow: Story = {
  args: {
    variant: 'heading',
    children: '見出し: 推し色に染まる（発光あり）',
    glow: true,
  },
};

export const HeadingNotGlow: Story = {
  args: {
    variant: 'heading',
    children: '見出し: 推し色に染まる（発光なし）',
    glow: false,
  },
};

export const SubHeadingGlow: Story = {
  args: {
    variant: 'subHeading',
    children: 'サブ見出し: YouTube動画視聴ログ管理アプリ（発光あり）',
    glow: true,
  },
};

export const SubHeadingNotGlow: Story = {
  args: {
    variant: 'subHeading',
    children: 'サブ見出し: YouTube動画視聴ログ管理アプリ（発光なし）',
    glow: false,
  },
};

export const BodyGlow: Story = {
  args: {
    variant: 'body',
    children: '本文: 推しの軌跡を一覧化（発光あり）',
    glow: true,
  },
};

export const BodyNotGlow: Story = {
  args: {
    variant: 'body',
    children: '本文: 推しの軌跡を一覧化（発光なし）',
    glow: false,
  },
};

export const DetailGlow: Story = {
  args: {
    variant: 'detail',
    children: '詳細: 2026/03/15 投稿 • 12.5万回視聴（発光あり）',
    glow: true,
  },
};

export const DetailNotGlow: Story = {
  args: {
    variant: 'detail',
    children: '詳細: 2026/03/15 投稿 • 12.5万回視聴（発光なし）',
    glow: false,
  },
};
