import { render, screen } from '@testing-library/react';
import GuestLoginButton from '@/components/ui/GuestLoginButton';
import { describe, it, expect, vi } from 'vitest';

// next/navigation 全体をモック化してダミーのルーターを返す
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    // 今回のコンポーネントで呼び出しているメソッドを定義しておく
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

describe('GuestLoginButton', () => {
  it('エラーなくレンダリングされること', () => {
    render(<GuestLoginButton />);
    // ボタンが表示されているかなどの検証処理...
    expect(
      screen.getByRole('button', { name: 'ゲストとして始める' })
    ).toBeInTheDocument();
  });
});
