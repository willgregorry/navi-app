import React from 'react';
import { AlertOctagon, Volume2 } from 'lucide-react';

interface ViolationBannerProps {
  isOpen: boolean;
  violationCount: number;
  onDismiss: () => void;
}

export const ViolationBanner: React.FC<ViolationBannerProps> = ({
  isOpen,
  violationCount,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="violation-overlay" role="alert" aria-live="assertive">
      <div className="violation-dialog">
        <div className="violation-icon-wrapper">
          <AlertOctagon size={44} className="siren-pulse" />
        </div>

        <h2 className="violation-title">EXAM FOCUS COMPROMISED!</h2>
        <p className="violation-desc">
          You were detected switching applications or pressing Alt+Tab.
          Violation #<strong>{violationCount}</strong> has been logged and immediately transmitted to the instructor dashboard.
        </p>

        <div className="alarm-indicator">
          <Volume2 size={16} />
          <span>Active anti-distraction siren sounding...</span>
        </div>

        <button onClick={onDismiss} className="return-btn">
          Return to Assessment Now
        </button>
      </div>
    </div>
  );
};
