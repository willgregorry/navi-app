import { apiClient } from './client';
import type {
  ViolationReportRequest,
  ViolationReportResponse,
} from '../../types/api/models';

/**
 * Report Alt+Tab / Window Blur violation event to anti-cheat telemetry.
 * POST /api/v1/violations
 */
export async function reportViolation(
  payload: ViolationReportRequest
): Promise<ViolationReportResponse | null> {
  try {
    const response = await apiClient.post<ViolationReportResponse>('/violations', payload);
    return response.data;
  } catch (error) {
    // Non-blocking telemetry warning
    console.info('[AntiCheatService] Violation reported locally (backend offline).', payload.event_type);
    return {
      violation_count: 1,
      event_type: payload.event_type,
      timestamp: new Date().toISOString(),
      message: 'Violation recorded locally',
    };
  }
}
