"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Table, Settings, GraduationCap } from "lucide-react"
import { AnimatedButton } from "@/components/animated-button"
import { SMKLogo } from "@/components/smk-logo"
import Image from "next/image"
import LogoAdmin from "@/public/logo-admin.png" // ganti dengan logo admin kamu

const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: Home, url: "/dashboard" },
  { id: "table-data", name: "Table data", icon: Table, url: "/table-data" },
  { id: "data-siswa", name: "Data Siswa", icon: GraduationCap, url: "/data-siswa" },
  { id: "settings", name: "Settings and profile", icon: Settings, url: "/dashboard/settings" },
]

export function DashboardLayout() {
  const router = useRouter()
  const pathname = usePathname() // 👈 ini penting

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in")
    localStorage.removeItem("admin_username")
    router.push("/")
  }

  return (
    
  
      <div className="w-70 bg-[#1E3A8A] text-white flex flex-col rounded-r-3xl">
        {/* Admin Profile */}
        <div className="p-8 pb-6">
          <div className="flex items-center space-x-4 mb-8">
           <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundImage: `url(${LogoAdmin.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            </div>
            <div>
              <h3 className="text-lg font-semibold font-inter text-white">Admin</h3>
              <p className="text-sm text-blue-200 font-poppins">admin@ppdb.com</p>
            </div>
          </div>
          <div className="w-full h-px bg-blue-600/30"></div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-6 space-y-5">
          {menuItems.map((item) => {
            const isActive = pathname === item.url // 👈 cek langsung dari URL
            return (
              <Link key={item.id} href={item.url} className="block">
                <AnimatedButton
                  variant="ghost"
                  className={`w-full justify-start text-left font-poppins py-4 px-6 transition-all duration-300 ${isActive
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
  )
}