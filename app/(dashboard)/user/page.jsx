"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchUserScholarships } from "@/redux/slices/scholarshipSlice";
import { getMyGrants } from "@/redux/slices/businessGrantSlice";
import { fetchUserConsultations } from "@/redux/slices/consultationSlice";
import Link from "next/link";

export default function UserHome() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { userScholarships, loading: scholarshipsLoading } = useSelector((state) => state.scholarship);
  const { myGrants, loading: grantsLoading } = useSelector((state) => state.businessGrant);
  const { userConsultations, loading: consultationsLoading } = useSelector((state) => state.consultation);
  
  const creditHours = user?.creditHours ?? user?.chancesLeft ?? 0;

  useEffect(() => {
    if (token) {
      dispatch(fetchUserScholarships(token));
      dispatch(getMyGrants(token));
      dispatch(fetchUserConsultations(token));
    }
  }, [token, dispatch]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        dispatch(fetchUserScholarships(token));
        dispatch(getMyGrants(token));
        dispatch(fetchUserConsultations(token));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token, dispatch]);

  const totalApplications = 
    (userScholarships?.length || 0) + 
    (myGrants?.length || 0) + 
    (userConsultations?.length || 0);

  return (
    <div className="p-6 font-[var(--font-family)] text-[var(--text-color)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-2">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-400">
          Overview of all your applications
        </p>
      </motion.div>

      {/* Credit Hours Alert */}
      {creditHours === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-1">No Credit Hours Remaining</h3>
              <p className="text-gray-300">You need to make a payment to get 3 credit hours for applications.</p>
            </div>
            <Link
              href="/payment"
              className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--accent-color)] transition"
            >
              Make Payment
            </Link>
          </div>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[var(--primary-color)]/20 to-[var(--accent-color)]/20 p-6 rounded-xl border border-[var(--primary-color)]/30"
        >
          <h3 className="text-3xl font-bold text-[var(--primary-color)] mb-2">
            {totalApplications}
          </h3>
          <p className="text-gray-300">Total Applications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A1A1A]/60 p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-3xl font-bold text-blue-400 mb-2">
            {userScholarships?.length || 0}
          </h3>
          <p className="text-gray-300">Educational Counseling</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A1A1A]/60 p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-3xl font-bold text-green-400 mb-2">
            {myGrants?.length || 0}
          </h3>
          <p className="text-gray-300">Entrepreneur Incubation</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A1A1A]/60 p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-3xl font-bold text-purple-400 mb-2">
            {userConsultations?.length || 0}
          </h3>
          <p className="text-gray-300">Career Counseling</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--primary-color)]/20 p-6 rounded-xl border border-[var(--accent-color)]/30"
        >
          <h3 className="text-3xl font-bold text-[var(--accent-color)] mb-2">
            {creditHours}
          </h3>
          <p className="text-gray-300">Credit Hours</p>
          <p className="text-xs text-gray-400 mt-1">For Entrepreneur Incubation & Educational Counseling</p>
        </motion.div>
      </div>

      {/* Applications Overview */}
      <div className="space-y-6">
        {/* Scholarships Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A1A1A]/60 rounded-xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-400">Educational Counseling Applications</h2>
            <Link
              href="/user/scholarships"
              className="text-sm text-[var(--primary-color)] hover:underline"
            >
              View All →
            </Link>
          </div>
          {scholarshipsLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : userScholarships?.length === 0 ? (
            <p className="text-gray-400">No educational counseling applications yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Degree Level</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Course</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {userScholarships.slice(0, 5).map((s) => (
                    <tr key={s._id} className="border-b border-white/5 hover:bg-[#0F0F0F]/40">
                      <td className="px-4 py-3 text-gray-300">{s.degreeLevel}</td>
                      <td className="px-4 py-3 text-gray-300">{s.course}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {userScholarships.length > 5 && (
                <p className="text-sm text-gray-400 mt-2 text-center">
                  +{userScholarships.length - 5} more applications
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Grants Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A1A1A]/60 rounded-xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-400">Entrepreneur Incubation Applications</h2>
            <Link
              href="/user/grants"
              className="text-sm text-[var(--primary-color)] hover:underline"
            >
              View All →
            </Link>
          </div>
          {grantsLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : myGrants?.length === 0 ? (
            <p className="text-gray-400">No entrepreneur incubation applications yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Business Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {myGrants.slice(0, 5).map((g) => (
                    <tr key={g._id} className="border-b border-white/5 hover:bg-[#0F0F0F]/40">
                      <td className="px-4 py-3 text-gray-300">{g.title}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">
                        {g.description || "No description"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(g.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {myGrants.length > 5 && (
                <p className="text-sm text-gray-400 mt-2 text-center">
                  +{myGrants.length - 5} more applications
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Consultations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1A1A1A]/60 rounded-xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-400">Career Counseling Requests</h2>
            <Link
              href="/user/consultation"
              className="text-sm text-[var(--primary-color)] hover:underline"
            >
              View All →
            </Link>
          </div>
          {consultationsLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : userConsultations?.length === 0 ? (
            <p className="text-gray-400">No career counseling requests yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Message</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {userConsultations.slice(0, 5).map((c) => (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-[#0F0F0F]/40">
                      <td className="px-4 py-3 text-gray-300">{c.category}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm max-w-xs truncate">
                        {c.message || "No message"}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {userConsultations.length > 5 && (
                <p className="text-sm text-gray-400 mt-2 text-center">
                  +{userConsultations.length - 5} more requests
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
