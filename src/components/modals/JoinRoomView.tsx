import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface JoinRoomViewProps {
  onJoin: (studentName: string, studentId: string, roomCode: string) => void;
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({ onJoin }) => {
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
      <div className="join-card">
        <div className="join-header">
          <div className="join-logo">
            <img src="/navi-favicon.png" alt="Navi" className="join-logo-img" />
          </div>
          <h1>Navi Kiosk</h1>
          <p className="subtitle">Secure Python Assessment Platform with Socratic Guidance</p>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="student-name">Full Name</label>
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
            <label htmlFor="student-id">Student ID / NIM</label>
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
            <label htmlFor="room-code">Assessment Room Code</label>
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

          <div className="kiosk-notice">
            <ShieldCheck size={16} />
            <span>
              Once the exam starts, the app enters fullscreen Kiosk mode and monitors window focus integrity.
            </span>
          </div>

          <button type="submit" className="join-submit-btn">
            <span>Enter Assessment Room</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
