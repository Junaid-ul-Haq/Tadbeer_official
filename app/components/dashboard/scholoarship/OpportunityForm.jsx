"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { scholarshipService } from "@/services/scholarshipService";
import { toast } from "react-hot-toast";

export default function OpportunityForm({ onSuccess, onClose, editingOpportunity = null }) {
  const token = useSelector((state) => state.auth.token);
  const [degreeLevels, setDegreeLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    degreeLevel: "",
    course: "",
    country: "",
    qualificationType: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchDegreeLevels();
    if (editingOpportunity) {
      setFormData({
        degreeLevel: editingOpportunity.degreeLevel || "",
        course: editingOpportunity.course || "",
        country: editingOpportunity.country || "",
        qualificationType: editingOpportunity.qualificationType || "",
        description: editingOpportunity.description || "",
        isActive: editingOpportunity.isActive !== undefined ? editingOpportunity.isActive : true,
      });
    }
  }, [editingOpportunity]);

  const fetchDegreeLevels = async () => {
    try {
      const levels = await scholarshipService.getDegreeLevels(token);
      setDegreeLevels(levels);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load degree levels");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingOpportunity) {
        await scholarshipService.updateOpportunity(token, editingOpportunity._id, formData);
        toast.success("Opportunity updated successfully!");
      } else {
        await scholarshipService.createOpportunity(token, formData);
        toast.success("Opportunity created successfully!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent mb-6">
        {editingOpportunity ? "Edit Scholarship Opportunity" : "Add Scholarship Opportunity"}
      </h2>

      {/* Degree Level */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Degree Level <span className="text-red-400">*</span>
        </label>
        <select
          name="degreeLevel"
          value={formData.degreeLevel}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
        >
          <option value="">Select Degree Level</option>
          {degreeLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Course */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Course/Field <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="e.g., Computer Science, Finance, Chemistry, Zoology"
          required
          className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Country <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="e.g., UK, USA, Canada, Australia"
          required
          className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
        />
      </div>

      {/* Qualification Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Qualification Type (Optional)
        </label>
        <input
          type="text"
          name="qualificationType"
          value={formData.qualificationType}
          onChange={handleChange}
          placeholder="e.g., BSc, MBA, MSc"
          className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details about this scholarship opportunity..."
          rows="3"
          className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] resize-none"
        />
      </div>

      {/* Active Status */}
      {editingOpportunity && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 rounded border-white/10 bg-[#1A1A1A] text-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-color)]"
          />
          <label className="text-sm font-medium text-gray-300">Active</label>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : editingOpportunity ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

