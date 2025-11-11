"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AvailableOpportunitiesTable from "@/app/components/dashboard/scholoarship/AvailableOpportunitiesTable";
import { scholarshipService } from "@/services/scholarshipService";
import { fetchUserScholarships } from "@/redux/slices/scholarshipSlice";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [recommendedOpportunities, setRecommendedOpportunities] = useState([]);
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [allOpportunitiesLoading, setAllOpportunitiesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("recommended"); // "recommended" or "all"

  useEffect(() => {
    if (token) {
      fetchRecommendedOpportunities();
      fetchAllOpportunities();
    }
  }, [token]);

  const fetchRecommendedOpportunities = async () => {
    setRecommendedLoading(true);
    try {
      const result = await scholarshipService.getMyOpportunities(token);
      setRecommendedOpportunities(result.opportunities || []);
    } catch (err) {
      // If no recommendations found, show message but don't error
      if (err.message && err.message.includes("profile")) {
        setRecommendedOpportunities([]);
      } else {
        toast.error(err.message || "Failed to fetch recommended opportunities");
        setRecommendedOpportunities([]);
      }
    } finally {
      setRecommendedLoading(false);
    }
  };

  const fetchAllOpportunities = async () => {
    setAllOpportunitiesLoading(true);
    try {
      const result = await scholarshipService.getAllActiveOpportunities(token);
      setAllOpportunities(result.opportunities || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch opportunities");
      setAllOpportunities([]);
    } finally {
      setAllOpportunitiesLoading(false);
    }
  };

  const handleApplySuccess = () => {
    // Refresh overview data when application is submitted
    dispatch(fetchUserScholarships(token));
    fetchRecommendedOpportunities();
    fetchAllOpportunities();
  };

  return (
    <div className="p-6 font-[var(--font-family)] text-[var(--text-color)]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Available Education and Guidance</h1>
        <p className="text-gray-400 text-sm">
          View all your applications in the{" "}
          <a href="/user" className="text-[var(--primary-color)] hover:underline">
            Overview
          </a>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab("recommended")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "recommended"
              ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Recommended for You
          {recommendedOpportunities.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[var(--primary-color)]/20 text-[var(--primary-color)] rounded-full text-xs">
              {recommendedOpportunities.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "all"
              ? "border-b-2 border-[var(--primary-color)] text-[var(--primary-color)]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          All Available Education and Guidance
          {allOpportunities.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full text-xs">
              {allOpportunities.length}
            </span>
          )}
        </button>
      </div>

      {/* Recommended Education and Guidance Tab */}
      {activeTab === "recommended" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {recommendedLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
              <p className="mt-4 text-gray-400">Loading recommended scholarships...</p>
            </div>
          ) : recommendedOpportunities.length > 0 ? (
            <>
              <div className="mb-4 p-4 bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-[var(--primary-color)]">✨ Recommended for You:</span>{" "}
                  Based on your profile, we've found scholarships matching your degree and course.
                </p>
              </div>
              <AvailableOpportunitiesTable
                opportunities={recommendedOpportunities}
                loading={recommendedLoading}
                onApplySuccess={handleApplySuccess}
              />
            </>
          ) : (
            <div className="text-center py-12 bg-[#1A1A1A]/50 rounded-lg border border-white/10">
              <p className="text-gray-400 mb-4">No recommended scholarships found based on your profile.</p>
              <p className="text-sm text-gray-500 mb-6">
                Make sure your profile includes your education details, or check all available scholarships.
              </p>
              <button
                onClick={() => setActiveTab("all")}
                className="px-6 py-2 bg-[var(--primary-color)] text-black rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                View All Education and Guidance
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* All Education and Guidance Tab */}
      {activeTab === "all" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AvailableOpportunitiesTable
            opportunities={allOpportunities}
            loading={allOpportunitiesLoading}
            onApplySuccess={handleApplySuccess}
          />
        </motion.div>
      )}
    </div>
  );
}
