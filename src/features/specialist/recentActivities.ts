import {
  blocksForCompare,
  blocksForRoutine,
  welcomeBlocks,
} from './sessions';

export type RecentActivity = {
  id: string;
  kind: 'scan' | 'routine' | 'insight';
  title: string;
  subtitle: string;
  loadBlocks: () => ReturnType<typeof welcomeBlocks>;
};

export const recentActivities: RecentActivity[] = [
  {
    id: 'scan-1',
    kind: 'scan',
    title: 'Skin scan',
    subtitle: 'Papules · Strong severity · 15m ago',
    loadBlocks: welcomeBlocks,
  },
  {
    id: 'routine-1',
    kind: 'routine',
    title: 'Routine adjustment',
    subtitle: 'Morning SPF · High UV day',
    loadBlocks: blocksForRoutine,
  },
  {
    id: 'compare-1',
    kind: 'insight',
    title: 'Progress check',
    subtitle: '+2.3% · 3X vs last 5 days',
    loadBlocks: blocksForCompare,
  },
];
