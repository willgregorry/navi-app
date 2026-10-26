export interface TestCase {
  id: string | number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string; // Unified string identifier for React keys & code dicts
  numericId?: number; // Backend DB id if available
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  category: string;
  description: string;
  constraints: string[];
  starterCode: string;
  sampleTestCases: TestCase[];
}

export interface ExamSessionData {
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  roomCode: string;
  durationMinutes: number;
  expiresAt: string | null;
  hintQuota: number;
  hintsUsed: number;
  remainingHints: number;
  allowSyntaxHints: boolean;
  allowLogicHints: boolean;
  problems: Problem[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  isSuccess: boolean;
  passedCount?: number;
  totalCount?: number;
  hasSyntaxError?: boolean;
  faultyLine?: number | null;
  syntaxErrorMessage?: string;
  executionTimeMs?: number;
}
