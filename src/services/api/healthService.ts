import { apiClient } from './client';
import type { HealthResponse } from '../../types/api/models';

/**
 * Health check probe to test server & database status.
 * GET /api/v1/health
 */
export async function checkServerHealth(): Promise<HealthResponse | null> {
  try {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    return null;
  }
}
