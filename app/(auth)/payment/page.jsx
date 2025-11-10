"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { paymentService } from "@/services/paymentService";
import authService from "@/services/authService";
import { updateUserData } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function PaymentPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);

  const [amount, setAmount] = useState(2500); // Fixed at 2500 (discounted from 5000)
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const hasCheckedInitialStatus = useRef(false); // Track if we've checked payment status initially

  // Check if user is logged in and profile completed
  useEffect(() => {
    if (!isLoggedIn || !token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    // ✅ Admins should not access payment page - redirect to admin panel
    if (user?.role === "admin") {
      router.push("/admin");
      return;
    }

    if (!user?.profileCompleted) {
      toast.error("Please complete your profile first");
      router.push("/profile");
      return;
    }

    // Check existing payment status only once on mount (using ref to prevent re-running)
    if (!hasCheckedInitialStatus.current) {
      hasCheckedInitialStatus.current = true;
      checkPaymentStatus(false); // Don't auto-redirect on initial check
    }

    // Cleanup polling on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    };
    // Only depend on isLoggedIn and token, not user (to prevent refresh loop when user data updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token]); // Removed 'user' and 'router' from dependencies to prevent refresh loop

  const checkPaymentStatus = async (shouldRedirect = true) => {
    setCheckingPayment(true);
    try {
      const result = await paymentService.getMyPayment(token);
      if (result.payment) {
        const newStatus = result.payment.status;
        setPaymentStatus(newStatus);
        
        if (newStatus === "verified" && shouldRedirect && !hasShownSuccessToast) {
          // Mark that we've shown the success toast to prevent duplicates
          setHasShownSuccessToast(true);
          
          // Stop polling immediately
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          
          // Show success message only once (before any async operations)
          toast.success("Payment verified! Redirecting to dashboard...", {
            duration: 3000,
            id: "payment-verified", // Use ID to prevent duplicates
          });
          
          // Payment verified - refresh user data from backend
          try {
            const userData = await authService.getCurrentUser(token);
            if (userData.user) {
              // Update Redux store with fresh user data
              dispatch(updateUserData({ user: userData.user }));
              
              // Redirect immediately without delay to prevent refresh loop
              const dashboardPath = userData.user?.role === "admin" ? "/admin" : "/user";
              router.replace(dashboardPath); // Use replace to avoid back navigation issues
            } else {
              // Fallback redirect if no user data
              router.replace("/user");
            }
          } catch (refreshError) {
            // Silent error handling - no console logs
            // Still redirect even if refresh fails
            router.replace("/user");
          }
        } else if (newStatus === "pending" && !pollingInterval) {
          // Start polling every 30 seconds if payment is pending
          const interval = setInterval(() => {
            checkPaymentStatus(true);
          }, 30000); // Poll every 30 seconds
          setPollingInterval(interval);
        }
      }
    } catch (err) {
      // Silent error handling - no console logs in production
      if (process.env.NODE_ENV === "development") {
        // Only log in development
      }
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
      toast.success("Payment submitted successfully! Please wait for admin verification. You will receive an email once the admin reviews your payment.", {
        duration: 4000,
        id: "payment-submitted", // Use ID to prevent duplicates
      });
      setPaymentStatus("pending");
      setHasShownSuccessToast(false); // Reset for new payment
      setScreenshot(null);
      e.target.reset();
      
      // Start polling after submission
      if (!pollingInterval) {
        const interval = setInterval(() => {
          checkPaymentStatus(true);
        }, 30000);
        setPollingInterval(interval);
      }
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
              <div className="text-sm text-gray-400 mt-2">
                <p>Your payment is under review. Please wait for admin verification.</p>
                <p className="mt-2 font-semibold text-yellow-400">
                  ⏳ You will receive an email notification once your payment is verified or rejected.
                </p>
                <button
                  onClick={() => checkPaymentStatus(true)} // Still redirect if verified, but toast is prevented by hasShownSuccessToast flag
                  disabled={checkingPayment}
                  className="mt-3 px-4 py-2 bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50 text-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-color)]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {checkingPayment ? "Checking..." : "🔄 Refresh Status"}
                </button>
              </div>
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
            {/* Payment Amount Display */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Amount <span className="text-red-400">*</span>
              </label>
              <div className="bg-gradient-to-br from-[var(--primary-color)]/20 to-[var(--accent-color)]/20 border-2 border-[var(--primary-color)]/30 rounded-xl p-6 text-center relative">
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  DISCOUNT
                </div>
                <div className="text-xl text-gray-400 line-through mb-2">
                  PKR 5,000
                </div>
                <div className="text-4xl font-bold text-[var(--primary-color)] mb-2">
                  PKR 2,500
                </div>
                <div className="text-sm text-green-400 font-medium">
                  Save PKR 2,500
                </div>
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
            <p className="text-gray-400 text-sm mb-4">
              You should have received an email confirmation. You can now access your dashboard.
            </p>
            <button
              onClick={async () => {
                try {
                  // Refresh user data before navigating
                  const userData = await authService.getCurrentUser(token);
                  if (userData.user) {
                    dispatch(updateUserData({ user: userData.user }));
                  }
                } catch (err) {
                  // Silent error handling
                }
                // Navigate to dashboard
                const dashboardPath = user?.role === "admin" ? "/admin" : "/user";
                router.replace(dashboardPath);
              }}
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

