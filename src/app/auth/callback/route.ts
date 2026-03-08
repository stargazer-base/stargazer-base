'use server';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
    // サーバーサイド用のSupabaseクライアントを作成
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // 送られてきたcodeを使って、安全なセッション（Cookie）を確立する
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 成功したら、メイン画面（または指定されたnextのURL）へリダイレクト
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // エラーがあった場合はエラーページなどに飛ばす（今回は/に飛ばします）
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
