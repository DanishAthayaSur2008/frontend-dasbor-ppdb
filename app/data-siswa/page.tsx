'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useState, useEffect } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';

export default function DataSiswaPage() {
  const [siswaData, setSiswaData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('https://backend_best.smktibazma.com/api/getsiswa');
      const data = await res.json();
      setSiswaData(data);
    } catch (err) {
      console.error('Gagal fetch data siswa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (siswa: any) => {
    setEditData(siswa);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editData) return;

    try {
      const formData = new FormData();
      for (const key in editData) {
        if (editData[key] instanceof File) formData.append(key, editData[key]);
        else formData.append(key, editData[key] ?? '');
      }

      const res = await fetch(`https://backend_best.smktibazma.com/api/siswa/update/${editData.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert('Data berhasil diperbarui!');
        setIsEditOpen(false);
        fetchData();
      } else {
        const errMsg = await res.json();
        alert('Gagal update: ' + errMsg.error);
      }
    } catch (err) {
      console.error('Error update:', err);
      alert('Terjadi error update data siswa');
    }
  };

  const filteredData = siswaData.filter((s: any) =>
    (s.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredData.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar tetap di kiri */}
      <DashboardLayout />

      {/* Konten utama bisa scroll */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-[1rem] transition-all duration-300">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left">
          Dashboard / Data Siswa
        </h1>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">Data Siswa</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Siswa"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 px-3 py-2 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-400"
            />
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
              + New
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm w-full">
          {loading ? (
            <p className="p-4 text-center">Memuat data...</p>
          ) : (
            <>
              <table className="min-w-full text-sm sm:text-base border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">NISN</th>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Alamat</th>
                    <th className="px-4 py-3 text-left">NIK</th>
                    <th className="px-4 py-3 text-left">Kontak</th>
                    <th className="px-4 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((siswa: any) => (
                    <tr key={siswa.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-green-600 font-medium">{siswa.nisn}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{siswa.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{siswa.alamat}</td>
                      <td className="px-4 py-3">{siswa.nik}</td>
                      <td className="px-4 py-3">{siswa.telepon}</td>
                      <td className="px-4 py-3 flex gap-2 justify-start sm:justify-center">
                        <button
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleEdit(siswa)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-3 text-sm sm:text-base">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Prev
                </button>
                <span>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal Edit */}
        {isEditOpen && editData && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-semibold mb-4">Edit Siswa</h2>
              <div className="flex flex-col gap-3">
                <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="border px-3 py-2 rounded" placeholder="Nama" />
                <input type="text" value={editData.alamat} onChange={(e) => setEditData({ ...editData, alamat: e.target.value })} className="border px-3 py-2 rounded" placeholder="Alamat" />
                <input type="text" value={editData.nik} onChange={(e) => setEditData({ ...editData, nik: e.target.value })} className="border px-3 py-2 rounded" placeholder="NIK" />
                <input type="text" value={editData.nisn} onChange={(e) => setEditData({ ...editData, nisn: e.target.value })} className="border px-3 py-2 rounded" placeholder="NISN" />
                <input type="text" value={editData.telepon} onChange={(e) => setEditData({ ...editData, telepon: e.target.value })} className="border px-3 py-2 rounded" placeholder="Telepon" />
                <input type="file" accept="image/*" onChange={(e) => setEditData({ ...editData, foto: e.target.files?.[0] })} className="border px-3 py-2 rounded" />
                <input type="file" accept="application/pdf" onChange={(e) => setEditData({ ...editData, cv: e.target.files?.[0] })} className="border px-3 py-2 rounded" />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
                <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
                  Batal
                </button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
