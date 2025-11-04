"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { businessGrantService } from "@/services/businessGrantService";
import { toast } from "react-hot-toast";

export default function ApplyGrantForm({ opportunity, onSuccess }) {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form states
  const [businessTitle, setBusinessTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposal, setProposal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    if (!businessTitle.trim()) {
      setError("Business title is required");
      return;
    }

    if (!description.trim()) {
      setError("Business description is required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add opportunity details
      formData.append("title", businessTitle);
      formData.append("description", description);
      formData.append("opportunityId", opportunity._id);

      // Add proposal file if provided
      if (proposal) {
        formData.append("proposal", proposal);
      }

      await businessGrantService.applyForGrant(token, formData);
      toast.success("Grant application submitted successfully!");
      onSuccess();
      
      // Reset form
      setBusinessTitle("");
      setDescription("");
      setProposal(null);
    } catch (err) {
      setError(err.message || "Failed to submit application");
      toast.error(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
        Apply for Business Grant
      </h2>

      {/* Opportunity Info */}
      <div className="p-4 bg-[#1A1A1A]/60 border border-[var(--accent-color)]/30 rounded-lg">
        <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-2">
          Grant Opportunity
        </h3>
        <div className="space-y-1 text-sm text-gray-300">
          <p><span className="font-medium">City:</span> {opportunity.city}</p>
          <p>
            <span className="font-medium">Amount:</span>{" "}
            {new Intl.NumberFormat("en-PK", {
              style: "currency",
              currency: "PKR",
            }).format(opportunity.amount)}
          </p>
          {opportunity.description && (
            <p><span className="font-medium">Description:</span> {opportunity.description}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={businessTitle}
            onChange={(e) => setBusinessTitle(e.target.value)}
            placeholder="e.g., Tech Startup for Women, Green Energy Solutions"
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            required
          />
        </div>

        {/* Business Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your business idea, goals, and how you plan to use the grant..."
            rows={6}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            required
          />
        </div>

        {/* Business Proposal File */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Proposal (Optional)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setProposal(e.target.files[0])}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--primary-color)]"
          />
          {proposal && (
            <p className="text-xs text-gray-400 mt-1">Selected: {proposal.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Upload a detailed business proposal document (PDF, DOC, DOCX)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

