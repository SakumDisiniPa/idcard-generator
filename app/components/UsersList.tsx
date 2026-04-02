'use client';

import { useEffect, useState } from 'react';
import { DatabaseEntry } from '@/lib/jsondb';
import EditUserModal from '@/components/EditUserModal';
import DeleteReasonModal from '@/components/DeleteReasonModal';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  CalendarX, 
  UserX, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ChevronDown,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface UsersListProps {
  accessId: string;
  users: DatabaseEntry[];
  setUsers: (users: DatabaseEntry[]) => void;
  onUserDeleted: (id: string) => void;
  onUserUpdated: (user: DatabaseEntry) => void;
}

type FilterType = 'all' | 'active' | 'expired' | 'inactive';

export default function UsersList({
  accessId,
  users,
  setUsers,
  onUserDeleted,
  onUserUpdated,
}: UsersListProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<DatabaseEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: {
          'x-access-id': accessId,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Gagal memuat data karyawan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getFilteredUsers = () => {
    let filtered = users;
    
    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter((u) => u.status === 'active');
        break;
      case 'expired':
        filtered = filtered.filter((u) => u.status === 'expired');
        break;
      case 'inactive':
        filtered = filtered.filter((u) => u.status === 'inactive');
        break;
      default:
        break;
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((u) => 
        u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
      );
    }
    
    return filtered;
  };

  const countByStatus = {
    all: users.length,
    active: users.filter((u) => u.status === 'active').length,
    expired: users.filter((u) => u.status === 'expired').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (reason: 'dipecat' | 'mengundurkan diri') => {
    if (!deleteTargetId) return;

    try {
      const res = await fetch('/api/admin/users/deactivate', {
        method: 'POST',
        headers: {
          'x-access-id': accessId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: deleteTargetId,
          reason,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to deactivate user');
      }

      await fetchUsers();
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      setError('Gagal menonaktifkan pengguna');
      console.error(err);
    }
  };

  const handleEditClick = (user: DatabaseEntry) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updates: Partial<DatabaseEntry>) => {
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'x-access-id': accessId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error('Failed to update user');
      }

      await fetchUsers();
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError('Gagal memperbarui pengguna');
      console.error(err);
    }
  };

  const filteredUsers = getFilteredUsers();

  const statusConfig = {
    active: {
      icon: CheckCircle,
      color: 'green',
      label: 'Aktif',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    expired: {
      icon: Clock,
      color: 'yellow',
      label: 'Berakhir',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    inactive: {
      icon: XCircle,
      color: 'red',
      label: 'Tidak Aktif',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Memuat data karyawan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Header with Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, ID, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        <button
          onClick={refreshUsers}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`group p-4 rounded-xl border-2 transition-all duration-200 ${
            filter === 'all'
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className={`w-5 h-5 ${filter === 'all' ? 'text-blue-600' : 'text-slate-400'}`} />
            <ChevronDown className={`w-4 h-4 transition-transform ${filter === 'all' ? 'rotate-180' : ''} text-slate-400`} />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Semua Karyawan
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {countByStatus.all}
          </p>
        </button>

        <button
          onClick={() => setFilter('active')}
          className={`group p-4 rounded-xl border-2 transition-all duration-200 ${
            filter === 'active'
              ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <UserCheck className={`w-5 h-5 ${filter === 'active' ? 'text-green-600' : 'text-slate-400'}`} />
            <ChevronDown className={`w-4 h-4 transition-transform ${filter === 'active' ? 'rotate-180' : ''} text-slate-400`} />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Karyawan Aktif
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {countByStatus.active}
          </p>
        </button>

        <button
          onClick={() => setFilter('expired')}
          className={`group p-4 rounded-xl border-2 transition-all duration-200 ${
            filter === 'expired'
              ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CalendarX className={`w-5 h-5 ${filter === 'expired' ? 'text-yellow-600' : 'text-slate-400'}`} />
            <ChevronDown className={`w-4 h-4 transition-transform ${filter === 'expired' ? 'rotate-180' : ''} text-slate-400`} />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Kontrak Berakhir
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {countByStatus.expired}
          </p>
        </button>

        <button
          onClick={() => setFilter('inactive')}
          className={`group p-4 rounded-xl border-2 transition-all duration-200 ${
            filter === 'inactive'
              ? 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 shadow-lg'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <UserX className={`w-5 h-5 ${filter === 'inactive' ? 'text-red-600' : 'text-slate-400'}`} />
            <ChevronDown className={`w-4 h-4 transition-transform ${filter === 'inactive' ? 'rotate-180' : ''} text-slate-400`} />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            Tidak Aktif
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {countByStatus.inactive}
          </p>
        </button>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center py-16">
          <div className="flex flex-col items-center">
            <Users className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              {searchTerm 
                ? 'Tidak ada karyawan yang sesuai dengan pencarian'
                : filter === 'all'
                  ? 'Belum ada data karyawan'
                  : `Tidak ada data karyawan ${filter === 'active' ? 'aktif' : filter === 'expired' ? 'dengan kontrak berakhir' : 'tidak aktif'}`}
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    TTL
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    Berakhir Kontrak
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  {filter === 'inactive' && (
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                      Alasan
                    </th>
                  )}
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => {
                  const StatusIcon = statusConfig[user.status as keyof typeof statusConfig]?.icon || AlertCircle;
                  const status = statusConfig[user.status as keyof typeof statusConfig] || statusConfig.active;
                  
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                        {user.id}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {user.nama}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">
                          {user.ttl}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                        {user.ttl}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                        {new Date(user.contractEndDate).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      {filter === 'inactive' && (
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                          {user.inactiveReason === 'dipecat'
                            ? '🔴 Dipecat'
                            : '✋ Mengundurkan Diri'}
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/status/${user.id}?token=${user.token}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-200"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {user.status !== 'inactive' && (
                            <>
                              <button
                                onClick={() => handleEditClick(user)}
                                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user.id)}
                                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer with Summary */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Menampilkan {filteredUsers.length} dari {users.length} karyawan
              {searchTerm && ` (hasil pencarian: "${searchTerm}")`}
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      {isEditModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteReasonModal
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setDeleteTargetId(null);
          }}
        />
      )}
    </div>
  );
}