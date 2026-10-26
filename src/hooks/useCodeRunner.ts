import { useState, useCallback } from 'react';
import type { Problem, ExecutionResult } from '../types/exam';
import { runCode, submitCode } from '../services/api/codeExecutionService';

export function useCodeRunner() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [executionResults, setExecutionResults] = useState<Record<string, ExecutionResult | null>>({});
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [inProgressProblemIds, setInProgressProblemIds] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  // Initialize starter codes when problems are loaded
  const initializeCodes = useCallback((problems: Problem[]) => {
    setCodes((prev) => {
      const next = { ...prev };
      problems.forEach((p) => {
        if (!next[p.id]) {
          next[p.id] = p.starterCode;
        }
      });
      return next;
    });
  }, []);

  const updateCode = useCallback((problemId: string, newCode: string) => {
    setCodes((prev) => ({ ...prev, [problemId]: newCode }));
    setInProgressProblemIds((prev) => {
      if (prev.includes(problemId)) return prev;
      return [...prev, problemId];
    });
  }, []);

  const executeCode = useCallback(
    async (problem: Problem, studentId: number): Promise<ExecutionResult> => {
      setIsRunning(true);
      const currentCode = codes[problem.id] || problem.starterCode;

      try {
        const response = await runCode({
          student_id: studentId,
          problem_id: problem.numericId || parseInt(problem.id, 10) || 1,
          source_code: currentCode,
        });

        const result: ExecutionResult = {
          stdout: response.stdout || '',
          stderr: response.stderr || '',
          exitCode: response.success ? 0 : 1,
          isSuccess: response.all_passed,
          passedCount: response.passed_tests,
          totalCount: response.total_tests,
          hasSyntaxError: response.has_syntax_error,
          faultyLine: response.syntax_error_details?.line_number ?? null,
          syntaxErrorMessage: response.syntax_error_details?.message,
        };

        setExecutionResults((prev) => ({ ...prev, [problem.id]: result }));

        if (response.all_passed) {
          setSolvedProblemIds((prev) => {
            if (prev.includes(problem.id)) return prev;
            return [...prev, problem.id];
          });
        }

        return result;
      } catch (err: any) {
        const fallbackResult: ExecutionResult = {
          stdout: '',
          stderr: err?.message || 'Execution error encountered.',
          exitCode: 1,
          isSuccess: false,
        };
        setExecutionResults((prev) => ({ ...prev, [problem.id]: fallbackResult }));
        return fallbackResult;
      } finally {
        setIsRunning(false);
      }
    },
    [codes]
  );

  const submitProblem = useCallback(
    async (problem: Problem, studentId: number) => {
      setIsSubmitting(true);
      const currentCode = codes[problem.id] || problem.starterCode;

      try {
        const response = await submitCode({
          student_id: studentId,
          problem_id: problem.numericId || parseInt(problem.id, 10) || 1,
          source_code: currentCode,
        });

        if (response.is_passed) {
          setSolvedProblemIds((prev) => {
            if (prev.includes(problem.id)) return prev;
            return [...prev, problem.id];
          });
        }

        setTotalScore(response.total_score_accumulated || 0);
        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [codes]
  );

  return {
    codes,
    updateCode,
    initializeCodes,
    executionResults,
    solvedProblemIds,
    inProgressProblemIds,
    totalScore,
    isRunning,
    isSubmitting,
    executeCode,
    submitProblem,
  };
}
