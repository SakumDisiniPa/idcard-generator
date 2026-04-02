'use client';

import { useState, useEffect, useRef } from 'react';
import { DatabaseEntry } from '@/lib/jsondb';
import { 
  X, 
  Save, 
  User, 
  IdCard, 
  Key, 
  Phone, 
  Calendar, 
  Camera, 
  Image as ImageIcon,
  QrCode,
  AlertCircle,
  CheckCircle,
  Upload,
  RefreshCw
} from 'lucide-react';

interface EditUserModalProps {
  user: DatabaseEntry;
  onSave: (updates: Partial<DatabaseEntry>) => Promise<void>;
  onClose: () => void;
}

export default function EditUserModal({
  user,
  onSave,
  onClose,
}: EditUserModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    nama: user.nama,
    ttl: user.ttl,
    phone: user.phone,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.nama.trim()) {
      errors.nama = 'Nama tidak boleh kosong';
    } else if (formData.nama.length < 3) {
      errors.nama = 'Nama minimal 3 karakter';
    }
    
    if (!formData.ttl.trim()) {
      errors.ttl = 'TTL tidak boleh kosong';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Nomor telepon tidak boleh kosong';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Nomor telepon tidak valid';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih file gambar yang valid (JPG, PNG, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file tidak boleh lebih dari 5MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updates: any = { ...formData };

      // If there's a new image file, upload it
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('id', user.id);
        uploadFormData.append('isProfileUpdate', 'true');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || 'Gagal upload foto');
        }

        const uploadData = await uploadRes.json();
        updates.image = uploadData.image;
      }

      await onSave(updates);
      setSuccess('Perubahan berhasil disimpan!');
      
      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-fadeInUp">
          {/* Header */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Edit Pengguna
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ubah data karyawan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-slideDown">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Read-only Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID Section */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <IdCard className="w-4 h-4" />
                  ID
                </label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono text-sm"
                />
              </div>

              {/* Token Section */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Key className="w-4 h-4" />
                  Token
                </label>
                <input
                  type="text"
                  value={user.token}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono text-sm"
                />
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    fieldErrors.nama 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
                  required
                />
                {fieldErrors.nama && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.nama}</p>
                )}
              </div>

              {/* TTL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  TTL (Tempat, Tanggal Lahir)
                </label>
                <input
                  type="text"
                  name="ttl"
                  value={formData.ttl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    fieldErrors.ttl 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="e.g., Jakarta, 01 Januari 1990"
                  required
                />
                {fieldErrors.ttl && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.ttl}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    fieldErrors.phone 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="e.g., +62812345678"
                  required
                />
                {fieldErrors.phone && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Upload Foto Profil Baru */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Camera className="w-4 h-4" />
                Update Foto Profil
              </label>
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
                className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 text-slate-500 hover:text-blue-500 dark:text-slate-400 text-sm group"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                  <span>Klik untuk ganti foto</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    JPG, PNG, WebP • Max 5MB
                  </span>
                </div>
              </button>
            </div>

            {/* Image Previews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Image Preview */}
              {imagePreview && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <ImageIcon className="w-4 h-4" />
                    Foto Baru
                  </label>
                  <div className="relative group">
                    <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Current Image Preview */}
              {user.image && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <ImageIcon className="w-4 h-4" />
                    Foto Saat Ini
                  </label>
                  <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* QR Code Preview */}
              {user.qr && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <QrCode className="w-4 h-4" />
                    Kode QR
                  </label>
                  <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={user.qr}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition-all duration-200"
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