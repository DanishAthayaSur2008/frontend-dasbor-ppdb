"use client"

import type React from "react"
import { useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
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

  const handleClick = () => {
    const button = buttonRef.current
    if (!button || disabled) return

    // Click animation
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      onComplete: () => {
        if (onClick) onClick()
      },
    })
  }

  const handleMouseEnter = () => {
    const button = buttonRef.current
    if (!button || disabled) return

    gsap.to(button, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = () => {
    const button = buttonRef.current
    if (!button || disabled) return

    gsap.to(button, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    })
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Button>
  )
}
