import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
};

/** Shared title + subtitle block used at the top of each analysis panel. */
export function PanelHeading({ title, subtitle }: Props) {
  return (
    <View style={styles.heading}>
      <Text variant="sectionTitle" color="textPrimary">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color="textTertiary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    gap: spacing.base,
  },
});
