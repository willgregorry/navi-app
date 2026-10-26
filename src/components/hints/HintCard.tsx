import React from 'react';
import type { SocraticHint } from '../../types/hint';

interface HintCardProps {
  hint: SocraticHint;
  index: number;
}

export const HintCard: React.FC<HintCardProps> = ({ hint, index }) => {
  const isSyntax = hint.type === 'syntax';

  return (
    <div className={`hint-card-unique ${isSyntax ? 'syntax-card' : 'logic-card'}`}>
      <div className="card-top-tag">
        <span className="card-tag-mono">
          [{String(index + 1).padStart(2, '0')} // {isSyntax ? 'SYNTAX' : 'LOGIC'}]
        </span>
        {hint.line !== undefined && (
          <span className="card-line-pill">L{hint.line}</span>
        )}
      </div>

      <div className="card-body-content">
        <h4 className="hint-card-title">{hint.title}</h4>
        <p className="hint-card-question">{hint.question}</p>

        {hint.conceptHint && (
          <div className="hint-reflection-box">
            <span className="reflection-bullet">■</span>
            <p className="reflection-text">{hint.conceptHint}</p>
          </div>
        )}
      </div>
    </div>
  );
};
