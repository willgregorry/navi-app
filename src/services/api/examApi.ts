import { apiClient } from './client';
import type { Problem } from '../../types/exam';

// Import decoupled dummy datasets
import dummyProblems from '../../dummy/problems.json';
import dummyRooms from '../../dummy/rooms.json';

export interface RoomDetails {
  code: string;
  title: string;
  durationMinutes: number;
  totalPoints: number;
  maxHints: number;
  problemIds: string[];
}

export interface SubmissionPayload {
  roomCode: string;
  studentName: string;
  studentId: string;
  problemId: string;
  code: string;
  isSuccess: boolean;
  passedCount: number;
  totalCount: number;
}

export interface ViolationPayload {
  roomCode: string;
  studentId: string;
  count: number;
  timestamp: number;
}

/**
 * Fetch all challenges for an assessment room using Axios with dummy JSON fallback.
 */
export async function fetchChallenges(roomCode?: string): Promise<Problem[]> {
  try {
    const response = await apiClient.get<Problem[]>('/challenges', {
      params: { roomCode },
    });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  } catch (err) {
    // Graceful fallback to dummy problems JSON
  }

  return dummyProblems as Problem[];
}

/**
 * Fetch a single challenge by its ID using Axios with dummy JSON fallback.
 */
export async function fetchChallengeById(problemId: string): Promise<Problem | null> {
  try {
    const response = await apiClient.get<Problem>(`/challenges/${problemId}`);
    if (response.data) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }

  const found = (dummyProblems as Problem[]).find((p) => p.id === problemId);
  return found || null;
}

/**
 * Fetch room metadata and settings.
 */
export async function fetchRoomDetails(roomCode: string): Promise<RoomDetails> {
  try {
    const response = await apiClient.get<RoomDetails>(`/rooms/${roomCode}`);
    if (response.data) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }

  const room = dummyRooms.rooms.find((r) => r.code === roomCode);
  if (room) {
    return room as RoomDetails;
  }

  // Generic fallback if room code is dynamic (e.g. NAVI-8392)
  return {
    code: roomCode,
    title: 'Python Assessment Challenges',
    durationMinutes: 120,
    totalPoints: (dummyProblems as Problem[]).reduce((a, b) => a + (b.points || 0), 0),
    maxHints: 5,
    problemIds: (dummyProblems as Problem[]).map((p) => p.id),
  };
}

/**
 * Dispatch student challenge submission to assessment API.
 */
export async function submitChallengeSolution(payload: SubmissionPayload): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.post('/submissions', payload);
    return response.data || { success: true };
  } catch (err) {
    // Emulated success in local offline mode
    return { success: true };
  }
}

/**
 * Log focus guard violation (Alt+Tab / blur) to proctor telemetry API.
 */
export async function logViolationEvent(payload: ViolationPayload): Promise<void> {
  try {
    await apiClient.post('/telemetry/violations', payload);
  } catch (err) {
    // Silent fail in local mode
  }
}
