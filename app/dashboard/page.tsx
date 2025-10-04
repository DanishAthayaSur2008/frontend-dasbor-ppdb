"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import bgBlue from "@/public/blue-header.png" // background header biru
import folderBg from "@/public/bg-card-ddashboard.png" // background di dalam card
import Image from "next/image"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [chartData, setChartData] = useState<any[]>([])
  const [dataPertahun, setDataPertahun] = useState<any[]>([])
  const [summary, setSummary] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/")
      return
    }

    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]
    const chart = months.map((m) => ({
      name: m,
      jumlah: Math.floor(Math.random() * 100) + 10,
    }))
    setChartData(chart)

    const years = [2025, 2024, 2023, 2022, 2021]
    const perTahun = years.map((y) => ({
      tahun: y,
      jumlah: Math.floor(Math.random() * 100) + 1,
    }))
    setDataPertahun(perTahun)

    const total = perTahun.reduce((a, b) => a + b.jumlah, 0)
    const verified = Math.floor(total * 0.3)
    const unverified = total - verified
    setSummary({ total, verified, unverified })
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-poppins">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardLayout />

      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-6">Dashboard</h1>
        {/* ====== HEADER BLUE SECTION ====== */}
        <div className="relative h-[157px] rounded-[10px] overflow-visible mb-[100px]">
          {/* Background image full cover */}
          <Image
            src={bgBlue} // ganti dengan gambar header kamu
            alt="Background Header"
            fill
            className="object-cover w-full h-full rounded-[10px]"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-[10px]" />

          {/* ====== CARD SECTION ====== */}
          <div className="absolute left-[33px] -bottom-[45px] flex gap-3">
            {/* Card Total */}
            <div
              className="relative w-[369px] h-[140px] rounded-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col justify-center px-6 bg-white"
              style={{
                backgroundImage: `url(${folderBg.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-[#132B6D] text-[24px] font-semibold leading-[29px]">
                {summary.total} Pendaftar
              </h3>
              <p className="text-[16px] text-black/50">Jumlah Pendaftar</p>
            </div>

            {/* Card Tidak Terverif */}
            <div
              className="relative w-[369px] h-[140px] rounded-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col justify-center px-6 bg-white"
              style={{
                backgroundImage: `url(${folderBg.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-[#132B6D] text-[24px] font-semibold leading-[29px]">
                {summary.unverified} Tidak Terverif
              </h3>
              <p className="text-[16px] text-black/50">Jumlah Tidak Terverifikasi</p>
            </div>

            {/* Card Terverif */}
            <div
              className="relative w-[369px] h-[140px] rounded-[20px] shadow-[0_2px_4px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col justify-center px-6 bg-white"
              style={{
                backgroundImage: `url(${folderBg.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h3 className="text-[#132B6D] text-[24px] font-semibold leading-[29px]">
                {summary.verified} Terverifikasi
              </h3>
              <p className="text-[16px] text-black/50">Jumlah Verifikasi</p>
            </div>
          </div>
        </div>
        {/* ====== END OF HEADER BLUE SECTION ====== */}


        {/* CHART + DATA PER TAHUN */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Jumlah Pendaftar</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm">
                  12 Months
                </button>
                <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">6 Months</button>
                <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">30 Days</button>
                <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">7 Days</button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="jumlah"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-bold mb-4">Data Pertahun</h3>
            <div className="space-y-4">
              {dataPertahun.map((item) => (
                <div key={item.tahun}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{item.tahun}</span>
                    <span>{item.jumlah} Peserta</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.jumlah}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
