import React from 'react';
import { AlertOctagon, Volume2 } from 'lucide-react';

interface ViolationBannerProps {
  isOpen: boolean;
  violationCount: number;
  onDismiss: () => void;
}

export const ViolationBanner: React.FC<ViolationBannerProps> = ({
  isOpen,
  violationCount,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="violation-overlay" role="alert" aria-live="assertive">
      <div className="violation-dialog">
        <div className="violation-icon-wrapper">
          <AlertOctagon size={44} className="siren-pulse" />
        </div>

        <h2 className="violation-title">FOKUS UJIAN TERGANGGU!</h2>
        <p className="violation-desc">
          Anda terdeteksi berpindah aplikasi atau menekan tombol Alt+Tab.
          Pelanggaran ke-<strong>{violationCount}</strong> telah dicatat dan dilaporkan langsung ke dasbor guru.
        </p>

        <div className="alarm-indicator">
          <Volume2 size={16} />
          <span>Alarm anti-distraksi sedang berbunyi...</span>
        </div>

        <button onClick={onDismiss} className="return-btn">
          Kembali ke Ujian Sekarang
        </button>
      </div>
    </div>
  );
};
