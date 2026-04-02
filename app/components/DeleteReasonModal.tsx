'use client';

interface DeleteReasonModalProps {
  onConfirm: (reason: 'dipecat' | 'mengundurkan diri') => void;
  onCancel: () => void;
}

export default function DeleteReasonModal({
  onConfirm,
  onCancel,
}: DeleteReasonModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Alasan Menonaktifkan Karyawan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Pilih alasan karyawan ini tidak lagi aktif
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3">
            <button
              onClick={() => onConfirm('dipecat')}
              className="w-full p-4 text-left border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
            >
              <p className="font-medium text-slate-900 dark:text-slate-50 group-hover:text-red-600 dark:group-hover:text-red-400">
                🔴 Dipecat
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 mt-1">
                Karyawan diberhentikan dari pekerjaan
              </p>
            </button>

            <button
              onClick={() => onConfirm('mengundurkan diri')}
              className="w-full p-4 text-left border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all group"
            >
              <p className="font-medium text-slate-900 dark:text-slate-50 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                ✋ Mengundurkan Diri
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 mt-1">
                Karyawan secara sukarela meninggalkan posisi
              </p>
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onCancel}
              className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded font-medium transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
