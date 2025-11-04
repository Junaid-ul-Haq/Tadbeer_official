"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { businessGrantService } from "@/services/businessGrantService";
import { toast } from "react-hot-toast";

export default function GrantOpportunityForm({ opportunity, onSuccess, onClose }) {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        city: opportunity.city || "",
        amount: opportunity.amount || "",
        description: opportunity.description || "",
      });
    }
  }, [opportunity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.city || !formData.amount) {
      toast.error("City and amount are required");
      return;
    }

    setLoading(true);
    try {
      if (opportunity) {
        // Update existing
        await businessGrantService.updateGrantOpportunity(token, opportunity._id, formData);
        toast.success("Grant opportunity updated successfully");
      } else {
        // Create new
        await businessGrantService.createGrantOpportunity(token, formData);
        toast.success("Grant opportunity created successfully");
      }
      onSuccess();
      onClose();
      setFormData({ city: "", amount: "", description: "" });
    } catch (err) {
      toast.error(err.message || "Failed to save opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
        {opportunity ? "Edit Grant Opportunity" : "Add Grant Opportunity"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Karachi, Lahore, Islamabad"
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (PKR) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g., 50000"
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description of the grant opportunity..."
            rows={4}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-600/30 text-white rounded-lg font-semibold hover:bg-gray-600/50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : opportunity ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

