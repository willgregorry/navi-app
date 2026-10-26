import { apiClient } from './client';
import type {
  StudentJoinRequest,
  StudentJoinResponse,
  StudentStatusResponse,
} from '../../types/api/models';
import dummyProblems from '../../dummy/problems.json';

/**
 * Join an exam room as a student from the desktop kiosk.
 * Sends POST /api/v1/students/join with fallback to local dummy session if offline.
 */
export async function joinExamRoom(payload: StudentJoinRequest): Promise<StudentJoinResponse> {
  try {
    const response = await apiClient.post<StudentJoinResponse>('/students/join', payload);
    if (response.data && response.data.student_id) {
      return response.data;
    }
  } catch (error) {
    console.warn('[StudentSessionService] API join failed, switching to local offline session mode.', error);
  }

  // Graceful offline fallback
  const fallbackProblems = (dummyProblems as any[]).map((p, idx) => ({
    id: idx + 101,
    title: p.title,
    difficulty: p.difficulty || 'Easy',
    points: p.points || 20,
    category: p.category || 'General',
    description: p.description,
    constraints: p.constraints || [],
    starter_code: p.starterCode || 'def solution():\n    pass\n',
    public_test_cases: (p.sampleTestCases || []).map((tc: any, tcIdx: number) => ({
      id: tcIdx + 1,
      input_data: tc.input,
      expected_output: tc.expectedOutput,
    })),
  }));

  return {
    student_id: 1,
    room_code: payload.room_code,
    student_name: payload.student_name,
    student_id_number: payload.student_id_number,
    duration_minutes: 90,
    expires_at: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    hint_quota: 5,
    hints_used: 0,
    remaining_hints: 5,
    allow_syntax_hints: true,
    allow_logic_hints: true,
    problems: fallbackProblems,
  };
}

/**
 * Retrieve current metrics & solved status for a student participant.
 * Sends GET /api/v1/students/{student_id}
 */
export async function getStudentStatus(studentId: number): Promise<StudentStatusResponse | null> {
  try {
    const response = await apiClient.get<StudentStatusResponse>(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.warn(`[StudentSessionService] Failed to fetch student status for #${studentId}`, error);
    return null;
  }
}
