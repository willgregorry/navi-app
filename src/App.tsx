import React, { useState, useEffect, useCallback } from 'react';
import { ExamHeader } from './components/layout/ExamHeader';
import { ResizablePanels } from './components/layout/ResizablePanels';
import { ProblemPanel } from './components/problem/ProblemPanel';
import { EditorPanel } from './components/editor/EditorPanel';
import { HintPanel } from './components/hints/HintPanel';
import { ViolationBanner } from './components/alarm/ViolationBanner';
import { SubmissionModal } from './components/modals/SubmissionModal';
import { JoinRoomView } from './components/modals/JoinRoomView';
import { ChallengeListView } from './components/challenges/ChallengeListView';
import {
  useExamSession,
  useCodeRunner,
  useSocraticAI,
  useFocusGuard,
  useKioskLock,
  useViolationReporter,
  useTheme,
} from './hooks';
import type { Problem } from './types/exam';
import './index.css';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // 1. Exam Session Hook (Room join, countdown timer, problem list, quota)
  const {
    session,
    problems,
    isJoined,
    remainingHints,
    setRemainingHints,
    timeRemainingFormatted,
    joinSession,
    exitSession,
  } = useExamSession();

  // 2. Code Runner Hook (Sandbox run, submit, test cases, score accumulation)
  const {
    codes,
    updateCode,
    initializeCodes,
    executionResults,
    solvedProblemIds,
    inProgressProblemIds,
    isRunning,
    executeCode,
    submitProblem,
  } = useCodeRunner();

  // 3. Socratic AI Hook (Gemini reflective inquiries, line targeting)
  const { hintsByProblem, isRequesting: isRequestingHint, requestHintForProblem } = useSocraticAI(
    remainingHints,
    (newRemaining) => setRemainingHints(newRemaining)
  );

  // 4. Kiosk Lock Hook (Win32 low-level keyboard/taskmgr hook)
  const { isKioskActive, toggleKiosk, enterKiosk, exitKiosk } = useKioskLock();

  // 5. Anti-Cheat & Violation Reporter Hook
  const { reportViolationEvent } = useViolationReporter({
    studentId: session?.studentId ?? null,
    isKioskActive,
  });

  const { violationCount, isDistracted, dismissWarning } = useFocusGuard({
    enabled: isJoined,
    onViolation: (count) => {
      reportViolationEvent(count);
    },
  });

  // Local UI states
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [focusedLine, setFocusedLine] = useState<number | null>(null);

  // Sync starter codes when problems are loaded
  useEffect(() => {
    if (problems.length > 0) {
      initializeCodes(problems);
    }
  }, [problems, initializeCodes]);

  const handleJoin = async (name: string, idNum: string, room: string) => {
    const joinedSession = await joinSession(name, idNum, room);
    if (joinedSession) {
      initializeCodes(joinedSession.problems);
      await enterKiosk();
      setActiveProblem(null);
    }
  };

  const handleFocusLine = useCallback((line: number) => {
    setFocusedLine(null);
    setTimeout(() => {
      setFocusedLine(line);
    }, 10);
  }, []);

  const handleRunCode = async () => {
    if (!activeProblem || !session) return;
    const result = await executeCode(activeProblem, session.studentId);

    // If there is an AST syntax error, automatically highlight line & query Socratic advice
    if (result.hasSyntaxError && result.faultyLine) {
      handleFocusLine(result.faultyLine);
      const currentCode = codes[activeProblem.id] || activeProblem.starterCode;
      await requestHintForProblem(activeProblem, session.studentId, currentCode, {
        type: 'SyntaxError',
        message: result.syntaxErrorMessage || result.stderr,
        line: result.faultyLine,
      });
    }
  };

  const handleManualRequestHint = async () => {
    if (!activeProblem || !session || remainingHints <= 0) return;
    const currentCode = codes[activeProblem.id] || activeProblem.starterCode;
    const currentResult = executionResults[activeProblem.id];

    let errorDetail = undefined;
    if (currentResult?.stderr) {
      const match = currentResult.stderr.match(/line (\d+)/);
      errorDetail = {
        type: currentResult.hasSyntaxError ? 'SyntaxError' : 'RuntimeError',
        message: currentResult.stderr,
        line: match ? parseInt(match[1], 10) : null,
      };
    }

    const hint = await requestHintForProblem(
      activeProblem,
      session.studentId,
      currentCode,
      errorDetail
    );

    if (hint?.line) {
      handleFocusLine(hint.line);
    }
  };

  const handleSubmitProblem = async () => {
    if (!activeProblem || !session) return;
    await submitProblem(activeProblem, session.studentId);
    setIsSubmitModalOpen(true);
  };

  const handleExitExam = async () => {
    await exitKiosk();
    setIsSubmitModalOpen(false);
    setActiveProblem(null);
    exitSession();
  };

  // 1. Entrance Form
  if (!isJoined || !session) {
    return (
      <JoinRoomView
        onJoin={handleJoin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // 2. Challenge List View (Multi-problem contest overview)
  if (!activeProblem) {
    return (
      <>
        <ChallengeListView
          roomCode={session.roomCode}
          studentName={session.studentName}
          studentId={session.studentIdNumber}
          problems={problems}
          solvedProblemIds={solvedProblemIds}
          inProgressProblemIds={inProgressProblemIds}
          onSelectProblem={(problem) => setActiveProblem(problem)}
          onSubmitAll={() => setIsSubmitModalOpen(true)}
          violationCount={violationCount}
          timeRemaining={timeRemainingFormatted}
          isKioskActive={isKioskActive}
          onToggleKiosk={toggleKiosk}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <ViolationBanner
          isOpen={isDistracted}
          violationCount={violationCount}
          onDismiss={dismissWarning}
        />

        <SubmissionModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onExitExam={handleExitExam}
          studentName={session.studentName}
          studentId={session.studentIdNumber}
          roomCode={session.roomCode}
          violationCount={violationCount}
          hintsUsed={session.hintQuota - remainingHints}
          testCasesPassed={solvedProblemIds.length}
          totalTestCases={problems.length}
        />
      </>
    );
  }

  // 3. Problem Code Editor View
  const currentCode = codes[activeProblem.id] || activeProblem.starterCode;
  const currentResult = executionResults[activeProblem.id] || null;
  const currentHints = hintsByProblem[activeProblem.id] || [];

  const hintLines = currentHints
    .map((h) => h.line)
    .filter((l): l is number => typeof l === 'number' && l > 0);

  let errorLines: number[] = [];
  if (currentResult?.stderr) {
    const matches = [...currentResult.stderr.matchAll(/line (\d+)/g)];
    errorLines = matches.map((m) => parseInt(m[1], 10)).filter((n) => !isNaN(n));
  }

  const highlightLines = Array.from(new Set([...hintLines, ...errorLines]));

  return (
    <div className="exam-app-container">
      <ExamHeader
        roomCode={session.roomCode}
        studentName={session.studentName}
        studentId={session.studentIdNumber}
        violationCount={violationCount}
        timeRemaining={timeRemainingFormatted}
        isKioskActive={isKioskActive}
        onToggleKiosk={toggleKiosk}
        theme={theme}
        onToggleTheme={toggleTheme}
        onBackToChallenges={() => setActiveProblem(null)}
        activeProblemTitle={activeProblem.title}
      />

      <ResizablePanels
        leftPanel={<ProblemPanel problem={activeProblem} />}
        centerPanel={
          <EditorPanel
            code={currentCode}
            onChange={(val) => updateCode(activeProblem.id, val || '')}
            onRunCode={handleRunCode}
            onSubmit={handleSubmitProblem}
            isRunning={isRunning}
            executionResult={currentResult}
            theme={theme}
            highlightLines={highlightLines}
            focusedLine={focusedLine}
            onJumpToLine={handleFocusLine}
          />
        }
        rightPanel={
          <HintPanel
            hints={currentHints}
            availableHints={remainingHints}
            maxHints={session.hintQuota}
            onFocusLine={handleFocusLine}
            onRequestHint={handleManualRequestHint}
            isRequestingHint={isRequestingHint}
          />
        }
        initialLeftWidth={340}
        initialRightWidth={340}
        minLeftWidth={260}
        maxLeftWidth={540}
        minRightWidth={280}
        maxRightWidth={540}
      />

      <ViolationBanner
        isOpen={isDistracted}
        violationCount={violationCount}
        onDismiss={dismissWarning}
      />

      <SubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onExitExam={handleExitExam}
        onReturnToChallenges={() => {
          setIsSubmitModalOpen(false);
          setActiveProblem(null);
        }}
        problemTitle={activeProblem.title}
        studentName={session.studentName}
        studentId={session.studentIdNumber}
        roomCode={session.roomCode}
        violationCount={violationCount}
        hintsUsed={session.hintQuota - remainingHints}
        testCasesPassed={activeProblem.sampleTestCases.length}
        totalTestCases={activeProblem.sampleTestCases.length}
      />
    </div>
  );
};

export default App;
