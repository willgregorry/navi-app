import React, { useState } from 'react';
import type { SocraticHint } from '../../types/hint';
import { ChevronDown, ChevronUp, Check, AlertCircle, HelpCircle, Lightbulb, Crosshair } from 'lucide-react';

interface HintCardProps {
  hint: SocraticHint;
  index: number;
  onFocusLine?: (line: number) => void;
}

export const HintCard: React.FC<HintCardProps> = ({ hint, index, onFocusLine }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isUnderstood, setIsUnderstood] = useState(false);

  const isSyntax = hint.type === 'syntax';

  return (
    <div className={`hint-card-unique ${isSyntax ? 'syntax-card' : 'logic-card'} ${isUnderstood ? 'card-resolved' : ''}`}>
      {/* Card Header Stamp */}
      <div className="card-top-tag">
        <div className="card-tag-left">
          <span className="card-type-icon">
            {isSyntax ? <AlertCircle size={12} /> : <HelpCircle size={12} />}
          </span>
          <span className="card-tag-mono">
            {String(index + 1).padStart(2, '0')} // {isSyntax ? 'SYNTAX DEFECT' : 'LOGICAL CONUNDRUM'}
          </span>
        </div>

        {hint.line !== undefined && (
          <button
            type="button"
            onClick={() => onFocusLine && onFocusLine(hint.line!)}
            className="card-line-badge clickable"
            title={`Click to highlight & jump to line ${hint.line} in code editor`}
          >
            <Crosshair size={10} />
            <span>LINE {hint.line}</span>
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body-content">
        <h4 className="hint-card-title">{hint.title}</h4>
        
        <div className="hint-question-container">
          <span className="prompt-label">SOCRATIC INQUIRY</span>
          <p className="hint-card-question">{hint.question}</p>
        </div>

        {/* Progressive Disclosure for Deep Concept Hint */}
        {hint.conceptHint && (
          <div className="concept-disclosure-section">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="reveal-concept-toggle"
              aria-expanded={isRevealed}
            >
              <div className="toggle-left">
                <Lightbulb size={13} />
                <span>{isRevealed ? 'Hide Conceptual Clue' : 'Reveal Conceptual Clue'}</span>
              </div>
              {isRevealed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {isRevealed && (
              <div className="hint-reflection-drawer">
                <span className="drawer-mono-prefix">&gt;&gt; PRINCIPLE</span>
                <p className="reflection-text">{hint.conceptHint}</p>
              </div>
            )}
          </div>
        )}

        {/* Card Footer: Mark as Understood Action */}
        <div className="card-footer-actions">
          <button
            onClick={() => setIsUnderstood(!isUnderstood)}
            className={`mark-understood-btn ${isUnderstood ? 'btn-active' : ''}`}
          >
            <Check size={12} />
            <span>{isUnderstood ? 'Understood & Applied' : 'Mark as Understood'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
