import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // ブラウザ環境をシミュレート
    setupFiles: ['./vitest.setup.ts'], // テスト実行前に読み込むファイル
    alias: {
      '@': path.resolve(__dirname, './src'), // Next.jsの @/ エイリアスを使っている場合
    },
  },
});
