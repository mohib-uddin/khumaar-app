import { StyleSheet, View } from 'react-native';

import { SegmentedToggle } from '@/components/ui';

import { periodOptions, type Period } from './data';

type Props = {
  value: Period;
  onChange: (value: Period) => void;
};

/**
 * Floating "Today / This Week" period selector — Figma node 0:501.
 */
export function PeriodToggle({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <SegmentedToggle options={periodOptions} value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
});
