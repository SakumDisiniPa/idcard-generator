'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import StatusHeader from '@/components/status/StatusHeader';
import PhotoProfile from '@/components/status/PhotoProfile';
import DetailData from '@/components/status/DetailData';
import ActionButtons from '@/components/status/ActionButtons';
import AdditionalInfo from '@/components/status/AdditionalInfo';
import RenewContractModal from '@/components/status/RenewContractModal';

interface UserData {
  id: string;
  customId: string;
  nama: string;
  ttl: string;
  phone: string;
  image: string;
  timestamp: number;
  contractEndDate: string;
  status: 'active' | 'expired' | 'inactive';
  inactiveReason?: 'dipecat' | 'mengundurkan diri';
}

interface VerifyResponse {
  valid: boolean;
  user?: UserData;
  message?: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

function DataCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 gap-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 break-words">
        {value}
      </span>
    </div>
  );
}

export default function StatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const token = searchParams.get('token');
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRenewModal, setShowRenewModal] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setData({ valid: false, message: 'Missing ID or Token' });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/verify?id=${encodeURIComponent(String(id))}&token=${encodeURIComponent(token)}`
        );
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Fetch error:', error);
        setData({ valid: false, message: 'Gagal memuat data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="animate-spin h-12 w-12 border-4 border-slate-300 dark:border-slate-700 border-t-green-600 rounded-full"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 animate-pulse">
            Memuat data verifikasi...
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="card bg-white dark:bg-slate-800 p-6 sm:p-8 w-full max-w-md border-t-4 border-red-500 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
            QR Tidak Valid
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {data?.message ||
              'QR Code atau Token tidak ditemukan dalam sistem.'}
          </p>
          <a
            href="/"
            className="btn-primary inline-block"
          >
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  // Check for expired or inactive status
  const user = data.user;
  const isBlacklisted = user.status === 'inactive';
  const isExpired = user.status === 'expired';

  const handlePermanentDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus permanen data ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/users?id=${user.id}`, {
        method: 'DELETE',
        headers: {
          'x-access-id': process.env.NEXT_PUBLIC_SECRET_ACCESS_ID || '',
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('Data berhasil dihapus permanen');
        window.location.href = '/';
      } else {
        alert('Gagal menghapus data');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gagal menghapus data');
    }
  };

  const handleRenewContract = () => {
    setShowRenewModal(true);
  };

  const updateContract = async (newDate: string) => {
    try {
      const updatedUser = { ...user, contractEndDate: newDate, status: 'active' };
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'x-access-id': process.env.NEXT_PUBLIC_SECRET_ACCESS_ID || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        alert('Kontrak berhasil diperbarui');
        setShowRenewModal(false);
        window.location.reload();
      } else {
        alert('Gagal memperbarui kontrak');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Gagal memperbarui kontrak');
    }
  };
  let tempatLahir = 'N/A';
  let tanggalLahir = 'N/A';

  if (user.ttl && user.ttl.includes(',')) {
    const parts = user.ttl.split(',').map((p) => p.trim());
    tempatLahir = parts[0];
    tanggalLahir = parts.length > 1 ? formatDate(parts[1]) : 'N/A';
  } else {
    tempatLahir = user.ttl || 'N/A';
    tanggalLahir = 'Tanggal Tidak Tersedia';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8 py-8 sm:py-12">
      <div
        className={`card bg-white dark:bg-slate-800 w-full max-w-2xl lg:max-w-full border-t-4 ${
          isBlacklisted ? 'border-red-500' : isExpired ? 'border-yellow-500' : 'border-green-500'
        } animate-fadeIn`}
      >
        <StatusHeader isBlacklisted={isBlacklisted} isExpired={isExpired} />
        <PhotoProfile nama={user.nama} customId={user.customId} phone={user.phone} image={user.image} isBlacklisted={isBlacklisted} isExpired={isExpired} />
        <DetailData
          nama={user.nama}
          tempatLahir={tempatLahir}
          tanggalLahir={tanggalLahir}
          customId={user.customId}
          phone={user.phone}
          contractEndDate={formatDate(user.contractEndDate)}
          timestamp={user.timestamp}
        />
        <ActionButtons
          isBlacklisted={isBlacklisted}
          isExpired={isExpired}
          onRenewContract={handleRenewContract}
          onPermanentDelete={handlePermanentDelete}
        />
      </div>

      <AdditionalInfo isBlacklisted={isBlacklisted} isExpired={isExpired} />

      <RenewContractModal
        isOpen={showRenewModal}
        onClose={() => setShowRenewModal(false)}
        onConfirm={updateContract}
        currentDate={new Date().toISOString().split('T')[0]}
      />
    </div>
  );
}
