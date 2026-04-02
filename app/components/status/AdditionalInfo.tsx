'use client';

interface AdditionalInfoProps {
  isBlacklisted: boolean;
  isExpired: boolean;
}

export default function AdditionalInfo({ isBlacklisted, isExpired }: AdditionalInfoProps) {
  if (isBlacklisted || isExpired) return null;

  return (
    <div className="mt-8 max-w-2xl lg:max-w-full w-full px-4 sm:px-0">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 text-center">
        <p className="text-sm sm:text-base text-blue-900 dark:text-blue-100">
          ℹ️ Sistem verifikasi ID Card PT DAHLIA - Semua data terenkripsi dan aman
        </p>
      </div>
    </div>
  );
}
