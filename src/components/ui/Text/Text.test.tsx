import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('コンポーネントテスト: Text', () => {
  // 1. デフォルトの挙動テスト
  it('デフォルトでbodyスタイル（pタグ・発光なし）としてテキストが描画されること', () => {
    render(<Text>推しの動画</Text>);
    const element = screen.getByText('推しの動画');

    expect(element.tagName).toBe('P'); // デフォルトは p タグ
    expect(element.className).not.toContain('drop-shadow'); // 光っていないこと
  });

  // 2. タグの出し分けテスト（代表的なものだけチェック）
  it('variant="pageTitle" の場合は h1 タグで描画されること', () => {
    render(<Text variant="pageTitle">タイトル</Text>);
    const element = screen.getByText('タイトル');
    expect(element.tagName).toBe('H1');
  });

  // 3. 発光ロジックのテスト（一番重要な分岐！）
  it('pageTitle はデフォルトで発光クラスが付与されること', () => {
    render(<Text variant="pageTitle">光るタイトル</Text>);
    const element = screen.getByText('光るタイトル');
    expect(element.className).toContain('drop-shadow');
  });

  it('heading はデフォルトでは発光クラスが付与されないこと', () => {
    render(<Text variant="heading">光らない見出し</Text>);
    const element = screen.getByText('光らない見出し');
    expect(element.className).not.toContain('drop-shadow');
  });

  // 4. 強制上書きのテスト
  it('glow={true} を渡すと、デフォルトで光らない要素も発光すること', () => {
    render(
      <Text variant="heading" glow={true}>
        強制発光
      </Text>
    );
    const element = screen.getByText('強制発光');
    expect(element.className).toContain('drop-shadow');
  });

  it('glow={false} を渡すと、デフォルトで光る要素も発光しないこと', () => {
    render(
      <Text variant="pageTitle" glow={false}>
        発光オフ
      </Text>
    );
    const element = screen.getByText('発光オフ');
    expect(element.className).not.toContain('drop-shadow');
  });

  // 5. 外部クラスのマージテスト
  it('追加の className が正しく適用されること', () => {
    render(<Text className="mt-10">マージテスト</Text>);
    const element = screen.getByText('マージテスト');
    expect(element.className).toContain('mt-10');
  });
});
