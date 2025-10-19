"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Cek apakah user sudah login
    const isLoggedIn = localStorage.getItem("admin_logged_in")
    if (isLoggedIn === "true") {
      router.push("/dashboard")
      return
    }

    const tl = gsap.timeline()

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" })
      .fromTo(
        titleRef.current,
        { y: -50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6",
      )
      .fromTo(formRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E2B61] to-[#142B6D] p-6">

      {/* Login Form */}
      <div ref={formRef} className="w-full max-w-5xl">
        <LoginForm />
      </div>

      {/* Footer */}
      <div className="text-center mt-10">
        <p className="text-xs text-white/70 font-poppins">
          © 2026 SMK TI Bazma. Semua hak dilindungi.
        </p>
      </div>
    </div>
  )
}
