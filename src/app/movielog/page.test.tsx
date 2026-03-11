import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MovieLogPage from './page';

// Supabaseクライアントのモック
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({
      data: [
        { id: 'video1', thumbnail_url: 'https://example.com/thumb1.jpg' },
        { id: 'video2', thumbnail_url: 'https://example.com/thumb2.jpg' },
      ],
    }),
  }),
}));

describe('MovieLog：推し色に染まる', () => {
  it('タイトルの見出しがh1（見出しレベル1）で正しく表示されること', async () => {
    // 非同期コンポーネントを解決してから描画
    const jsx = await MovieLogPage();
    render(jsx);

    // タイトルを取得
    const title = screen.getByRole('heading', {
      name: '推し色に染まる',
      level: 1,
    });

    // タイトルが表示されているか確認
    expect(title).toBeInTheDocument();
  });

  it('サブタイトルが正しく表示されること', async () => {
    const jsx = await MovieLogPage();
    render(jsx);

    // サブタイトルを取得
    const subtitle = screen.getByText('YouTube動画視聴ログ管理アプリ');

    // サブタイトルが表示されているか確認
    expect(subtitle).toBeInTheDocument();
  });

  it('MovieCardコンポーネントが描画されテキストが存在すること', async () => {
    const jsx = await MovieLogPage();
    render(jsx);

    // MovieCardコンポーネントの中に存在するはずの要素（例としてダミータグ）で描画を確認
    // モックデータ2件分が描画されるため `getAllByText` を使用
    const tags = screen.getAllByText('#初配信');
    expect(tags.length).toBe(2);
  });
});
