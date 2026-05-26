import { symptomMetrics } from '@/features/skin-analysis/data';
import { palette } from '@/theme';

import { skinContext } from './skinContext';
import type { BriefChip, ConsultationBlock, QuickIntent } from './types';

let blockId = 0;
export const nextBlockId = () => `block-${++blockId}`;

export const briefChips: BriefChip[] = [
  {
    id: 'score',
    label: 'Score',
    value: `${skinContext.health.score}/${skinContext.health.total}`,
    prompt: `My skin score is ${skinContext.health.score}. What should I focus on?`,
    tintBg: palette.brand[50],
    borderColor: palette.brand[100],
    labelColor: palette.brand[700],
    valueColor: palette.ink[900],
  },
  {
    id: 'concern',
    label: 'Focus',
    value: 'Oiliness',
    prompt: 'Why is oiliness still my main concern?',
    tintBg: palette.accent.warningSoft,
    borderColor: 'rgba(253, 109, 44, 0.22)',
    labelColor: palette.accent.warning,
    valueColor: palette.ink[900],
  },
  {
    id: 'uv',
    label: 'UV',
    value: skinContext.environment.uv,
    prompt: `UV is ${skinContext.environment.uv} in ${skinContext.environment.location}. How should I protect my skin today?`,
    tintBg: 'rgba(84, 113, 255, 0.1)',
    borderColor: 'rgba(84, 113, 255, 0.22)',
    labelColor: palette.accent.info,
    valueColor: palette.ink[900],
  },
  {
    id: 'scan',
    label: 'Last scan',
    value: `${skinContext.health.updatedMinutesAgo}m ago`,
    prompt: 'Explain my latest scan results in simple terms.',
    tintBg: 'rgba(29, 149, 110, 0.1)',
    borderColor: 'rgba(29, 149, 110, 0.2)',
    labelColor: palette.accent.success,
    valueColor: palette.ink[900],
  },
];

export const quickIntents: QuickIntent[] = [
  { id: 'flare', label: 'Log a flare-up' },
  { id: 'routine', label: 'Adjust my routine' },
  { id: 'compare', label: 'Compare progress' },
  { id: 'acne', label: 'Why is acne worse?' },
  { id: 'uv', label: 'UV safety today' },
];

export function welcomeBlocks(): ConsultationBlock[] {
  const name = skinContext.user.name;
  return [
    {
      id: nextBlockId(),
      type: 'specialist',
      text: `Hi ${name} — I reviewed your brief above. Oiliness is still the main focus; papules are elevated. Tap a metric or ask anything below.`,
    },
    {
      id: nextBlockId(),
      type: 'insight',
      title: 'Good Progress',
      body: `Score ${skinContext.health.score}/${skinContext.health.total} · ${skinContext.progress.delta} this week.`,
      highlight: skinContext.progress.narrative,
    },
    {
      id: nextBlockId(),
      type: 'scan_prompt',
    },
  ];
}

export function blocksForBriefChip(prompt: string): ConsultationBlock[] {
  return [
    { id: nextBlockId(), type: 'user', text: prompt },
    {
      id: nextBlockId(),
      type: 'specialist',
      text: `Given your ${skinContext.health.score}/100 score and ${skinContext.environment.uv} in ${skinContext.environment.location}, I'd keep mornings gentle and lock in SPF reapplication.`,
    },
    {
      id: nextBlockId(),
      type: 'insight',
      title: 'Triggers to watch',
      body: skinContext.triggers.slice(0, 3).join(' · '),
    },
    {
      id: nextBlockId(),
      type: 'deep_link',
      title: 'Full skin analysis',
      subtitle: 'Symptoms, treatments & specialist notes',
      href: '/analyze',
    },
  ];
}

export function blocksForUserText(text: string): ConsultationBlock[] {
  return [
    { id: nextBlockId(), type: 'user', text },
    {
      id: nextBlockId(),
      type: 'specialist',
      text: "Based on your profile, I'd avoid harsh actives tonight and prioritize barrier repair. Tap a quick action below or send another photo if something changed.",
    },
    {
      id: nextBlockId(),
      type: 'triage',
    },
  ];
}

export function blocksForScanAnalyzing(): ConsultationBlock[] {
  return [{ id: nextBlockId(), type: 'scan_analyzing' }];
}

export function blocksForScanResult(): ConsultationBlock[] {
  return [
    {
      id: nextBlockId(),
      type: 'scan_result',
      metrics: symptomMetrics,
      summary: 'Based on AI skin detection — papules need the most attention this week.',
    },
    {
      id: nextBlockId(),
      type: 'specialist',
      text: 'Crusting and cysts look manageable with your current routine. Consider a lighter moisturizer while papules calm down.',
    },
    {
      id: nextBlockId(),
      type: 'deep_link',
      title: 'Open full report',
      subtitle: 'Overview · Symptoms · Treatments',
      href: '/analyze',
    },
    {
      id: nextBlockId(),
      type: 'triage',
    },
  ];
}

export function blocksForRoutine(): ConsultationBlock[] {
  return [
    {
      id: nextBlockId(),
      type: 'user',
      text: 'Adjust my morning routine',
    },
    {
      id: nextBlockId(),
      type: 'specialist',
      text: 'Your morning flow is solid. With High UV today, I recommend moving SPF earlier and skipping extra exfoliation.',
    },
    {
      id: nextBlockId(),
      type: 'routine_suggestion',
      changes: [
        'Add SPF reapplication at midday',
        'Swap harsh cleanser Tue/Thu → gentle milk cleanser',
        'Keep toner — do not layer with new acids this week',
      ],
    },
    {
      id: nextBlockId(),
      type: 'deep_link',
      title: 'Review routines',
      subtitle: 'Morning · Night · Weekly',
      href: '/rituals',
    },
  ];
}

export function blocksForCompare(): ConsultationBlock[] {
  return [
    { id: nextBlockId(), type: 'user', text: 'Compare my progress' },
    {
      id: nextBlockId(),
      type: 'insight',
      title: 'Weekly change',
      body: `Skin progress ${skinContext.progress.delta} with ring at ${skinContext.progress.ring}%.`,
      highlight: skinContext.progress.narrative,
    },
    {
      id: nextBlockId(),
      type: 'specialist',
      text: 'Acne markers improved since last cycle. Oiliness is stable — stay consistent with your toner step.',
    },
    {
      id: nextBlockId(),
      type: 'deep_link',
      title: 'Detailed analysis',
      subtitle: 'View symptom breakdown',
      href: '/analyze',
    },
  ];
}

export function blocksForFlare(): ConsultationBlock[] {
  return [
    { id: nextBlockId(), type: 'user', text: 'Log a flare-up' },
    {
      id: nextBlockId(),
      type: 'specialist',
      text: "Tell me severity — I'll suggest whether to adjust home care or book a dermatologist.",
    },
    {
      id: nextBlockId(),
      type: 'triage',
    },
  ];
}

export function blocksForTriage(level: 'routine' | 'monitor' | 'dermatologist'): ConsultationBlock[] {
  if (level === 'dermatologist') {
    return [
      {
        id: nextBlockId(),
        type: 'safety',
        level: 'dermatologist',
        message:
          'Painful cysts, rapid spreading, or fever warrant an in-person visit. I can help you prepare questions for your appointment.',
      },
    ];
  }
  if (level === 'monitor') {
    return [
      {
        id: nextBlockId(),
        type: 'safety',
        level: 'monitor',
        message: 'Track daily photos for 5 days. If papules worsen, escalate to a dermatologist.',
      },
      {
        id: nextBlockId(),
        type: 'scan_prompt',
      },
    ];
  }
  return [
    {
      id: nextBlockId(),
      type: 'specialist',
      text: "Great — stay on your current routine. I'll check in when your environment or score shifts.",
    },
  ];
}

export function blocksForQuickIntent(intentId: string): ConsultationBlock[] | null {
  switch (intentId) {
    case 'routine':
      return blocksForRoutine();
    case 'compare':
      return blocksForCompare();
    case 'flare':
      return blocksForFlare();
    case 'acne':
      return [
        { id: nextBlockId(), type: 'user', text: 'Why is acne worse?' },
        {
          id: nextBlockId(),
          type: 'specialist',
          text: 'Likely combined triggers: stress, touching face, and High UV. Papules are elevated — ease actives for 48 hours.',
        },
        {
          id: nextBlockId(),
          type: 'insight',
          title: 'Be aware',
          body: skinContext.triggers.join(' · '),
        },
      ];
    case 'uv':
      return blocksForBriefChip(
        `UV is ${skinContext.environment.uv} in ${skinContext.environment.location}. How should I protect my skin today?`,
      );
    default:
      return null;
  }
}
