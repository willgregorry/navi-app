import { useState, useEffect, useCallback } from 'react';
import type { ExamSessionData, Problem } from '../types/exam';
import { joinExamRoom } from '../services/api/studentSessionService';
import { adaptPublicProblemsList } from '../services/adapters/problemAdapter';

export function useExamSession() {
  const [session, setSession] = useState<ExamSessionData | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [remainingHints, setRemainingHints] = useState<number>(5);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(90 * 60);

  // Timer countdown
  useEffect(() => {
    if (!isJoined || timeRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isJoined, timeRemainingSeconds]);

  // Format MM:SS or HH:MM:SS
  const formatTime = useCallback((totalSecs: number): string => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }, []);

  const timeRemainingFormatted = formatTime(timeRemainingSeconds);

  const joinSession = useCallback(async (name: string, idNum: string, room: string) => {
    setIsLoading(true);
    try {
      const response = await joinExamRoom({
        room_code: room.trim().toUpperCase(),
        student_name: name.trim(),
        student_id_number: idNum.trim(),
      });

      const adaptedProblems = adaptPublicProblemsList(response.problems || []);

      const sessionData: ExamSessionData = {
        studentId: response.student_id,
        studentName: response.student_name,
        studentIdNumber: response.student_id_number,
        roomCode: response.room_code,
        durationMinutes: response.duration_minutes || 90,
        expiresAt: response.expires_at,
        hintQuota: response.hint_quota || 5,
        hintsUsed: response.hints_used || 0,
        remainingHints: response.remaining_hints ?? 5,
        allowSyntaxHints: response.allow_syntax_hints ?? true,
        allowLogicHints: response.allow_logic_hints ?? true,
        problems: adaptedProblems,
      };

      setSession(sessionData);
      setProblems(adaptedProblems);
      setRemainingHints(sessionData.remainingHints);

      // Initialize timer from expires_at if provided
      if (response.expires_at) {
        const diffMs = new Date(response.expires_at).getTime() - Date.now();
        if (diffMs > 0) {
          setTimeRemainingSeconds(Math.floor(diffMs / 1000));
        } else {
          setTimeRemainingSeconds(sessionData.durationMinutes * 60);
        }
      } else {
        setTimeRemainingSeconds(sessionData.durationMinutes * 60);
      }

      setIsJoined(true);
      return sessionData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exitSession = useCallback(() => {
    setSession(null);
    setProblems([]);
    setIsJoined(false);
  }, []);

  return {
    session,
    problems,
    isJoined,
    isLoading,
    remainingHints,
    setRemainingHints,
    timeRemainingFormatted,
    timeRemainingSeconds,
    joinSession,
    exitSession,
  };
}
