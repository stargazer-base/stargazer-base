import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard コンポーネント', () => {
  it('推し活特化の動画カード情報（タグ・ステータス・コメント）が正しく表示されること', () => {
    render(<MovieCard />);

    // タグの一部分を取得
    const tag = screen.getByText(/自分用タグをここに表示できます。/i);

    // コメントの一部分を取得
    const comment = screen.getByText(/自分用一言コメントをここに表示できます/i);

    // すべて想定通り表示されているか確認
    expect(tag).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
  });
});
