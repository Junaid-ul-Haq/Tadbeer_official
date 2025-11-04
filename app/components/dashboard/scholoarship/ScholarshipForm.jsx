"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { scholarshipService } from "@/services/scholarshipService";
import { motion } from "framer-motion";

export default function ScholarshipForm({ onSuccess }) {
  const token = useSelector((state) => state.auth.token);
  const [degreeLevel, setDegreeLevel] = useState("");
  const [course, setCourse] = useState("");
  const [documents, setDocuments] = useState([]);
  const [degreeLevels, setDegreeLevels] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [showOpportunities, setShowOpportunities] = useState(false);

  useEffect(() => {
    async function fetchDegrees() {
      try {
        const levels = await scholarshipService.getDegreeLevels(token);
        setDegreeLevels(levels);
      } catch (err) {
        console.error(err);
        setError("Failed to load degree levels");
      }
    }
    fetchDegrees();
  }, [token]);

  // Search opportunities when degree and course are selected
  useEffect(() => {
    if (degreeLevel && course.trim()) {
      searchOpportunities();
    } else {
      setOpportunities([]);
      setShowOpportunities(false);
    }
  }, [degreeLevel, course]);

  const searchOpportunities = async () => {
    if (!degreeLevel || !course.trim()) return;

    setSearching(true);
    try {
      const result = await scholarshipService.searchOpportunities(token, degreeLevel, course);
      setOpportunities(result.opportunities || []);
      setShowOpportunities(true);
      setError("");
    } catch (err) {
      console.error(err);
      setOpportunities([]);
      setError("Failed to search opportunities");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!degreeLevel || !course.trim()) {
      setError("Please select degree level and enter course name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await scholarshipService.createScholarship(token, degreeLevel, course, documents);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
        Apply for Scholarship
      </h2>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Degree Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Degree Level <span className="text-red-400">*</span>
          </label>
          <select
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            value={degreeLevel}
            onChange={(e) => {
              setDegreeLevel(e.target.value);
              setCourse("");
              setOpportunities([]);
            }}
            required
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
            Course/Field of Study <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g., Computer Science, Finance, Chemistry, Zoology"
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Enter your course name to see available scholarship opportunities
          </p>
        </div>

        {/* Matching Opportunities */}
        {searching && (
          <div className="text-center py-4 text-gray-400">Searching opportunities...</div>
        )}

        {showOpportunities && opportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#1A1A1A]/60 border border-[var(--accent-color)]/30 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-3">
              🎓 Available Scholarship Opportunities ({opportunities.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {opportunities.map((opp) => (
                <div
                  key={opp._id}
                  className="p-3 bg-[#0F0F0F]/60 border border-white/10 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {opp.degreeLevel} in {opp.course}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        🇺🇳 {opp.country}
                        {opp.qualificationType && ` • ${opp.qualificationType}`}
                      </p>
                      {opp.description && (
                        <p className="text-xs text-gray-500 mt-1">{opp.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        opp.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {opp.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {showOpportunities && opportunities.length === 0 && !searching && (
          <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-sm">
            No matching scholarship opportunities found for {degreeLevel} in {course}. You can still apply, and we'll review your application.
          </div>
        )}

        {/* Documents */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload Documents <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setDocuments(e.target.files)}
            className="w-full px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-color)] file:text-white hover:file:bg-[var(--primary-color)]"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload all required documents (transcripts, certificates, etc.)
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
