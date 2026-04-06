import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MovieLogPage from './page';

// Supabaseクライアントのモック修正版
vi.mock('@/lib/supabase/server', () => {
  // すべてのチェーン用メソッドが自分自身を返すように定義
  const mockQueryBuilder = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(), // これも return this に変更！
    limit: vi.fn().mockReturnThis(), // 追加
    // 最後に await された時に返るデータ
    // Supabaseのクエリビルダは、最後に Promise（then）を介してデータを返します
    then: vi.fn((resolve) => {
      resolve({
        data: [
          { id: '1', name_jp: '公式チャンネル', color_code: '#FF0000' },
          { id: '2', name_jp: 'サブチャンネル', color_code: '#00FF00' },
        ],
        error: null,
      });
    }),
    auth: {
      // getUserをモック関数として定義（ここではまだ戻り値は設定しない）
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
    },
  };

  return {
    createClient: () => mockQueryBuilder,
  };
});

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
});
