import '@testing-library/jest-dom/vitest';
// これを入れることで、「要素が存在するか（toBeInTheDocument）」などの便利な検証メソッドが使えるようになります。
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 各テスト（it や test）が終わるたびに、描画したDOMを綺麗にお掃除する
afterEach(() => {
  cleanup();
});

// ResizeObserver のモックを追加 (Vitest/JSDOM 環境には存在しないため)
// global ではなく globalThis を使うことで、ブラウザ環境（Storybook等）との互換性を確保します
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
}
