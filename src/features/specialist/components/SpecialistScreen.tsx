import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui';
import { openProPaywall, useSpecialistQuota } from '@/features/billing';
import { HeaderBlur } from '@/features/dashboard';
import { useLatestAnalysis } from '@/features/dashboard/hooks/useLatestAnalysis';
import { palette } from '@/theme';

import { briefChipsFromAnalysis } from '../briefChipsFromAnalysis';
import { useCoachHistory } from '../hooks/useCoachHistory';
import { useSpecialistSession } from '../hooks/useSpecialistSession';
import { SpecialistChat } from './chat/SpecialistChat';
import { SpecialistHub } from './hub/SpecialistHub';
import { SpecialistComposer } from './SpecialistComposer';

export function SpecialistScreen() {
  const router = useRouter();
  const { analysis } = useLatestAnalysis();
  const { items: history, refresh: refreshHistory } = useCoachHistory();
  const quota = useSpecialistQuota();
  const session = useSpecialistSession();
  const {
    mode,
    chatTitle,
    messages,
    isTyping,
    backToHub,
    sendBriefChip,
    startNewChat,
    sendUserText,
    openCoachHistory,
    selectTriage,
    clearTimers,
  } = session;

  const chips = useMemo(() => briefChipsFromAnalysis(analysis), [analysis]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (mode === 'hub') void refreshHistory();
  }, [mode, refreshHistory]);

  const guardSend = (send: (text: string) => void) => (text: string) => {
    if (!quota.canSend) {
      openProPaywall('chat');
      return;
    }
    quota.recordLocalSend();
    send(text);
  };

  const handleExit = () => {
    if (mode === 'chat') {
      backToHub();
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const remaining = quota.isPro ? undefined : quota.remaining;

  return (
    <Screen edges={['top', 'left', 'right']} style={styles.screen}>
      <HeaderBlur />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        {mode === 'hub' ? (
          <>
            <SpecialistHub
              onBack={handleExit}
              chips={chips}
              history={history}
              onBriefMetric={(prompt) => {
                if (!quota.canSend) {
                  openProPaywall('chat');
                  return;
                }
                quota.recordLocalSend();
                sendBriefChip(prompt);
              }}
              onOpenHistory={(item) =>
                openCoachHistory(item.title, item.blocks, item.threadId)
              }
            />
            <SpecialistComposer
              variant="hub"
              onSend={guardSend(startNewChat)}
              remainingMessages={remaining}
            />
          </>
        ) : (
          <SpecialistChat
            title={chatTitle}
            messages={messages}
            isTyping={isTyping}
            onBack={backToHub}
            onSend={guardSend(sendUserText)}
            onTriageSelect={selectTriage}
            remainingMessages={remaining}
          />
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: palette.surface.canvas,
  },
  flex: {
    flex: 1,
  },
});
