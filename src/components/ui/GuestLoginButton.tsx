'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface GuestLoginButtonProps {
  redirectTo?: string;
}

export default function GuestLoginButton({
  redirectTo = '/movielog',
}: GuestLoginButtonProps = {}) {
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

    // 成功したら、指定されたURL（またはデフォルトの動画一覧ページ）へ遷移させます
    // redirectToが空文字などの場合は遷移せず、リフレッシュのみ行います
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh(); // サーバーコンポーネントのデータを最新化
  };

  return (
    <button
      onClick={handleGuestLogin}
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/20 px-8 py-4 font-bold tracking-wider text-indigo-100 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:bg-indigo-500/30 hover:shadow-[0_0_20px_rgba(129,140,248,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:w-auto"
    >
      <svg
        className="mr-3 h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      {isLoading ? '処理中...' : 'ゲストとして始める'}
    </button>
  );
}
