'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (isLoggedIn !== 'true') {
      router.push('/')
      return
    }
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

  // Dummy data untuk grafik
  const chartData = [
    { name: 'Feb', jumlah: 20 },
    { name: 'Mar', jumlah: 25 },
    { name: 'Apr', jumlah: 30 },
    { name: 'May', jumlah: 40 },
    { name: 'Jun', jumlah: 50 },
    { name: 'Jul', jumlah: 55 },
    { name: 'Aug', jumlah: 60 },
    { name: 'Sep', jumlah: 65 },
    { name: 'Oct', jumlah: 70 },
    { name: 'Nov', jumlah: 75 },
    { name: 'Dec', jumlah: 80 },
    { name: 'Jan', jumlah: 90 },
  ]

  const dataPertahun = [
    { tahun: 2025, jumlah: 100 },
    { tahun: 2024, jumlah: 100 },
    { tahun: 2021, jumlah: 100 },
    { tahun: 2020, jumlah: 100 },
  ]

  return (
    <div className="flex">
      {/* Sidebar */}
      <DashboardLayout />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Breadcrumb */}
        <h2 className="text-xl font-bold font-inter mb-6">
          Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-2xl font-bold text-blue-600">150 Pendaftar</p>
            <p className="text-gray-500">Jumlah Pendaftar</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-2xl font-bold text-yellow-600">126 Tidak Terverif</p>
            <p className="text-gray-500">Jumlah Tidak Terverifikasi</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-2xl font-bold text-green-600">24 Terverifikasi</p>
            <p className="text-gray-500">Jumlah Verifikasi</p>
          </div>
        </div>

        {/* Chart + Data */}
        <div className="grid grid-cols-3 gap-6">
          {/* Chart */}
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
