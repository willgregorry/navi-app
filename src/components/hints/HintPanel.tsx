import React from 'react';
import type { SocraticHint } from '../../types/hint';
import { HintCard } from './HintCard';
import { Lightbulb, Info } from 'lucide-react';

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
        <Lightbulb size={16} />
        <h2>Socratic Hint Center</h2>
      </div>

      <div className="hint-quota-bar">
        <span className="quota-label">Remaining Hints:</span>
        <div className="quota-pill">
          <strong>{availableHints}</strong> / {maxHints}
        </div>
      </div>

      <div className="panel-content scrollable">
        <div className="socratic-guidance-note">
          <Info size={14} />
          <p>
            Socratic hints guide your conceptual reasoning without ever giving away direct code solutions.
          </p>
        </div>

        {hints.length === 0 ? (
          <div className="empty-hints-state">
            <p>No errors detected.</p>
            <span>Click <strong>Run Code</strong> to validate your syntax and verify test cases.</span>
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
