'use client';

import { createClient } from '@/lib/supabase/client';

export default function GoogleLoginButton() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    // Googleログイン画面へリダイレクトさせます
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ログイン成功後、Next.jsの /auth/callback に戻ってくるように指定
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Googleログインエラー:', error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="inline-flex items-center rounded border-b-2 border-gray-200 bg-white px-6 py-2 font-bold text-gray-800 shadow-md hover:border-gray-300 hover:bg-gray-100"
    >
      Googleでログイン
    </button>
  );
}
