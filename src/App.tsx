import React, { useState, useEffect } from 'react';
import { ExamHeader } from './components/layout/ExamHeader';
import { ResizablePanels } from './components/layout/ResizablePanels';
import { ProblemPanel } from './components/problem/ProblemPanel';
import { EditorPanel } from './components/editor/EditorPanel';
import { HintPanel } from './components/hints/HintPanel';
import { ViolationBanner } from './components/alarm/ViolationBanner';
import { SubmissionModal } from './components/modals/SubmissionModal';
import { JoinRoomView } from './components/modals/JoinRoomView';
import { ChallengeListView } from './components/challenges/ChallengeListView';
import { useFocusGuard } from './hooks/useFocusGuard';
import { useTheme } from './hooks/useTheme';
import { executePython } from './services/pythonRunner';
import { fetchChallenges, submitChallengeSolution, logViolationEvent } from './services/api/examApi';
import type { Problem, ExecutionResult } from './types/exam';
import type { SocraticHint } from './types/hint';
import './index.css';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isJoined, setIsJoined] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [roomCode, setRoomCode] = useState('');

  // Problem dataset fetched via Axios API layer
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);

  // Student progress per problem
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [inProgressProblemIds, setInProgressProblemIds] = useState<string[]>([]);
  const [executionResults, setExecutionResults] = useState<Record<string, ExecutionResult | null>>({});
  const [hintsByProblem, setHintsByProblem] = useState<Record<string, SocraticHint[]>>({});
  const [availableHints, setAvailableHints] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isKioskActive, setIsKioskActive] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [focusedLine, setFocusedLine] = useState<number | null>(null);

  // Load challenges using Axios on mount or room change
  useEffect(() => {
    async function loadData() {
      const data = await fetchChallenges(roomCode || undefined);
      setProblems(data);
      setCodes((prev) => {
        const next = { ...prev };
        data.forEach((p) => {
          if (!next[p.id]) next[p.id] = p.starterCode;
        });
        return next;
      });
    }
    loadData();
  }, [roomCode]);

  // Focus guard listens to window blur (Alt+Tab), triggers siren & violation telemetry
  const { violationCount, isDistracted, dismissWarning } = useFocusGuard({
    enabled: isJoined,
    onViolation: (count) => {
      logViolationEvent({
        roomCode,
        studentId,
        count,
        timestamp: Date.now(),
      });
    },
  });

  const handleJoin = async (name: string, id: string, room: string) => {
    setStudentName(name);
    setStudentId(id);
    setRoomCode(room);
    setIsJoined(true);
    setActiveProblem(null);

    // Fetch latest challenges for this room via Axios
    const roomProblems = await fetchChallenges(room);
    setProblems(roomProblems);

    // Request Electron to enter Kiosk Mode
    if (window.naviElectron) {
      const res = await window.naviElectron.setKiosk(true);
      setIsKioskActive(Boolean(res?.isKiosk));
    }
  };

  const handleToggleKiosk = async () => {
    if (window.naviElectron) {
      const nextState = !isKioskActive;
      const res = await window.naviElectron.setKiosk(nextState);
      setIsKioskActive(Boolean(res?.isKiosk));
    }
  };

  const handleFocusLine = (line: number) => {
    setFocusedLine(null);
    setTimeout(() => {
      setFocusedLine(line);
    }, 10);
  };

  const handleCodeChange = (newCode: string | undefined) => {
    if (!activeProblem) return;
    const val = newCode || '';
    setCodes((prev) => ({ ...prev, [activeProblem.id]: val }));

    if (!inProgressProblemIds.includes(activeProblem.id)) {
      setInProgressProblemIds((prev) => [...prev, activeProblem.id]);
    }
  };

  const handleRunCode = async () => {
    if (!activeProblem) return;
    const currentCode = codes[activeProblem.id] || activeProblem.starterCode;

    setIsRunning(true);

    try {
      const result = await executePython(currentCode, activeProblem.id);
      setExecutionResults((prev) => ({
        ...prev,
        [activeProblem.id]: {
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
          isSuccess: result.isSuccess,
        },
      }));

      if (result.isSuccess) {
        if (!solvedProblemIds.includes(activeProblem.id)) {
          setSolvedProblemIds((prev) => [...prev, activeProblem.id]);
        }
      }

      if (result.hints && result.hints.length > 0) {
        setHintsByProblem((prev) => ({ ...prev, [activeProblem.id]: result.hints }));
        setAvailableHints((prev) => Math.max(0, prev - 1));
        const firstLine = result.hints.find((h) => h.line)?.line;
        if (firstLine) {
          handleFocusLine(firstLine);
        }
      } else {
        setHintsByProblem((prev) => ({ ...prev, [activeProblem.id]: [] }));
      }
    } catch (err: any) {
      setExecutionResults((prev) => ({
        ...prev,
        [activeProblem.id]: {
          stdout: '',
          stderr: err?.message || 'Execution failed unexpectedly.',
          exitCode: 1,
          isSuccess: false,
        },
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitProblem = () => {
    if (!activeProblem) return;
    if (!solvedProblemIds.includes(activeProblem.id)) {
      setSolvedProblemIds((prev) => [...prev, activeProblem.id]);
    }

    const currentCode = codes[activeProblem.id] || activeProblem.starterCode;

    // Dispatch submission to Axios API
    submitChallengeSolution({
      roomCode,
      studentName,
      studentId,
      problemId: activeProblem.id,
      code: currentCode,
      isSuccess: true,
      passedCount: activeProblem.sampleTestCases.length,
      totalCount: activeProblem.sampleTestCases.length,
    });

    setIsSubmitModalOpen(true);
  };

  const handleExitExam = async () => {
    if (window.naviElectron) {
      await window.naviElectron.setKiosk(false);
      setIsKioskActive(false);
    }
    setIsSubmitModalOpen(false);
    setActiveProblem(null);
    setIsJoined(false);
  };

  // 1. Entrance Form
  if (!isJoined) {
    return (
      <JoinRoomView
        onJoin={handleJoin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // 2. Challenge List View (HackerRank contest overview)
  if (!activeProblem) {
    return (
      <>
        <ChallengeListView
          roomCode={roomCode}
          studentName={studentName}
          studentId={studentId}
          problems={problems}
          solvedProblemIds={solvedProblemIds}
          inProgressProblemIds={inProgressProblemIds}
          onSelectProblem={(problem) => setActiveProblem(problem)}
          onSubmitAll={() => setIsSubmitModalOpen(true)}
          violationCount={violationCount}
          isKioskActive={isKioskActive}
          onToggleKiosk={handleToggleKiosk}
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
          studentName={studentName}
          studentId={studentId}
          roomCode={roomCode}
          violationCount={violationCount}
          hintsUsed={5 - availableHints}
          testCasesPassed={solvedProblemIds.length}
          totalTestCases={problems.length}
        />
      </>
    );
  }

  // 3. Problem Editor View
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
        roomCode={roomCode}
        studentName={studentName}
        studentId={studentId}
        violationCount={violationCount}
        isKioskActive={isKioskActive}
        onToggleKiosk={handleToggleKiosk}
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
            onChange={handleCodeChange}
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
            availableHints={availableHints}
            maxHints={5}
            onFocusLine={handleFocusLine}
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
        studentName={studentName}
        studentId={studentId}
        roomCode={roomCode}
        violationCount={violationCount}
        hintsUsed={5 - availableHints}
        testCasesPassed={activeProblem.sampleTestCases.length}
        totalTestCases={activeProblem.sampleTestCases.length}
      />
    </div>
  );
};

export default App;
