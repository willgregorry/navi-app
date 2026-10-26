import React from 'react';
import type { SocraticHint } from '../../types/hint';
import { HintCard } from './HintCard';
import { HelpCircle } from 'lucide-react';

interface HintPanelProps {
  hints: SocraticHint[];
  availableHints: number;
  maxHints: number;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  hints,
  availableHints,
  maxHints,
}) => {
  return (
    <aside className="panel hint-panel">
      <div className="panel-header">
        <HelpCircle size={14} />
        <h2>Socratic Diagnostics</h2>
      </div>

      <div className="hint-quota-bar">
        <span className="quota-label">HINTS REMAINING</span>
        <div className="quota-pill-mono">
          <span className="quota-active">{availableHints}</span>
          <span className="quota-divider">/</span>
          <span className="quota-max">{maxHints}</span>
        </div>
      </div>

      <div className="panel-content scrollable">
        <div className="socratic-guidance-note">
          <span className="guidance-prefix">NOTE //</span>
          <p>
            Socratic hints guide your conceptual reasoning without ever giving away direct code solutions.
          </p>
        </div>

        {hints.length === 0 ? (
          <div className="empty-hints-state">
            <div className="empty-dot" />
            <p>No active diagnostic issues.</p>
            <span>Run your code to evaluate syntax and logic against test cases.</span>
          </div>
        ) : (
          <div className="hints-list">
            {hints.map((hint, idx) => (
              <HintCard key={hint.id || idx} hint={hint} index={idx} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
