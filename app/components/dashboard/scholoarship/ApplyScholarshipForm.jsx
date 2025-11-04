"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { scholarshipService } from "@/services/scholarshipService";
import { toast } from "react-hot-toast";

export default function ApplyScholarshipForm({ opportunity, onSuccess }) {
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // File states
  const [passport, setPassport] = useState(null);
  const [experienceDocuments, setExperienceDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passport
    if (!passport) {
      setError("Please upload your passport");
      return;
    }

    // Validate experience documents (max 3)
    if (experienceDocuments.length === 0) {
      setError("Please upload at least one experience document (max 3)");
      return;
    }

    if (experienceDocuments.length > 3) {
      setError("You can upload maximum 3 experience documents");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add opportunity details
      formData.append("degreeLevel", opportunity.degreeLevel);
      formData.append("course", opportunity.course);
      formData.append("opportunityId", opportunity._id);

      // Add passport (single file)
      if (passport) {
        formData.append("passport", passport);
      }

      // Add experience documents (max 3)
      Array.from(experienceDocuments).forEach((file) => {
        formData.append("experienceDocuments", file);
      });

      // Add all other documents (no limit)
      Array.from(documents).forEach((file) => {
        formData.append("documents", file);
      });

      await scholarshipService.applyForScholarship(token, formData);
      toast.success("Scholarship application submitted successfully!");
      onSuccess();
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
        Apply for Scholarship
      </h2>

      {/* Opportunity Info */}
      <div className="p-4 bg-[#1A1A1A]/60 border border-[var(--accent-color)]/30 rounded-lg">
        <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-2">
          Scholarship Opportunity
        </h3>
        <div className="space-y-1 text-sm text-gray-300">
          <p><span className="font-medium">Degree:</span> {opportunity.degreeLevel} in {opportunity.course}</p>
          <p><span className="font-medium">Country:</span> {opportunity.country}</p>
          {opportunity.qualificationType && (
            <p><span className="font-medium">Qualification:</span> {opportunity.qualificationType}</p>
          )}
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
        {/* Passport Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Passport <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setPassport(e.target.files[0])}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--primary-color)]"
            required
          />
          {passport && (
            <p className="text-xs text-gray-400 mt-1">Selected: {passport.name}</p>
          )}
        </div>

        {/* Experience Documents (Max 3) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Experience Documents <span className="text-red-400">*</span>{" "}
            <span className="text-gray-400 text-xs">(Max 3 files)</span>
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 3) {
                setError("Maximum 3 experience documents allowed");
                return;
              }
              setExperienceDocuments(files);
              setError("");
            }}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--primary-color)]"
            required
          />
          {experienceDocuments.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-400">
                Selected: {experienceDocuments.length} file(s)
              </p>
              {Array.from(experienceDocuments).map((file, idx) => (
                <p key={idx} className="text-xs text-gray-500 ml-2">
                  • {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* All Other Documents (No Limit) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            All Other Documents <span className="text-gray-400 text-xs">(Optional, no limit)</span>
          </label>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setDocuments(e.target.files)}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--primary-color)]"
          />
          {documents.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Selected: {documents.length} file(s)
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Upload transcripts, certificates, recommendation letters, etc.
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
