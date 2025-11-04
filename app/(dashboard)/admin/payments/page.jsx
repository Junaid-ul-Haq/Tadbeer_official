"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { paymentService } from "@/services/paymentService";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminPaymentsPage() {
  const token = useSelector((state) => state.auth.token);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token, page, limit, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const result = await paymentService.getAllPayments(token, page, limit, statusFilter);
      setPayments(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      toast.error(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (payment) => {
    try {
      const result = await paymentService.getPaymentById(token, payment._id);
      setSelectedPayment(result.data);
      setShowDetail(true);
    } catch (err) {
      toast.error(err.message || "Failed to fetch payment details");
    }
  };

  const handleVerify = async (status) => {
    if (!selectedPayment) return;
    
    setVerifying(true);
    try {
      await paymentService.verifyPayment(token, selectedPayment._id, status, adminNotes);
      toast.success(`Payment ${status} successfully`);
      setShowDetail(false);
      setSelectedPayment(null);
      setAdminNotes("");
      fetchPayments();
    } catch (err) {
      toast.error(err.message || "Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      verified: "bg-green-500/20 text-green-400 border-green-500/50",
      rejected: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`}
      >
        {status?.toUpperCase() || "PENDING"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--primary-color)]">
          Payment Verifications
        </h1>
        <div className="flex gap-4 items-center">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
            className="px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
          <p className="mt-4 text-gray-400">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No payments found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A]/60 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Submitted</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-[#1A1A1A]/40 transition-colors"
                  >
                    <td className="px-4 py-4 text-gray-300">{payment.user?.name || "N/A"}</td>
                    <td className="px-4 py-4 text-gray-300">{payment.user?.email || "N/A"}</td>
                    <td className="px-4 py-4 text-gray-300 font-semibold">PKR {payment.amount?.toLocaleString()}</td>
                    <td className="px-4 py-4">{getStatusBadge(payment.status)}</td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleView(payment)}
                        className="px-4 py-2 bg-[var(--primary-color)] text-black rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1A1A1A]/80"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1A1A1A]/80"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetail && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-[#0F0F0F]/95 text-white w-[95%] max-w-4xl max-h-[90vh] rounded-2xl shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[var(--primary-color)]">
                Payment Details
              </h2>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedPayment(null);
                  setAdminNotes("");
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">User Name</p>
                  <p className="text-white font-semibold">{selectedPayment.user?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{selectedPayment.user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{selectedPayment.user?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">CNIC</p>
                  <p className="text-white font-semibold">{selectedPayment.user?.CNIC || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-[var(--primary-color)] font-bold text-lg">
                    PKR {selectedPayment.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Payment Screenshot</p>
                {selectedPayment.screenshot?.url ? (
                  <img
                    src={selectedPayment.screenshot.url}
                    alt="Payment Screenshot"
                    className="max-w-full h-auto rounded-lg border border-white/10"
                  />
                ) : (
                  <p className="text-gray-500">No screenshot available</p>
                )}
              </div>

              {selectedPayment.status === "pending" && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for rejection (if applicable)"
                    rows={3}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder-gray-500 resize-none"
                  />
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleVerify("verified")}
                      disabled={verifying}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying ? "Verifying..." : "✓ Verify Payment"}
                    </button>
                    <button
                      onClick={() => handleVerify("rejected")}
                      disabled={verifying}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying ? "Rejecting..." : "✗ Reject Payment"}
                    </button>
                  </div>
                </div>
              )}

              {selectedPayment.adminNotes && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm font-semibold">Admin Notes:</p>
                  <p className="text-gray-300 text-sm mt-1">{selectedPayment.adminNotes}</p>
                </div>
              )}

              {selectedPayment.verifiedBy && (
                <div className="mt-4 text-sm text-gray-400">
                  Verified by: {selectedPayment.verifiedBy?.name || "N/A"} on{" "}
                  {selectedPayment.updatedAt
                    ? new Date(selectedPayment.updatedAt).toLocaleString()
                    : "N/A"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

