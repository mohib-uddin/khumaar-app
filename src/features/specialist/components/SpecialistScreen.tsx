import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { palette } from '@/theme';

import { useSpecialistSession } from '../hooks/useSpecialistSession';
import { SpecialistChat } from './chat/SpecialistChat';
import { SpecialistHub } from './hub/SpecialistHub';
import { SpecialistComposer } from './SpecialistComposer';
import { MockScanSheet } from './MockScanSheet';

export function SpecialistScreen() {
  const router = useRouter();
  const session = useSpecialistSession();
  const {
    mode,
    chatTitle,
    messages,
    isTyping,
    scanSheetOpen,
    setScanSheetOpen,
    backToHub,
    sendBriefChip,
    startNewChat,
    sendUserText,
    openFeatureScan,
    openFeatureRoutine,
    openRecentActivity,
    startMockScan,
    selectTriage,
    clearTimers,
  } = session;

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleExit = () => {
    if (mode === 'chat') {
      backToHub();
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

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
              onFeatureScan={openFeatureScan}
              onFeatureRoutine={openFeatureRoutine}
              onRecentActivity={openRecentActivity}
              onBriefMetric={sendBriefChip}
            />
            <SpecialistComposer
              variant="hub"
              onSend={startNewChat}
              onAttachScan={openFeatureScan}
            />
          </>
        ) : (
          <SpecialistChat
            title={chatTitle}
            messages={messages}
            isTyping={isTyping}
            onBack={backToHub}
            onSend={sendUserText}
            onScanPress={() => setScanSheetOpen(true)}
            onTriageSelect={selectTriage}
          />
        )}
      </KeyboardAvoidingView>

      <MockScanSheet
        visible={scanSheetOpen}
        onClose={() => setScanSheetOpen(false)}
        onCapture={startMockScan}
      />
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
