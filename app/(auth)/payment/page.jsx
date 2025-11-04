"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { paymentService } from "@/services/paymentService";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);

  const [amount, setAmount] = useState(null); // 2500 or 5000
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  // Check if user is logged in and profile completed
  useEffect(() => {
    if (!isLoggedIn || !token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!user?.profileCompleted) {
      toast.error("Please complete your profile first");
      router.push("/profile");
      return;
    }

    // Check existing payment status
    checkPaymentStatus();
  }, [isLoggedIn, token, user, router]);

  const checkPaymentStatus = async () => {
    setCheckingPayment(true);
    try {
      const result = await paymentService.getMyPayment(token);
      if (result.payment) {
        setPaymentStatus(result.payment.status);
        if (result.payment.status === "verified") {
          // Payment verified, redirect to dashboard
          toast.success("Payment verified! Redirecting to dashboard...");
          router.push("/user");
        }
      }
    } catch (err) {
      console.error("Error checking payment:", err);
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount) {
      setError("Please select an amount");
      return;
    }

    if (!screenshot) {
      setError("Please upload payment screenshot");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("screenshot", screenshot);

      await paymentService.createPayment(token, formData);
      toast.success("Payment submitted successfully! Please wait for admin verification.");
      setPaymentStatus("pending");
      setAmount(null);
      setScreenshot(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Failed to submit payment");
      toast.error(err.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  if (checkingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#111] text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
          <p className="mt-4 text-gray-400">Checking payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#111] text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-3xl bg-[#101010]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[var(--accent-color)] mb-2">
            Complete Payment
          </h2>
          <p className="text-gray-400">
            Please make payment and upload the screenshot for verification
          </p>
        </div>

        {/* Account Details Card */}
        <div className="bg-gradient-to-br from-[var(--primary-color)]/20 to-[var(--accent-color)]/20 border border-[var(--primary-color)]/30 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-[var(--primary-color)] mb-4">
            Payment Details
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>Account Name:</strong> SALEEMAH KHANUM WELFARE FOUNDATION (SKWF)</p>
            <p><strong>Account Number:</strong> PK48ABPA0010027253970016</p>
            <p><strong>Bank:</strong> Allied Bank</p>
            <p><strong>Branch:</strong> ABL-FAISAL TOWN 11-B, FAISAL TOWN, LAHORE</p>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus && (
          <div className={`p-4 rounded-lg mb-6 ${
            paymentStatus === "verified"
              ? "bg-green-500/20 border border-green-500/50"
              : paymentStatus === "rejected"
              ? "bg-red-500/20 border border-red-500/50"
              : "bg-yellow-500/20 border border-yellow-500/50"
          }`}>
            <p className={`font-semibold ${
              paymentStatus === "verified"
                ? "text-green-400"
                : paymentStatus === "rejected"
                ? "text-red-400"
                : "text-yellow-400"
            }`}>
              Payment Status: {paymentStatus.toUpperCase()}
            </p>
            {paymentStatus === "pending" && (
              <p className="text-sm text-gray-400 mt-2">
                Your payment is under review. Please wait for admin verification.
              </p>
            )}
            {paymentStatus === "rejected" && (
              <p className="text-sm text-gray-400 mt-2">
                Your payment was rejected. Please contact support or submit a new payment.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Payment Form */}
        {paymentStatus !== "verified" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Amount <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAmount(2500)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    amount === 2500
                      ? "border-[var(--primary-color)] bg-[var(--primary-color)]/20 text-[var(--primary-color)]"
                      : "border-white/10 hover:border-white/30 text-gray-300"
                  }`}
                >
                  <div className="text-2xl font-bold">PKR 2,500</div>
                </button>
                <button
                  type="button"
                  onClick={() => setAmount(5000)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    amount === 5000
                      ? "border-[var(--primary-color)] bg-[var(--primary-color)]/20 text-[var(--primary-color)]"
                      : "border-white/10 hover:border-white/30 text-gray-300"
                  }`}
                >
                  <div className="text-2xl font-bold">PKR 5,000</div>
                </button>
              </div>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Screenshot <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files[0])}
                className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--primary-color)]"
                required
              />
              {screenshot && (
                <p className="text-xs text-gray-400 mt-2">Selected: {screenshot.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload a screenshot of your payment transaction
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading || !amount || !screenshot}
              className="w-full py-3 rounded-xl font-semibold text-lg text-white 
                bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] 
                shadow-[0_0_25px_rgba(143,194,65,0.4)] hover:shadow-[0_0_35px_rgba(24,186,214,0.5)] 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Payment"}
            </motion.button>
          </form>
        )}

        {paymentStatus === "verified" && (
          <div className="text-center py-8">
            <p className="text-green-400 text-lg font-semibold mb-4">
              ✅ Payment Verified!
            </p>
            <button
              onClick={() => router.push("/user")}
              className="px-6 py-3 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

