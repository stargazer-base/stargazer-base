import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';

// メイン画面がレンダリングされる前に、next/navigationをモック化します
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// 2. 【追加】Supabaseのクライアントをモック化
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      // signInAnonymouslyが呼ばれたら、成功したフリ（ダミーのユーザーデータ）を返すように設定
      signInAnonymously: vi.fn().mockResolvedValue({
        data: { user: { id: 'dummy-uuid-1234' } },
        error: null,
      }),
    },
  }),
}));

// next/headers のモック（偽装）を追加
vi.mock('next/headers', () => {
  return {
    cookies: () => ({
      get: vi.fn(),
      getAll: vi.fn().mockReturnValue([]),
      set: vi.fn(),
      delete: vi.fn(),
    }),
    headers: () => new Headers(),
  };
});

describe('メイン画面', () => {
  it('タイトルの見出しがh1（見出しレベル1）で正しく表示されること', async () => {
    // 画面を描画
    const Component = await Home();
    render(Component);

    // タイトルを取得
    const title = screen.getByRole('heading', {
      name: '推し天文台',
      level: 1,
    });

    // タイトルが表示されているか確認
    expect(title).toBeInTheDocument();
  });

  it('説明文が正しく表示されること', async () => {
    // 画面を描画
    const Component = await Home();
    render(Component);

    // 説明文を取得
    const description = screen.getByText(
      '推し(星)を特等席で眺め続けるための前線基地'
    );

    // 説明文が表示されているか確認
    expect(description).toBeInTheDocument();
  });

  it('リンクが正しく表示されること：推し色に染まる', async () => {
    // 画面を描画
    const Component = await Home();
    render(Component);

    // リンクを取得（Linkの中に複数のテキストが含まれるため、正規表現で部分一致させます）
    const link = screen.getByRole('link', {
      name: /推し色に染まる/,
    });

    // リンクが表示されているか確認
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/movielog');
  });

  it('アプリケーション名の見出しがh2（見出しレベル2）で正しく表示されること：推し色に染まる', async () => {
    // 画面を描画
    const Component = await Home();
    render(Component);

    const heading = screen.getByRole('heading', {
      name: '推し色に染まる',
      level: 2,
    });

    expect(heading).toBeInTheDocument();
  });

  it('アプリのイメージ画像が正しく表示されること：推し色に染まる', async () => {
    // 画面を描画
    const Component = await Home();
    render(Component);

    const image = screen.getByRole('img', {
      name: '推し色に染まる アプリのイメージ画像',
    });

    expect(image).toBeInTheDocument();
  });

  it('機能説明が正しく表示されること：推し色に染まる', async () => {
    // 画面を描画
    const Component = await Home();
    render(Component);

    // テキストを取得
    const introText = screen.getByText('YouTube動画視聴ログ管理アプリ');
    expect(introText).toBeInTheDocument();

    // リスト項目を取得
    const listItem1 = screen.getByText(/推しの軌跡を一覧化/);
    const listItem2 = screen.getByText(/未視聴をサクッと発掘/);
    const listItem3 = screen.getByText(/推しへの染まり度を可視化/);

    expect(listItem1).toBeInTheDocument();
    expect(listItem2).toBeInTheDocument();
    expect(listItem3).toBeInTheDocument();
  });
});
