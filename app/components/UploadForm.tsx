'use client';

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { validateFile, formatPhoneNumber } from '@/utils/validators';
import { API_ENDPOINTS, MESSAGES, CONSTRAINTS } from '@/utils/constants';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  CalendarDays,
  Shield,
  LogOut,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface UploadFormProps {
  onQRGenerated: (qrUrl: string) => void;
  onLogout: () => void;
}

interface FormData {
  customId: string;
  nama: string;
  tempat: string;
  tanggalLahir: string;
  phone: string;
  contractEndDate: string;
}

export default function UploadForm({ onQRGenerated, onLogout }: UploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    customId: '',
    nama: '',
    tempat: '',
    tanggalLahir: '',
    phone: '+62',
    contractEndDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const generateId = () => {
    const id = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setFormData((prev: FormData) => ({ ...prev, customId: id }));
    setFieldErrors((prev) => ({ ...prev, customId: undefined }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = formatPhoneNumber(value);
    value = value.replace(/\s+/g, '-');
    setFormData((prev: FormData) => ({ ...prev, phone: value }));
    setFieldErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormData
  ) => {
    const value = e.target.value;
    if (field === 'customId') {
      setFormData((prev: FormData) => ({ ...prev, [field]: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    }
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || MESSAGES.ERROR.INVALID_FILE);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFileName('');
      } else {
        setError('');
      }
    } else {
      setFileName('');
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.customId) {
      errors.customId = 'ID Kustom harus diisi';
    } else if (formData.customId.length < 8) {
      errors.customId = 'ID minimal 8 digit';
    }
    
    if (!formData.nama) {
      errors.nama = 'Nama lengkap harus diisi';
    } else if (formData.nama.length < 3) {
      errors.nama = 'Nama minimal 3 karakter';
    }
    
    if (!formData.tempat) {
      errors.tempat = 'Tempat lahir harus diisi';
    }
    
    if (!formData.tanggalLahir) {
      errors.tanggalLahir = 'Tanggal lahir harus diisi';
    }
    
    if (!formData.phone) {
      errors.phone = 'Nomor telepon harus diisi';
    } else if (formData.phone.length < 10) {
      errors.phone = 'Nomor telepon tidak valid';
    }
    
    if (!formData.contractEndDate) {
      errors.contractEndDate = 'Tanggal berakhir kontrak harus diisi';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError('❌ Silakan pilih foto terlebih dahulu');
        setLoading(false);
        return;
      }

      // Validate file
      const fileValidation = validateFile(file);
      if (!fileValidation.valid) {
        setError(fileValidation.error || MESSAGES.ERROR.INVALID_FILE);
        setLoading(false);
        return;
      }

      const ttlGabungan = `${formData.tempat}, ${formData.tanggalLahir}`;

      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('id', formData.customId);
      formDataObj.append('nama', formData.nama);
      formDataObj.append('ttl', ttlGabungan);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('contractEndDate', formData.contractEndDate);

      const res = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formDataObj,
      });

      if (!res.ok) {
        throw new Error('Upload gagal');
      }

      const data = await res.json();
      onQRGenerated(data.qrUrl);

      // Reset form
      setFormData({
        customId: '',
        nama: '',
        tempat: '',
        tanggalLahir: '',
        phone: '+62',
        contractEndDate: '',
      });
      setFileName('');
      setFieldErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(MESSAGES.ERROR.UPLOAD_FAILED);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-2xl lg:max-w-full">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl -z-10"></div>
      
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 w-full border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Input Data Baru
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Lengkapi data karyawan berikut
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          {/* Custom ID */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Shield className="w-4 h-4" />
              ID Kustom
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Masukkan ID atau Generate"
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    fieldErrors.customId 
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
                  value={formData.customId}
                  onChange={(e) => handleInputChange(e, 'customId')}
                  required
                />
                {fieldErrors.customId && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.customId}</p>
                )}
              </div>
              <button
                type="button"
                onClick={generateId}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <User className="w-4 h-4" />
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Setiawan"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                fieldErrors.nama 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
              value={formData.nama}
              onChange={(e) => handleInputChange(e, 'nama')}
              maxLength={CONSTRAINTS.NAME.MAX_LENGTH}
              required
            />
            {fieldErrors.nama && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.nama}</p>
            )}
          </div>

          {/* TTL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="w-4 h-4" />
                Tempat Lahir
              </label>
              <input
                type="text"
                placeholder="Contoh: Jakarta"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  fieldErrors.tempat 
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
                value={formData.tempat}
                onChange={(e) => handleInputChange(e, 'tempat')}
                required
              />
              {fieldErrors.tempat && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.tempat}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="w-4 h-4" />
                Tanggal Lahir
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  fieldErrors.tanggalLahir 
                    ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
                value={formData.tanggalLahir}
                onChange={(e) => handleInputChange(e, 'tanggalLahir')}
                required
              />
              {fieldErrors.tanggalLahir && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.tanggalLahir}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Phone className="w-4 h-4" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              placeholder="+62..."
              className={`w-full px-4 py-2.5 rounded-xl border ${
                fieldErrors.phone 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={CONSTRAINTS.PHONE.MAX_LENGTH + 3}
              required
            />
            {fieldErrors.phone && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Contract End Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <CalendarDays className="w-4 h-4" />
              Tanggal Berakhir Kontrak
            </label>
            <input
              type="date"
              value={formData.contractEndDate}
              onChange={(e) => handleInputChange(e, 'contractEndDate')}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                fieldErrors.contractEndDate 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200`}
              required
            />
            {fieldErrors.contractEndDate && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldErrors.contractEndDate}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <FileText className="w-4 h-4" />
              Upload Foto
            </label>
            <div className="relative">
              <input
                type="file"
                name="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-center transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400">
                <Upload className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {fileName || 'Klik atau drag file untuk upload'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Format: JPG, PNG, WebP • Max {CONSTRAINTS.FILE.MAX_SIZE_MB}MB
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses Data...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Upload & Generate QR
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}