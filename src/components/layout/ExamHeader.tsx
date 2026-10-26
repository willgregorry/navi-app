import React from 'react';
import { Shield, AlertTriangle, Clock, BookOpen } from 'lucide-react';

interface ExamHeaderProps {
  roomCode: string;
  studentName: string;
  studentId: string;
  violationCount: number;
  timeRemaining?: string;
  isKioskActive: boolean;
  onToggleKiosk?: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  roomCode,
  studentName,
  studentId,
  violationCount,
  timeRemaining = '58:40',
  isKioskActive,
  onToggleKiosk,
}) => {
  return (
    <header className="exam-header">
      <div className="header-brand">
        <div className="brand-logo">
          <BookOpen className="icon" size={18} />
        </div>
        <div className="brand-meta">
          <span className="brand-title">Navi Kiosk</span>
          <span className="room-badge">{roomCode}</span>
        </div>
      </div>

      <div className="header-student-info">
        <span className="student-name">{studentName}</span>
        <span className="student-nim">({studentId})</span>
      </div>

      <div className="header-status-group">
        <div className="timer-badge">
          <Clock size={15} />
          <span>{timeRemaining}</span>
        </div>

        <div className={`violation-badge ${violationCount > 0 ? 'has-violations' : ''}`}>
          <AlertTriangle size={15} />
          <span>{violationCount} Pelanggaran</span>
        </div>

        {onToggleKiosk && (
          <button
            onClick={onToggleKiosk}
            className={`kiosk-toggle-btn ${isKioskActive ? 'active' : ''}`}
            title="Toggle Fullscreen Kiosk Mode"
          >
            <Shield size={14} />
            <span>{isKioskActive ? 'Kiosk ON' : 'Kiosk OFF'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
