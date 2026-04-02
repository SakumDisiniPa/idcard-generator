'use client';

import { useState, useRef } from 'react';
import { DatabaseEntry } from '@/lib/jsondb';

interface AddEmployeeModalProps {
  accessId: string;
  onClose: () => void;
  onEmployeeAdded: (employee: DatabaseEntry) => void;
}

export default function AddEmployeeModal({
  accessId,
  onClose,
  onEmployeeAdded,
}: AddEmployeeModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    ttl: '',
    phone: '',
    contractEndDate: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih file gambar yang valid');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file tidak boleh lebih dari 5MB');
      return;
    }

    setFileName(file.name);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.nama.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    if (!formData.ttl.trim()) {
      setError('TTL tidak boleh kosong');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Telepon tidak boleh kosong');
      return;
    }

    if (!formData.contractEndDate) {
      setError('Tanggal berakhir kontrak tidak boleh kosong');
      return;
    }

    if (!fileInputRef.current?.files?.[0]) {
      setError('Silakan pilih foto profil');
      return;
    }

    try {
      setLoading(true);

      // Create FormData for upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', fileInputRef.current.files[0]);
      uploadFormData.append('id', formData.id || formData.nama);
      uploadFormData.append('nama', formData.nama);
      uploadFormData.append('ttl', formData.ttl);
      uploadFormData.append('phone', formData.phone);
      uploadFormData.append('contractEndDate', formData.contractEndDate);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal upload karyawan');
      }

      const uploadedData = await res.json();

      // Fetch the newly added employee from database
      const getUserRes = await fetch(`/api/admin/users/${uploadedData.id}`, {
        headers: {
          'x-access-id': accessId,
        },
      });

      if (!getUserRes.ok) {
        throw new Error('Gagal mengambil data karyawan');
      }

      const newEmployee = await getUserRes.json();
      onEmployeeAdded(newEmployee);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
              Tambah Karyawan
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-600 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="label">Foto Profil *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-slate-500 hover:text-blue-500 dark:text-slate-400"
              >
                {fileName ? `📎 ${fileName}` : '📸 Klik untuk pilih foto'}
              </button>
            </div>

            {/* Image Preview */}
            {preview && (
              <div>
                <label className="label">Preview</label>
                <div className="w-full h-48 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* ID */}
            <div>
              <label className="label">ID (Opsional)</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Biarkan kosong untuk auto generate"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="label">Nama *</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Nama lengkap"
                required
              />
            </div>

            {/* TTL */}
            <div>
              <label className="label">TTL (Tempat, Tanggal Lahir) *</label>
              <input
                type="text"
                name="ttl"
                value={formData.ttl}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., Jakarta, 01 Januari 1990"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="label">Telepon *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="e.g., +62812345678"
                required
              />
            </div>

            {/* Contract End Date */}
            <div>
              <label className="label">Tanggal Berakhir Kontrak (Bulan, Hari, Tahun) *</label>
              <input
                type="date"
                name="contractEndDate"
                value={formData.contractEndDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium transition-colors"
              >
                {loading ? 'Memproses...' : 'Tambah Karyawan'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
