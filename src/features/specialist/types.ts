import type { SymptomMetric } from '@/features/skin-analysis/data';

export type TriageLevel = 'routine' | 'monitor' | 'dermatologist';

export type ConsultationBlock =
  | { id: string; type: 'specialist'; text: string }
  | { id: string; type: 'user'; text: string }
  | { id: string; type: 'insight'; title: string; body: string; highlight?: string }
  | { id: string; type: 'scan_prompt' }
  | { id: string; type: 'scan_analyzing' }
  | { id: string; type: 'scan_result'; metrics: SymptomMetric[]; summary: string }
  | { id: string; type: 'routine_suggestion'; changes: string[] }
  | { id: string; type: 'safety'; level: TriageLevel; message: string }
  | { id: string; type: 'deep_link'; title: string; subtitle: string; href: '/analyze' | '/rituals' }
  | { id: string; type: 'triage'; selected?: TriageLevel }
  | { id: string; type: 'typing' };

export type BriefChip = {
  id: string;
  label: string;
  value: string;
  prompt: string;
  tintBg: string;
  borderColor: string;
  labelColor: string;
  valueColor: string;
};

export type QuickIntent = {
  id: string;
  label: string;
};

export type SpecialistIntent =
  | 'welcome'
  | 'brief_chip'
  | 'user_text'
  | 'scan'
  | 'compare'
  | 'routine'
  | 'flare'
  | 'triage';
