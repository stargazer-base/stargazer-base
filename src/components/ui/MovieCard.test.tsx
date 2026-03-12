import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard コンポーネント', () => {
  it('推し活特化の動画カード情報（タグ・ステータス・コメント）が正しく表示されること', () => {
    render(<MovieCard />);

    // ステータス（お気に入り）を取得
    const favoriteIcon = screen.getByLabelText('お気に入り');

    // タグを取得（一部）
    const tag1 = screen.getByText('#初配信');
    const tag2 = screen.getByText('#歌枠');

    // コメントの一部分を取得
    const comment = screen.getByText(/最高にエモかった！最後の曲泣ける/);

    // すべて想定通り表示されているか確認
    expect(favoriteIcon).toBeInTheDocument();
    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
  });

  it('カードをクリックすると推し色（赤色）に染まること', () => {
    // 画面を描画
    render(<MovieCard />);

    // カードを取得 (単一で描写しているため1つだけ取得可能)
    const card = screen.getByRole('button');

    // 初期状態は赤枠ではない
    expect(card.className).not.toContain('border-red-500');

    // クリックを実行
    fireEvent.click(card);

    // 等価なクラスが付与されていることを確認
    expect(card.className).toContain('border-red-500');
  });

  it('お気に入り（★）をクリックするとお気に入り状態がトグルされ、カードは染まらないこと', () => {
    // 画面を描画
    render(<MovieCard />);

    // お気に入りアイコンとカードを取得
    const favoriteIcon = screen.getByLabelText('お気に入り');
    const card = screen.getByRole('button');

    // 初期状態の確認（未お気に入り、カードは染まっていない）
    expect(favoriteIcon.className).toContain('text-white/40');
    expect(favoriteIcon.className).not.toContain('text-yellow-300');
    expect(card.className).not.toContain('border-red-500');

    // ★をクリック
    fireEvent.click(favoriteIcon);

    // ★がお気に入り状態（黄色）に変わることを確認
    expect(favoriteIcon.className).toContain('text-yellow-300');
    expect(favoriteIcon.className).toContain('bg-yellow-400/20');

    // ★をクリックしても（伝播がストップするため）カード本体は染まっていないことを確認
    expect(card.className).not.toContain('border-red-500');

    // もう一度★をクリック
    fireEvent.click(favoriteIcon);

    // ★が未お気に入り状態（グレー）に戻ることを確認
    expect(favoriteIcon.className).not.toContain('text-yellow-300');
    expect(favoriteIcon.className).toContain('text-white/40');
  });
});
