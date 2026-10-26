import React from 'react';
import { Shield, AlertTriangle, Clock, Sun, Moon } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface ExamHeaderProps {
  roomCode: string;
  studentName: string;
  studentId: string;
  violationCount: number;
  timeRemaining?: string;
  isKioskActive: boolean;
  onToggleKiosk?: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  roomCode,
  studentName,
  studentId,
  violationCount,
  timeRemaining = '58:40',
  isKioskActive,
  onToggleKiosk,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="exam-header">
      <div className="header-brand">
        <div className="brand-logo">
          <img src="/navi-favicon.png" alt="Navi" className="header-logo-img" />
        </div>
        <div className="brand-meta">
          <span className="brand-title">Navi Kiosk</span>
          <span className="room-badge">{roomCode}</span>
        </div>
      </div>

      <div className="header-student-info">
        <span className="student-name">{studentName}</span>
        <span className="student-nim">[{studentId}]</span>
      </div>

      <div className="header-status-group">
        <div className="timer-badge">
          <Clock size={14} />
          <span>{timeRemaining}</span>
        </div>

        <div className={`violation-badge ${violationCount > 0 ? 'has-violations' : ''}`}>
          <AlertTriangle size={14} />
          <span>{violationCount} {violationCount === 1 ? 'Violation' : 'Violations'}</span>
        </div>

        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {onToggleKiosk && (
          <button
            onClick={onToggleKiosk}
            className={`kiosk-toggle-btn ${isKioskActive ? 'active' : ''}`}
            title="Toggle Fullscreen Kiosk Mode"
          >
            <Shield size={13} />
            <span>{isKioskActive ? 'Kiosk Active' : 'Kiosk Inactive'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
