"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Home, Table, CheckCircle, Shield, Settings, GraduationCap } from "lucide-react"
import { SectionView } from "@/components/section-view"
import { AnimatedButton } from "@/components/animated-button"
import { SMKLogo } from "@/components/smk-logo"

const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: Home },
  { id: "table-data", name: "Table data", icon: Table },
  { id: "data-verifikasi", name: "Data Siswa", icon: GraduationCap },
  { id: "settings", name: "Settings and profile", icon: Settings },
]

export function DashboardLayout() {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const contentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in")
    localStorage.removeItem("admin_username")
    router.push("/")
  }

  const handleMenuClick = (menuId: string) => {
    if (activeMenu === menuId) return
    setActiveMenu(menuId)

    // animasi transisi content (optional)
    const tl = gsap.timeline()
    tl.to(contentRef.current, { opacity: 0, y: 20, duration: 0.2, ease: "power2.in" })
      .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })
  }

  return (
    <div className="dashboard-container min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#1E3A8A] text-white flex flex-col rounded-r-3xl">
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
        <div className="flex-1 px-6 space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className={`sidebar-item menu-${item.id}`}>
              <AnimatedButton
                variant="ghost"
                className={`w-full justify-start text-left font-poppins rounded-2xl py-4 px-6 transition-all duration-300 ${activeMenu === item.id
                    ? "bg-white text-[#1E3A8A] shadow-lg transform scale-105"
                    : "text-white hover:bg-blue-700/50"
                  }`}
                onClick={() => handleMenuClick(item.id)}
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.name}
              </AnimatedButton>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <SMKLogo className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-inter text-[#4DA9FF]">SMK TI BAZMA</h4>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main ref={contentRef} className="flex-1 p-8">
          <SectionView sectionId={activeMenu} />
        </main>
      </div>
    </div>
  )
}
