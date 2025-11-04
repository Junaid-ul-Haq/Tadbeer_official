"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ApplyScholarshipForm from "./ApplyScholarshipForm";
import Modal from "./Modal";

export default function AvailableOpportunitiesTable({ opportunities, loading, onApplySuccess }) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleApply = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowApplyForm(true);
  };

  const handleApplySuccess = () => {
    setShowApplyForm(false);
    setSelectedOpportunity(null);
    if (onApplySuccess) onApplySuccess();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
        <p className="mt-4 text-gray-400">Loading opportunities...</p>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1A1A1A]/40 rounded-lg border border-white/10">
        <p className="text-gray-400 text-lg">No scholarship opportunities available at the moment.</p>
        <p className="text-gray-500 text-sm mt-2">Check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1A1A1A]/60 border-b border-white/10">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Degree Level</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Course</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Country</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Qualification Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opportunity, index) => (
              <motion.tr
                key={opportunity._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-[#1A1A1A]/40 transition-colors"
              >
                <td className="px-4 py-4 text-gray-300">{opportunity.degreeLevel}</td>
                <td className="px-4 py-4 text-gray-300">{opportunity.course}</td>
                <td className="px-4 py-4 text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    🌍 {opportunity.country}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-400 text-sm">
                  {opportunity.qualificationType || "N/A"}
                </td>
                <td className="px-4 py-4 text-gray-400 text-sm max-w-xs truncate">
                  {opportunity.description || "No description"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {opportunity.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleApply(opportunity)}
                    disabled={!opportunity.isActive}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      opportunity.isActive
                        ? "bg-[var(--primary-color)] text-black hover:opacity-90"
                        : "bg-gray-600/30 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Apply
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Form Modal */}
      <Modal show={showApplyForm} onClose={() => setShowApplyForm(false)}>
        {selectedOpportunity && (
          <ApplyScholarshipForm
            opportunity={selectedOpportunity}
            onSuccess={handleApplySuccess}
          />
        )}
      </Modal>
    </>
  );
}

