"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Menu } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

interface Student {
  id: number;
  nisn: string;
  nama: string;
  alamat: string;
  nik: string;
  kontak: string;
  verified: boolean;
  status: string;
}

export default function StudentDetail() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("ppdb_diterima");
    if (!raw) return;

    const list: Student[] = JSON.parse(raw);
    const found = list.find((s) => s.id === Number(params.id));

    if (found) setStudent(found);
  }, [params.id]);

  if (!student) {
    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardLayout />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-4 transition-all duration-300">
          {/* 🔹 FIXED HEADER TITLE */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3">
            Dashboard / Table Data / Detail Data Siswa
          </h1>
        </div>

          <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <p className="text-gray-600 text-center">Memuat data siswa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardLayout />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-6 md:ml-4 transition-all duration-300">
        
        {/* Title */}
        <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 mb-4 flex items-center gap-3">

          {/* Hamburger Button (mobile only) */}
          <button
            onClick={() => document.dispatchEvent(new CustomEvent("toggle-sidebar"))}
            className="md:hidden bg-[#1E3A8A] text-white p-2 rounded-md shadow"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold py-3">Dashboard / Table Data / Detail Data Siswa</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Detail Data Siswa
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <DetailItem label="NISN" value={student.nisn} />
            <DetailItem label="Nama Lengkap" value={student.nama} />
            <DetailItem label="Alamat" value={student.alamat} />
            <DetailItem label="NIK" value={student.nik} />
            <DetailItem label="Kontak" value={student.kontak} />
            <DetailItem label="Status" value={student.status} />
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              © 2026 SMK TI Bazma — Sistem Informasi PPDB
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
      <p className="text-md font-semibold text-gray-800">{value}</p>
    </motion.div>
  );
}
