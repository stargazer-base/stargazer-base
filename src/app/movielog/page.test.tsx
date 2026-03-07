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

  it('MovieCardコンポーネントが描画されテキストが存在すること', () => {
    render(<MovieLogPage />);

    // MovieCardコンポーネントの中に存在するはずの要素（例としてダミータグ）で描画を確認
    const tag = screen.getByText('#初配信');
    expect(tag).toBeInTheDocument();
  });
});
