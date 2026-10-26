export type HintType = 'syntax' | 'logic' | 'runtime';

export interface SocraticHint {
  id: string;
  type: HintType;
  line?: number;
  title: string;
  question: string;
  conceptHint?: string;
}

export interface HintState {
  available: number;
  used: number;
  hints: SocraticHint[];
}
