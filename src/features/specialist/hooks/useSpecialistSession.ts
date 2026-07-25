import { useCallback, useRef, useState } from 'react';

import { getSupabase } from '@/lib/supabase';

import { recentActivities } from '../recentActivities';
import {
  blocksForFlare,
  blocksForQuickIntent,
  blocksForScanAnalyzing,
  blocksForScanResult,
  blocksForTriage,
  nextBlockId,
  welcomeBlocks,
} from '../sessions';
import type { ConsultationBlock, TriageLevel } from '../types';

const TYPING_MS = 900;
const SCAN_MS = 1600;
const COACH_ERROR =
  'Could not reach the coach. Check your connection and try again.';

export type SpecialistMode = 'hub' | 'chat';

type HistoryTurn = { role: 'user' | 'assistant'; content: string };

function historyFromBlocks(blocks: ConsultationBlock[]): HistoryTurn[] {
  const turns: HistoryTurn[] = [];
  for (const b of blocks) {
    if (b.type === 'user' && b.text.trim()) {
      turns.push({ role: 'user', content: b.text.trim() });
    } else if (b.type === 'specialist' && b.text.trim()) {
      turns.push({ role: 'assistant', content: b.text.trim() });
    }
  }
  return turns.slice(-8);
}

async function invokeCoachChat(message: string, history: HistoryTurn[]): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.functions.invoke('coach-chat', {
    body: { message, history },
  });

  const payload = data as { reply?: string; error?: string; detail?: string } | null;
  if (error) {
    const detail = payload?.detail || payload?.error;
    throw new Error(detail ? `${error.message}: ${detail}` : error.message);
  }

  const reply = payload?.reply?.trim();
  if (!reply) throw new Error(payload?.error || 'Empty coach reply');
  return reply;
}

export function useSpecialistSession() {
  const [mode, setMode] = useState<SpecialistMode>('hub');
  const [chatTitle, setChatTitle] = useState('Khumaar Specialist');
  const [messages, setMessages] = useState<ConsultationBlock[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanSheetOpen, setScanSheetOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const messagesRef = useRef<ConsultationBlock[]>([]);
  messagesRef.current = messages;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const appendBlocks = useCallback((blocks: ConsultationBlock[]) => {
    setMessages((prev) => [...prev.filter((m) => m.type !== 'typing'), ...blocks]);
    setIsTyping(false);
  }, []);

  const enterChat = useCallback(
    (title: string, initial?: ConsultationBlock[]) => {
      setChatTitle(title);
      setMode('chat');
      setIsTyping(false);
      if (initial) {
        setMessages(initial);
      } else if (messagesRef.current.length === 0) {
        setMessages(welcomeBlocks());
      }
    },
    [],
  );

  const backToHub = useCallback(() => {
    setMode('hub');
    setIsTyping(false);
    clearTimers();
  }, [clearTimers]);

  const respondWithBlocks = useCallback(
    (blocks: ConsultationBlock[], delay = TYPING_MS) => {
      setIsTyping(true);
      setMessages((prev) => [
        ...prev.filter((m) => m.type !== 'typing'),
        { id: nextBlockId(), type: 'typing' },
      ]);

      const t = setTimeout(() => {
        appendBlocks(blocks);
      }, delay);
      timers.current.push(t);
    },
    [appendBlocks],
  );

  const sendLive = useCallback(
    async (text: string, title = 'Khumaar Specialist', resetThread = false) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      clearTimers();
      setChatTitle(title);
      setMode('chat');

      const prior = resetThread ? [] : messagesRef.current;
      const history = historyFromBlocks(prior);
      const userBlock: ConsultationBlock = {
        id: nextBlockId(),
        type: 'user',
        text: trimmed,
      };

      setMessages([...prior.filter((m) => m.type !== 'typing'), userBlock, { id: nextBlockId(), type: 'typing' }]);
      setIsTyping(true);

      try {
        const reply = await invokeCoachChat(trimmed, history);
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== 'typing'),
          { id: nextBlockId(), type: 'specialist', text: reply },
        ]);
      } catch (error) {
        console.warn('Coach chat error', error);
        setMessages((prev) => [
          ...prev.filter((m) => m.type !== 'typing'),
          { id: nextBlockId(), type: 'specialist', text: COACH_ERROR },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [clearTimers],
  );

  const sendBriefChip = useCallback(
    (prompt: string) => {
      void sendLive(prompt, 'Skin brief', true);
    },
    [sendLive],
  );

  const startNewChat = useCallback(
    (text: string) => {
      void sendLive(text, 'Khumaar Specialist', true);
    },
    [sendLive],
  );

  const sendUserText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (mode !== 'chat') {
        void sendLive(trimmed, 'Khumaar Specialist', true);
        return;
      }
      void sendLive(trimmed, chatTitle, false);
    },
    [mode, chatTitle, sendLive],
  );

  const runQuickIntent = useCallback(
    (intentId: string) => {
      if (intentId === 'flare') {
        enterChat('Khumaar Specialist');
        respondWithBlocks(blocksForFlare());
        return;
      }
      const promptByIntent: Record<string, string> = {
        routine: 'Help me adjust my routine based on my latest scan.',
        compare: 'What changed in my skin since my last scan?',
        products: 'Which product types fit my current focus points?',
      };
      const prompt = promptByIntent[intentId];
      if (prompt) {
        void sendLive(prompt, 'Khumaar Specialist', true);
        return;
      }
      enterChat('Khumaar Specialist');
      const blocks = blocksForQuickIntent(intentId);
      if (blocks) respondWithBlocks(blocks);
    },
    [enterChat, respondWithBlocks, sendLive],
  );

  const openFeatureScan = useCallback(() => {
    setScanSheetOpen(true);
  }, []);

  const openFeatureRoutine = useCallback(() => {
    void sendLive(
      'Coach me on my morning and night routine for today.',
      'Routine advisor',
      true,
    );
  }, [sendLive]);

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
