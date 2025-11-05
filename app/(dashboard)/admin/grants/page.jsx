"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllGrants,
  updateGrantStatus,
  getGrantById,
} from "@/redux/slices/businessGrantSlice";
import GrantTable from "@/app/components/dashboard/grants/GrantTable";
import GrantOpportunityTable from "@/app/components/dashboard/grants/GrantOpportunityTable";
import GrantOpportunityForm from "@/app/components/dashboard/grants/GrantOpportunityForm";
import Modal from "@/app/components/dashboard/scholoarship/Modal";
import CNICPreview from "@/app/components/cnicPreview";
import { openProtectedFile } from "@/services/fileService";
import { businessGrantService } from "@/services/businessGrantService";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminGrantDashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { allGrants, selectedGrant, loading, totalPages } = useSelector(
    (state) => state.businessGrant
  );
  
  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Opportunities state
  const [activeTab, setActiveTab] = useState("applications");
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
    await dispatch(getAllGrants({ token, page: pageNumber, limit: pageLimit }));
  };

  const handleStatus = async (id, status) => {
    await dispatch(updateGrantStatus({ token, id, status }));
  };

  const handleView = async (id) => {
    const res = await dispatch(getGrantById({ token, id }));
    const grant = res.payload;
    setShowDetail(true);
  };

  // Opportunities functions
  const fetchOpportunities = async (pageNum, pageLimit, search = "") => {
    setOpportunitiesLoading(true);
    try {
      const result = await businessGrantService.getAllGrantOpportunities(
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
      await businessGrantService.deleteGrantOpportunity(token, id);
      toast.success("Opportunity deleted successfully");
      fetchOpportunities(oppPage, oppLimit, searchTerm);
    } catch (err) {
      toast.error(err.message || "Failed to delete opportunity");
    }
  };

  const handleToggleActive = async (opp) => {
    try {
      await businessGrantService.updateGrantOpportunity(token, opp._id, {
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
          Entrepreneur Incubation Management
        </h1>
        <p className="text-gray-400 text-center mt-2">
          Manage applications and entrepreneur incubation opportunities
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
          Grant Opportunities
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
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                }}
                className="bg-[#1A1A1A]/80 text-white border border-white/10 rounded-lg px-3 py-2"
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
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
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

          {/* Grant Table */}
          <GrantTable
            grants={allGrants}
            loading={loading}
            onApprove={(id) => handleStatus(id, "approved")}
            onReject={(id) => handleStatus(id, "rejected")}
            onView={handleView}
          />
        </motion.div>
      )}

      {/* Opportunities Tab */}
      {activeTab === "opportunities" && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#0F0F0F]/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_25px_rgba(24,186,214,0.1)] p-6"
        >
          {/* Search and Add Button */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by city or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOppPage(1);
              }}
              className="flex-1 min-w-[200px] px-4 py-2.5 bg-[#1A1A1A]/80 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            />
            <button
              onClick={() => {
                setEditingOpportunity(null);
                setShowOpportunityForm(true);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              + Add Grant Opportunity
            </button>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <label className="font-medium">Records per page:</label>
              <select
                value={oppLimit}
                onChange={(e) => {
                  setOppLimit(parseInt(e.target.value));
                  setOppPage(1);
                }}
                className="bg-[#1A1A1A]/80 text-white border border-white/10 rounded-lg px-3 py-2"
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
              <span className="text-gray-300">
                Page {oppPage} of {oppTotalPages}
              </span>
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
          <GrantOpportunityTable
            opportunities={opportunities}
            loading={opportunitiesLoading}
            onEdit={handleEditOpportunity}
            onDelete={handleDeleteOpportunity}
            onToggleActive={handleToggleActive}
          />
        </motion.div>
      )}

      {/* Opportunity Form Modal */}
      <Modal show={showOpportunityForm} onClose={() => setShowOpportunityForm(false)}>
        <GrantOpportunityForm
          opportunity={editingOpportunity}
          onSuccess={handleOpportunitySuccess}
          onClose={() => setShowOpportunityForm(false)}
        />
      </Modal>

      {/* Modal for Grant Details */}


<Modal show={showDetail} onClose={() => setShowDetail(false)}>
  {selectedGrant ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      {/* Modal Container */}
      <div className="bg-[var(--surface-color)] text-[var(--text-color)] w-[95%] max-w-6xl h-[90vh] rounded-[var(--border-radius)] shadow-lg font-[var(--font-family)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--outline-color)] shrink-0">
          <h2 className="text-3xl font-bold text-[var(--primary-color)]">
            Entrepreneur Incubation Details
          </h2>
          <button
            onClick={() => setShowDetail(false)}
            className="px-4 py-2 bg-[var(--primary-color)] text-[var(--background-color)] font-bold rounded hover:opacity-90"
          >
            Close
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-8 overflow-hidden p-6">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-3">
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedGrant.user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedGrant.user?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {selectedGrant.user?.phone || "N/A"}</p>
              <p><strong>CNIC Number:</strong> {selectedGrant.user?.CNIC || "N/A"}</p>
              <p><strong>Address:</strong> {selectedGrant.user?.address || "N/A"}</p>

              <p><strong>Title:</strong> {selectedGrant.title || "N/A"}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`capitalize font-semibold ${
                    selectedGrant.status === "approved"
                      ? "text-green-500"
                      : selectedGrant.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedGrant.status || "pending"}
                </span>
              </p>

              <p>
                <strong>Submitted On:</strong>{" "}
                {selectedGrant.createdAt
                  ? new Date(selectedGrant.createdAt).toLocaleString()
                  : "N/A"}
              </p>

              {/* CNIC Preview */}
              {(selectedGrant.user?.cnicFront ||
                selectedGrant.user?.cnicBack) && (
                <CNICPreview
                  cnicFront={selectedGrant.user.cnicFront}
                  cnicBack={selectedGrant.user.cnicBack}
                  token={token}
                />
              )}

              {/* Other Documents */}
            {/* Other Documents Section */}
<div className="mt-6 border-t border-gray-700 pt-4">
  <h3 className="font-semibold text-lg mb-3 text-[var(--primary-color)]">
    Uploaded Proposal
  </h3>

  {selectedGrant.proposal || selectedGrant.proposal.filePath ? (
    <div className="flex items-center gap-3">   
      <span className="text-[var(--accent-color)]">
        {selectedGrant.proposal.fileName || "Proposal Document"}
      </span>
      <span className="text-sm text-gray-400">
        ({selectedGrant.proposal.fileType?.split("/")[1] || "file"})
      </span>
    </div>
  ) : (
    <p className="text-gray-400 text-sm italic">No proposal uploaded</p>
  )}
</div>



            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pl-3 border-l border-[var(--outline-color)]">
            <div className="flex flex-col">
              <strong>Description:</strong>
              <div className="border rounded p-3 min-h-[200px] max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 bg-[var(--background-color)] text-sm">
                {selectedGrant.description || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center py-4">Loading...</p>
  )}
</Modal>



    </div>
  );
}
