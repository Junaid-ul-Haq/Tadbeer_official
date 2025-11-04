"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthLayout({ children, title, tagline }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-[var(--font-family)]">
      {/* 🔹 Left Section — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full md:w-1/2 relative flex flex-col items-center justify-center 
                   bg-gradient-to-br from-[var(--primary-color)] via-[var(--accent-color)] to-[var(--secondary-color)] 
                   text-white p-10 md:p-16 overflow-hidden"
      >
        {/* Soft Glow Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        {/* Background Glow Shapes */}
        <div className="absolute -top-10 left-1/3 w-80 h-80 bg-white/10 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-color)]/20 blur-3xl rounded-full animate-pulse-slow" />

        {/* Logo & Title */}
        <div className="relative z-10 text-center">
          <div className="relative w-64 h-32 mx-auto mb-8">
            <Image
              src="/vedios/F logo.png"
              alt="Tadbeer Logo"
              fill
              className="object-contain drop-shadow-2xl animate-fadeIn"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-md mx-auto">
            {tagline}
          </p>
        </div>
      </motion.div>

      {/* 🔹 Right Section — Form Area */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 
                   bg-gradient-to-br from-white via-[#f9fafb] to-[#eef2f3] 
                   border-l border-gray-200 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle Accent Glow */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--accent-color)]/10 blur-3xl rounded-full" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-[var(--primary-color)]/10 blur-3xl rounded-full" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl rounded-2xl p-8 md:p-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
