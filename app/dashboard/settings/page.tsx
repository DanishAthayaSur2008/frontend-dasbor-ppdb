"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCard } from "@/components/animated-card"
import { Eye, EyeOff, User, Lock, Save, ArrowLeft } from "lucide-react"
import LogoAdmin from "@/public/logo-admin.png"

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    currentUsername: "admin@ppdb.com",
    newUsername: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    }

    gsap.fromTo(
      ".settings-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" },
    )
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveUsername = async () => {
    if (!formData.newUsername.trim()) {
      alert("Please enter a new username")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update local storage and form
    localStorage.setItem("admin_username", formData.newUsername)
    setFormData((prev) => ({
      ...prev,
      currentUsername: formData.newUsername,
      newUsername: "",
    }))

    setIsLoading(false)
    alert("Username updated successfully!")
  }

  const handleSavePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Please fill in all password fields")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    if (formData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Clear password fields
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))

    setIsLoading(false)
    alert("Password updated successfully!")
  }

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-[#1E3A8A] font-inter">Settings and Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Username Settings */}
        <AnimatedCard className="settings-card border-0 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-[#1E3A8A] font-inter">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-[#1E3A8A]" />
              </div>
              <span>Update Username</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentUsername" className="text-sm font-medium text-gray-700 font-poppins">
                Current Username
              </Label>
              <Input
                id="currentUsername"
                value={formData.currentUsername}
                disabled
                className="bg-gray-50 font-poppins"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newUsername" className="text-sm font-medium text-gray-700 font-poppins">
                New Username
              </Label>
              <Input
                id="newUsername"
                type="email"
                placeholder="Enter new username/email"
                value={formData.newUsername}
                onChange={(e) => handleInputChange("newUsername", e.target.value)}
                className="font-poppins"
              />
            </div>

            <Button
              onClick={handleSaveUsername}
              disabled={isLoading || !formData.newUsername.trim()}
              className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-poppins rounded-lg py-2"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Username"}
            </Button>
          </CardContent>
        </AnimatedCard>

        {/* Password Settings */}
        <AnimatedCard className="settings-card border-0 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-[#1E3A8A] font-inter">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="h-5 w-5 text-[#1E3A8A]" />
              </div>
              <span>Update Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 font-poppins">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  className="pr-10 font-poppins"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 font-poppins">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  className="pr-10 font-poppins"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 font-poppins">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pr-10 font-poppins"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSavePassword}
              disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-poppins rounded-lg py-2"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Password"}
            </Button>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Profile Information Card */}
      <AnimatedCard className="settings-card border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1E3A8A] font-inter">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
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
              <h3 className="text-lg font-semibold font-inter text-gray-900">Admin</h3>
              <p className="text-sm text-gray-600 font-poppins">{formData.currentUsername}</p>
              <p className="text-xs text-gray-500 font-poppins">Administrator - SMK TI BAZMA</p>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
