import React, { useState } from 'react';
import { ExamHeader } from './components/layout/ExamHeader';
import { ProblemPanel } from './components/problem/ProblemPanel';
import { EditorPanel } from './components/editor/EditorPanel';
import { HintPanel } from './components/hints/HintPanel';
import { ViolationBanner } from './components/alarm/ViolationBanner';
import { JoinRoomView } from './components/modals/JoinRoomView';
import { useFocusGuard } from './hooks/useFocusGuard';
import { useTheme } from './hooks/useTheme';
import { SAMPLE_PROBLEM, analyzeCodeLocally } from './services/mockExam';
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

  const handleRunCode = () => {
    setIsRunning(true);

    setTimeout(() => {
      const result = analyzeCodeLocally(code);
      setExecutionResult({
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.isSuccess ? 0 : 1,
        isSuccess: result.isSuccess,
      });

      if (result.hints.length > 0) {
        setHints(result.hints);
        setAvailableHints((prev) => Math.max(0, prev - 1));
      } else {
        setHints([]);
      }

      setIsRunning(false);
    }, 600);
  };

  const handleSubmit = () => {
    alert('Solution successfully submitted! The assessment is complete.');
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

      <div className="three-panel-grid">
        <ProblemPanel problem={SAMPLE_PROBLEM} />
        <EditorPanel
          code={code}
          onChange={(val) => setCode(val || '')}
          onRunCode={handleRunCode}
          onSubmit={handleSubmit}
          isRunning={isRunning}
          executionResult={executionResult}
          theme={theme}
        />
        <HintPanel
          hints={hints}
          availableHints={availableHints}
          maxHints={5}
        />
      </div>

      <ViolationBanner
        isOpen={isDistracted}
        violationCount={violationCount}
        onDismiss={dismissWarning}
      />
    </div>
  );
};

export default App;
