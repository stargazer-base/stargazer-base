'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function GuestLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGuestLogin = async () => {
    setIsLoading(true);

    // ここで匿名ログインのAPIを叩きます
    const { data, error } = await supabase.auth.signInAnonymously();

    setIsLoading(false);

    if (error) {
      console.error('ログインエラー:', error.message);
      alert('エラーが発生しました。もう一度お試しください。');
      return;
    }

    console.log('ログイン成功！ユーザー情報:', data.user);

    // 成功したら、動画一覧ページ（例: /dashboard）へ遷移させます
    router.push('/movielog');
    router.refresh(); // サーバーコンポーネントのデータを最新化
  };

  return (
    <button
      onClick={handleGuestLogin}
      disabled={isLoading}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
    >
      {isLoading ? '処理中...' : 'ゲストとして始める'}
    </button>
  );
}
