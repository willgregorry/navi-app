import { apiClient } from './client';
import type {
  StudentJoinRequest,
  StudentJoinResponse,
  StudentStatusResponse,
} from '../../types/api/models';

/**
 * Join an exam room as a student participant.
 * Calls POST /api/v1/students/join
 */
export async function joinExamRoom(payload: StudentJoinRequest): Promise<StudentJoinResponse> {
  try {
    const response = await apiClient.post<StudentJoinResponse>('/students/join', payload);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Gagal terhubung ke server ujian.';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}

/**
 * Retrieve current metrics & status for a student participant.
 * Calls GET /api/v1/students/{student_id}
 */
export async function getStudentStatus(studentId: number): Promise<StudentStatusResponse> {
  try {
    const response = await apiClient.get<StudentStatusResponse>(`/students/${studentId}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Gagal memuat status siswa.';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}
