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

    const months = [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
    ]
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
      {/* Sidebar */}
      <DashboardLayout />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 bg-gray-50 overflow-x-hidden">
        <h2 className="text-xl font-bold font-inter mb-6">Dashboard</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-2xl font-bold text-blue-600">{summary.total} Pendaftar</p>
            <p className="text-gray-500">Jumlah Pendaftar</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-2xl font-bold text-yellow-600">{summary.unverified} Tidak Terverif</p>
            <p className="text-gray-500">Jumlah Tidak Terverifikasi</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-2xl font-bold text-green-600">{summary.verified} Terverifikasi</p>
            <p className="text-gray-500">Jumlah Verifikasi</p>
          </div>
        </div>

        {/* Chart + Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h3 className="font-bold">Jumlah Pendaftar</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm">
                  12 Months
                </button>
                <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">6 Months</button>
                <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">30 Days</button>
                <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">7 Days</button>
              </div>
            </div>

            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
          </div>

          {/* Data Pertahun */}
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
