import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieLogPage from './page';

describe('MovieLog：推し色に染まる', () => {
  it('タイトルの見出しがh1（見出しレベル1）で正しく表示されること', () => {
    // 画面を描画
    render(<MovieLogPage />);

    // タイトルを取得
    const title = screen.getByRole('heading', {
      name: '推し色に染まる',
      level: 1,
    });

    // タイトルが表示されているか確認
    expect(title).toBeInTheDocument();
  });

  it('サブタイトルが正しく表示されること', () => {
    // 画面を描画
    render(<MovieLogPage />);

    // サブタイトルを取得
    const subtitle = screen.getByText('YouTube動画視聴ログ管理アプリ');

    // サブタイトルが表示されているか確認
    expect(subtitle).toBeInTheDocument();
  });

  it('推し活特化の動画カード情報（タグ・ステータス・コメント）が正しく表示されること', () => {
    // 画面を描画
    render(<MovieLogPage />);

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

  it('カードをクリックすると推し色（赤色）に染まること', async () => {
    // 画面を描画
    render(<MovieLogPage />);

    // カードを取得 (カードが必ず1枚以上ある想定)
    const cards = screen.getAllByRole('link');
    const card = cards[0]!;

    // 初期状態は赤枠ではない
    expect(card.className).not.toContain('border-red-500');

    // クリックを実行
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(card);

    // 等価なクラスが付与されていることを確認
    expect(card.className).toContain('border-red-500');
  });

  it('お気に入り（★）をクリックするとお気に入り状態がトグルされ、カードは染まらないこと', async () => {
    // 画面を描画
    render(<MovieLogPage />);

    // お気に入りアイコンとカードを取得
    const favoriteIcon = screen.getByLabelText('お気に入り');
    const cards = screen.getAllByRole('link');
    const card = cards[0]!;

    // 初期状態の確認（未お気に入り、カードは染まっていない）
    expect(favoriteIcon.className).toContain('text-white/40');
    expect(favoriteIcon.className).not.toContain('text-yellow-300');
    expect(card.className).not.toContain('border-red-500');

    // ★をクリック
    const { fireEvent } = await import('@testing-library/react');
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
