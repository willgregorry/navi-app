import React from 'react';
import type { SocraticHint } from '../../types/hint';
import { HintCard } from './HintCard';
import { HelpCircle, Sparkles } from 'lucide-react';

interface HintPanelProps {
  hints: SocraticHint[];
  availableHints: number;
  maxHints: number;
  onFocusLine?: (line: number) => void;
  onRequestHint?: () => void;
  isRequestingHint?: boolean;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  hints,
  availableHints,
  maxHints,
  onFocusLine,
  onRequestHint,
  isRequestingHint = false,
}) => {
  return (
    <aside className="panel hint-panel">
      <div className="panel-header">
        <HelpCircle size={14} />
        <h2>Socratic Diagnostics</h2>
        {hints.length > 0 && (
          <span className="active-hint-badge">{hints.length} Active</span>
        )}
      </div>

      <div className="hint-quota-bar">
        <div className="quota-text-group">
          <span className="quota-label">DIAGNOSTIC QUOTA</span>
          <div className="quota-meter">
            {Array.from({ length: maxHints }).map((_, idx) => (
              <span
                key={idx}
                className={`quota-meter-segment ${idx < availableHints ? 'available' : 'consumed'}`}
              />
            ))}
          </div>
        </div>

        <div className="quota-pill-mono">
          <span className="quota-active">{availableHints}</span>
          <span className="quota-divider">/</span>
          <span className="quota-max">{maxHints}</span>
        </div>
      </div>

      <div className="panel-content scrollable">
        <div className="socratic-guidance-note">
          <div className="guidance-header">
            <Sparkles size={12} />
            <span className="guidance-prefix">PEDAGOGICAL GUARDRAIL</span>
          </div>
          <p>
            Hints isolate structural issues and pose targeted reflective inquiries, requiring you to reason through and repair the defect yourself.
          </p>
        </div>

        {onRequestHint && (
          <button
            type="button"
            onClick={onRequestHint}
            disabled={availableHints <= 0 || isRequestingHint}
            style={{
              width: '100%',
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: availableHints > 0 ? 'var(--bg-elevated)' : 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              color: availableHints > 0 ? 'var(--text-main)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: availableHints > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
            <span>{isRequestingHint ? 'Analyzing Code Structure...' : 'Request Socratic Guidance'}</span>
          </button>
        )}

        {hints.length === 0 ? (
          <div className="empty-hints-state">
            <div className="empty-dot" />
            <p>No active diagnostic issues.</p>
            <span>Run your code to evaluate syntax and logic against test cases.</span>
          </div>
        ) : (
          <div className="hints-list">
            {hints.map((hint, idx) => (
              <HintCard
                key={hint.id || idx}
                hint={hint}
                index={idx}
                onFocusLine={onFocusLine}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
