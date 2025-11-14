"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, XCircle, MoreVertical, Send, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

/**
 * Data Akhir Page
 * Menampilkan data hasil keputusan akhir (LOLOS / TIDAK LOLOS)
 * diambil otomatis dari localStorage key: "app_dataAkhir_v1"
 * UI dijaga 100% sama seperti desain aslinya
 */

type FinalDecision = {
  id: number;
  nisn: string;
  nama: string;
  keputusan: "lolos" | "tidak";
};

export default function DataAkhirPage() {
  const [students, setStudents] = useState<FinalDecision[]>([]);
  const [filter, setFilter] = useState<"lolos" | "tidak">("lolos");
  const [selectedStudent, setSelectedStudent] = useState<FinalDecision | null>(
    null
  );
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Ambil data dari localStorage saat page dibuka
  useEffect(() => {
    try {
      const raw = localStorage.getItem("app_dataAkhir_v1");
      if (raw) {
        setStudents(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Gagal membaca localStorage:", e);
    }
  }, []);

  // Simpan ke localStorage kalau ada perubahan (dummy persistence)
  useEffect(() => {
    localStorage.setItem("app_dataAkhir_v1", JSON.stringify(students));
  }, [students]);

  const filteredStudents = students.filter((s) => s.keputusan === filter);

  const handleChangeStatus = (newStatus: "lolos" | "tidak") => {
    if (!selectedStudent) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id ? { ...s, keputusan: newStatus } : s
      )
    );
    setShowChangeStatus(false);
  };

  const handleSendNotification = (student: FinalDecision) => {
    setSelectedStudent(student);
    setShowNotifModal(true);
  };

  const getCardStyle = (type: "lolos" | "tidak") => {
    const isActive = filter === type;
    const colors = {
      lolos: "#25A215",
      tidak: "#D32F2F",
    }[type];

    return {
      background: isActive ? "#208FEA" : "#FFFFFF",
      color: isActive ? "#FFFFFF" : "#000000",
      borderLeft: `7px solid ${colors}`,
      boxShadow: "2px 2px 4px rgba(0,0,0,0.25)",
    };
  };

  const CircleDecoration = ({ active }: { active: boolean }) => (
    <div className="absolute top-0 right-0 w-[140px] h-[140px] translate-x-1/2 -translate-y-1/3">
      <div
        className={`absolute w-[111px] h-[111px] rounded-full ${
          active ? "bg-white/20" : "bg-[#E3E2E2]"
        }`}
      ></div>
      <div
        className={`absolute left-[27px] top-[27px] w-[57px] h-[57px] rounded-full ${
          active ? "bg-white/30" : "bg-[#EEEEEE]"
        }`}
      ></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-4 transition-all duration-300">
        {/* 🔹 FIXED HEADER TITLE */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3">
            Dashboard / Data Akhir
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 justify-items-center">
          {[
            {
              type: "lolos",
              title: "Data Lolos",
              icon: BadgeCheck,
              count: students.filter((s) => s.keputusan === "lolos").length,
            },
            {
              type: "tidak",
              title: "Data Tidak Lolos",
              icon: XCircle,
              count: students.filter((s) => s.keputusan === "tidak").length,
            },
          ].map(({ type, title, icon: Icon, count }) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className="relative w-full sm:w-[360px] md:w-[380px] h-[150px] rounded-[10px] text-left transition overflow-hidden"
              style={getCardStyle(type as any)}
            >
              <div className="absolute left-6 top-5 flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center"
                  style={{
                    backgroundColor: getCardStyle(type as any).borderLeft.split(
                      " "
                    )[2],
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold ${
                      filter === type ? "text-white" : "text-[#132B6D]"
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-base ${
                      filter === type ? "text-white" : "text-black"
                    }`}
                  >
                    {count} data
                  </p>
                </div>
              </div>
              <CircleDecoration active={filter === type} />
              <span
                className={`absolute left-6 bottom-3 text-sm font-semibold ${
                  filter === type ? "text-white" : "text-gray-800"
                }`}
              >
                Selengkapnya →
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 sm:px-4 py-2 text-left">NISN</th>
                <th className="px-3 sm:px-4 py-2 text-left">Nama</th>
                <th className="px-3 sm:px-4 py-2 text-center">Keputusan</th>
                <th className="px-3 sm:px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <td className="px-3 sm:px-4 py-2 font-mono text-green-600">
                    {s.nisn}
                  </td>
                  <td className="px-3 sm:px-4 py-2">{s.nama}</td>
                  <td className="px-3 sm:px-4 py-2 text-center font-semibold">
                    {s.keputusan === "lolos" ? (
                      <span className="text-green-600">Lolos</span>
                    ) : (
                      <span className="text-red-600">Tidak Lolos</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 py-2 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleSendNotification(s)}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      Kirimkan Notifikasi
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudent(s);
                        setShowChangeStatus(true);
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200 transition"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-700" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Kirim Notifikasi */}
        {showNotifModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button
                onClick={() => setShowNotifModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">
                Kirimkan Notifikasi
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Apakah kamu yakin ingin mengirimkan notifikasi kepada{" "}
                <span className="font-semibold text-gray-800">
                  {selectedStudent.nama}
                </span>{" "}
                bahwa dia{" "}
                <span
                  className={
                    selectedStudent.keputusan === "lolos"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {selectedStudent.keputusan === "lolos"
                    ? "LOLOS seleksi"
                    : "TIDAK LOLOS seleksi"}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNotifModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => setShowNotifModal(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ubah Status */}
        {showChangeStatus && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 relative">
              <button
                onClick={() => setShowChangeStatus(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">
                Ubah Status Siswa
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Pilih status baru untuk{" "}
                <span className="font-semibold text-gray-800">
                  {selectedStudent.nama}
                </span>
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleChangeStatus("lolos")}
                  className="flex-1 mx-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Jadikan Lolos
                </button>
                <button
                  onClick={() => handleChangeStatus("tidak")}
                  className="flex-1 mx-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Jadikan Tidak Lolos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
