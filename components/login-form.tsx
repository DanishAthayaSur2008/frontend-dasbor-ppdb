"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Animate form inputs on mount
    gsap.fromTo(
      ".form-input",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Animate button loading state
    gsap.to(".login-button", { scale: 0.95, duration: 0.1 })

    // Mock authentication - replace with real auth
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("admin_logged_in", "true")
        localStorage.setItem("admin_username", username)

        // Success animation
        gsap.to(formRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            router.push("/dashboard")
          },
        })
      } else {
        setError("Username atau password salah")

        // Error animation
        if (errorRef.current) {
          gsap.fromTo(errorRef.current, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 })
        }

        // Shake animation for form
        gsap.to(formRef.current, {
          keyframes: { x: [-10, 10, -10, 10, 0] },
          duration: 0.5,
          ease: "power2.out",
        })
      }

      gsap.to(".login-button", { scale: 1, duration: 0.1 })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-semibold text-primary font-inter">Masuk ke Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div ref={errorRef} className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="form-input space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground font-poppins">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-11 border-border focus:border-primary font-poppins"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div className="form-input space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground font-poppins">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 border-border focus:border-primary font-poppins"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="login-button w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium font-poppins transition-all duration-200"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-poppins">
            Demo: username: <span className="font-medium">admin</span>, password:{" "}
            <span className="font-medium">admin123</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
