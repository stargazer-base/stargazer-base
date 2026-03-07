import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="box-border flex flex-col items-center justify-center p-24 text-center">
      <div className="flex flex-col items-center justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <h1 className="text-4xl font-bold tracking-wider text-white">
          推し天文台 - Stargazer Base -
        </h1>
        <p className="mt-4 text-xl text-indigo-100/90">
          推し(星)を特等席で眺め続けるための前線基地
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-yellow-200/80 drop-shadow-[0_0_8px_rgba(253,230,138,0.5)]">
        <p className="mt-8 tracking-[0.5em]">★★★★★★</p>
        <p className="mt-2 tracking-[0.3em]">★★★★</p>
        <p className="mt-2 tracking-[0.2em]">★★★★★★</p>
        <p className="mt-2 tracking-[0.4em]">★★★★★★</p>
        <p className="mt-2 tracking-[0.5em]">★★★★★★★</p>
      </div>
      <div className="flex w-full max-w-5xl flex-col items-center justify-center">
        <ul className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="text-xl font-bold text-white transition-colors group-hover:text-indigo-200">
                推し色に染まる
              </h2>
              <p className="mt-1 text-sm text-indigo-200/80">
                YouTube動画の視聴ログ管理アプリ
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✦</span>
                  推しの軌跡を一覧化
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✦</span>
                  未視聴をサクッと発掘
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✦</span>
                  推しへの染まり度を可視化
                </li>
              </ul>
            </Link>
          </li>
          <li className="flex h-full w-full">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-md">
              <span className="text-indigo-200/50">Coming soon ...</span>
            </div>
          </li>
          <li className="flex h-full w-full">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-md">
              <span className="text-indigo-200/50">Coming soon ...</span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
