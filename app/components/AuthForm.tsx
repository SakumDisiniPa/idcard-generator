'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MESSAGES } from '@/utils/constants';
import { 
  Lock, 
  Shield, 
  Key, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Fingerprint
} from 'lucide-react';

interface AuthFormProps {
  onSuccess: (accessId: string) => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [accessId, setAccessId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { verifyAccess } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isValid = await verifyAccess(accessId);

      if (isValid) {
        onSuccess(accessId);
        setAccessId('');
      } else {
        setError(MESSAGES.ERROR.AUTH_FAILED);
        setAccessId('');
      }
    } catch (err) {
      setError('⚠️ Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md lg:max-w-2xl transform transition-all duration-300 animate-fadeInUp"
      >
        {/* Card Container */}
        <div className="relative bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          
          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
          
          {/* Header */}
          <div className="text-center pt-8 lg:pt-12 pb-6 lg:pb-8 px-6 lg:px-8">
            <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mb-4">
              <Shield className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Akses Terbatas
            </h1>
            <p className="text-sm lg:text-base text-slate-300">
              Masukkan ID Akses untuk melanjutkan ke dashboard
            </p>
          </div>

          {/* Content */}
          <div className="px-6 lg:px-8 pb-8 lg:pb-10 space-y-5">
            {/* ID Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-slate-200">
                <Key className="w-4 h-4 lg:w-5 lg:h-5" />
                ID Akses
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan ID akses Anda"
                    className="w-full pl-10 lg:pl-12 pr-12 lg:pr-14 py-3 lg:py-4 text-base lg:text-lg bg-white/10 dark:bg-slate-900/50 border border-white/20 dark:border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={accessId}
                    onChange={(e) => setAccessId(e.target.value)}
                    disabled={loading}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Eye className="w-5 h-5 lg:w-6 lg:h-6" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 lg:p-6 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm lg:text-base text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-base lg:text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 lg:h-6 lg:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 lg:w-6 lg:h-6" />
                    Masuk ke Dashboard
                  </>
                )}
              </div>
            </button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400" />
                <span className="text-xs lg:text-sm text-slate-400">Sistem keamanan berlapis</span>
              </div>
              <div className="w-px h-3 bg-slate-600"></div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400" />
                <span className="text-xs lg:text-sm text-slate-400">Enkripsi data</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl -z-10"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl -z-10"></div>
      </form>
    </div>
  );
}