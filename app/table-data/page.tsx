'use client';

import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

type Student = {
  id: number;
  nisn: string;
  nama: string;
  alamat: string;
  nik: string;
  kontak: string;
  verified: boolean;
};

export default function TableDataPage() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      nisn: '123456789',
      nama: 'Muhammad Iqbal Asqalani',
      alamat: 'Bekasi Barat, Kec. Medan Satria Kel. Kali Baru',
      nik: '123456789',
      kontak: '+62812-8888-8888',
      verified: false,
    },
    {
      id: 2,
      nisn: '987654321',
      nama: 'Aisyah Nurhaliza',
      alamat: 'Bogor, Jawa Barat',
      nik: '987654321',
      kontak: '+62821-9999-0000',
      verified: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unverified' | 'verified'>('all');

  const handleVerify = (id: number) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, verified: true } : s)));
  };

  // Data sesuai filter
  const filteredStudents = students.filter((s) => {
    if (filter === 'unverified') return !s.verified;
    if (filter === 'verified') return s.verified;
    return true; // all
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardLayout />

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">Dashboard / Data PPDB</h1>

        {/* Header cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl p-5 shadow-md text-left transition ${filter === 'all' ? 'ring-2 ring-blue-400 ' : ''} text-black`}
            style={{ backgroundImage: "url('/bg-card.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <h3 className="text-lg font-semibold">Data Diterima</h3>
            <p className="text-3xl font-bold">{students.length}</p>
          </button>

          <button onClick={() => setFilter('unverified')} className={`rounded-xl p-6 shadow-md text-left transition ${filter === 'unverified' ? 'ring-2 ring-blue-400' : ''} text-black`}
            style={{ backgroundImage: "url('/bg-card.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h3 className="text-lg font-semibold">Data Belum Terverifikasi</h3>
            <p className="text-3xl font-bold">{students.filter((s) => !s.verified).length}</p>
          </button>

          <button onClick={() => setFilter('verified')} className={`rounded-xl p-6 shadow-md text-left transition ${filter === 'verified' ? 'ring-2 ring-blue-400' : ''} text-black`}
            style={{ backgroundImage: "url('/bg-card.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h3 className="text-lg font-semibold">Data Terverifikasi</h3>
            <p className="text-3xl font-bold">{students.filter((s) => s.verified).length}</p>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">NISN</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Alamat</th>
                <th className="px-4 py-2 text-left">NIK</th>
                <th className="px-4 py-2 text-left">Kontak</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-green-600">{s.nisn}</td>
                  <td className="px-4 py-2">{s.nama}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{s.alamat}</td>
                  <td className="px-4 py-2">{s.nik}</td>
                  <td className="px-4 py-2">{s.kontak}</td>
                  <td className="px-4 py-2 flex items-center gap-3 justify-center">
                    {!s.verified ? (
                      <button onClick={() => handleVerify(s.id)} className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition">
                        <Check className="w-4 h-4" /> Verify
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm">Verified</span>
                    )}
                    <button className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200">
                      <Pencil className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button className="p-2 bg-red-100 rounded-lg hover:bg-red-200">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
