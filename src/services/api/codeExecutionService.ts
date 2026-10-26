import { apiClient } from './client';
import type {
  CodeRunRequest,
  CodeRunResponse,
  CodeSubmitRequest,
  CodeSubmitResponse,
} from '../../types/api/models';

/**
 * Execute Python code against public test cases.
 * Calls POST /api/v1/code/run
 */
export async function runCode(payload: CodeRunRequest): Promise<CodeRunResponse> {
  try {
    const response = await apiClient.post<CodeRunResponse>('/code/run', payload);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Eksekusi kode di sandbox backend gagal.';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}

/**
 * Submit final code solution for a specific problem.
 * Calls POST /api/v1/code/submit
 */
export async function submitCode(payload: CodeSubmitRequest): Promise<CodeSubmitResponse> {
  try {
    const response = await apiClient.post<CodeSubmitResponse>('/code/submit', payload);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Pengumpulan solusi gagal dikirim ke backend.';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}
