"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface PPDBLogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function PPDBLogo({ size = "md", animated = true }: PPDBLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (animated && logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" },
      )
    }
  }, [animated])

  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-xl",
    lg: "w-20 h-20 text-2xl",
  }

  return (
    <div
      ref={logoRef}
      className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg`}
    >
      <div className="text-center">
        <div className="font-bold text-white font-serif leading-none">SMK</div>
        <div className="text-xs text-white/90 font-sans leading-none">TI</div>
      </div>
    </div>
  )
}
