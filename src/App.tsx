import React, { useState } from 'react';
import { ExamHeader } from './components/layout/ExamHeader';
import { ResizablePanels } from './components/layout/ResizablePanels';
import { ProblemPanel } from './components/problem/ProblemPanel';
import { EditorPanel } from './components/editor/EditorPanel';
import { HintPanel } from './components/hints/HintPanel';
import { ViolationBanner } from './components/alarm/ViolationBanner';
import { SubmissionModal } from './components/modals/SubmissionModal';
import { JoinRoomView } from './components/modals/JoinRoomView';
import { useFocusGuard } from './hooks/useFocusGuard';
import { useTheme } from './hooks/useTheme';
import { SAMPLE_PROBLEM } from './services/mockExam';
import { executePython } from './services/pythonRunner';
import type { ExecutionResult } from './types/exam';
import type { SocraticHint } from './types/hint';
import './index.css';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isJoined, setIsJoined] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [code, setCode] = useState(SAMPLE_PROBLEM.starterCode);
  const [hints, setHints] = useState<SocraticHint[]>([]);
  const [availableHints, setAvailableHints] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isKioskActive, setIsKioskActive] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Focus guard listens to window blur (Alt+Tab), triggers siren & violation count
  const { violationCount, isDistracted, dismissWarning } = useFocusGuard({
    enabled: isJoined,
  });

  const handleJoin = async (name: string, id: string, room: string) => {
    setStudentName(name);
    setStudentId(id);
    setRoomCode(room);
    setIsJoined(true);

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

  const handleRunCode = async () => {
    setIsRunning(true);

    try {
      const result = await executePython(code, SAMPLE_PROBLEM.id);
      setExecutionResult({
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        isSuccess: result.isSuccess,
      });

      if (result.hints && result.hints.length > 0) {
        setHints(result.hints);
        setAvailableHints((prev) => Math.max(0, prev - 1));
      } else {
        setHints([]);
      }
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err?.message || 'Execution failed unexpectedly.',
        exitCode: 1,
        isSuccess: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    setIsSubmitModalOpen(true);
  };

  const handleExitExam = async () => {
    if (window.naviElectron) {
      await window.naviElectron.setKiosk(false);
      setIsKioskActive(false);
    }
    setIsSubmitModalOpen(false);
    setIsJoined(false);
  };

  if (!isJoined) {
    return (
      <JoinRoomView
        onJoin={handleJoin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

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
      />

      <ResizablePanels
        leftPanel={<ProblemPanel problem={SAMPLE_PROBLEM} />}
        centerPanel={
          <EditorPanel
            code={code}
            onChange={(val) => setCode(val || '')}
            onRunCode={handleRunCode}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            executionResult={executionResult}
            theme={theme}
          />
        }
        rightPanel={
          <HintPanel
            hints={hints}
            availableHints={availableHints}
            maxHints={5}
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
        studentName={studentName}
        studentId={studentId}
        roomCode={roomCode}
        violationCount={violationCount}
        hintsUsed={5 - availableHints}
        testCasesPassed={SAMPLE_PROBLEM.sampleTestCases.length}
        totalTestCases={SAMPLE_PROBLEM.sampleTestCases.length}
      />
    </div>
  );
};

export default App;
