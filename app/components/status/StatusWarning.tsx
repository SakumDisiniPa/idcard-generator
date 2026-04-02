'use client';

interface StatusWarningProps {
  isBlacklisted: boolean;
  isExpired: boolean;
  inactiveReason?: 'dipecat' | 'mengundurkan diri';
}

export default function StatusWarning({ isBlacklisted, isExpired, inactiveReason }: StatusWarningProps) {
  if (!isBlacklisted && !isExpired) return null;

  if (isBlacklisted) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
        <div className="text-center space-y-2">
          <p className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-300">
            ⚠️ Karyawan Tidak Aktif
          </p>
          <p className="text-sm text-red-700 dark:text-red-200">
            Karyawan ini telah {inactiveReason === 'dipecat' ? 'dipecat' : 'mengundurkan diri'}
          </p>
        </div>
      </div>
    );
  }
}
