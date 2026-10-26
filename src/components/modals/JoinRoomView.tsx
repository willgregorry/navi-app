import React, { useState, useRef } from 'react';
import { ShieldCheck, ArrowRight, Sun, Moon, AlertCircle } from 'lucide-react';
import type { Theme } from '../../hooks/useTheme';

interface JoinRoomViewProps {
  onJoin: (studentName: string, studentId: string, roomCode: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  apiError?: string | null;
  isLoading?: boolean;
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
  apiError,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [roomSuffix, setRoomSuffix] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const studentIdInputRef = useRef<HTMLInputElement>(null);
  const roomCodeInputRef = useRef<HTMLInputElement>(null);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (val.startsWith('NAVI-')) {
      val = val.slice(5);
    }
    setRoomSuffix(val);
    if (errors.roomCode) {
      setErrors((prev) => ({ ...prev, roomCode: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }
    if (!studentId.trim()) {
      newErrors.studentId = 'Please enter your student ID / NIM.';
    }
    const cleanSuffix = roomSuffix.trim().toUpperCase();
    if (!cleanSuffix) {
      newErrors.roomCode = 'Please enter the assessment room code.';
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
    const fullRoomCode = `NAVI-${cleanSuffix}`;
    onJoin(name.trim().toUpperCase(), studentId.trim(), fullRoomCode);
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
              placeholder="ENTER FULL NAME"
              value={name}
              onChange={(e) => {
                setName(e.target.value.toUpperCase());
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              className={`name-input ${errors.name ? 'input-has-error' : ''}`}
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
              placeholder="ENTER STUDENT ID / NIM"
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
            <div className={`room-input-group ${errors.roomCode ? 'group-has-error' : ''}`}>
              <span className="room-prefix-tag">NAVI-</span>
              <input
                ref={roomCodeInputRef}
                id="room-code"
                type="text"
                placeholder="8392"
                value={roomSuffix}
                onChange={handleRoomChange}
                className="room-suffix-input"
                autoComplete="off"
              />
            </div>
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

          {apiError && (
            <div
              className="api-error-alert"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#ef4444',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{apiError}</span>
            </div>
          )}

          <button type="submit" className="join-submit-btn" disabled={isLoading}>
            <span>{isLoading ? 'Connecting to Assessment Room...' : 'Enter Assessment Room'}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
