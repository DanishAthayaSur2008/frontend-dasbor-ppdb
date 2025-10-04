'use client';

import { useState } from 'react';
import { Check, Pencil, Trash2, FileCheck2, FolderX, BadgeCheck } from 'lucide-react';
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
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: true } : s))
    );
  };

  // Data sesuai filter
  const filteredStudents = students.filter((s) => {
    if (filter === 'unverified') return !s.verified;
    if (filter === 'verified') return s.verified;
    return true;
  });

  // Reusable card style function
  const getCardStyle = (type: 'all' | 'unverified' | 'verified') => {
    const isActive = filter === type;

    const colors = {
      all: { border: '#25A215', icon: '#25A215' },
      unverified: { border: '#08979C', icon: '#08979C' },
      verified: { border: '#D97400', icon: '#D97400' },
    }[type];

    return {
      background: isActive ? '#208FEA' : '#FFFFFF',
      color: isActive ? '#FFFFFF' : '#000000',
      borderLeft: `7px solid ${colors.border}`,
      boxShadow: '2px 2px 4px rgba(0,0,0,0.25)',
      ringColor: isActive
        ? type === 'all'
          ? 'ring-green-400'
          : type === 'unverified'
          ? 'ring-cyan-500'
          : 'ring-orange-400'
        : '',
    };
  };

  // Circle decoration reusable
  const CircleDecoration = ({ active }: { active: boolean }) => (
    <div className="absolute top-0 right-0 w-[140px] h-[140px] translate-x-1/2 -translate-y-1/3">
      <div
        className={`absolute w-[111px] h-[111px] rounded-full ${
          active ? 'bg-white/20' : 'bg-[#E3E2E2]'
        }`}
      ></div>
      <div
        className={`absolute left-[27px] top-[27px] w-[57px] h-[57px] rounded-full ${
          active ? 'bg-white/30' : 'bg-[#EEEEEE]'
        }`}
      ></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardLayout />

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">Dashboard / Data PPDB</h1>

        {/* Header Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9 mb-8">
          {/* Card Data Diterima */}
          <button
            onClick={() => setFilter('all')}
            className={`relative w-[397px] h-[154px] rounded-[10px] text-left transition overflow-hidden ${
              getCardStyle('all').ringColor
            } ${filter === 'all' ? 'ring-2' : ''}`}
            style={getCardStyle('all')}
          >
            <div className="absolute left-7 top-5 flex items-center gap-5">
              <div
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${
                  filter === 'all' ? 'bg-white/30' : 'bg-[#25A215]'
                }`}
              >
                <FileCheck2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    filter === 'all' ? 'text-white' : 'text-[#132B6D]'
                  }`}
                >
                  Data Diterima
                </h3>
                <p
                  className={`text-lg ${
                    filter === 'all' ? 'text-white' : 'text-black'
                  }`}
                >
                  {students.length} Data
                </p>
              </div>
            </div>

            <CircleDecoration active={filter === 'all'} />

            <span
              className={`absolute left-7 bottom-3 text-sm font-semibold ${
                filter === 'all' ? 'text-white' : 'text-gray-800'
              }`}
            >
              Selengkapnya →
            </span>
          </button>

          {/* Card Belum Terverifikasi */}
          <button
            onClick={() => setFilter('unverified')}
            className={`relative w-[397px] h-[154px] rounded-[10px] text-left transition overflow-hidden ${
              getCardStyle('unverified').ringColor
            } ${filter === 'unverified' ? 'ring-2' : ''}`}
            style={getCardStyle('unverified')}
          >
            <div className="absolute left-7 top-5 flex items-center gap-5">
              <div
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${
                  filter === 'unverified' ? 'bg-white/30' : 'bg-[#08979C]'
                }`}
              >
                <FolderX className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    filter === 'unverified' ? 'text-white' : 'text-[#132B6D]'
                  }`}
                >
                  Data Belum Terverif
                </h3>
                <p
                  className={`text-lg ${
                    filter === 'unverified' ? 'text-white' : 'text-black'
                  }`}
                >
                  {students.filter((s) => !s.verified).length} Data
                </p>
              </div>
            </div>

            <CircleDecoration active={filter === 'unverified'} />

            <span
              className={`absolute left-7 bottom-3 text-sm font-semibold ${
                filter === 'unverified' ? 'text-white' : 'text-gray-800'
              }`}
            >
              Selengkapnya →
            </span>
          </button>

          {/* Card Terverifikasi */}
          <button
            onClick={() => setFilter('verified')}
            className={`relative w-[397px] h-[154px] rounded-[10px] text-left transition overflow-hidden ${
              getCardStyle('verified').ringColor
            } ${filter === 'verified' ? 'ring-2' : ''}`}
            style={getCardStyle('verified')}
          >
            <div className="absolute left-7 top-5 flex items-center gap-5">
              <div
                className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${
                  filter === 'verified' ? 'bg-white/30' : 'bg-[#D97400]'
                }`}
              >
                <BadgeCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    filter === 'verified' ? 'text-white' : 'text-[#132B6D]'
                  }`}
                >
                  Data Terverif
                </h3>
                <p
                  className={`text-lg ${
                    filter === 'verified' ? 'text-white' : 'text-black'
                  }`}
                >
                  {students.filter((s) => s.verified).length} Data
                </p>
              </div>
            </div>

            <CircleDecoration active={filter === 'verified'} />

            <span
              className={`absolute left-7 bottom-3 text-sm font-semibold ${
                filter === 'verified' ? 'text-white' : 'text-gray-800'
              }`}
            >
              Selengkapnya →
            </span>
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
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-mono text-green-600">
                    {s.nisn}
                  </td>
                  <td className="px-4 py-2">{s.nama}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{s.alamat}</td>
                  <td className="px-4 py-2">{s.nik}</td>
                  <td className="px-4 py-2">{s.kontak}</td>
                  <td className="px-4 py-2 flex items-center gap-3 justify-center">
                    {!s.verified ? (
                      <button
                        onClick={() => handleVerify(s.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                      >
                        <Check className="w-4 h-4" /> Verify
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm">
                        Verified
                      </span>
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
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500"
                  >
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
