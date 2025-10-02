"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState, useEffect } from "react";
import { Edit, Trash2, MoreVertical } from "lucide-react";

export default function DataSiswaPage() {
  const [siswaData, setSiswaData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // jumlah data per halaman

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://backend_best.smktibazma.com/api/getsiswa");
        const data = await res.json();
        setSiswaData(data);
      } catch (err) {
        console.error("Gagal fetch data siswa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter pencarian
  const filteredData = siswaData.filter((s: any) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Ambil data sesuai halaman
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Ganti halaman
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardLayout />

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">Dashboard / Data Siswa</h1>

        

        {/* Header + Search */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Data Siswa</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari Siswa"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset ke halaman 1
              }}
              className="border px-3 py-2 rounded-lg"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
              + New
            </button>
          </div>
        </div>

        {/* Table */}
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
                      <td className="px-4 py-2 text-green-600 font-medium">
                        {siswa.id}
                      </td>
                      <td className="px-4 py-2">{siswa.name}</td>
                      <td className="px-4 py-2">{siswa.alamat}</td>
                      <td className="px-4 py-2">{siswa.nik}</td>
                      <td className="px-4 py-2">{siswa.telepon}</td>
                      <td className="px-4 py-2 flex items-center gap-3">
                        <button className="text-green-600 hover:text-green-800">
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

              {/* Pagination */}
              <div className="flex justify-between items-center p-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
