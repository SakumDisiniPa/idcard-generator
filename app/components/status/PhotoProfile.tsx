'use client';

import { User, Phone, IdCard, Camera, Shield, Clock, AlertTriangle } from 'lucide-react';

interface PhotoProfileProps {
  nama: string;
  customId: string;
  phone: string;
  image?: string;
  isBlacklisted: boolean;
  isExpired?: boolean; // Menambahkan prop isExpired
}

export default function PhotoProfile({ 
  nama, 
  customId, 
  phone, 
  image, 
  isBlacklisted,
  isExpired = false 
}: PhotoProfileProps) {
  
  // Menentukan konfigurasi berdasarkan status
  const getStatusConfig = () => {
    if (isBlacklisted) {
      return {
        status: 'blacklisted',
        glowColor: 'from-red-500 to-rose-500',
        ringColor: 'ring-red-500/50',
        ringHoverColor: 'ring-red-500/50',
        bottomLine: 'from-red-500 via-rose-500 to-red-500',
        badgeIcon: Shield,
        badgeColor: 'bg-red-600',
        badgeText: 'Tidak Aktif',
        badgeBg: 'bg-red-100 dark:bg-red-900/30',
        badgeTextColor: 'text-red-700 dark:text-red-300',
        nameDecoration: 'line-through decoration-red-500',
        activeIndicator: false
      };
    }
    
    if (isExpired) {
      return {
        status: 'expired',
        glowColor: 'from-yellow-500 to-orange-500',
        ringColor: 'ring-yellow-500/50',
        ringHoverColor: 'ring-yellow-500/50',
        bottomLine: 'from-yellow-500 via-orange-500 to-yellow-500',
        badgeIcon: Clock,
        badgeColor: 'bg-orange-600',
        badgeText: 'Kontrak Berakhir',
        badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
        badgeTextColor: 'text-orange-700 dark:text-orange-300',
        nameDecoration: '',
        activeIndicator: false
      };
    }
    
    return {
      status: 'active',
      glowColor: 'from-green-500 to-emerald-500',
      ringColor: 'ring-green-500/30',
      ringHoverColor: 'ring-green-500/50',
      bottomLine: 'from-green-500 via-emerald-500 to-green-500',
      badgeIcon: null,
      badgeColor: '',
      badgeText: '',
      badgeBg: '',
      badgeTextColor: '',
      nameDecoration: '',
      activeIndicator: true
    };
  };
  
  const config = getStatusConfig();
  const StatusBadgeIcon = config.badgeIcon;
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200 dark:border-slate-700 ${
      config.status === 'blacklisted' ? 'opacity-80' : ''
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          {/* Photo Section */}
          <div className="flex-shrink-0 group">
            <div className="relative">
              {/* Glow Effect - Only for active */}
              {config.status === 'active' && (
                <div className={`absolute -inset-1 bg-gradient-to-r ${config.glowColor} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
              )}
              
              {/* Glow Effect for Expired */}
              {config.status === 'expired' && (
                <div className={`absolute -inset-1 bg-gradient-to-r ${config.glowColor} rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300`}></div>
              )}
              
              {/* Photo Container */}
              <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 shadow-xl overflow-hidden ${
                config.status === 'blacklisted' 
                  ? 'ring-2 ring-red-500/50' 
                  : config.status === 'expired'
                    ? 'ring-4 ring-yellow-500/30 group-hover:ring-yellow-500/50'
                    : 'ring-4 ring-green-500/30 group-hover:ring-green-500/50'
              } transition-all duration-300`}>
                {image ? (
                  <img 
                    src={image} 
                    alt={nama} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700">
                    <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Status Badge - Blacklisted */}
              {config.status === 'blacklisted' && (
                <div className="absolute -top-2 -right-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-sm"></div>
                    <div className="relative bg-red-600 text-white rounded-full p-1.5 shadow-lg">
                      <Shield className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Status Badge - Expired */}
              {config.status === 'expired' && (
                <div className="absolute -top-2 -right-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-sm"></div>
                    <div className="relative bg-orange-600 text-white rounded-full p-1.5 shadow-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active Indicator */}
              {config.activeIndicator && (
                <div className="absolute -bottom-1 -right-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm animate-pulse"></div>
                    <div className="relative bg-green-500 rounded-full p-1.5 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className={`flex-1 w-full space-y-3 text-center lg:text-left ${
            config.status === 'blacklisted' ? 'opacity-80' : ''
          }`}>
            {/* Name with Gradient */}
            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent ${
                config.nameDecoration
              }`}>
                {nama}
              </h2>
              
              {/* Status Badge Text */}
              {config.status === 'blacklisted' && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${config.badgeBg} ${config.badgeTextColor} text-xs rounded-full`}>
                  <Shield className="w-3 h-3" />
                  {config.badgeText}
                </span>
              )}
              
              {config.status === 'expired' && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${config.badgeBg} ${config.badgeTextColor} text-xs rounded-full`}>
                  <Clock className="w-3 h-3" />
                  {config.badgeText}
                </span>
              )}
            </div>
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* ID Card */}
              <div className={`flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group/info ${
                config.status === 'blacklisted' ? 'opacity-80' : ''
              }`}>
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover/info:bg-blue-200 dark:group-hover/info:bg-blue-900/50 transition-colors">
                  <IdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ID Kustom
                  </p>
                  <p className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {customId}
                  </p>
                </div>
              </div>
              
              {/* Phone Card */}
              <div className={`flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group/info ${
                config.status === 'blacklisted' ? 'opacity-80' : ''
              }`}>
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover/info:bg-green-200 dark:group-hover/info:bg-green-900/50 transition-colors">
                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Nomor Telepon
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Info - Based on Status */}
            {config.status === 'active' && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Status Aktif</span>
                  </div>
                  <div className="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Karyawan Terdaftar</span>
                  </div>
                </div>
              </div>
            )}
            
            {config.status === 'expired' && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-orange-600 dark:text-orange-400">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Kontrak Telah Berakhir</span>
                  </div>
                  <div className="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Perlu Perpanjangan</span>
                  </div>
                </div>
              </div>
            )}
            
            {config.status === 'blacklisted' && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Tidak Aktif</span>
                  </div>
                  <div className="w-px h-3 bg-slate-300 dark:bg-slate-600"></div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Tidak Dapat Akses</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.bottomLine}`}></div>
    </div>
  );
}