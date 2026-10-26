import { useCallback } from 'react';
import { reportViolation } from '../services/api/antiCheatService';

interface UseViolationReporterOptions {
  studentId: number | null;
  isKioskActive: boolean;
}

export function useViolationReporter({ studentId, isKioskActive }: UseViolationReporterOptions) {
  const handleReportViolation = useCallback(
    async (count: number) => {
      if (!studentId) return;

      await reportViolation({
        student_id: studentId,
        event_type: 'alt_tab',
        is_kiosk_active: isKioskActive,
        details: `Student window focus lost (violation counter: ${count}). Intercepted by client guard.`,
      });
    },
    [studentId, isKioskActive]
  );

  return {
    reportViolationEvent: handleReportViolation,
  };
}
