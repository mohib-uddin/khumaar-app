import { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderBlur } from '@/features/dashboard';
import { palette, spacing } from '@/theme';

import type { ConsultationBlock, TriageLevel } from '../../types';
import { ConsultationBlockView } from '../blocks/ConsultationBlockView';
import { SPECIALIST_COMPOSER_HEIGHT, SpecialistComposer } from '../SpecialistComposer';
import { TypingIndicator } from '../TypingIndicator';
import { SpecialistChatHeader } from './SpecialistChatHeader';

type Props = {
  title: string;
  messages: ConsultationBlock[];
  isTyping: boolean;
  onBack: () => void;
  onSend: (text: string) => void;
  onTriageSelect: (level: TriageLevel) => void;
  remainingMessages?: number;
};

export function SpecialistChat({
  title,
  messages,
  isTyping,
  onBack,
  onSend,
  onTriageSelect,
  remainingMessages,
}: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ConsultationBlock>>(null);
  const data = messages.filter((m) => m.type !== 'typing');

  useEffect(() => {
    if (data.length > 0 || isTyping) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [data.length, isTyping]);

  return (
    <View style={styles.root}>
      <HeaderBlur />
      <SpecialistChatHeader title={title} onBack={onBack} />
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + SPECIALIST_COMPOSER_HEIGHT + spacing.xxxl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        renderItem={({ item, index }) => (
          <ConsultationBlockView
            block={item}
            index={index}
            onTriageSelect={onTriageSelect}
          />
        )}
      />
      <SpecialistComposer onSend={onSend} remainingMessages={remainingMessages} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.surface.canvas,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
  },
});
