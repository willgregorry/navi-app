/**
 * OpenAPI 3.1.0 Contract Types for Navi Exam & Socratic Engine API v1.0.0
 * Auto-aligned with openapi.json
 */

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface PublicTestCase {
  id: number;
  input_data: string;
  expected_output: string;
}

export interface TestCaseCreate {
  input_data?: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface TestCaseResponse {
  id: number;
  problem_id: number;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
  created_at: string;
}

export interface PublicProblemResponse {
  id: number;
  title: string;
  difficulty: DifficultyLevel;
  points: number;
  category: string;
  description: string;
  constraints?: string[];
  starter_code: string;
  public_test_cases?: PublicTestCase[];
}

export interface ProblemCreate {
  title: string;
  difficulty?: DifficultyLevel;
  points?: number;
  category?: string;
  description: string;
  constraints?: string[];
  starter_code?: string;
  test_cases: TestCaseCreate[];
}

export interface StudentJoinRequest {
  room_code: string;
  student_name: string;
  student_id_number: string;
}

export interface StudentJoinResponse {
  student_id: number;
  room_code: string;
  student_name: string;
  student_id_number: string;
  duration_minutes: number;
  expires_at: string | null;
  hint_quota: number;
  hints_used: number;
  remaining_hints: number;
  allow_syntax_hints: boolean;
  allow_logic_hints: boolean;
  problems?: PublicProblemResponse[];
}

export interface StudentStatusResponse {
  student_id: number;
  student_name: string;
  student_id_number: string;
  hints_used: number;
  violation_count: number;
  solved_problem_ids?: number[];
  in_progress_problem_ids?: number[];
  total_score: number;
  is_submitted: boolean;
  time_remaining_seconds: number;
}

export interface SyntaxErrorDetail {
  line_number?: number | null;
  column_offset?: number | null;
  error_type: string;
  message: string;
  faulty_line?: string | null;
}

export interface TestCaseRunResult {
  test_case_id?: number | null;
  is_hidden?: boolean;
  passed: boolean;
  input_data?: string | null;
  expected_output?: string | null;
  actual_output?: string | null;
  error_message?: string | null;
  execution_time_ms: number;
}

export interface CodeRunRequest {
  student_id: number;
  problem_id: number;
  source_code: string;
}

export interface CodeRunResponse {
  success: boolean;
  has_syntax_error?: boolean;
  syntax_error_details?: SyntaxErrorDetail | null;
  total_tests: number;
  passed_tests: number;
  all_passed: boolean;
  test_results?: TestCaseRunResult[];
  stdout?: string;
  stderr?: string;
}

export interface CodeSubmitRequest {
  student_id: number;
  problem_id: number;
  source_code: string;
}

export interface CodeSubmitResponse {
  student_id: number;
  problem_id: number;
  is_passed: boolean;
  points_earned: number;
  passed_tests: number;
  total_tests: number;
  status: string;
  total_score_accumulated: number;
  score_percentage?: number;
  submitted_at: string;
}

export interface SocraticHintRequest {
  student_id: number;
  problem_id?: number | null;
  source_code: string;
  error_type: string;
  error_message: string;
  faulty_line_number?: number | null;
  language?: 'id' | 'en';
}

export interface SocraticHintResponse {
  hint_text: string;
  target_line_number?: number | null;
  hints_used: number;
  remaining_hints: number;
  total_quota: number;
  engine_used: string;
}

export interface ViolationReportRequest {
  student_id: number;
  event_type: 'alt_tab' | 'window_blur' | 'devtools_opened' | string;
  is_kiosk_active?: boolean;
  details?: string | null;
}

export interface ViolationReportResponse {
  violation_count: number;
  event_type: string;
  timestamp: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  database_connected: boolean;
}
