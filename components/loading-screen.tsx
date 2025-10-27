"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const easeOutBack = (x: number): number => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsLoading(false)
            setTimeout(onComplete, 800)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete]) 

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800"
        >
          {/* 🔵 Animated Background Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
            />
          </div>

          <div className="relative z-10 text-center">
            {/* 🔵 Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: easeOutBack }}
              className="mb-8"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-blue-500 rounded-full"
                />
                <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src="/favicon-removebg-preview.png"
                    alt="SMK Logo"
                    className="w-18 h-18 inset-0 rounded-full object-cover mx-auto"
                  />
                </div>
              </div>
            </motion.div>

            {/* 🔵 School Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl font-bold text-white mb-2"
            >
              SMK TI BAZMA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-gray-300 text-lg mb-8"
            >
              Admin Dashboard - PPDB SMK TI Bazma 2026
            </motion.p>

            {/* 🔵 Progress Bar */}
            <div className="w-64 mx-auto">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Loading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* 🔵 Loading Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-6"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="text-cyan-400 text-sm"
              >
                Preparing your experience...
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
