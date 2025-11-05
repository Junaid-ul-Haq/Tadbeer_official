"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManageUsersPage() {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com");
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "";
      const response = await fetch(`${BASE_URL}/auth/users?page=${page}&limit=${limit}${searchParam}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.totalPages);
        setTotalRecords(data.totalRecords);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com");
      const response = await fetch(`${BASE_URL}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUserDetails(data);
        setSelectedUser(userId);
      } else {
        toast.error(data.message || "Failed to fetch user details");
      }
    } catch (error) {
      toast.error("Error fetching user details");
      console.error(error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Verified</span>,
      pending: <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Pending</span>,
      rejected: <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Rejected</span>,
      approved: <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Approved</span>,
    };
    return badges[status] || <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">{status}</span>;
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-2">
            Manage Users
          </h1>
          <p className="text-gray-400">View and manage all registered users</p>
        </div>

        {/* Search Bar */}
        <div className="bg-[var(--surface-color)] rounded-xl p-4 border border-[var(--outline-color)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or CNIC..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-[var(--background-color)] border border-[var(--outline-color)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary-color)]"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[var(--surface-color)] rounded-xl border border-[var(--outline-color)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No users found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background-color)] border-b border-[var(--outline-color)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CNIC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--outline-color)]">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-[var(--background-color)]/50 transition cursor-pointer"
                        onClick={() => fetchUserDetails(user._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="mr-2 text-[var(--primary-color)]" size={16} />
                            <span className="text-white">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.CNIC}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {user.profileCompleted ? (
                              <span className="text-green-400 text-xs">✓ Profile Complete</span>
                            ) : (
                              <span className="text-yellow-400 text-xs">⏳ Profile Incomplete</span>
                            )}
                            {user.paymentVerified ? (
                              <span className="text-green-400 text-xs">✓ Payment Verified</span>
                            ) : (
                              <span className="text-yellow-400 text-xs">⏳ Payment Pending</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchUserDetails(user._id);
                            }}
                            className="text-[var(--primary-color)] hover:text-[var(--accent-color)] transition"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[var(--outline-color)] flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} users
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-[var(--background-color)] border border-[var(--outline-color)] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-color)] transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-[var(--background-color)] border border-[var(--outline-color)] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-color)] transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* User Details Modal */}
      {selectedUser && userDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[var(--surface-color)] rounded-xl border border-[var(--outline-color)] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-[var(--outline-color)] flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[var(--primary-color)]">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-8 text-center text-gray-400">Loading details...</div>
            ) : (
              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="mr-2 text-[var(--primary-color)]" size={20} />
                      <span className="text-gray-400">Name</span>
                    </div>
                    <p className="text-white font-medium">{userDetails.user.name}</p>
                  </div>
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="mr-2 text-[var(--primary-color)]" size={20} />
                      <span className="text-gray-400">Email</span>
                    </div>
                    <p className="text-white font-medium">{userDetails.user.email}</p>
                  </div>
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Phone className="mr-2 text-[var(--primary-color)]" size={20} />
                      <span className="text-gray-400">Phone</span>
                    </div>
                    <p className="text-white font-medium">{userDetails.user.phone}</p>
                  </div>
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2 text-[var(--primary-color)]" size={20} />
                      <span className="text-gray-400">CNIC</span>
                    </div>
                    <p className="text-white font-medium">{userDetails.user.CNIC}</p>
                  </div>
                  <div className="bg-[var(--background-color)] p-4 rounded-lg md:col-span-2">
                    <div className="flex items-center mb-2">
                      <MapPin className="mr-2 text-[var(--primary-color)]" size={20} />
                      <span className="text-gray-400">Address</span>
                    </div>
                    <p className="text-white font-medium">{userDetails.user.address}</p>
                  </div>
                </div>

                {/* Statuses */}
                <div className="bg-[var(--background-color)] p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-[var(--primary-color)] mb-4">Account Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Profile Status:</span>
                      {userDetails.user.profileCompleted ? (
                        <span className="text-green-400 flex items-center">
                          <CheckCircle className="mr-1" size={16} /> Complete
                        </span>
                      ) : (
                        <span className="text-yellow-400 flex items-center">
                          <Clock className="mr-1" size={16} /> Incomplete
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Payment Status:</span>
                      {userDetails.user.paymentVerified ? (
                        <span className="text-green-400 flex items-center">
                          <CheckCircle className="mr-1" size={16} /> Verified
                        </span>
                      ) : (
                        <span className="text-yellow-400 flex items-center">
                          <Clock className="mr-1" size={16} /> Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Credit Hours:</span>
                      <span className="text-white font-medium">{userDetails.user.creditHours ?? userDetails.user.chancesLeft ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Registered:</span>
                      <span className="text-gray-300">
                        {new Date(userDetails.user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[var(--primary-color)]">Applications</h3>
                  
                  {/* Scholarships */}
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-white mb-2">Scholarships ({userDetails.applications.scholarships?.length || 0})</h4>
                    {userDetails.applications.scholarships?.length > 0 ? (
                      <div className="space-y-2">
                        {userDetails.applications.scholarships.map((scholarship) => (
                          <div key={scholarship._id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{scholarship.degreeLevel} - {scholarship.course}</span>
                            {getStatusBadge(scholarship.status)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No scholarship applications</p>
                    )}
                  </div>

                  {/* Business Grants */}
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-white mb-2">Business Grants ({userDetails.applications.grants?.length || 0})</h4>
                    {userDetails.applications.grants?.length > 0 ? (
                      <div className="space-y-2">
                        {userDetails.applications.grants.map((grant) => (
                          <div key={grant._id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{grant.title}</span>
                            {getStatusBadge(grant.status)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No grant applications</p>
                    )}
                  </div>

                  {/* Consultations */}
                  <div className="bg-[var(--background-color)] p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-white mb-2">Consultations ({userDetails.applications.consultations?.length || 0})</h4>
                    {userDetails.applications.consultations?.length > 0 ? (
                      <div className="space-y-2">
                        {userDetails.applications.consultations.map((consultation) => (
                          <div key={consultation._id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">{consultation.category}</span>
                            {getStatusBadge(consultation.status)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No consultation requests</p>
                    )}
                  </div>

                  {/* Payment */}
                  {userDetails.applications.payment && (
                    <div className="bg-[var(--background-color)] p-4 rounded-lg">
                      <h4 className="text-md font-semibold text-white mb-2">Payment</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">Amount: PKR {userDetails.applications.payment.amount}</span>
                        {getStatusBadge(userDetails.applications.payment.status)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

