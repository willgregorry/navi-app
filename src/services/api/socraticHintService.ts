import { apiClient } from './client';
import type {
  SocraticHintRequest,
  SocraticHintResponse,
} from '../../types/api/models';
import dummyHints from '../../dummy/hints.json';

/**
 * Request reflective Socratic hint from Gemini AI engine.
 * POST /api/v1/hints/request
 */
export async function requestSocraticHint(
  payload: SocraticHintRequest,
  currentRemainingHints: number = 5
): Promise<SocraticHintResponse> {
  try {
    const response = await apiClient.post<SocraticHintResponse>('/hints/request', payload);
    if (response.data && response.data.hint_text) {
      return response.data;
    }
  } catch (error) {
    console.warn('[SocraticHintService] Backend AI engine unreachable, using local pedagogical heuristic fallback.', error);
  }

  // Offline pedagogical fallback
  const fallbackList = (dummyHints as any).hints || [];
  const selected = fallbackList[Math.floor(Math.random() * fallbackList.length)];

  return {
    hint_text: selected?.hintText ||
      'Perhatikan kembali kondisi perulangan dan tanda baca pada blok kode tersebut. Apakah semua variabel sudah terdefinisi sebelum dipanggil?',
    target_line_number: payload.faulty_line_number || selected?.line || null,
    hints_used: Math.max(0, 5 - currentRemainingHints + 1),
    remaining_hints: Math.max(0, currentRemainingHints - 1),
    total_quota: 5,
    engine_used: 'local_heuristic_fallback',
  };
}
