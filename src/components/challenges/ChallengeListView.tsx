import React from 'react';
import {
  Check,
  Clock,
  Circle,
  ArrowRight,
  Code2,
  Trophy,
  FileCheck2,
  Send,
} from 'lucide-react';
import { ExamHeader } from '../layout/ExamHeader';
import type { Problem } from '../../types/exam';
import type { Theme } from '../../hooks/useTheme';

interface ChallengeListViewProps {
  roomCode: string;
  studentName: string;
  studentId: string;
  problems: Problem[];
  solvedProblemIds: string[];
  inProgressProblemIds: string[];
  onSelectProblem: (problem: Problem) => void;
  onSubmitAll: () => void;
  violationCount: number;
  timeRemaining?: string;
  isKioskActive: boolean;
  onToggleKiosk?: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const ChallengeListView: React.FC<ChallengeListViewProps> = ({
  roomCode,
  studentName,
  studentId,
  problems,
  solvedProblemIds,
  inProgressProblemIds,
  onSelectProblem,
  onSubmitAll,
  violationCount,
  timeRemaining = '58:40',
  isKioskActive,
  onToggleKiosk,
  theme,
  onToggleTheme,
}) => {
  const totalPoints = problems.reduce((acc, p) => acc + (p.points || 0), 0);
  const earnedPoints = problems
    .filter((p) => solvedProblemIds.includes(p.id))
    .reduce((acc, p) => acc + (p.points || 0), 0);
  const solvedCount = solvedProblemIds.length;
  const progressPercent = Math.round((solvedCount / problems.length) * 100);

  return (
    <div className="challenge-page-wrapper">
      <ExamHeader
        roomCode={roomCode}
        studentName={studentName}
        studentId={studentId}
        violationCount={violationCount}
        timeRemaining={timeRemaining}
        isKioskActive={isKioskActive}
        onToggleKiosk={onToggleKiosk}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <main className="challenge-main-container">
        {/* Assessment Hero Summary */}
        <section className="challenge-hero-card">
          <div className="hero-left">
            <div className="hero-room-tag">
              <Code2 size={13} />
              <span>ASSESSMENT ROOM • {roomCode}</span>
            </div>
            <h1 className="hero-title">Python Assessment Challenges</h1>
            <p className="hero-subtitle">
              Solve the programming challenges below. Your solutions will be evaluated against automated test cases in real time with Socratic guidance.
            </p>
          </div>

          <div className="hero-stats-panel">
            <div className="stat-box">
              <div className="stat-label">
                <FileCheck2 size={13} />
                <span>SOLVED</span>
              </div>
              <div className="stat-value">
                {solvedCount} <span className="stat-max">/ {problems.length}</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-label">
                <Trophy size={13} />
                <span>SCORE</span>
              </div>
              <div className="stat-value">
                {earnedPoints} <span className="stat-max">/ {totalPoints} pts</span>
              </div>
            </div>

            <button onClick={onSubmitAll} className="finish-assessment-btn">
              <Send size={13} />
              <span>Finish Assessment</span>
            </button>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="challenge-progress-bar-container">
          <div className="progress-info">
            <span>Overall Completion</span>
            <span className="progress-percent">{progressPercent}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Challenge List Items */}
        <section className="challenges-section">
          <div className="challenges-section-header">
            <h2>Challenge List</h2>
            <span className="challenges-count-badge">
              {problems.length} Problems Available
            </span>
          </div>

          <div className="challenge-cards-list">
            {problems.map((problem, index) => {
              const isSolved = solvedProblemIds.includes(problem.id);
              const isInProgress = inProgressProblemIds.includes(problem.id);

              return (
                <div
                  key={problem.id}
                  onClick={() => onSelectProblem(problem)}
                  className={`challenge-card ${isSolved ? 'card-solved' : ''} ${
                    isInProgress ? 'card-inprogress' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectProblem(problem);
                    }
                  }}
                >
                  <div className="challenge-card-left">
                    <div className="status-indicator">
                      {isSolved ? (
                        <div className="status-mark-solved" title="Solved">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : isInProgress ? (
                        <div className="status-mark-inprogress" title="In Progress">
                          <Clock size={12} />
                        </div>
                      ) : (
                        <div className="status-mark-unattempted" title="Unattempted">
                          <Circle size={14} />
                        </div>
                      )}
                    </div>

                    <div className="challenge-info">
                      <div className="challenge-title-row">
                        <span className="challenge-index">#{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="challenge-title">{problem.title}</h3>
                        {isSolved && (
                          <span className="solved-badge-pill">
                            <Check size={10} strokeWidth={3} />
                            <span>SOLVED</span>
                          </span>
                        )}
                      </div>

                      <p className="challenge-excerpt">
                        {problem.description.split('\n')[0].replace(/[`*]/g, '')}
                      </p>

                      <div className="challenge-tags">
                        <span className="tag-chip tag-category">{problem.category}</span>
                        <span
                          className={`tag-chip tag-difficulty diff-${problem.difficulty.toLowerCase()}`}
                        >
                          {problem.difficulty}
                        </span>
                        <span className="tag-chip tag-points">{problem.points} Points</span>
                      </div>
                    </div>
                  </div>

                  <div className="challenge-card-right">
                    <button
                      className={`challenge-action-btn ${
                        isSolved ? 'btn-solved' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProblem(problem);
                      }}
                    >
                      <span>
                        {isSolved
                          ? 'Review Code'
                          : isInProgress
                          ? 'Continue'
                          : 'Solve Challenge'}
                      </span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
