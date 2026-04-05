import { Text } from '@/components/ui/Text';

/** STPRファミリー各グループごとの人数 */
const STARS = [6, 4, 6, 6, 7, 6];

/**
 * トップ画面専用: STPRファミリー各グループの人数分の星（★）を描画する
 */
export const StprFamilyStars = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      {STARS.map((count, index) => (
        <Text
          key={index}
          variant="subHeading"
          className="tracking-[0.45em] text-yellow-200/80 drop-shadow-[0_0_8px_rgba(253,230,138,0.5)]"
        >
          {'★'.repeat(count)}
        </Text>
      ))}
    </div>
  );
};
