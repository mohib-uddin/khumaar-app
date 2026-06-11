import { StyleSheet, View } from 'react-native';

import { FacialRatios, facialRatios } from '@/features/skin-profile';
import { spacing } from '@/theme';

import { PanelHeading } from './PanelHeading';

/** Face tab — reference-inspired facial harmony score and ratio report. */
export function RatiosPanel() {
  return (
    <View style={styles.panel}>
      <PanelHeading title="Facial analysis" subtitle="From your front & side scans" />
      <FacialRatios data={facialRatios} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing['4xl'],
  },
});
