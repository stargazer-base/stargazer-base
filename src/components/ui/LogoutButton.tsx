'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('ログアウトエラー:', error.message);
      alert('ログアウトに失敗しました。');
      return;
    }
    
    // 成功したら画面をリフレッシュ
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-medium tracking-wider text-white/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] sm:w-auto"
    >
      ログアウト
    </button>
  );
}
