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
      setError('Mohon lengkapi semua kolom.');
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
          <p className="subtitle">Platform Ujian Koding Python Berbasis Kiosk Terpadu</p>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="student-name">Nama Lengkap</label>
            <input
              id="student-name"
              type="text"
              placeholder="Contoh: Willy Gregory"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-id">NIM / Nomor Induk</label>
            <input
              id="student-id"
              type="text"
              placeholder="Contoh: 215150200111001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="room-code">Kode Ruangan Ujian</label>
            <input
              id="room-code"
              type="text"
              placeholder="Contoh: NAVI-8392"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="room-input"
              required
            />
          </div>

          <div className="kiosk-notice">
            <ShieldCheck size={16} />
            <span>
              Saat ujian dimulai, aplikasi akan memasuki mode Kiosk layar penuh dan memantau fokus jendela.
            </span>
          </div>

          <button type="submit" className="join-submit-btn">
            <span>Masuk ke Ruangan Ujian</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
