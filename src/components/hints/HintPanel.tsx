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
        <h2>Pusat Hint Sokratik</h2>
      </div>

      <div className="hint-quota-bar">
        <span className="quota-label">Sisa Kuota Hint:</span>
        <div className="quota-pill">
          <strong>{availableHints}</strong> / {maxHints}
        </div>
      </div>

      <div className="panel-content scrollable">
        <div className="socratic-guidance-note">
          <Info size={14} />
          <p>
            Hint Sokratik dirancang untuk memandu alur berpikir Anda tanpa membocorkan kode jawaban.
          </p>
        </div>

        {hints.length === 0 ? (
          <div className="empty-hints-state">
            <p>Belum ada eror yang terdeteksi.</p>
            <span>Klik <strong>Jalankan Kode</strong> untuk menguji sintaks dan kasus uji Anda.</span>
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
