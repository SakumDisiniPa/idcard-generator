'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
// Asumsikan Anda memiliki komponen atau tag <img> untuk logo atau foto
// Contoh: import Logo from '@/components/Logo'; 

// Fungsi untuk memformat tanggal (agar TTL lebih mudah dibaca)
const formatDate = (dateString) => {
    // Pastikan input adalah YYYY-MM-DD
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', options);
    } catch (e) {
        return dateString;
    }
};

// Komponen Card Data
const DataCard = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-gray-800 break-words max-w-[60%] text-right">{value}</span>
    </div>
);


export default function StatusPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id;
    const token = searchParams.get('token');
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!id || !token) return;
        fetch(`/api/verify?id=${id}&token=${token}`)
            .then(res => res.json())
            .then(setData)
            .catch(() => setData({ valid: false }));
    }, [id, token]);

    if (!data) {
        return <p className="text-center mt-10 animate-pulse text-gray-500">Memuat data verifikasi...</p>;
    }

    if (!data.valid) {
        return <p className="text-center mt-10 text-red-600 text-2xl font-bold">❌ QR / Token Tidak Valid</p>;
    }

    const user = data.user;
    
    // Pemrosesan TTL
    let tempatLahir = 'N/A';
    let tanggalLahir = 'N/A';

    if (user.ttl && user.ttl.includes(',')) {
        const parts = user.ttl.split(',').map(p => p.trim());
        tempatLahir = parts[0];
        tanggalLahir = parts.length > 1 ? formatDate(parts[1]) : 'N/A';
    } else {
        // Jika format TTL tidak sesuai (misal hanya sdsds atau tanggal saja)
        tempatLahir = user.ttl || 'N/A';
        tanggalLahir = 'Tanggal Tidak Tersedia';
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-sm border-t-8 border-green-500 transform transition duration-500 hover:shadow-2xl">
                
                {/* Bagian Header dan Status */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center text-3xl font-extrabold text-green-600">
                        <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                        ID VALID
                    </div>
                    
                    {/* Placeholder Foto atau Logo */}
                    <div className="mt-4 mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-300 shadow-inner">
                        {/* Jika ada user.image, gunakan <img> tag di sini */}
                        <img src={user.image} alt="Foto Pengguna" className="w-20 h-20 rounded-full object-cover" />
                    </div>
                </div>

                {/* Bagian Data Pribadi (Menggunakan Card yang Lebih Terstruktur) */}
                <div className="space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-700 mb-2 border-b pb-1">Detail Pengguna</h2>
                    
                    <DataCard label="Nama Lengkap" value={user.nama} />
                    <DataCard label="Tempat Lahir" value={tempatLahir} />
                    <DataCard label="Tanggal Lahir" value={tanggalLahir} />
                    <DataCard label="ID Kustom" value={user.customId} />
                    <DataCard label="Nomor Telepon" value={user.phone} />
                    
                </div>

                {/* Footer Verifikasi */}
                <div className="mt-6 border-t pt-4 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                        Verifikasi: <span className="text-green-600">Sistem Otomatis (QR)</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Diperiksa pada: {new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB
                    </p>
                </div>
            </div>
            
            <p className="mt-4 text-xs text-gray-400">ID System: {user.id}</p>
        </div>
    );
}