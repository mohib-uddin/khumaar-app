export type OnboardingStep =
  | 'welcome'
  | 'auth'
  | 'consent'
  | 'concerns'
  | 'feel'
  | 'prep'
  | 'scan'
  | 'analyzing'
  | 'results'
  | 'done';

export type SkinFeel = 'dry' | 'oily' | 'combo' | 'sensitive';

export type ScanView = 'front' | 'left' | 'right' | 'side';

export type ScanStatus = 'pending' | 'uploaded' | 'analyzing' | 'ready' | 'failed';

export type AnalysisMetric = {
  id: string;
  label: string;
  value: string;
  position: number;
  tone: 'good' | 'average' | 'improve';
};

export type RoutinePlanStep = {
  id: string;
  title: string;
  description: string;
  kind: 'skincare' | 'exercise';
};

export type RoutinePlanBlock = {
  title: string;
  subtitle: string;
  steps: RoutinePlanStep[];
};

export type FocusPointStatus = 'done' | 'active' | 'pending';

export type FocusPoint = {
  key: string;
  label: string;
  status: FocusPointStatus;
};

export type RoutinePlan = {
  morning: RoutinePlanBlock;
  night: RoutinePlanBlock;
  focus_points: FocusPoint[];
  weekly_tip: string;
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  onboarding_step: OnboardingStep;
  concerns: string[];
  skin_feel: SkinFeel | null;
  fitzpatrick_type: number | null;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
  wellness_disclaimer_accepted_at: string | null;
  photo_ai_consent_at: string | null;
  starter_ritual_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ScanAnalysisRow = {
  id: string;
  user_id: string;
  batch_id: string;
  overall_score: number;
  top_focus: string;
  headline: string;
  metrics: AnalysisMetric[];
  ritual_id: string;
  disclaimer: string;
  routine_plan: RoutinePlan | null;
  fitzpatrick_type: number | null;
  raw: Record<string, unknown> | null;
  created_at: string;
};

export type RoutineCompletionRow = {
  id: string;
  user_id: string;
  routine_id: string;
  step_id: string;
  completed_on: string;
  created_at: string;
};

export type CoachMessageRow = {
  id: string;
  user_id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      consent_events: {
        Row: {
          id: string;
          user_id: string;
          consent_type: 'terms' | 'privacy' | 'wellness_disclaimer' | 'photo_ai';
          accepted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_type: 'terms' | 'privacy' | 'wellness_disclaimer' | 'photo_ai';
          accepted?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          accepted: boolean;
        }>;
        Relationships: [];
      };
      scans: {
        Row: {
          id: string;
          user_id: string;
          view: ScanView;
          storage_path: string;
          status: ScanStatus;
          batch_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          view: ScanView;
          storage_path: string;
          status?: ScanStatus;
          batch_id?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          status: ScanStatus;
          storage_path: string;
          batch_id: string | null;
        }>;
        Relationships: [];
      };
      scan_analyses: {
        Row: ScanAnalysisRow;
        Insert: Omit<ScanAnalysisRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
          routine_plan?: RoutinePlan | null;
        };
        Update: Partial<ScanAnalysisRow>;
        Relationships: [];
      };
      routine_completions: {
        Row: RoutineCompletionRow;
        Insert: {
          id?: string;
          user_id: string;
          routine_id: string;
          step_id: string;
          completed_on?: string;
          created_at?: string;
        };
        Update: Partial<RoutineCompletionRow>;
        Relationships: [];
      };
      coach_messages: {
        Row: CoachMessageRow;
        Insert: {
          id?: string;
          user_id: string;
          thread_id?: string;
          role: 'user' | 'assistant';
          content: string;
          created_at?: string;
        };
        Update: Partial<CoachMessageRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
