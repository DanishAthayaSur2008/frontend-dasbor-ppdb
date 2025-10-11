'use client';

import { useState } from 'react';
import { Check, Trash2, FileCheck2, FolderX, BadgeCheck, X, Download, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import jsPDF from 'jspdf';

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
      verified: false,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unverified' | 'verified'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleVerify = () => {
    if (!selectedStudent) return;

    // Cek apakah admin sudah download PDF sebelumnya
    if (!downloadedIds.includes(selectedStudent.id)) {
      setShowWarning(true);
      return;
    }

    // Jika sudah download PDF, maka lanjut verifikasi
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id ? { ...s, verified: true } : s
      )
    );
    setShowModal(false);
  };

  const handleDownloadPDF = (student: Student) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Data Siswa', 20, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const data = [
      `NISN: ${student.nisn}`,
      `Nama: ${student.nama}`,
      `Alamat: ${student.alamat}`,
      `NIK: ${student.nik}`,
      `Kontak: ${student.kontak}`,
      `Status: ${student.verified ? 'Verified' : 'Unverified'}`,
    ];

    let y = 40;
    data.forEach((line) => {
      doc.text(line, 20, y);
      y += 10;
    });

    doc.save(`data_${student.nama.replace(/\s+/g, '_')}.pdf`);

    // Catat bahwa PDF sudah didownload
    setDownloadedIds((prev) => [...prev, student.id]);
  };

  const filteredStudents = students.filter((s) => {
    if (filter === 'unverified') return !s.verified;
    if (filter === 'verified') return s.verified;
    return true;
  });

  const getCardStyle = (type: 'all' | 'unverified' | 'verified') => {
    const isActive = filter === type;
    const colors = {
      all: { border: '#25A215' },
      unverified: { border: '#08979C' },
      verified: { border: '#D97400' },
    }[type];

    return {
      background: isActive ? '#208FEA' : '#FFFFFF',
      color: isActive ? '#FFFFFF' : '#000000',
      borderLeft: `7px solid ${colors.border}`,
      boxShadow: '2px 2px 4px rgba(0,0,0,0.25)',
    };
  };

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
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-[1rem] transition-all duration-300">
        <h1 className="text-lg sm:text-xl font-semibold mb-6 font-inter">
          Dashboard / Data PPDB
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
          {[
            { type: 'all', title: 'Data Diterima', icon: FileCheck2, count: students.length },
            { type: 'unverified', title: 'Data Belum Terverif', icon: FolderX, count: students.filter((s) => !s.verified).length },
            { type: 'verified', title: 'Data Terverif', icon: BadgeCheck, count: students.filter((s) => s.verified).length },
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
                    backgroundColor: getCardStyle(type as any).borderLeft.split(' ')[2],
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold ${
                      filter === type ? 'text-white' : 'text-[#132B6D]'
                    }`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-base ${
                      filter === type ? 'text-white' : 'text-black'
                    }`}
                  >
                    {count} Data
                  </p>
                </div>
              </div>
              <CircleDecoration active={filter === type} />
              <span
                className={`absolute left-6 bottom-3 text-sm font-semibold ${
                  filter === type ? 'text-white' : 'text-gray-800'
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
                <th className="px-3 sm:px-4 py-2 text-left">Alamat</th>
                <th className="px-3 sm:px-4 py-2 text-left">NIK</th>
                <th className="px-3 sm:px-4 py-2 text-left">Kontak</th>
                <th className="px-3 sm:px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="px-3 sm:px-4 py-2 font-mono text-green-600">{s.nisn}</td>
                  <td className="px-3 sm:px-4 py-2">{s.nama}</td>
                  <td className="px-3 sm:px-4 py-2 truncate max-w-[120px] sm:max-w-xs">{s.alamat}</td>
                  <td className="px-3 sm:px-4 py-2">{s.nik}</td>
                  <td className="px-3 sm:px-4 py-2">{s.kontak}</td>
                  <td className="px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
                    {!s.verified ? (
                      <button
                        onClick={() => handleOpenModal(s)}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Verify
                      </button>
                    ) : (
                      <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs sm:text-sm">
                        Verified
                      </span>
                    )}
                    {/* Download PDF Button */}
                    <button
                      onClick={() => handleDownloadPDF(s)}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm rounded-lg hover:bg-yellow-200 transition"
                    >
                      Download PDF
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 sm:p-2 bg-red-100 rounded-lg hover:bg-red-200">
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
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

        {/* Modal konfirmasi data */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">
                Apakah data tersebut sudah cocok?
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-700 space-y-2">
                <p><span className="font-semibold text-gray-900">NISN:</span> {selectedStudent.nisn}</p>
                <p><span className="font-semibold text-gray-900">Nama:</span> {selectedStudent.nama}</p>
                <p><span className="font-semibold text-gray-900">Alamat:</span> {selectedStudent.alamat}</p>
                <p><span className="font-semibold text-gray-900">NIK:</span> {selectedStudent.nik}</p>
                <p><span className="font-semibold text-gray-900">Kontak:</span> {selectedStudent.kontak}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Agree
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal warning download */}
        {showWarning && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button
                onClick={() => setShowWarning(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-10 h-10 text-yellow-500 mb-3" />
                <h2 className="text-lg font-semibold text-[#132B6D] mb-2">
                  Anda belum mendownload data!
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Silakan download dan baca terlebih dahulu file PDF data siswa sebelum melakukan verifikasi.
                </p>
                <button
                  onClick={() => {
                    handleDownloadPDF(selectedStudent);
                    setShowWarning(false);
                  }}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  <Download className="w-4 h-4" /> Download Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
