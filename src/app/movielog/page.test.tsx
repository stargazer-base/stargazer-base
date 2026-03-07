import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieLogPage from './page';

describe('MovieLog：推し色に染まる', () => {
  it('タイトルの見出しがh1（見出しレベル1）で正しく表示されること', () => {
    // 画面を描画
    render(<MovieLogPage />);

    // タイトルを取得
    const title = screen.getByRole('heading', {
      name: '推し色に染まる',
      level: 1,
    });

    // タイトルが表示されているか確認
    expect(title).toBeInTheDocument();
  });

  it('サブタイトルが正しく表示されること', () => {
    // 画面を描画
    render(<MovieLogPage />);

    // サブタイトルを取得
    const subtitle = screen.getByText('YouTube動画視聴ログ管理アプリ');

    // サブタイトルが表示されているか確認
    expect(subtitle).toBeInTheDocument();
  });

  it('プレースホルダーテキストが正しく表示されること', () => {
    // 画面を描画
    render(<MovieLogPage />);

    // ダミーテキストを取得
    const placeholderText = screen.getByText(
      'ここにYouTube動画の一覧が並びます...'
    );

    // ダミーテキストが表示されているか確認
    expect(placeholderText).toBeInTheDocument();
  });
});
