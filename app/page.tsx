'use client';

import { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import UploadForm from '@/components/UploadForm';
import QRDisplay from '@/components/QRDisplay';
import UsersList from '@/components/UsersList';
import { DatabaseEntry } from '@/lib/jsondb';
import { 
  Users, 
  UserPlus, 
  LogOut, 
  QrCode,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [view, setView] = useState<'upload' | 'list'>('upload');
  const [accessId, setAccessId] = useState('');
  const [users, setUsers] = useState<DatabaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedAccessId = localStorage.getItem('admin_access_id');
    const sessionTimestamp = localStorage.getItem('admin_session_time');

    if (storedAccessId && sessionTimestamp) {
      const sessionTime = parseInt(sessionTimestamp);
      const now = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

      if (now - sessionTime < sessionDuration) {
        // Session still valid
        setAccessId(storedAccessId);
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('admin_access_id');
        localStorage.removeItem('admin_session_time');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (id: string) => {
    setIsAuthenticated(true);
    setAccessId(id);
    localStorage.setItem('admin_access_id', id);
    localStorage.setItem('admin_session_time', Date.now().toString());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setQrUrl(null);
    setAccessId('');
    setView('upload');
    setUsers([]);
    setIsMobileMenuOpen(false);
    localStorage.removeItem('admin_access_id');
    localStorage.removeItem('admin_session_time');
  };

  const handleUserDeleted = (deletedId: string) => {
    setUsers(users.filter((u) => u.id !== deletedId));
  };

  const handleUserUpdated = (updatedUser: DatabaseEntry) => {
    setUsers(
      users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="animate-spin h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Memuat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="animate-fadeIn">
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      ) : qrUrl ? (
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="animate-fadeIn">
            <QRDisplay qrUrl={qrUrl} onClose={() => setQrUrl(null)} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo/Brand */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => {
                      setView('upload');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      view === 'upload'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Tambah Karyawan
                  </button>
                  <button
                    onClick={() => {
                      setView('list');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      view === 'list'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Data Karyawan
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="sm:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-slideDown">
                <div className="px-4 py-3 space-y-2">
                  <button
                    onClick={() => {
                      setView('upload');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      view === 'upload'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    Tambah Karyawan
                  </button>
                  <button
                    onClick={() => {
                      setView('list');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      view === 'list'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    Data Karyawan
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {view === 'upload' ? (
                <div className="animate-fadeInUp">
                  <UploadForm
                    onQRGenerated={(url) => setQrUrl(url)}
                    onLogout={handleLogout}
                  />
                </div>
              ) : (
                <div className="animate-fadeInUp">
                  <UsersList
                    accessId={accessId}
                    users={users}
                    setUsers={setUsers}
                    onUserDeleted={handleUserDeleted}
                    onUserUpdated={handleUserUpdated}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}