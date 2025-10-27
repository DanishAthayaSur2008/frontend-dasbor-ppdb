"use client"

import type React from "react"
import { useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function AnimatedButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  type = "button",
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button || disabled) return

    // animasi klik GSAP
    gsap.fromTo(
      button,
      { scale: 1 },
      { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" }
    )

    console.log("✅ AnimatedButton clicked")
    onClick?.(e) // pastikan event diteruskan
  }

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      type={type}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
