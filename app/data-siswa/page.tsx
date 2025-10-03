'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useState, useEffect } from 'react';
import { Edit, Trash2, MoreVertical } from 'lucide-react';

export default function DataSiswaPage() {
  const [siswaData, setSiswaData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // modal edit
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

  // buka modal edit
  const handleEdit = (siswa: any) => {
    setEditData(siswa);
    setIsEditOpen(true);
  };

  // submit update ke API
  // submit update ke API
  const handleUpdate = async () => {
    if (!editData) return;

    try {
      const formData = new FormData();
      formData.append('id', editData.id);
      formData.append('name', editData.name || '');
      formData.append('alamat', editData.alamat || '');
      formData.append('nik', editData.nik || '');
      formData.append('telepon', editData.telepon || '');

      // kalau ada field tambahan (angkatan, keahlian, dll) tambahkan juga:
      formData.append('angkatan', editData.angkatan || '');
      formData.append('keahlian', editData.keahlian || '');
      formData.append('status', editData.status || '');
      formData.append('email', editData.email || '');
      formData.append('password', editData.password || '');
      formData.append('hafalan', editData.hafalan || '');
      formData.append('nisn', editData.nisn || '');

      // kalau user upload file
      if (editData.foto instanceof File) {
        formData.append('foto', editData.foto);
      }
      if (editData.cv instanceof File) {
        formData.append('cv', editData.cv);
      }

      const res = await fetch(`https://backend_best.smktibazma.com/api/siswa/update/${editData.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert('Data berhasil diperbarui!');
        setIsEditOpen(false);
        fetchData(); // refresh data
      } else {
        const errMsg = await res.json();
        alert('Gagal update: ' + errMsg.error);
      }
    } catch (err) {
      console.error('Error update:', err);
      alert('Terjadi error update data siswa');
    }
  };

  // Filter pencarian
  const filteredData = siswaData.filter((s: any) => (s.name || '').toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardLayout />

      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">Dashboard / Data Siswa</h1>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Data Siswa</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari Siswa"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-lg"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg">+ New</button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {loading ? (
            <p className="p-4">Memuat data...</p>
          ) : (
            <>
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">NISN</th>
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Alamat</th>
                    <th className="px-4 py-2 text-left">NIK</th>
                    <th className="px-4 py-2 text-left">Kontak</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((siswa: any) => (
                    <tr key={siswa.id} className="border-b">
                      <td className="px-4 py-2 text-green-600 font-medium">{siswa.nisn}</td>
                      <td className="px-4 py-2">{siswa.name}</td>
                      <td className="px-4 py-2">{siswa.alamat}</td>
                      <td className="px-4 py-2">{siswa.nik}</td>
                      <td className="px-4 py-2">{siswa.telepon}</td>
                      <td className="px-4 py-2 flex items-center gap-3">
                        <button className="text-green-600 hover:text-green-800" onClick={() => handleEdit(siswa)}>
                          <Edit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center p-4">
                <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
                  Prev
                </button>
                <span>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal Edit */}
        {isEditOpen && editData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-4">Edit Siswa</h2>
              <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" placeholder="Nama" />
              <input type="text" value={editData.alamat} onChange={(e) => setEditData({ ...editData, alamat: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" placeholder="Alamat" />
              <input type="text" value={editData.nik} onChange={(e) => setEditData({ ...editData, nik: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" placeholder="NIK" />
              <input type="text" value={editData.nisn} onChange={(e) => setEditData({ ...editData, nisn: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" placeholder="Masukan nisn" />
              <input type="text" value={editData.telepon} onChange={(e) => setEditData({ ...editData, telepon: e.target.value })} className="w-full border px-3 py-2 mb-3 rounded" placeholder="Telepon" />
              <input type="file" accept="image/*" onChange={(e) => setEditData({ ...editData, foto: e.target.files?.[0] })} className="w-full border px-3 py-2 mb-3 rounded" />

              <input type="file" accept="application/pdf" onChange={(e) => setEditData({ ...editData, cv: e.target.files?.[0] })} className="w-full border px-3 py-2 mb-3 rounded" />

              <div className="flex justify-end gap-3">
                <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Batal
                </button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded">
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
