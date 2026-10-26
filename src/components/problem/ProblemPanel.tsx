import React from 'react';
import type { Problem } from '../../types/exam';
import { FileCode, CheckCircle2 } from 'lucide-react';

interface ProblemPanelProps {
  problem: Problem;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem }) => {
  return (
    <aside className="panel problem-panel">
      <div className="panel-header">
        <FileCode size={16} />
        <h2>{problem.title}</h2>
      </div>

      <div className="panel-content scrollable">
        <section className="problem-section">
          <h3>Deskripsi Soal</h3>
          <p className="problem-text">{problem.description}</p>
        </section>

        {problem.constraints.length > 0 && (
          <section className="problem-section">
            <h3>Batasan (Constraints)</h3>
            <ul className="constraints-list">
              {problem.constraints.map((c, idx) => (
                <li key={idx}><code>{c}</code></li>
              ))}
            </ul>
          </section>
        )}

        <section className="problem-section">
          <h3>Contoh Kasus Uji</h3>
          {problem.sampleTestCases.map((tc, idx) => (
            <div key={tc.id || idx} className="sample-card">
              <div className="sample-title">
                <CheckCircle2 size={13} />
                <span>Kasus Uji #{idx + 1}</span>
              </div>
              <div className="sample-io">
                <div className="io-block">
                  <span className="io-label">Input:</span>
                  <pre><code>{tc.input}</code></pre>
                </div>
                <div className="io-block">
                  <span className="io-label">Expected Output:</span>
                  <pre><code>{tc.expectedOutput}</code></pre>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
};
