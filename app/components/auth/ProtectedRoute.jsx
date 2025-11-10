"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hydrate } from "@/redux/slices/authSlice";
import { motion } from "framer-motion";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, user, isHydrated } = useSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  // ✅ Hydrate Redux state from localStorage when app loads
  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  // ✅ Authorization logic
  useEffect(() => {
    if (!isHydrated) return; // Wait for state hydration

    if (!isLoggedIn) {
      router.replace("/login"); // Not logged in → redirect to login
    } else if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user?.role)
    ) {
      router.replace("/unauthorized"); // Role not allowed → redirect
    } else if (
      // For user dashboard, check if payment is verified
      allowedRoles.includes("user") &&
      user?.role === "user" &&
      !user?.paymentVerified
    ) {
      // Payment not verified, redirect to payment page
      router.replace("/payment");
    } else {
      setChecked(true); // Access granted
    }
  }, [isHydrated, isLoggedIn, user, allowedRoles, router]);

  // ✅ Loading screen while verifying access
  if (!isHydrated || !checked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-green-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full mb-4"
        />
        <p className="text-gray-600 font-medium text-lg">
          Checking access...
        </p>
      </div>
    );
  }

  // ✅ Render protected content
  return <>{children}</>;
}
