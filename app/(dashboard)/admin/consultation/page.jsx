"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllConsultations,
  updateConsultationStatus,
  fetchConsultationById,
} from "@/redux/slices/consultationSlice";
import ConsultationTable from "@/app/components/dashboard/consultation/ConsultationTable";
import Modal from "@/app/components/dashboard/scholoarship/Modal";
import CNICPreview from "@/app/components/cnicPreview";
import { openProtectedFile } from "@/services/fileService";

export default function AdminConsultationDashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { allConsultations, selectedConsultation, loading, totalPages } =
    useSelector((state) => state.consultation);

  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (token) fetchPage(page, limit);
  }, [token, page, limit]);

  const fetchPage = async (pageNumber, pageLimit) => {
    await dispatch(
      fetchAllConsultations({ token, page: pageNumber, limit: pageLimit })
    );
  };

  const handleStatus = async (id, status) => {
    await dispatch(updateConsultationStatus({ token, id, status }));
    fetchPage(page, limit); // Refresh after update
  };

  const handleView = async (id) => {
    await dispatch(fetchConsultationById({ token, id }));
    setShowDetail(true);
  };

  return (
    <div className="p-6 font-[var(--font-family)] text-[var(--text-color)]">
      <h1 className="text-3xl font-bold mb-6">All Career Pathways</h1>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <label className="mr-2">Records per page:</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
            className="bg-[var(--surface-color)] px-3 py-1 rounded border border-gray-600"
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
            className={`px-3 py-1 rounded bg-[var(--primary-color)] ${
              page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            Previous
          </button>
          <select
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value))}
            className="bg-[var(--surface-color)] px-2 py-1 rounded border border-gray-600"
          >
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
              (p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              )
            )}
          </select>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded bg-[var(--primary-color)] ${
              page >= totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Consultation Table */}
      <ConsultationTable
        consultations={allConsultations}
        loading={loading}
        onApprove={(id) => handleStatus(id, "approved")}
        onReject={(id) => handleStatus(id, "rejected")}
        onView={handleView}
      />

      {/* Detail Modal */}
      <Modal show={showDetail} onClose={() => setShowDetail(false)}>
        {selectedConsultation ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-[var(--surface-color)] text-[var(--text-color)] w-[90%] max-w-6xl h-[90vh] rounded-[var(--border-radius)] shadow-lg font-[var(--font-family)] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-[var(--outline-color)]">
                <h2 className="text-3xl font-bold text-[var(--primary-color)]">
                  Career Pathways Details
                </h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-4 py-2 bg-[var(--primary-color)] text-[var(--background-color)] font-bold rounded hover:opacity-90"
                >
                  Close
                </button>
              </div>

              {/* Main Content */}
              <div className="flex flex-1 p-6 gap-8 overflow-hidden">
                {/* Left Column */}
                <div className="flex-1 flex flex-col justify-start gap-4">
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedConsultation.user?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedConsultation.user?.email || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedConsultation.user?.phone || "N/A"}
                    </p>
                    <p>
                      <strong>CNIC Number:</strong>{" "}
                      {selectedConsultation.user?.CNIC || "N/A"}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedConsultation.user?.address || "N/A"}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {selectedConsultation.category || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`capitalize font-semibold ${
                          selectedConsultation.status === "approved"
                            ? "text-green-500"
                            : selectedConsultation.status === "rejected"
                            ? "text-red-500"
                            : "text-yellow-400"
                        }`}
                      >
                        {selectedConsultation.status || "pending"}
                      </span>
                    </p>
                    <p>
                      <strong>Submitted On:</strong>{" "}
                      {selectedConsultation.createdAt
                        ? new Date(
                            selectedConsultation.createdAt
                          ).toLocaleString()
                        : "N/A"}
                    </p>

                    {/* CNIC Preview */}
                    {(selectedConsultation.user?.cnicFront ||
                      selectedConsultation.user?.cnicBack) && (
                      <CNICPreview
                        cnicFront={selectedConsultation.user.cnicFront}
                        cnicBack={selectedConsultation.user.cnicBack}
                        token={token}
                      />
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                  {/* Educational Background */}
                  <div className="flex flex-col">
                    <strong>Educational Background:</strong>
                    <div className="border rounded p-3 h-32 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 bg-[var(--background-color)] text-sm space-y-2">
                      {selectedConsultation.user?.education?.length > 0 ? (
                        selectedConsultation.user.education.map((edu, i) => (
                          <div key={i} className="border-b border-gray-600 pb-2">
                            <p>
                              <strong>Institute:</strong>{" "}
                              {edu.institute || "N/A"}
                            </p>
                            <p>
                              <strong>Degree:</strong> {edu.degree || "N/A"}
                            </p>
                            <p>
                              <strong>CGPA:</strong> {edu.cgpa || "N/A"}
                            </p>
                            <p>
                              <strong>Start:</strong>{" "}
                              {edu.startDate
                                ? new Date(edu.startDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              <strong>End:</strong>{" "}
                              {edu.endDate
                                ? new Date(edu.endDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No education data available</p>
                      )}
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div className="flex flex-col">
                    <strong>Professional Experience:</strong>
                    <div className="border rounded p-3 h-32 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 bg-[var(--background-color)] text-sm space-y-2">
                      {selectedConsultation.user?.experience?.length > 0 ? (
                        selectedConsultation.user.experience.map((exp, i) => (
                          <div key={i} className="border-b border-gray-600 pb-2">
                            <p>
                              <strong>Institute:</strong>{" "}
                              {exp.institute || "N/A"}
                            </p>
                            <p>
                              <strong>Role:</strong> {exp.role || "N/A"}
                            </p>
                            <p>
                              <strong>Start:</strong>{" "}
                              {exp.startDate
                                ? new Date(exp.startDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              <strong>End:</strong>{" "}
                              {exp.endDate
                                ? new Date(exp.endDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No experience data available</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col">
                    <strong>Description:</strong>
                    <div className="border rounded p-3 h-32 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700 bg-[var(--background-color)] text-sm">
                      {selectedConsultation.description || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              {selectedConsultation.documents?.length > 0 && (
                <div className="p-6 border-t border-[var(--outline-color)]">
                  <h3 className="text-xl font-bold text-[var(--primary-color)]">
                    Other Uploaded Documents
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    {selectedConsultation.documents.map((doc) => (
                      <li key={doc.filePath} className="flex items-center justify-between gap-4">
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
                                  const pathParts = doc.filePath.split('/');
                                  folder = pathParts[2];
                                  filename = pathParts[3];
                                } else if (doc.filePath.startsWith('/uploads/')) {
                                  const pathParts = doc.filePath.split('/');
                                  folder = pathParts[pathParts.length - 2];
                                  filename = pathParts[pathParts.length - 1];
                                } else {
                                  folder = 'others';
                                  filename = doc.filePath;
                                }
                                
                                const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com");
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
          </div>
        ) : (
          <p className="text-center py-4">Loading...</p>
        )}
      </Modal>
    </div>
  );
}
