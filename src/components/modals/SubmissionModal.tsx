import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExitExam: () => void;
  studentName: string;
  studentId: string;
  roomCode: string;
  violationCount: number;
  hintsUsed: number;
  testCasesPassed: number;
  totalTestCases: number;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onExitExam,
  studentName,
  studentId,
  roomCode,
  violationCount,
  hintsUsed,
  testCasesPassed,
  totalTestCases,
}) => {
  if (!isOpen) return null;

  return (
    <div className="submission-overlay" role="dialog" aria-modal="true">
      <div className="submission-card-unique">
        <div className="submission-top-tag">
          <span className="submission-mono-badge">[ 01 // SUBMISSION FINALIZED ]</span>
          <span className="submission-room-stamp">{roomCode}</span>
        </div>

        <div className="submission-body">
          <div className="submission-status-icon">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="submission-title">Assessment Submitted</h2>
          <p className="submission-subtitle">
            Your Python solution has been packaged and securely dispatched to the proctor evaluation queue.
          </p>

          <div className="submission-stats-grid">
            <div className="stat-box">
              <span className="stat-label">CANDIDATE</span>
              <span className="stat-value">{studentName}</span>
              <span className="stat-sub">[{studentId}]</span>
            </div>

            <div className="stat-box">
              <span className="stat-label">SAMPLE TESTS</span>
              <span className="stat-value">{testCasesPassed} / {totalTestCases}</span>
              <span className="stat-sub text-success">Verified Passed</span>
            </div>

            <div className="stat-box">
              <span className="stat-label">HINTS CONSUMED</span>
              <span className="stat-value">{hintsUsed}</span>
              <span className="stat-sub">Socratic Inquiries</span>
            </div>

            <div className="stat-box">
              <span className="stat-label">FOCUS INTEGRITY</span>
              <span className={`stat-value ${violationCount > 0 ? 'text-warn' : ''}`}>
                {violationCount === 0 ? '100%' : `${violationCount}x Alt-Tab`}
              </span>
              <span className="stat-sub">
                {violationCount === 0 ? 'Clean Proctor Record' : 'Violations Logged'}
              </span>
            </div>
          </div>

          <div className="submission-actions">
            <button onClick={onClose} className="sub-btn-secondary">
              Review Solution
            </button>
            <button onClick={onExitExam} className="sub-btn-primary">
              <span>Finish & Exit</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
