'use client';

import { useState } from 'react';

interface RenewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  currentDate?: string;
}

export default function RenewContractModal({
  isOpen,
  onClose,
  onConfirm,
  currentDate = new Date().toISOString().split('T')[0],
}: RenewContractModalProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedDate) {
      alert('Pilih tanggal terlebih dahulu');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(selectedDate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6 space-y-6 animate-slideUp">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            📅 Perpanjang Kontrak Kerja
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Pilih tanggal berakhir kontrak baru
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tanggal Berakhir Kontrak
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Format: YYYY-MM-DD (atau gunakan date picker)
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            ℹ️ Kontrak akan diperpanjang hingga{' '}
            <strong>
              {selectedDate
                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                    'id-ID',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )
                : 'tanggal dipilih'}
            </strong>
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {isLoading ? '⏳ Memproses...' : '✓ Perpanjang'}
          </button>
        </div>
      </div>
    </div>
  );
}
