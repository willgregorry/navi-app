import React from 'react';
import type { SocraticHint } from '../../types/hint';
import { HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface HintCardProps {
  hint: SocraticHint;
  index: number;
}

export const HintCard: React.FC<HintCardProps> = ({ hint, index }) => {
  const isSyntax = hint.type === 'syntax';

  return (
    <div className={`hint-card ${isSyntax ? 'syntax-hint' : 'logic-hint'}`}>
      <div className="hint-card-header">
        <div className="hint-badge-group">
          <span className={`hint-type-tag ${hint.type}`}>
            {isSyntax ? <AlertCircle size={12} /> : <HelpCircle size={12} />}
            {isSyntax ? 'Syntax Error' : 'Logic Error'}
          </span>
          {hint.line !== undefined && (
            <span className="hint-line-tag">Line {hint.line}</span>
          )}
        </div>
        <span className="hint-number">#{index + 1}</span>
      </div>

      <h4 className="hint-title">{hint.title}</h4>
      <p className="hint-question">{hint.question}</p>

      {hint.conceptHint && (
        <div className="concept-tip">
          <Sparkles size={12} />
          <span>{hint.conceptHint}</span>
        </div>
      )}
    </div>
  );
};
