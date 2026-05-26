import { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Microphone, Paperclip, PaperPlane, Plus } from '@/components/icons';
import { Card, PressableScale } from '@/components/ui';
import { palette, radii, spacing, tabBarDock } from '@/theme';

type Props = {
  onSend: (text: string) => void;
  onAttachScan?: () => void;
  /** Hub: home entry. Chat: active thread. */
  variant?: 'hub' | 'chat';
};

const PLACEHOLDER = 'Type your message…';
const PILL_H = 52;
const ORB_SIZE = 52;

/** Same dark pill as bottom tab segmented track. */
const MIC_ORB_BG = 'rgba(47, 49, 49, 0.92)';

export function SpecialistComposer({ onSend, onAttachScan, variant = 'chat' }: Props) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const isHub = variant === 'hub';
  const hasText = Boolean(text.trim());

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const LeadingIcon = isHub ? Plus : Paperclip;
  const micShowsSend = !isHub && hasText;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
      <View style={styles.row}>
        <Card radius="pill" elevation="card" background={palette.white} style={styles.pill}>
          <PressableScale
            onPress={onAttachScan}
            style={styles.leading}
            hitSlop={8}
            accessibilityLabel="Add attachment">
            <LeadingIcon size={20} color={palette.ink[700]} />
          </PressableScale>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={PLACEHOLDER}
            placeholderTextColor={palette.ink[300]}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            multiline
            maxLength={500}
          />
          <PressableScale
            onPress={handleSend}
            disabled={!hasText}
            style={[styles.inlineSend, !hasText && styles.inlineSendDisabled]}
            hitSlop={8}
            accessibilityLabel="Send message">
            <PaperPlane size={18} color={hasText ? palette.ink[900] : palette.ink[300]} />
          </PressableScale>
        </Card>

        <PressableScale
          onPress={micShowsSend ? handleSend : undefined}
          accessibilityLabel={micShowsSend ? 'Send message' : 'Voice input'}
          pressedScale={0.94}
          style={styles.micOrb}>
          {micShowsSend ? (
            <PaperPlane size={20} color={palette.white} />
          ) : (
            <Microphone size={22} color={palette.white} />
          )}
        </PressableScale>
      </View>
    </View>
  );
}

/** Dock height for scroll padding (pill + safe area slack). */
export const SPECIALIST_COMPOSER_HEIGHT = ORB_SIZE + spacing.xl + spacing.lg;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: tabBarDock.hostPaddingX,
    paddingTop: spacing.md,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tabBarDock.barAgentGap,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: PILL_H,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: palette.border.light,
  },
  leading: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: 'Lufga-Medium',
    fontSize: 15,
    lineHeight: 20,
    color: palette.ink[900],
    maxHeight: 72,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
  },
  inlineSend: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  inlineSendDisabled: {
    opacity: 0.45,
  },
  micOrb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: radii.pill,
    backgroundColor: MIC_ORB_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
