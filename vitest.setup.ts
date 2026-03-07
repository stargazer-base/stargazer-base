import '@testing-library/jest-dom/vitest';
// これを入れることで、「要素が存在するか（toBeInTheDocument）」などの便利な検証メソッドが使えるようになります。
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 各テスト（it や test）が終わるたびに、描画したDOMを綺麗にお掃除する
afterEach(() => {
  cleanup();
});
