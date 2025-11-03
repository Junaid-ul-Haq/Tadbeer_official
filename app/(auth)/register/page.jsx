"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "@/redux/slices/authSlice";
import InputField from "@/app/components/auth/Input";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cnicFront: null,
    cnicBack: null,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

    const result = await dispatch(signupUser(fd));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Account created successfully!");
      router.push("/profile");
    } else {
      toast.error(result.payload || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#111] text-white font-[var(--font-family)] relative overflow-hidden">
      {/* ✨ Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[var(--accent-color)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-[var(--primary-color)]/10 blur-[120px] rounded-full" />
      </div>

      {/* 🟢 Left Section */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-12 md:p-16 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-r border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center flex flex-col items-center"
        >
          <Image
            src="/vedios/Artboard 1 (2).png"
            alt="Tadbeer Logo"
            width={200}
            height={100}
            className="mx-auto drop-shadow-[0_0_25px_rgba(24,186,214,0.5)] mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(143,194,65,0.4)]">
            Join Tadbeer
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-md">
            Empowering lives with compassion, education, and opportunity.  
            Let’s start your journey together.
          </p>
        </motion.div>
      </div>

      {/* 🔵 Right Section (Signup Form) */}
      <div className="flex-1 flex items-center justify-center p-10 md:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg bg-[#0F0F0F]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.05)] p-10"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-[var(--accent-color)] drop-shadow-[0_0_8px_rgba(24,186,214,0.4)]">
            Create Account
          </h2>
          <p className="text-gray-400 mb-8 text-center">
            Fill in the details to begin your Tadbeer experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border-white/10 focus:border-[var(--accent-color)]"
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border-white/10 focus:border-[var(--accent-color)]"
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
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
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-[#1A1A1A] text-white border-white/10 focus:border-[var(--accent-color)]"
            />

            {/* 🪪 CNIC Upload Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FileInput
                label="CNIC Front"
                name="cnicFront"
                file={formData.cnicFront}
                onChange={handleFileChange}
              />
              <FileInput
                label="CNIC Back"
                name="cnicBack"
                file={formData.cnicBack}
                onChange={handleFileChange}
              />
            </div>

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
              {loading ? "Creating Account..." : "Next → Complete Profile"}
            </motion.button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already registered?{" "}
              <Link
                href="/login"
                className="text-[var(--accent-color)] font-semibold hover:underline hover:text-[var(--primary-color)] transition-colors"
              >
                Log In
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// 🪪 File Upload (Dark Theme)
function FileInput({ label, name, file, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative flex items-center justify-between bg-[#1A1A1A]/80 border border-white/10 rounded-lg px-3 py-3 cursor-pointer hover:border-[var(--accent-color)] transition-all">
        <input
          type="file"
          name={name}
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <span className="text-sm text-gray-400 truncate">
          {file ? file.name : `Choose ${label}`}
        </span>
        <span className="text-[var(--accent-color)] text-xs font-medium">
          Upload
        </span>
      </div>
    </div>
  );
}
