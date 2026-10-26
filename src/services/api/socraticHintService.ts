import { apiClient } from './client';
import type {
  SocraticHintRequest,
  SocraticHintResponse,
} from '../../types/api/models';

/**
 * Request reflective Socratic hint from Gemini AI engine.
 * Calls POST /api/v1/hints/request
 */
export async function requestSocraticHint(
  payload: SocraticHintRequest
): Promise<SocraticHintResponse> {
  try {
    const finalPayload: SocraticHintRequest = {
      language: 'en',
      ...payload,
    };
    const response = await apiClient.post<SocraticHintResponse>('/hints/request', finalPayload);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Failed to receive Socratic guidance from AI engine.';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
}
