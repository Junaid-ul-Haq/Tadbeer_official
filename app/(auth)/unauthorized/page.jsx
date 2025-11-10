"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldX } from "lucide-react";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color-dark)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

