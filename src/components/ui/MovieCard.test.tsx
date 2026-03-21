import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard コンポーネント', () => {
  it('推し活特化の動画カード情報（タグ・ステータス・コメント）が正しく表示されること', () => {
    render(<MovieCard />);

    // タグを取得（一部）
    const tag1 = screen.getByText('#初配信');
    const tag2 = screen.getByText('#歌枠');

    // コメントの一部分を取得
    const comment = screen.getByText(/Coming soon/i);

    // すべて想定通り表示されているか確認
    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
  });
});
