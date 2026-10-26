import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, Sun, Moon, AlertCircle } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface JoinRoomViewProps {
  onJoin: (studentName: string, studentId: string, roomCode: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  roomCode?: string;
}

export const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  onJoin,
  theme,
  onToggleTheme,
}) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const studentIdInputRef = useRef<HTMLInputElement>(null);
  const roomCodeInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    if (!studentId.trim()) {
      newErrors.studentId = 'Please enter your student ID / NIM.';
    }
    if (!roomCode.trim()) {
      newErrors.roomCode = 'Please specify the assessment room code.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field for smooth UX
      if (newErrors.name) {
        nameInputRef.current?.focus();
      } else if (newErrors.studentId) {
        studentIdInputRef.current?.focus();
      } else if (newErrors.roomCode) {
        roomCodeInputRef.current?.focus();
      }
      return;
    }

    setErrors({});
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

        <form onSubmit={handleSubmit} className="join-form" noValidate>
          <div className="form-group">
            <label htmlFor="student-name">FULL NAME</label>
            <input
              ref={nameInputRef}
              id="student-name"
              type="text"
              placeholder="e.g., Willy Gregory"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              className={errors.name ? 'input-has-error' : ''}
              autoComplete="name"
            />
            {errors.name && (
              <div className="field-error-msg">
                <AlertCircle size={12} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="student-id">STUDENT ID / NIM</label>
            <input
              ref={studentIdInputRef}
              id="student-id"
              type="text"
              placeholder="e.g., 215150200111001"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (errors.studentId) {
                  setErrors((prev) => ({ ...prev, studentId: undefined }));
                }
              }}
              className={errors.studentId ? 'input-has-error' : ''}
              autoComplete="off"
            />
            {errors.studentId && (
              <div className="field-error-msg">
                <AlertCircle size={12} />
                <span>{errors.studentId}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="room-code">ASSESSMENT ROOM CODE</label>
            <input
              ref={roomCodeInputRef}
              id="room-code"
              type="text"
              placeholder="e.g., NAVI-8392"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                if (errors.roomCode) {
                  setErrors((prev) => ({ ...prev, roomCode: undefined }));
                }
              }}
              className={`room-input ${errors.roomCode ? 'input-has-error' : ''}`}
              autoComplete="off"
            />
            {errors.roomCode && (
              <div className="field-error-msg">
                <AlertCircle size={12} />
                <span>{errors.roomCode}</span>
              </div>
            )}
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
