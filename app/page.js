"use client";
import { useState, useRef } from "react";

// *** ID Akses Rahasia (Ganti dengan Verifikasi Server Asli) ***
const SECRET_ACCESS_ID = "101069563126"; 

export default function Page() {
    // State Baru untuk Kontrol Akses
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessIdInput, setAccessIdInput] = useState("");
    const [accessError, setAccessError] = useState("");

    // State Data Form Upload
    const [qr, setQr] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customId, setCustomId] = useState("");
    const [nama, setNama] = useState(""); 
    const [tempat, setTempat] = useState("");
    const [tanggalLahir, setTanggalLahir] = useState("");
    const [phone, setPhone] = useState("+62");
    const fileInputRef = useRef(null); 

    // === Fungsi Autentikasi ===
    const handleAccessSubmit = (e) => {
        e.preventDefault();
        setAccessError("");

        if (accessIdInput.toUpperCase() === SECRET_ACCESS_ID) {
            setIsAuthenticated(true);
        } else {
            setAccessError("ID Akses salah. Mohon periksa kembali.");
            setAccessIdInput("");
        }
    };

    // === Fungsi Form Upload (Tidak Berubah) ===
    const generateId = () => {
        const id = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setCustomId(id);
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;
        if (!value.startsWith("+62")) {
            value = "+62" + value.replace(/^(\+62|62|0)/, "");
        }
        value = value.replace(/\s+/g, "-");
        setPhone(value);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        const ttlGabungan = `${tempat}, ${tanggalLahir}`;

        const formData = new FormData();
        formData.append("file", e.target.file.files[0]);
        formData.append("id", customId);
        formData.append("nama", nama); 
        formData.append("ttl", ttlGabungan);
        formData.append("phone", phone);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            setQr(data.qrUrl);
            
            // Reset Form setelah sukses
            setCustomId("");
            setNama("");
            setTempat("");
            setTanggalLahir("");
            setPhone("+62");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {
            console.error(error);
            alert("Gagal mengunggah data. Cek koneksi server.");
            setQr(null); 
        } finally {
            setLoading(false);
        }
    };
    
    // === Render Formulir Akses jika belum diautentikasi ===
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <form
                    onSubmit={handleAccessSubmit}
                    className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-red-500"
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">🔐 Perlu Akses</h1>
                    <p className="text-gray-600 mb-6">Masukkan ID Akses untuk melanjutkan ke formulir Upload Data.</p>

                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="accessId">
                        ID Akses
                    </label>
                    <input
                        id="accessId"
                        type="password"
                        placeholder="Contoh: ADMIN123"
                        className="border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-lg px-4 py-2.5 w-full transition duration-150"
                        value={accessIdInput}
                        onChange={(e) => setAccessIdInput(e.target.value)}
                        required
                    />

                    {accessError && (
                        <p className="text-red-500 text-sm mt-2">{accessError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg font-bold text-lg transition duration-300 shadow-md mt-6 bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        );
    }
    
    // === Render Formulir Upload jika sudah diautentikasi ===
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-100">
            <form
                onSubmit={handleUpload}
                className="flex flex-col items-start gap-5 bg-white p-8 rounded-xl shadow-2xl shadow-gray-300 w-full max-w-lg transition duration-300 hover:shadow-gray-400"
            >
                <h1 className="text-3xl font-extrabold text-gray-800 mb-3 border-b-2 border-green-500 pb-1 w-full">
                    📝 Input Data Baru
                </h1>

                {/* Tambahkan Tombol Logout */}
                <button
                    type="button"
                    onClick={() => setIsAuthenticated(false)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium transition duration-150"
                >
                    Keluar
                </button>

                {/* Sisa Formulir Upload (Kode yang Sudah Anda Modifikasi Sebelumnya) */}
                {/* ID Input Group */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ID Kustom</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Masukkan ID atau Generate"
                            className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 flex-1 transition duration-150"
                            value={customId}
                            onChange={(e) => setCustomId(e.target.value.replace(/\D/g, ""))}
                            required
                        />
                        <button
                            type="button"
                            onClick={generateId}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200 shadow-md flex items-center gap-1"
                        >
                            Generate ID
                        </button>
                    </div>
                </div>

                {/* Nama Input */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                        type="text"
                        placeholder="Contoh: Budi Setiawan"
                        className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 w-full transition duration-150"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                    />
                </div>

                {/* TTL Input Group */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tempat, Tanggal Lahir</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Tempat (e.g., Jakarta)"
                            className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 w-1/2 transition duration-150"
                            value={tempat}
                            onChange={(e) => setTempat(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 w-1/2 text-gray-700 transition duration-150"
                            value={tanggalLahir}
                            onChange={(e) => setTanggalLahir(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Nomor Telepon Input */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor HP</label>
                    <input
                        type="tel" 
                        placeholder="+62..."
                        className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 w-full transition duration-150"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                    />
                </div>

                {/* Foto Input */}
                <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Foto (Kartu/Profil)</label>
                    <input 
                        type="file" 
                        name="file" 
                        accept="image/*" 
                        required 
                        ref={fileInputRef} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition duration-150"
                    />
                </div>

                {/* Tombol Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        w-full py-3 rounded-lg font-bold text-lg transition duration-300 shadow-lg mt-2
                        ${loading 
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                            : "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl hover:shadow-green-200"
                        }
                    `}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses Data...
                        </span>
                    ) : (
                        "Upload dan Generate QR"
                    )}
                </button>
            </form>

            {/* Hasil QR Code */}
            {qr && (
                <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl shadow-xl border-t-4 border-green-500 w-full max-w-lg animate-fadeIn">
                    <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                        ✅ QR Berhasil Dibuat!
                    </h2>
                    <img src={qr} alt="QR Code" className="w-40 h-40 border-4 border-gray-100 rounded-lg shadow-md" />
                    <p className="text-sm text-gray-600 mt-2">QR Code siap diunduh dan dipindai.</p>
                    <a
                        href={qr}
                        download
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 shadow-md mt-1"
                    >
                        Download QR
                    </a>
                </div>
            )}
        </div>
    );
}