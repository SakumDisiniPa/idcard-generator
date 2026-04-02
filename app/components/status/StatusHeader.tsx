'use client';

import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface StatusHeaderProps {
  isBlacklisted: boolean;
  isExpired: boolean;
  inactiveReason?: 'dipecat' | 'mengundurkan diri';
}

export default function StatusHeader({ isBlacklisted, isExpired, inactiveReason }: StatusHeaderProps) {
  const getStatusConfig = () => {
    if (isBlacklisted) {
      return {
        icon: XCircle,
        title: 'DATA TIDAK AKTIF',
        description: `Karyawan telah ${
        inactiveReason === 'dipecat'
          ? 'dipecat'
          : 'mengundurkan diri'
      }`,
        color: 'red',
        gradient: 'from-red-600 to-rose-600',
        bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
        borderColor: 'border-red-200 dark:border-red-800',
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        animation: 'animate-shake'
      };
    }
    
    if (isExpired) {
      return {
        icon: Clock,
        title: 'KONTRAK BERAKHIR',
        description: 'Kontrak karyawan telah berakhir',
        color: 'yellow',
        gradient: 'from-yellow-600 to-orange-600',
        bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        animation: 'animate-pulse'
      };
    }
    
    return {
      icon: CheckCircle,
      title: 'ID VALID',
      description: 'Data telah terverifikasi dalam sistem',
      color: 'green',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      animation: 'animate-float'
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${config.bgGradient} border-b ${config.borderColor}`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 dark:bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative px-6 sm:px-8 py-8 sm:py-12 text-center space-y-4">
        {/* Icon Circle */}
        <div className={`inline-flex items-center justify-center p-4 rounded-full ${config.iconBg} ${config.animation}`}>
          <IconComponent className={`w-12 h-12 sm:w-16 sm:h-16 text-${config.color}-600 dark:text-${config.color}-400`} />
        </div>
        
        {/* Title with Gradient */}
        <div className="space-y-2">
          <h1 className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {config.title}
          </h1>
          
          {/* Decorative Line */}
          <div className="flex justify-center">
            <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${config.gradient}`}></div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {config.description}
        </p>
        
        {/* Additional Info based on status */}
        {isBlacklisted && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              Status: Tidak Aktif
            </span>
          </div>
        )}
        
        {isExpired && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
            <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
              Status: Kontrak Berakhir
            </span>
          </div>
        )}
        
        {!isBlacklisted && !isExpired && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-full">
            <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              Status: Aktif
            </span>
          </div>
        )}
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-8 opacity-10">
          <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}