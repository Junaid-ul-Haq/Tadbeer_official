"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { scholarshipService } from "@/services/scholarshipService";

export default function ScholarshipForm({ onSuccess }) {
  const token = useSelector((state) => state.auth.token);
  const [degreeLevel, setDegreeLevel] = useState("");
  const [course, setCourse] = useState("");
  const [documents, setDocuments] = useState([]);
  const [degreeLevels, setDegreeLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        Apply for Education and Guidance
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
        </div>

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
