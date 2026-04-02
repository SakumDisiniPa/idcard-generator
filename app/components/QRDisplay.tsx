'use client';

import { MESSAGES } from '@/app/utils/constants';

interface QRDisplayProps {
  qrUrl: string;
  onClose: () => void;
}

export default function QRDisplay({ qrUrl, onClose }: QRDisplayProps) {
  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-code-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card bg-white dark:bg-slate-800 p-6 sm:p-8 w-full max-w-md border-t-4 border-green-500 animate-fadeIn">
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-2 mb-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            {MESSAGES.SUCCESS.QR_GENERATED}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Simpan atau bagikan QR Code di bawah ini
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg inline-block border-2 border-slate-200 dark:border-slate-600">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg shadow-lg"
            loading="eager"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadQR}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR Code
          </button>
          <button
            onClick={onClose}
            className="btn-secondary w-full"
          >
            ← Kembali ke Formulir
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          QR Code akan aktif untuk verifikasi
        </p>
      </div>
    </div>
  );
}
