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

  const [opportunities, setOpportunities] = useState([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAvailableOpportunities();
    }
  }, [token]);

  const fetchAvailableOpportunities = async () => {
    setOpportunitiesLoading(true);
    try {
      const result = await scholarshipService.getAllActiveOpportunities(token);
      setOpportunities(result.opportunities || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch opportunities");
      setOpportunities([]);
    } finally {
      setOpportunitiesLoading(false);
    }
  };

  const handleApplySuccess = () => {
    // Refresh overview data when application is submitted
    dispatch(fetchUserScholarships(token));
    fetchAvailableOpportunities();
  };

  return (
    <div className="p-6 font-[var(--font-family)] text-[var(--text-color)]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Available Scholarships</h1>
        <p className="text-gray-400 text-sm">
          View all your applications in the{" "}
          <a href="/user" className="text-[var(--primary-color)] hover:underline">
            Overview
          </a>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AvailableOpportunitiesTable
          opportunities={opportunities}
          loading={opportunitiesLoading}
          onApplySuccess={handleApplySuccess}
        />
      </motion.div>
    </div>
  );
}
