'use client';

import { 
  User, 
  MapPin, 
  Calendar, 
  IdCard, 
  Phone, 
  FileText, 
  Clock, 
  CheckCircle,
  CalendarDays,
  Smartphone,
  Fingerprint
} from 'lucide-react';

interface DetailDataProps {
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  customId: string;
  phone: string;
  contractEndDate: string;
  timestamp: number;
}

interface DataCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

function DataCard({ label, value, icon: Icon, color }: DataCardProps) {
  return (
    <div className="group relative overflow-hidden">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-md">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DetailData({
  nama,
  tempatLahir,
  tanggalLahir,
  customId,
  phone,
  contractEndDate,
  timestamp,
}: DetailDataProps) {
  const formattedDate = new Date(contractEndDate).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTimestamp = new Date(timestamp).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const isContractExpired = new Date(contractEndDate) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(contractEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  
  const dataCards = [
    {
      label: 'Nama Lengkap',
      value: nama,
      icon: User,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      label: 'Tempat Lahir',
      value: tempatLahir,
      icon: MapPin,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      label: 'Tanggal Lahir',
      value: tanggalLahir,
      icon: Calendar,
      color: 'from-purple-600 to-pink-600'
    },
    {
      label: 'ID Kustom',
      value: customId,
      icon: Fingerprint,
      color: 'from-orange-600 to-red-600'
    },
    {
      label: 'Nomor Telepon',
      value: phone,
      icon: Smartphone,
      color: 'from-green-600 to-emerald-600'
    },
    {
      label: 'Kontrak Berakhir',
      value: formattedDate,
      icon: CalendarDays,
      color: isContractExpired ? 'from-red-600 to-rose-600' : 'from-yellow-600 to-orange-600'
    },
    {
      label: 'Terverifikasi pada',
      value: formattedTimestamp,
      icon: Clock,
      color: 'from-slate-600 to-slate-700'
    }
  ];

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Detail Lengkap
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 ml-11">
          Informasi lengkap data karyawan
        </p>
      </div>
      
      {/* Contract Status Alert */}
      {isContractExpired ? (
        <div className="mx-6 sm:mx-8 mb-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                Kontrak Telah Berakhir
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Kontrak karyawan ini telah berakhir pada {formattedDate}
              </p>
            </div>
          </div>
        </div>
      ) : daysUntilExpiry <= 30 && (
        <div className="mx-6 sm:mx-8 mb-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                Peringatan Kontrak
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Kontrak akan berakhir dalam {daysUntilExpiry} hari lagi pada {formattedDate}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Data Cards Grid */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCards.map((card, index) => (
            <DataCard
              key={index}
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      </div>
      
      {/* Verification Badge */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          <p className="text-xs text-green-700 dark:text-green-300">
            Data telah diverifikasi dan tersimpan dalam sistem
          </p>
        </div>
      </div>
    </div>
  );
}