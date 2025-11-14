"use client";

import { useEffect, useState } from "react";
import {
  Check,
  FileCheck2,
  FolderX,
  BadgeCheck,
  X,
  Download,
  AlertCircle,
  Clock4,
  Send,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import jsPDF from "jspdf";

/**
 * Table Data (Data Diterima) - FINAL REVISI
 *
 * Perbaikan & fitur:
 * - UI persis seperti aslinya (cards, table, spacing, responsive)
 * - Semua alur ada di 1 page: Diterima | Tertunda | Disetujui
 * - Setujui: cek download -> minta konfirmasi "sudah membaca?" -> pindah ke Disetujui
 * - Tunda: input note -> Kirim Notifikasi -> pindah ke Tertunda (note disimpan)
 * - Disetujui: tombol Loloskan / Tidak Loloskan -> SIMPAN KE localStorage "app_dataAkhir_v1" SEGERA
 * - Mencegah duplikat di localStorage
 * - Realtime sync: page lain yang buka akan mendengar perubahan localStorage (storage event)
 * - Semua aksi punya modal konfirmasi
 *
 * Catatan:
 * - Semua data dummy (useState). localStorage digunakan hanya untuk menyimpan keputusan akhir.
 * - Kalau mau sambung ke backend/fungsi notifikasi asli, tinggal ganti bagian tempat komentar "TODO: API call".
 */

type Student = {
  id: number;
  nisn: string;
  nama: string;
  alamat: string;
  nik: string;
  kontak: string;
  verified?: boolean;
  status?: "diterima" | "tertunda" | "disetujui";
  note?: string;
};

type FinalDecision = {
  id: number;
  nisn: string;
  nama: string;
  keputusan: "lolos" | "tidak";
};

export default function TableDataPage() {
  // -------- initial dummy data (as original) --------
  const [allDiterima, setAllDiterima] = useState<Student[]>([
    {
      id: 1,
      nisn: "123456789",
      nama: "Muhammad Iqbal Asqalani",
      alamat: "Bekasi Barat, Kec. Medan Satria Kel. Kali Baru",
      nik: "123456789",
      kontak: "+62812-8888-8888",
      verified: false,
      status: "diterima",
    },
    {
      id: 2,
      nisn: "987654321",
      nama: "Aisyah Nurhaliza",
      alamat: "Bogor, Jawa Barat",
      nik: "987654321",
      kontak: "+62821-9999-0000",
      verified: false,
      status: "diterima",
    },
  ]);

  // lists
  const [tertunda, setTertunda] = useState<Student[]>([]);
  const [disetujui, setDisetujui] = useState<Student[]>([]);

  // final decisions persisted in localStorage (app_dataAkhir_v1)
  const [dataAkhir, setDataAkhir] = useState<FinalDecision[]>(() => {
    try {
      const raw = localStorage.getItem("app_dataAkhir_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // UI / modal / helpers states
  const [activeFilter, setActiveFilter] = useState<
    "diterima" | "tertunda" | "disetujui"
  >("diterima");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // modal flags
  const [showWarningDownload, setShowWarningDownload] = useState(false);
  const [showConfirmRead, setShowConfirmRead] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [showTertundaConfirm, setShowTertundaConfirm] = useState(false);
  const [showDecisionConfirm, setShowDecisionConfirm] = useState<
    null | { decision: "lolos" | "tidak" }
  >(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

  // ---------------- keep localStorage in sync ----------------
  // write whenever dataAkhir changes (keeps persistence), but we also write directly
  // inside confirmDecision for immediacy to avoid race conditions across tabs.
  useEffect(() => {
    try {
      localStorage.setItem("app_dataAkhir_v1", JSON.stringify(dataAkhir));
    } catch {
      // ignore write errors
    }
  }, [dataAkhir]);

  useEffect(() => {
    if (allDiterima.length > 0) {
      sessionStorage.setItem("ppdb_diterima", JSON.stringify(allDiterima));
    }
  }, [allDiterima]);


  // storage event listener: update dataAkhir when localStorage changed from other tab
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "app_dataAkhir_v1") {
        try {
          const raw = e.newValue;
          const parsed: FinalDecision[] = raw ? JSON.parse(raw) : [];
          setDataAkhir(parsed);
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // ---------------- PDF download helper ----------------
  const handleDownloadPDF = (student: Student | null) => {
    if (!student) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Data Siswa", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const data = [
      `NISN: ${student.nisn}`,
      `Nama: ${student.nama}`,
      `Alamat: ${student.alamat}`,
      `NIK: ${student.nik}`,
      `Kontak: ${student.kontak}`,
    ];

    let y = 40;
    data.forEach((line) => {
      doc.text(line, 20, y);
      y += 10;
    });

    doc.save(`data_${student.nama.replace(/\s+/g, "_")}.pdf`);
    setDownloadedIds((prev) => (prev.includes(student.id) ? prev : [...prev, student.id]));
  };

  // ---------------- Filtered view logic ----------------
  const diterimaList = allDiterima.filter((s) =>
    [undefined, "diterima"].includes(s.status)
  );

  const filteredViewList =
    activeFilter === "diterima"
      ? diterimaList.filter(
        (s) =>
          s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nisn.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : activeFilter === "tertunda"
        ? tertunda.filter(
          (s) =>
            s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : disetujui.filter(
          (s) =>
            s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // ---------------- Setujui flow (download-check + confirm) ----------------
  const handleSetujuiClicked = (student: Student) => {
    setSelectedStudent(student);
    // show warning if not yet downloaded
    if (!downloadedIds.includes(student.id)) {
      setShowWarningDownload(true);
      return;
    }
    setShowConfirmRead(true);
  };

  const confirmSetujui = () => {
    if (!selectedStudent) return;
    // move to disetujui
    setDisetujui((prev) => [...prev, { ...selectedStudent, status: "disetujui" }]);
    // remove from diterima list
    setAllDiterima((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setShowConfirmRead(false);
    setSelectedStudent(null);
    // optionally switch to disetujui view to show newly added
    setActiveFilter("disetujui");
  };

  // ---------------- Tunda flow ----------------
  const handleTundaClicked = (student: Student) => {
    setSelectedStudent(student);
    setNoteInput(student.note ?? "");
    setShowNoteModal(true);
  };

  const sendTundaWithNote = () => {
    if (!selectedStudent) return;
    const noteTrim = noteInput.trim();
    if (!noteTrim) return;

    // move to tertunda
    setTertunda((prev) => [...prev, { ...selectedStudent, status: "tertunda", note: noteTrim }]);
    setAllDiterima((prev) => prev.filter((s) => s.id !== selectedStudent.id));

    setShowNoteModal(false);
    // open a confirm modal to simulate "kirim notif"
    setShowTertundaConfirm(true);
    setSelectedStudent(null);
    setNoteInput("");
    setActiveFilter("tertunda");
  };

  const confirmSendNotifTunda = () => {
    // TODO: API call to send notification
    setShowTertundaConfirm(false);
  };

  // edit note on tertunda
  const handleEditNoteTertunda = (student: Student) => {
    setSelectedStudent(student);
    setNoteInput(student.note ?? "");
    setShowNoteModal(true);
  };

  const saveEditedNoteTertunda = () => {
    if (!selectedStudent) return;
    const noteTrim = noteInput.trim();
    setTertunda((prev) => prev.map((s) => (s.id === selectedStudent.id ? { ...s, note: noteTrim } : s)));
    setShowNoteModal(false);
    setSelectedStudent(null);
    setNoteInput("");
  };

  // ---------------- Disetujui -> Final Decision (lolos / tidak) ----------------
  const handleDecisionOnDisetujui = (student: Student, decision: "lolos" | "tidak") => {
    setSelectedStudent(student);
    setShowDecisionConfirm({ decision });
  };

  const confirmDecision = () => {
    if (!selectedStudent || !showDecisionConfirm) return;

    const keputusan = showDecisionConfirm.decision;

    // remove student from lists to avoid reappearing
    setDisetujui((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setAllDiterima((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setTertunda((prev) => prev.filter((s) => s.id !== selectedStudent.id));

    const final: FinalDecision = {
      id: selectedStudent.id,
      nisn: selectedStudent.nisn,
      nama: selectedStudent.nama,
      keputusan,
    };

    try {
      // write directly to localStorage immediately (avoids race)
      const raw = localStorage.getItem("app_dataAkhir_v1");
      const existing: FinalDecision[] = raw ? JSON.parse(raw) : [];
      // remove any existing for same id, then add final
      const updated = [...existing.filter((d) => d.id !== final.id), final];
      localStorage.setItem("app_dataAkhir_v1", JSON.stringify(updated));
      // update component state to reflect persist change immediately
      setDataAkhir(updated);
    } catch (e) {
      console.error("Gagal menyimpan keputusan akhir:", e);
    }

    setShowDecisionConfirm(null);
    setSelectedStudent(null);
    // optionally switch to penerapan UI or leave view
  };

  // helper getCardStyle (kept consistent with original)
  const getCardStyle = (type: "diterima" | "tertunda" | "disetujui") => {
    const isActive = activeFilter === type;
    const colors = {
      diterima: "#25A215",
      tertunda: "#08979C",
      disetujui: "#D97400",
    } as Record<string, string>;

    return {
      background: isActive ? "#208FEA" : "#FFFFFF",
      color: isActive ? "#FFFFFF" : "#000000",
      borderLeft: `7px solid ${colors[type]}`,
      boxShadow: "2px 2px 4px rgba(0,0,0,0.25)",
    } as React.CSSProperties;
  };

  const CircleDecoration = ({ active }: { active: boolean }) => (
    <div className="absolute top-0 right-0 w-[140px] h-[140px] translate-x-1/2 -translate-y-1/3">
      <div
        className={`absolute w-[111px] h-[111px] rounded-full ${active ? "bg-white/20" : "bg-[#E3E2E2]"
          }`}
      ></div>
      <div
        className={`absolute left-[27px] top-[27px] w-[57px] h-[57px] rounded-full ${active ? "bg-white/30" : "bg-[#EEEEEE]"
          }`}
      ></div>
    </div>
  );

  const counts = {
    diterima: allDiterima.length,
    tertunda: tertunda.length,
    disetujui: disetujui.length,
  };

  // ---------------- Render UI ----------------
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-[1rem] transition-all duration-300">
        {/* 🔹 FIXED HEADER TITLE */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3">
            Dashboard / Table Data
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
          {[
            { type: "diterima", title: "Data Diterima", icon: FileCheck2, count: counts.diterima },
            { type: "tertunda", title: "Data Tertunda", icon: FolderX, count: counts.tertunda },
            { type: "disetujui", title: "Data Disetujui", icon: BadgeCheck, count: counts.disetujui },
          ].map(({ type, title, icon: Icon, count }) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type as any)}
              className="relative w-full sm:w-[360px] md:w-[380px] h-[150px] rounded-[10px] text-left transition overflow-hidden"
              style={getCardStyle(type as any)}
            >
              <div className="absolute left-6 top-5 flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center"
                  style={{
                    backgroundColor: String(getCardStyle(type as any).borderLeft || "").split(" ")[2] || "#208FEA",
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold ${activeFilter === type ? "text-white" : "text-[#132B6D]"}`}>
                    {title}
                  </h3>
                  <p className={`text-base ${activeFilter === type ? "text-white" : "text-black"}`}>{count} data</p>
                </div>
              </div>
              <CircleDecoration active={activeFilter === type} />
              <span className={`absolute left-6 bottom-3 text-sm font-semibold ${activeFilter === type ? "text-white" : "text-gray-800"}`}>Selengkapnya →</span>
            </button>
          ))}
        </div>

        {/* Search / header */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center bg-white shadow-md rounded-[10px] p-5 mb-6 gap-4 font-[Poppins]">
          <div className="flex flex-col items-start w-full sm:w-auto">
            <span className="text-[20px] font-[500] text-[#292929]">Data Siswa</span>
            <span className="text-sm text-gray-500 mt-1">
              {activeFilter === "diterima" ? "Menampilkan data diterima" : activeFilter === "tertunda" ? "Menampilkan data tertunda" : "Menampilkan data disetujui"}
            </span>
          </div>

          <div className="flex flex-row justify-end items-center gap-5 w-full sm:w-auto">
            <div className="flex items-center bg-[#EAEAEA] rounded-[10px] px-3 py-2 w-full sm:w-[276px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
              <input type="text" placeholder="Cari siswa..." className="bg-transparent outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
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
              {filteredViewList.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="px-3 sm:px-4 py-2 font-mono text-green-600">{s.nisn}</td>
                  <td className="px-3 sm:px-4 py-2">{s.nama}</td>
                  <td className="px-3 sm:px-4 py-2 truncate max-w-[120px] sm:max-w-xs">{s.alamat}</td>
                  <td className="px-3 sm:px-4 py-2">{s.nik}</td>
                  <td className="px-3 sm:px-4 py-2">{s.kontak}</td>

                  <td className="px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 justify-center flex-wrap">
                    {activeFilter === "diterima" && (
                      <>
                        <button onClick={() => handleSetujuiClicked(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Setujui
                        </button>

                        <button onClick={() => handleTundaClicked(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-500 text-white text-xs sm:text-sm rounded-lg hover:bg-yellow-600 transition">
                          <Clock4 className="w-3 h-3 sm:w-4 sm:h-4" /> Tunda
                        </button>

                        <button onClick={() => { setSelectedStudent(s); handleDownloadPDF(s); }} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 text-xs sm:text-sm rounded-lg hover:bg-yellow-200 transition">
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => window.location.href = `/table-data/${s.id}`} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition">
                          <Eye className="w-4 h-4" />
                        </button>

                      </>
                    )}

                    {activeFilter === "tertunda" && (
                      <>
                        <button onClick={() => handleEditNoteTertunda(s)} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition">
                          Edit Note
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setShowTertundaConfirm(true);
                          }}
                          className={`flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition ${!s.note ? "opacity-60 cursor-not-allowed" : ""}`}
                          disabled={!s.note}
                        >
                          <Send className="w-4 h-4" /> Kirim Notifikasi
                        </button>
                      </>
                    )}

                    {activeFilter === "disetujui" && (
                      <>
                        <button onClick={() => handleDecisionOnDisetujui(s, "lolos")} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition">
                          Loloskan
                        </button>
                        <button onClick={() => handleDecisionOnDisetujui(s, "tidak")} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded-lg hover:bg-red-600 transition">
                          Tidak Loloskan
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {filteredViewList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ========================= MODALS ========================= */}

        {/* Warning: belum download */}
        {showWarningDownload && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button onClick={() => setShowWarningDownload(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <AlertCircle className="w-10 h-10 text-yellow-500 mb-3" />
                <h2 className="text-lg font-semibold text-[#132B6D] mb-2">Anda belum mendownload data!</h2>
                <p className="text-gray-600 text-sm mb-4">Silakan download dan baca terlebih dahulu file PDF data siswa sebelum melakukan verifikasi.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowWarningDownload(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Batal</button>
                  <button onClick={() => { handleDownloadPDF(selectedStudent); setShowWarningDownload(false); setShowConfirmRead(true); }} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                    <Download className="w-4 h-4" /> Download Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm after download: only ask "sudah membaca?" */}
        {showConfirmRead && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative text-center">
              <button onClick={() => setShowConfirmRead(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">Sudahkah Anda membaca data siswa ini?</h2>
              <p className="text-gray-600 text-sm mb-6">Pastikan Anda telah meninjau seluruh informasi pada file PDF sebelum menyetujui.</p>

              <div className="flex justify-center gap-3">
                <button onClick={() => setShowConfirmRead(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button onClick={confirmSetujui} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Ya, Sudah Baca</button>
              </div>
            </div>
          </div>
        )}

        {/* Note Modal (Tunda / Edit note) */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
              <button onClick={() => { setShowNoteModal(false); setSelectedStudent(null); setNoteInput(""); }} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">Tunda Data Siswa</h2>
              <p className="text-gray-600 text-sm mb-3">Tulis alasan atau catatan kenapa data ini ditunda:</p>

              <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Tuliskan catatan di sini..." className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4" rows={4} />

              <div className="flex justify-end gap-3">
                <button onClick={() => { setShowNoteModal(false); setSelectedStudent(null); setNoteInput(""); }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Batal</button>

                {selectedStudent && tertunda.some((t) => t.id === selectedStudent.id) ? (
                  <button onClick={saveEditedNoteTertunda} disabled={!noteInput.trim()} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${noteInput.trim() ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}>
                    Simpan Note
                  </button>
                ) : (
                  <button onClick={sendTundaWithNote} disabled={!noteInput.trim()} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${noteInput.trim() ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}>
                    <Send className="w-4 h-4" /> Kirim Notifikasi
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tertunda send confirmation */}
        {showTertundaConfirm && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative text-center">
              <button onClick={() => { setShowTertundaConfirm(false); setSelectedStudent(null); }} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">Kirim Notifikasi</h2>
              <p className="text-gray-600 text-sm mb-6">Apakah Anda ingin mengirim notifikasi ke <span className="font-semibold text-gray-800">{selectedStudent?.nama}</span> mengenai alasan penundaan?</p>

              <div className="flex justify-center gap-3">
                <button onClick={() => { setShowTertundaConfirm(false); setSelectedStudent(null); }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button onClick={() => { confirmSendNotifTunda(); setShowTertundaConfirm(false); }} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Kirim</button>
              </div>
            </div>
          </div>
        )}

        {/* Decision confirm (disetujui -> lolos/tidak) */}
        {showDecisionConfirm && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative text-center">
              <button onClick={() => setShowDecisionConfirm(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-[#132B6D] mb-4">{showDecisionConfirm.decision === "lolos" ? "Konfirmasi Loloskan" : "Konfirmasi Tidak Loloskan"}</h2>
              <p className="text-gray-600 text-sm mb-6">Apakah Anda yakin ingin menetapkan status <span className="font-semibold">{showDecisionConfirm.decision === "lolos" ? "LOLOS" : "TIDAK LOLOS"}</span> untuk <span className="font-semibold">{selectedStudent.nama}</span>?</p>

              <div className="flex justify-center gap-3">
                <button onClick={() => setShowDecisionConfirm(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button onClick={confirmDecision} className={`px-4 py-2 rounded-lg text-white ${showDecisionConfirm.decision === "lolos" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>{showDecisionConfirm.decision === "lolos" ? "Loloskan" : "Tidak Loloskan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End modals */}
      </div>
    </div>
  );
}
