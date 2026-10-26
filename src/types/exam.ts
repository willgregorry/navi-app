export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  category: string;
  description: string;
  constraints: string[];
  starterCode: string;
  sampleTestCases: TestCase[];
}

export interface ExamSession {
  roomCode: string;
  studentName: string;
  studentId: string; // NIM
  startTime: number;
  durationMinutes: number;
  maxHints: number;
  problem: Problem;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  isSuccess: boolean;
  passedCount?: number;
  totalCount?: number;
}
