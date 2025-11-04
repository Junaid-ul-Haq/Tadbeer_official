"use client";
import { motion } from "framer-motion";

export default function OpportunityTable({
  opportunities,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Loading opportunities...</div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No scholarship opportunities found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Degree</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Course</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Country</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Qualification</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp, idx) => (
            <motion.tr
              key={opp._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-3 px-4 text-sm text-gray-300">{opp.degreeLevel}</td>
              <td className="py-3 px-4 text-sm text-gray-300 font-medium">{opp.course}</td>
              <td className="py-3 px-4 text-sm text-gray-300">🇺🇳 {opp.country}</td>
              <td className="py-3 px-4 text-sm text-gray-400">
                {opp.qualificationType || "—"}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    opp.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {opp.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(opp)}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-600/30 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onToggleActive(opp)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      opp.isActive
                        ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                        : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                    }`}
                  >
                    {opp.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this opportunity?")) {
                        onDelete(opp._id);
                      }
                    }}
                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-600/30 transition-all"
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

