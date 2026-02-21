# Next.js + TypeScript + Tailwind CSS Starter Template

自分用にカスタマイズした Next.js (App Router) の初期構築テンプレートです。
開発体験（DX）を重視した設定（Prettier, Tailwind Class Sorting, コンポーネント設計）が適用済みです。

## 🚀 特徴

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Formatter**: Prettier (with `prettier-plugin-tailwindcss`)
- **Utility**: `clsx` + `tailwind-merge` (`cn` helper implemented)
- **Editor**: VS Code settings included (Format on Save enabled)

## 📂 ディレクトリ構成

ソースコードは `src` 配下に集約し、役割ごとに分離しています。

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── oshiMaster.ts
│   │   └── server.ts
│   ├── utils.ts
│   └── youtube.ts
├── types/
│   ├── oshiMaster.ts
│   └── supabase.ts
└── middleware.ts
```

## 🧞 Commands

```Bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run start    # ビルド後の本番起動
npm run lint     # リントチェック
npm run format   # Prettierによる手動フォーマット実行
npm run supabase:gen   # アプリ固有DBおよびマスタDB型定義作成
npm run supabase:gen:app   # アプリ固有DB型定義作成
npm run supabase:gen:master   # マスタDB型定義作成
```

## 🛠️ 開発のポイント・ルール（Memo）

### スタイリングと競合解決 (cn utility)

Tailwind CSS のクラス競合を解決するために、src/lib/utils.ts に cn 関数を用意しています。 コンポーネントを作成する際は、必ずこの cn 関数を通して className を結合してください。

**なぜ必要なのか？** Tailwind は後から書いたクラスが優先されるとは限りません（CSS定義順依存）。cn を使うことで、親コンポーネントから渡されたクラスで確実にスタイルを上書きできます。

**使用例:**

```TypeScript
import { cn } from "@/lib/utils";

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function Button({ className, children }: ButtonProps) {
  return (
    <button
      // cnを使うことで、親から bg-red-500 が渡された時に bg-blue-500 を正しく消去・上書きできる
      className={cn(
        "rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600",
        className
      )}
    >
      {children}
    </button>
  );
}
```

---

### 自動整形 (Prettier & Sorting)

VS Code でファイルを 保存（Save）した瞬間 に、以下の処理が自動で走ります。

1. コードフォーマット: インデントやセミコロンの修正。

2. クラス名の並び替え: Tailwind のクラスが推奨順序に自動整列されます。
   - 例: class="p-4 flex bg-white" → class="flex bg-white p-4"

**注意点:**

- これを有効にするには、VS Code の拡張機能「Prettier - Code formatter」と「Tailwind CSS IntelliSense」が必要です。

- プロジェクトを開いた時に推奨拡張機能のポップアップが出るので、インストールしてください。

- 手動で全体を整形したい場合は npm run format を実行してください。

---

### 環境変数 (.env)

プロジェクトには .env.example が含まれています。 使用する際は、コピーして .env.local を作成してください。

```Bash
cp .env.example .env.local
```

---

### VS Code 設定

.vscode/settings.json により、以下の設定が適用されます。

- **Format On Save**: 保存時に自動整形。

- **Word Wrap**: エディタの右端でコードを折り返し表示（横スクロール防止）。

---

### Supabase (Database & Auth)

このテンプレートには `@supabase/ssr` がセットアップ済みです。

**セットアップ手順:**

1. Supabase でプロジェクトを作成。
2. `.env.local` に URL と ANON KEY を設定。

**使い方:**

Next.js の仕様上、クライアント側（ブラウザ）とサーバー側でインスタンス作成方法が異なりますが、`src/lib/supabase` 以下のヘルパー関数を使うことで統一的に扱えます。

**A. クライアントコンポーネント (`use client`) で使う場合:**

```ts
import { createClient } from '@/lib/supabase/client';

export default function MyComponent() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };
}
```

**B. サーバーコンポーネント / Server Actions で使う場合:**

```ts
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = createClient();
  const { data: todos } = await supabase.from('todos').select('\*');
}
```

**型定義の生成:**

DBのスキーマを変更したら、以下のコマンドで型定義ファイルを更新できます。 (package.json の script 内の <PROJECT_ID> を自身のIDに書き換えてください)

```Bash
npm run supabase:gen
```

---

### ✅ 動作確認手順 (Supabase)

プロジェクト作成後、DB接続を確認したい場合は以下の手順を行ってください。

**1. Supabase SQL Editor でテスト用テーブル作成**

```sql
create table notes (
  id bigint primary key generated always as identity,
  title text not null
);
insert into notes (title) values ('Connection Test OK');
alter table notes enable row level security;
create policy "Public Read" on notes for select using (true);
```

**2. src/app/page.tsx に一時的に以下を記述**

```TypeScript
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select("*");

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">DB Connection Test</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(notes, null, 2)}
      </pre>
    </main>
  );
}
```

画面に [ { "id": 1, "title": "Connection Test OK" } ] と表示されれば成功です。 確認後は元のコードに戻してください。

---

### 推し活マスタDB (Multi-Database Support)

このプロジェクトは、アプリ固有のデータを管理する **「App DB」** と、複数のアプリで共通利用する推し情報（メンバー情報、動画データなど）を管理する **「Oshi Master DB」** の2つのデータベースに接続可能な構成になっています。

**コンセプト:**

- **App DB**: ユーザー情報、いいね履歴、コメントなど（書き込みメイン）
- **Oshi Master DB**: 全アプリ共通の推しデータ（読み取り専用マスタ）

---

### 🛠️ 型定義の自動生成 (Type Generation)

DBスキーマを変更した場合、以下の手順で型定義ファイルを更新できます。

1. `package.json` の `scripts` にある `<APP_PROJECT_ID>` と `<MASTER_PROJECT_ID>` を、実際の Supabase Project ID に書き換えてください。
   （Project ID は Supabase 管理画面の URL `https://supabase.com/dashboard/project/abcde...` の `abcde...` 部分です）

2. Supabase CLI にログインします（初回のみ）。
   ```bash
   npx supabase login
   ```
3. コマンドを実行して型ファイルを生成します。

   ```Bash
   npm run supabase:gen
   ```

---

### YouTube Data API

推しの動画情報などを取得するための設定が含まれています。

**セットアップ:**

1. Google Cloud Console でプロジェクトを作成し、**YouTube Data API v3** を有効化します。
2. 認証情報から **APIキー** を作成します。
3. `.env.local` にキーを設定します。
4. Server Component 内で以下のように使用する。

   ```ts
     import { getYoutubeClient } from "@/lib/youtube";

     export default async function Page() {
       const youtube = getYoutubeClient();

       // 例: 特定のチャンネルの最新動画を取得
       const response = await youtube.search.list({
         part: ["snippet"],
         channelId: "CHANNEL_ID_HERE", // 推しのチャンネルID
         order: "date",
         maxResults: 5,
         type: ["video"],
       });

       const videos = response.data.items;

       return (
         <ul>
           {videos?.map((video) => (
             <li key={video.id?.videoId}>{video.snippet?.title}</li>
           ))}
         </ul>
       );
     }
   ```

---
