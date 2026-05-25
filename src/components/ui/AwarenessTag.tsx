import { Pill, Text } from '@/components/ui';
import { palette } from '@/theme';

type Props = {
  label: string;
};

/** Soft warning pill used in the "Be aware" section. */
export function AwarenessTag({ label }: Props) {
  return (
    <Pill paddingX={10} paddingY={10} background={palette.accent.warningSoft}>
      <Text variant="body" color={palette.accent.warning}>
        {label}
      </Text>
    </Pill>
  );
}
