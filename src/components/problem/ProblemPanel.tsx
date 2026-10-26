import React from 'react';
import type { Problem } from '../../types/exam';
import { Terminal } from 'lucide-react';

interface ProblemPanelProps {
  problem: Problem;
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem }) => {
  return (
    <aside className="panel problem-panel">
      <div className="panel-header">
        <Terminal size={14} />
        <h2>Problem Statement</h2>
      </div>

      <div className="panel-content scrollable">
        {/* Spacious, uncrowded problem hero header */}
        <div className="problem-hero-section">
          <div className="problem-meta-pills">
            <span className="meta-pill pill-category">{problem.category}</span>
            <span className={`meta-pill pill-diff diff-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            <span className="meta-pill pill-points">{problem.points} Points</span>
          </div>
          <h1 className="problem-title-display">{problem.title}</h1>
        </div>

        <section className="problem-section">
          <div className="section-title-label">01 // SPECIFICATION</div>
          <p className="problem-text">{problem.description}</p>
        </section>

        {problem.constraints.length > 0 && (
          <section className="problem-section">
            <div className="section-title-label">02 // CONSTRAINTS</div>
            <div className="constraints-card">
              {problem.constraints.map((c, idx) => (
                <div key={idx} className="constraint-item">
                  <span className="mono-dot">&gt;</span>
                  <code>{c}</code>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="problem-section">
          <div className="section-title-label">03 // TEST CASES</div>
          <div className="test-cases-stack">
            {problem.sampleTestCases.map((tc, idx) => (
              <div key={tc.id || idx} className="sample-card-unique">
                <div className="sample-tab-header">
                  <span className="sample-index-badge">CASE {String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="sample-io-split">
                  <div className="io-col">
                    <span className="io-heading">INPUT</span>
                    <pre><code>{tc.input}</code></pre>
                  </div>
                  <div className="io-col">
                    <span className="io-heading">EXPECTED</span>
                    <pre><code>{tc.expectedOutput}</code></pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};
