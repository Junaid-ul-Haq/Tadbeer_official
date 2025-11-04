"use client";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function GrantOpportunityTable({
  opportunities,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) {
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
        <p className="text-gray-400 text-lg">No grant opportunities found.</p>
        <p className="text-gray-500 text-sm mt-2">Click "Add Grant Opportunity" to create one.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1A1A1A]/60 border-b border-white/10">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">City</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount (PKR)</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Created</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp, index) => (
            <motion.tr
              key={opp._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-white/5 hover:bg-[#1A1A1A]/40 transition-colors"
            >
              <td className="px-4 py-4 text-gray-300 font-medium">{opp.city}</td>
              <td className="px-4 py-4 text-gray-300">
                <span className="font-semibold text-[var(--primary-color)]">
                  {new Intl.NumberFormat("en-PK", {
                    style: "currency",
                    currency: "PKR",
                  }).format(opp.amount)}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-400 text-sm max-w-xs truncate">
                {opp.description || "No description"}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    opp.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {opp.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-400 text-sm">
                {new Date(opp.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onToggleActive(opp)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      opp.isActive
                        ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    }`}
                  >
                    {opp.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => onEdit(opp)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/30 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this opportunity?")) {
                        onDelete(opp._id);
                      }
                    }}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

