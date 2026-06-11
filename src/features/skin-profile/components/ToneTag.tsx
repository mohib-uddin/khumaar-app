import { Pill, Text } from '@/components/ui';

import { toneColor, toneLabel, toneSoft, type Tone } from '../tones';

type Props = {
  tone: Tone;
  /** Override the default tone label ("Good" / "Average" / "Improve"). */
  label?: string;
};

/** Soft, tone-tinted status pill used across ratio and skin metric rows. */
export function ToneTag({ tone, label }: Props) {
  return (
    <Pill paddingX={8} paddingY={4} background={toneSoft[tone]}>
      <Text variant="metricSm" color={toneColor[tone]}>
        {label ?? toneLabel[tone]}
      </Text>
    </Pill>
  );
}
