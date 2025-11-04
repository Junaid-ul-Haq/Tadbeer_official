"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllScholarships,
  updateScholarshipStatus,
  setSelectedScholarship,
} from "@/redux/slices/scholarshipSlice";
import ScholarshipTable from "@/app/components/dashboard/scholoarship/ScholarshipTable";
import OpportunityTable from "@/app/components/dashboard/scholoarship/OpportunityTable";
import OpportunityForm from "@/app/components/dashboard/scholoarship/OpportunityForm";
import Modal from "@/app/components/dashboard/scholoarship/Modal";
import { scholarshipService } from "@/services/scholarshipService";
import CNICPreview from "@/app/components/cnicPreview";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { allScholarships, selectedScholarship, loading } = useSelector(
    (state) => state.scholarship
  );
  const token = useSelector((state) => state.auth.token);

  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Opportunities state
  const [activeTab, setActiveTab] = useState("applications"); // "applications" or "opportunities"
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);
  const [oppPage, setOppPage] = useState(1);
  const [oppTotalPages, setOppTotalPages] = useState(1);
  const [oppLimit, setOppLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      if (activeTab === "applications") {
        fetchPage(page, limit);
      } else {
        fetchOpportunities(oppPage, oppLimit, searchTerm);
      }
    }
  }, [token, page, limit, activeTab, oppPage, oppLimit, searchTerm]);

  const fetchPage = async (pageNumber, pageLimit) => {
    const res = await dispatch(
      fetchAllScholarships({ token, page: pageNumber, limit: pageLimit })
    );
    if (res.payload?.totalPages) setTotalPages(res.payload.totalPages);
  };

  const handleStatus = async (id, status) => {
    await dispatch(updateScholarshipStatus({ token, id, status }));
  };

  const handleView = async (id) => {
    const data = await scholarshipService.getScholarshipById(token, id);
    dispatch(setSelectedScholarship(data.data));
    setShowDetail(true);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  // Opportunities functions
  const fetchOpportunities = async (pageNum, pageLimit, search = "") => {
    setOpportunitiesLoading(true);
    try {
      const result = await scholarshipService.getAllOpportunities(
        token,
        pageNum,
        pageLimit,
        search
      );
      setOpportunities(result.data || []);
      setOppTotalPages(result.totalPages || 1);
    } catch (err) {
      toast.error(err.message || "Failed to fetch opportunities");
    } finally {
      setOpportunitiesLoading(false);
    }
  };

  const handleOpportunitySuccess = () => {
    fetchOpportunities(oppPage, oppLimit, searchTerm);
    setEditingOpportunity(null);
  };

  const handleEditOpportunity = (opp) => {
    setEditingOpportunity(opp);
    setShowOpportunityForm(true);
  };

  const handleDeleteOpportunity = async (id) => {
    try {
      await scholarshipService.deleteOpportunity(token, id);
      toast.success("Opportunity deleted successfully");
      fetchOpportunities(oppPage, oppLimit, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to delete opportunity");
    }
  };

  const handleToggleActive = async (opp) => {
    try {
      await scholarshipService.updateOpportunity(token, opp._id, {
        isActive: !opp.isActive,
      });
      toast.success(`Opportunity ${!opp.isActive ? "activated" : "deactivated"}`);
      fetchOpportunities(oppPage, oppLimit, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to update opportunity");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#0a0a0a] to-[#111] text-white p-8 font-[var(--font-family)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
          Scholarship Management
        </h1>
        <p className="text-gray-400 text-center mt-2">
          Manage applications and scholarship opportunities
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "applications"
              ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab("opportunities")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "opportunities"
              ? "text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Scholarship Opportunities
        </button>
      </div>

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#0F0F0F]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_25px_rgba(24,186,214,0.1)] p-6"
        >
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <label className="font-medium">Records per page:</label>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="bg-[#1A1A1A]/80 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              {[5, 10, 20, 50].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                page <= 1
                  ? "bg-gray-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] hover:opacity-90"
              }`}
            >
              ← Previous
            </button>

            <select
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value))}
              className="bg-[#1A1A1A]/80 text-white border border-white/10 rounded-lg px-3 py-2"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                page >= totalPages
                  ? "bg-gray-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:opacity-90"
              }`}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Scholarship Table */}
        <ScholarshipTable
          scholarships={allScholarships}
          loading={loading}
          onApprove={(id) => handleStatus(id, "approved")}
          onReject={(id) => handleStatus(id, "rejected")}
          onView={handleView}
        />
      </motion.div>
      )}

      {/* Detail Modal */}
      <Modal show={showDetail} onClose={() => setShowDetail(false)}>
        {selectedScholarship ? (
          <div className="p-6 bg-[#0F0F0F]/90 rounded-2xl text-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent mb-6">
              Applicant Details
            </h2>

            {/* Applicant Details */}
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>Name:</strong> {selectedScholarship.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedScholarship.user?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedScholarship.user?.phone}
              </p>
              <p>
                <strong>CNIC Number:</strong> {selectedScholarship.user?.CNIC || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedScholarship.user?.address || "N/A"}
              </p>

              <div>
                <strong>Education:</strong>
                {selectedScholarship.user?.education?.length > 0 ? (
                  selectedScholarship.user.education.map((edu, i) => (
                    <div
                      key={i}
                      className="ml-3 mt-1 text-gray-400 border-l border-white/10 pl-3"
                    >
                      🎓 {edu.institute} — {edu.degree} ({edu.startDate} →{" "}
                      {edu.endDate}) CGPA: {edu.cgpa}
                    </div>
                  ))
                ) : (
                  <span> No education details provided </span>
                )}
              </div>

              <div>
                <strong>Experience:</strong>
                {selectedScholarship.user?.experience?.length > 0 ? (
                  selectedScholarship.user.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="ml-3 mt-1 text-gray-400 border-l border-white/10 pl-3"
                    >
                      💼 {exp.institute} — {exp.role} ({exp.startDate} →{" "}
                      {exp.endDate})
                    </div>
                  ))
                ) : (
                  <span> No experience details provided </span>
                )}
              </div>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    selectedScholarship.status === "approved"
                      ? "text-green-400"
                      : selectedScholarship.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  } font-semibold`}
                >
                  {selectedScholarship.status}
                </span>
              </p>

              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(selectedScholarship.createdAt).toLocaleString()}
              </p>
            </div>

          {selectedScholarship.user && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3 border-b border-white/10 pb-2">
                CNIC Documents
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                <CNICPreview
                  cnicFront={selectedScholarship.user.cnicFront}
                  cnicBack={selectedScholarship.user.cnicBack}
                  token={token}
                />
              </div>
            </div>
          )}
      
          {/* Uploaded Documents at the Bottom */}
          {selectedScholarship.documents?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-lg border-b border-white/10 pb-2 mb-3">
                Other Uploaded Documents
              </h3>
              <ul className="list-disc pl-6 space-y-3">
                {selectedScholarship.documents.map((doc) => (
                  <li
                    key={doc.filePath}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-[var(--accent-color)] underline truncate">
                      {doc.fileName}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            // Handle different file path formats
                            let folder, filename;
                            
                            if (doc.filePath.startsWith('/files/')) {
                              // Format: /files/scholarships/filename.pdf
                              const pathParts = doc.filePath.split('/');
                              folder = pathParts[2];
                              filename = pathParts[3];
                            } else if (doc.filePath.startsWith('/uploads/')) {
                              // Format: /uploads/scholarships/filename.pdf
                              const pathParts = doc.filePath.split('/');
                              folder = pathParts[pathParts.length - 2];
                              filename = pathParts[pathParts.length - 1];
                            } else {
                              folder = 'scholarships';
                              filename = doc.filePath;
                            }
                            
                            const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://tadbeerresource.com";
                            const response = await fetch(`${BASE_URL}/api/files/${folder}/${filename}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = doc.fileName;
                            a.click();
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error("Download failed:", error);
                            alert("Download failed. Please check your connection and try again.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">Loading details...</p>
        )}
      </Modal>

      {/* Opportunities Tab */}
      {activeTab === "opportunities" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#0F0F0F]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_25px_rgba(24,186,214,0.1)] p-6"
        >
          {/* Header with Add Button and Search */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by course, country, or degree..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOppPage(1);
                }}
                className="flex-1 px-4 py-2 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>
            <button
              onClick={() => {
                setEditingOpportunity(null);
                setShowOpportunityForm(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
            >
              + Add Opportunity
            </button>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <label className="font-medium">Records per page:</label>
              <select
                value={oppLimit}
                onChange={(e) => {
                  setOppLimit(parseInt(e.target.value));
                  setOppPage(1);
                }}
                className="bg-[#1A1A1A]/80 text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              >
                {[5, 10, 20, 50].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={oppPage <= 1}
                onClick={() => setOppPage(oppPage - 1)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  oppPage <= 1
                    ? "bg-gray-700 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] hover:opacity-90"
                }`}
              >
                ← Previous
              </button>

              <select
                value={oppPage}
                onChange={(e) => setOppPage(parseInt(e.target.value))}
                className="bg-[#1A1A1A]/80 text-white border border-white/10 rounded-lg px-3 py-2"
              >
                {Array.from({ length: oppTotalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <button
                disabled={oppPage >= oppTotalPages}
                onClick={() => setOppPage(oppPage + 1)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  oppPage >= oppTotalPages
                    ? "bg-gray-700 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] hover:opacity-90"
                }`}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Opportunities Table */}
          <OpportunityTable
            opportunities={opportunities}
            loading={opportunitiesLoading}
            onEdit={handleEditOpportunity}
            onDelete={handleDeleteOpportunity}
            onToggleActive={handleToggleActive}
          />
        </motion.div>
      )}

      {/* Opportunity Form Modal */}
      <Modal show={showOpportunityForm} onClose={() => {
        setShowOpportunityForm(false);
        setEditingOpportunity(null);
      }}>
        <OpportunityForm
          onSuccess={handleOpportunitySuccess}
          onClose={() => {
            setShowOpportunityForm(false);
            setEditingOpportunity(null);
          }}
          editingOpportunity={editingOpportunity}
        />
      </Modal>
    </div>
  );
}
