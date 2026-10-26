import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface JoinRoomViewProps {
  onJoin: (studentName: string, studentId: string, roomCode: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  onJoin,
  theme,
  onToggleTheme,
}) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentId.trim() || !roomCode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onJoin(name.trim(), studentId.trim(), roomCode.trim().toUpperCase());
  };

  return (
    <div className="join-room-wrapper">
      <div className="join-theme-corner">
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      <div className="join-card-unique">
        <div className="join-card-header">
          <div className="join-logo-box">
            <img src="/navi-favicon.png" alt="Navi" className="join-logo-img" />
          </div>
          <h1>Navi Kiosk</h1>
          <p className="subtitle">Secure Python Assessment Platform with Socratic Guidance</p>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="student-name">FULL NAME</label>
            <input
              id="student-name"
              type="text"
              placeholder="e.g., Willy Gregory"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-id">STUDENT ID / NIM</label>
            <input
              id="student-id"
              type="text"
              placeholder="e.g., 215150200111001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="room-code">ASSESSMENT ROOM CODE</label>
            <input
              id="room-code"
              type="text"
              placeholder="e.g., NAVI-8392"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="room-input"
              required
            />
          </div>

          <div className="kiosk-notice-unique">
            <ShieldCheck size={15} className="notice-icon" />
            <span>
              Fullscreen Kiosk security activates upon entering. Alt+Tab, shortcut interruptions, and loss of focus trigger immediate alerts.
            </span>
          </div>

          <button type="submit" className="join-submit-btn">
            <span>Enter Assessment Room</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
