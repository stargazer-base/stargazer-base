// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Next.jsアプリのパスを指定
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  // 各テスト実行前に読み込むセットアップファイルを指定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // ブラウザ環境をシミュレートする設定
  testEnvironment: 'jest-environment-jsdom',
};

export default createJestConfig(config);
