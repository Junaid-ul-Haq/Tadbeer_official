"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser, loginSuccess } from "@/redux/slices/authSlice";
import authService from "@/services/authService";
import InputField from "../../components/auth/Input";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authService.loginUser(formData);
      if (data?.token) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        
        // Admin goes directly to dashboard
        if (data.user.role === "admin") {
          router.push("/admin");
          return;
        }
        
        // For users, check profile and payment status
        if (!data.user.profileCompleted) {
          // Profile not completed, redirect to profile page
          router.push("/profile");
        } else if (!data.user.paymentVerified) {
          // Profile completed but payment not verified, redirect to payment page
          router.push("/payment");
        } else {
          // Everything complete, redirect to dashboard
          router.push("/user");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      // Handle payment pending error
      if (err.response?.data?.paymentPending) {
        setError("Payment verification pending. Please wait for admin approval.");
        router.push("/payment");
      } else {
        setError(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#111] text-white font-[var(--font-family)] relative overflow-hidden">
      {/* ✨ Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[var(--accent-color)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-[var(--primary-color)]/10 blur-[120px] rounded-full" />
      </div>

      {/* 🟢 Left Side (Visual Intro) */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-12 md:p-16 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-r border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <div className="mb-8">
            <Image
              src="/vedios/F logo.png"
              alt="Tadbeer Logo"
              width={200}
              height={100}
              className="mx-auto drop-shadow-[0_0_25px_rgba(24,186,214,0.5)]"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(143,194,65,0.4)]">
            Welcome Back
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-md">
            Sign in and continue your journey of compassion, empowerment, and
            hope with <span className="text-[var(--accent-color)] font-semibold">Tadbeer Foundation</span>.
          </p>
        </motion.div>
      </div>

      {/* 🔵 Right Side (Login Form) */}
      <div className="flex-1 flex items-center justify-center p-10 md:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg bg-[#0F0F0F]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.05)] p-10"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-[var(--accent-color)] drop-shadow-[0_0_8px_rgba(24,186,214,0.4)]">
            Sign In
          </h2>
          <p className="text-gray-400 mb-8 text-center">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border-white/10 focus:border-[var(--accent-color)]"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border-white/10 focus:border-[var(--accent-color)]"
            />

            {error && (
              <p className="text-red-500 text-center text-sm font-medium">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl font-semibold text-lg text-white 
              bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] 
              shadow-[0_0_15px_rgba(24,186,214,0.4)] hover:shadow-[0_0_25px_rgba(143,194,65,0.5)] 
              transition-all duration-300"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="text-[var(--accent-color)] font-semibold hover:underline hover:text-[var(--primary-color)] transition-colors"
              >
                Create one here
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
