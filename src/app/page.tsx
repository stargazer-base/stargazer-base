import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/ui/Text';
import { createClient } from '@/lib/supabase/server';
import GoogleLoginButton from '@/components/ui/GoogleLoginButton';
import GuestLoginButton from '@/components/ui/GuestLoginButton';
import LogoutButton from '@/components/ui/LogoutButton';

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col items-center justify-center px-8 py-24 text-center">
      {/* タイトルとサブタイトル */}
      <div className="title-top-page">
        <Text variant="pageTitle">推し天文台</Text>
        <Text variant="subTitle" className="mt-4">
          推し(星)を特等席で眺め続けるための前線基地
        </Text>
      </div>

      {/* STPRファミリーの星たち */}
      <div className="text-yellow-200/80 drop-shadow-[0_0_8px_rgba(253,230,138,0.5)]">
        <p className="mt-8 tracking-[0.5em]">★★★★★★</p>
        <p className="mt-2 tracking-[0.3em]">★★★★</p>
        <p className="mt-2 tracking-[0.2em]">★★★★★★</p>
        <p className="mt-2 tracking-[0.4em]">★★★★★★</p>
        <p className="mt-2 tracking-[0.5em]">★★★★★★★</p>
        <p className="mt-2 tracking-[0.3em]">★★★★★★</p>
      </div>

      {/* アプリ一覧 */}
      <div className="flex w-full max-w-5xl flex-col items-center justify-center">
        <ul className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 推し色に染まる */}
          <li className="flex h-full w-full">
            <Link
              href="/movielog"
              className="group flex h-full w-full flex-col items-start justify-start rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]"
            >
              <div className="mb-5 w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
                <Image
                  src="/placeholder.svg"
                  alt="推し色に染まる アプリのイメージ画像"
                  width={600}
                  height={300}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <Text
                variant="heading"
                className="transition-colors group-hover:text-indigo-200"
              >
                推し色に染まる
              </Text>
              <Text variant="subHeading" className="mt-1">
                YouTube動画視聴ログ管理アプリ
              </Text>
              <ul className="mt-5 space-y-2">
                <li className="flex justify-start">
                  <span className="mr-2 text-indigo-400">✦</span>
                  <Text variant="body">推しの軌跡を一覧化</Text>
                </li>
                <li className="flex justify-start">
                  <span className="mr-2 text-indigo-400">✦</span>
                  <Text variant="body">未視聴をサクッと発掘</Text>
                </li>
                <li className="flex justify-start">
                  <span className="mr-2 text-indigo-400">✦</span>
                  <Text variant="body">推しへの染まり度を可視化</Text>
                </li>
              </ul>
            </Link>
          </li>

          {/* Coming soon */}
          <li className="flex h-full w-full">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-md">
              <span className="text-indigo-200/50">Coming soon ...</span>
            </div>
          </li>

          {/* Coming soon */}
          <li className="flex h-full w-full">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-md">
              <span className="text-indigo-200/50">Coming soon ...</span>
            </div>
          </li>
        </ul>
      </div>

      {/* ログイン・メッセージエリア */}
      <div className="mt-16 flex w-full max-w-5xl flex-col items-center justify-center space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        {user ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <Text variant="body" className="text-center text-indigo-100">
              こんにちは、{user.user_metadata.name || 'ゲスト'}
              さん！
              <br />
              推し色に染まるアプリをクリックして、推しの動画の視聴ログを作成しましょう！
            </Text>
            <LogoutButton />
          </div>
        ) : (
          <>
            <Text variant="body" className="mb-2 text-center text-indigo-100">
              ログインするとデータを保存できます。
            </Text>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <GoogleLoginButton />
              <GuestLoginButton redirectTo="" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
