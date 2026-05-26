import { useCallback, useRef, useState } from 'react';

import { recentActivities } from '../recentActivities';
import {
  blocksForBriefChip,
  blocksForFlare,
  blocksForQuickIntent,
  blocksForScanAnalyzing,
  blocksForScanResult,
  blocksForTriage,
  blocksForUserText,
  nextBlockId,
  welcomeBlocks,
} from '../sessions';
import type { ConsultationBlock, TriageLevel } from '../types';

const TYPING_MS = 900;
const SCAN_MS = 1600;

export type SpecialistMode = 'hub' | 'chat';

export function useSpecialistSession() {
  const [mode, setMode] = useState<SpecialistMode>('hub');
  const [chatTitle, setChatTitle] = useState('Khumaar Specialist');
  const [messages, setMessages] = useState<ConsultationBlock[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanSheetOpen, setScanSheetOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const appendBlocks = useCallback((blocks: ConsultationBlock[]) => {
    setMessages((prev) => [...prev.filter((m) => m.type !== 'typing'), ...blocks]);
  }, []);

  const enterChat = useCallback((title: string, initial?: ConsultationBlock[]) => {
    setChatTitle(title);
    setMode('chat');
    if (initial) {
      setMessages(initial);
    } else if (messages.length === 0) {
      setMessages(welcomeBlocks());
    }
  }, [messages.length]);

  const backToHub = useCallback(() => {
    setMode('hub');
    setIsTyping(false);
    clearTimers();
  }, [clearTimers]);

  const respondWithBlocks = useCallback(
    (blocks: ConsultationBlock[], delay = TYPING_MS) => {
      setIsTyping(true);
      setMessages((prev) => [...prev.filter((m) => m.type !== 'typing'), { id: nextBlockId(), type: 'typing' }]);

      const t = setTimeout(() => {
        setIsTyping(false);
        appendBlocks(blocks);
      }, delay);
      timers.current.push(t);
    },
    [appendBlocks],
  );

  const sendBriefChip = useCallback(
    (prompt: string) => {
      enterChat('Skin brief');
      respondWithBlocks(blocksForBriefChip(prompt));
    },
    [enterChat, respondWithBlocks],
  );

  /** Hub ask field — always starts a fresh chat thread. */
  const startNewChat = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      clearTimers();
      setIsTyping(false);
      setChatTitle('Khumaar Specialist');
      setMode('chat');
      setMessages([{ id: nextBlockId(), type: 'user', text: trimmed }]);

      const replyBlocks = blocksForUserText(trimmed).filter((b) => b.type !== 'user');
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, ...replyBlocks]);
      }, TYPING_MS);
      timers.current.push(t);
    },
    [clearTimers],
  );

  /** Continue the active chat thread. */
  const sendUserText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (mode !== 'chat') {
        startNewChat(trimmed);
        return;
      }
      setMessages((prev) => [...prev, { id: nextBlockId(), type: 'user', text: trimmed }]);
      const replyBlocks = blocksForUserText(trimmed).filter((b) => b.type !== 'user');
      respondWithBlocks(replyBlocks);
    },
    [mode, respondWithBlocks, startNewChat],
  );

  const runQuickIntent = useCallback(
    (intentId: string) => {
      enterChat('Khumaar Specialist');
      const blocks = blocksForQuickIntent(intentId);
      if (blocks) respondWithBlocks(blocks);
      else if (intentId === 'flare') respondWithBlocks(blocksForFlare());
    },
    [enterChat, respondWithBlocks],
  );

  const openFeatureScan = useCallback(() => {
    setScanSheetOpen(true);
  }, []);

  const openFeatureRoutine = useCallback(() => {
    const blocks = blocksForQuickIntent('routine');
    if (blocks) {
      setChatTitle('Routine advisor');
      setMode('chat');
      setMessages(blocks);
    }
  }, []);

  const openRecentActivity = useCallback(
    (activityId: string) => {
      const activity = recentActivities.find((a) => a.id === activityId);
      if (!activity) return;
      enterChat(activity.title, activity.loadBlocks());
    },
    [enterChat],
  );

  const startMockScan = useCallback(() => {
    setScanSheetOpen(false);
    enterChat('Skin scan');
    appendBlocks(blocksForScanAnalyzing());

    const t1 = setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.type !== 'scan_analyzing'));
      respondWithBlocks(blocksForScanResult(), 400);
    }, SCAN_MS);
    timers.current.push(t1);
  }, [appendBlocks, enterChat, respondWithBlocks]);

  const selectTriage = useCallback(
    (level: TriageLevel) => {
      setMessages((prev) =>
        prev.map((m) => (m.type === 'triage' ? { ...m, selected: level } : m)),
      );
      respondWithBlocks(blocksForTriage(level), 500);
    },
    [respondWithBlocks],
  );

  return {
    mode,
    chatTitle,
    messages,
    isTyping,
    scanSheetOpen,
    setScanSheetOpen,
    enterChat,
    backToHub,
    sendBriefChip,
    startNewChat,
    sendUserText,
    runQuickIntent,
    openFeatureScan,
    openFeatureRoutine,
    openRecentActivity,
    startMockScan,
    selectTriage,
    clearTimers,
  };
}
