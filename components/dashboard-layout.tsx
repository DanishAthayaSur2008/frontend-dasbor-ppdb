"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Table, Settings, GraduationCap, Menu, X } from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { SMKLogo } from "@/components/smk-logo"

const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: Home, url: "/dashboard" },
  { id: "table-data", name: "Table data", icon: Table, url: "/table-data" },
  { id: "data-siswa", name: "Data Siswa", icon: GraduationCap, url: "/data-siswa" },
  { id: "settings", name: "Settings and profile", icon: Settings, url: "/dashboard/settings" },
]

export function DashboardLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in")
    localStorage.removeItem("admin_username")
    router.push("/")
  }

  return (
    <>
      {/* Toggle button (muncul di mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#1E3A8A] text-white p-2 rounded-md shadow-lg focus:outline-none"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        w-72 bg-[#1E3A8A] text-white flex flex-col rounded-r-3xl md:rounded-r-3xl`}
      >
        {/* Admin Profile */}
        <div className="p-8 pb-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold font-inter">M</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-inter text-white">Admin</h3>
              <p className="text-sm text-blue-200 font-poppins">admin@ppdb.com</p>
            </div>
          </div>
          <div className="w-full h-px bg-blue-600/30"></div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-6 space-y-5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link key={item.id} href={item.url} onClick={() => setSidebarOpen(false)}>
                <AnimatedButton
                  variant="ghost"
                  className={`w-full justify-start text-left font-poppins py-4 px-6 transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[#1E3A8A] rounded-full shadow-md"
                      : "text-white hover:bg-white/10 rounded-full"
                  }`}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {item.name}
                </AnimatedButton>
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 pt-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <SMKLogo warna="#ffffffff" className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-inter text-white">SMK TI BAZMA</h4>
              <p className="text-xs text-blue-200 font-poppins">Islamic Boarding School</p>
            </div>
          </div>

          <div className="sidebar-item">
            <AnimatedButton
              variant="ghost"
              className="w-full justify-center bg-white text-[#1E3A8A] hover:bg-gray-100 font-poppins rounded-2xl py-3 font-medium shadow-md"
              onClick={handleLogout}
            >
              Logout
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Overlay (klik di luar sidebar untuk menutup, hanya di mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </>
  )
}
