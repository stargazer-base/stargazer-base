import { render, screen } from '@testing-library/react';
import Home from './page';

describe('メイン画面', () => {
  it('タイトルが正しく表示されること', () => {
    // 画面を描画
    render(<Home />);

    // タイトルを取得
    const title = screen.getByRole('heading', {
      name: '推し天文台 - Stargazer Base -',
    });

    // タイトルが表示されているか確認
    expect(title).toBeInTheDocument();
  });

  it('説明文が正しく表示されること', () => {
    // 画面を描画
    render(<Home />);

    // 説明文を取得
    const description = screen.getByText(
      '推し(星)を特等席で眺め続けるための前線基地'
    );

    // 説明文が表示されているか確認
    expect(description).toBeInTheDocument();
  });
});
