'use client';

import { 
  AlertCircle, 
  CheckCircle, 
  CalendarPlus, 
  Trash2, 
  Home,
  RefreshCw,
  Shield,
  Clock,
  UserX
} from 'lucide-react';

interface ActionButtonsProps {
  isBlacklisted: boolean;
  isExpired: boolean;
  onRenewContract: () => void;
  onPermanentDelete: () => void;
}

export default function ActionButtons({
  isBlacklisted,
  isExpired,
  onRenewContract,
  onPermanentDelete,
}: ActionButtonsProps) {
  const getStatusConfig = () => {
    if (isBlacklisted) {
      return {
        icon: UserX,
        title: 'Karyawan Tidak Aktif',
        description: 'Data ini tidak dapat digunakan untuk akses',
        color: 'red',
        gradient: 'from-red-600 to-rose-600',
        bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
        borderColor: 'border-red-200 dark:border-red-800',
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        statusIcon: AlertCircle
      };
    }
    
    if (isExpired) {
      return {
        icon: Clock,
        title: 'Kontrak Kadaluarsa',
        description: 'Perpanjang kontrak untuk mengaktifkan kembali',
        color: 'yellow',
        gradient: 'from-yellow-600 to-orange-600',
        bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        statusIcon: AlertCircle
      };
    }
    
    return {
      icon: Shield,
      title: 'Data Terverifikasi & Aman',
      description: 'Semua data telah terverifikasi dalam sistem',
      color: 'green',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      statusIcon: CheckCircle
    };
  };

  const config = getStatusConfig();
  const StatusIcon = config.statusIcon;

  return (
    <div className="relative overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      <div className="relative p-6 sm:p-8">
        {/* Status Card */}
        <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center`}>
              <config.icon className={`w-5 h-5 text-${config.color}-600 dark:text-${config.color}-400`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusIcon className={`w-4 h-4 text-${config.color}-600 dark:text-${config.color}-400`} />
                <p className={`text-sm font-semibold text-${config.color}-700 dark:text-${config.color}-300`}>
                  {config.title}
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {config.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {isExpired && (
                <button
                  onClick={onRenewContract}
                  className="group relative overflow-hidden flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <CalendarPlus className="w-4 h-4" />
                    <span>Perpanjang Kontrak Kerja</span>
                  </div>
                </button>
              )}
              
              {isBlacklisted && (
                <button
                  onClick={onPermanentDelete}
                  className="group relative overflow-hidden flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Permanen</span>
                  </div>
                </button>
              )}
            </div>
            
            <a
              href="/"
              className="group relative overflow-hidden flex-1 sm:flex-none w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-center"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </div>
            </a>
          </div>
          
          {/* Additional Info for Expired Contracts */}
          {isExpired && !isBlacklisted && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-xs text-yellow-700 dark:text-yellow-300">
                <RefreshCw className="w-3 h-3" />
                <span>Perpanjang kontrak untuk mengaktifkan kembali akses karyawan</span>
              </div>
            </div>
          )}
          
          {/* Additional Info for Blacklisted */}
          {isBlacklisted && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-3 h-3" />
                <span>Penghapusan permanen akan menghapus semua data dan tidak dapat dikembalikan</span>
              </div>
            </div>
          )}
          
          {/* Additional Info for Active */}
          {!isBlacklisted && !isExpired && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                <CheckCircle className="w-3 h-3" />
                <span>Data karyawan aktif dan dapat digunakan untuk akses sistem</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
        isBlacklisted 
          ? 'from-red-500 via-rose-500 to-red-500' 
          : isExpired
            ? 'from-yellow-500 via-orange-500 to-yellow-500'
            : 'from-green-500 via-emerald-500 to-green-500'
      }`}></div>
    </div>
  );
}