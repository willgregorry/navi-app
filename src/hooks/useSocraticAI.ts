import { useState, useCallback } from 'react';
import type { SocraticHint } from '../types/hint';
import type { Problem } from '../types/exam';
import { requestSocraticHint } from '../services/api/socraticHintService';

export function useSocraticAI(
  remainingHints: number,
  onHintConsumed: (remaining: number) => void
) {
  const [hintsByProblem, setHintsByProblem] = useState<Record<string, SocraticHint[]>>({});
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const requestHintForProblem = useCallback(
    async (
      problem: Problem,
      studentId: number,
      sourceCode: string,
      errorDetail?: {
        type?: string;
        message?: string;
        line?: number | null;
      }
    ): Promise<SocraticHint | null> => {
      if (remainingHints <= 0) {
        return null;
      }

      setIsRequesting(true);
      try {
        const errorType = errorDetail?.type || 'LogicQuestion';
        const errorMessage = errorDetail?.message || 'Student requested conceptual reflection.';
        const targetLine = errorDetail?.line ?? null;

        const response = await requestSocraticHint(
          {
            student_id: studentId,
            problem_id: problem.numericId || parseInt(problem.id, 10) || 1,
            source_code: sourceCode,
            error_type: errorType,
            error_message: errorMessage,
            faulty_line_number: targetLine,
            language: 'id',
          },
          remainingHints
        );

        const newHint: SocraticHint = {
          id: `hint-${Date.now()}`,
          type: errorType.toLowerCase().includes('syntax') ? 'syntax' : 'logic',
          line: response.target_line_number || targetLine || undefined,
          title: `Petunjuk Socratic (${problem.title})`,
          question: response.hint_text,
          conceptHint: `Engine: ${response.engine_used.toUpperCase()}`,
        };

        setHintsByProblem((prev) => ({
          ...prev,
          [problem.id]: [...(prev[problem.id] || []), newHint],
        }));

        onHintConsumed(response.remaining_hints);
        return newHint;
      } catch (err) {
        console.error('[useSocraticAI] Failed to fetch hint', err);
        return null;
      } finally {
        setIsRequesting(false);
      }
    },
    [remainingHints, onHintConsumed]
  );

  const clearHints = useCallback((problemId: string) => {
    setHintsByProblem((prev) => ({ ...prev, [problemId]: [] }));
  }, []);

  return {
    hintsByProblem,
    isRequesting,
    requestHintForProblem,
    clearHints,
  };
}
