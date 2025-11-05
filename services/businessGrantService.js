const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com");

export const businessGrantService = {
  createGrant: async (token, formData) => {
    try {
      const res = await fetch(`${BASE_URL}/business/createGrant`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Create Grant Error Response:", data);
        throw new Error(data.message || "Failed to submit grant");
      }
      return data;
    } catch (error) {
      console.error("Grant creation failed:", error);
      throw error;
    }
  },

  getMyGrants: async (token) => {
    const res = await fetch(`${BASE_URL}/business/getMyGrants`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch your grants");
    return data.grants || [];
  },

  getAllGrants: async (token, page = 1, limit = 10) => {
    const res = await fetch(
      `${BASE_URL}/business/getAllGrants?page=${page}&limit=${limit}`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch all grants");
    return data;
  },

  // Grant Opportunities (Admin)
  createGrantOpportunity: async (token, opportunityData) => {
    const res = await fetch(`${BASE_URL}/business/opportunities/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(opportunityData),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to create opportunity");
    return data;
  },

  getAllGrantOpportunities: async (token, page = 1, limit = 10, search = "") => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const res = await fetch(
      `${BASE_URL}/business/opportunities?page=${page}&limit=${limit}${searchParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch opportunities");
    return data;
  },

  updateGrantOpportunity: async (token, id, opportunityData) => {
    const res = await fetch(`${BASE_URL}/business/opportunities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(opportunityData),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to update opportunity");
    return data;
  },

  deleteGrantOpportunity: async (token, id) => {
    const res = await fetch(`${BASE_URL}/business/opportunities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to delete opportunity");
    return data;
  },

  // User: Get all active opportunities
  getAllActiveGrantOpportunities: async (token) => {
    const res = await fetch(`${BASE_URL}/business/opportunities/all`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch opportunities");
    return data;
  },

  // User: Apply for grant from opportunity
  applyForGrant: async (token, formData) => {
    const res = await fetch(`${BASE_URL}/business/createGrant`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to submit grant application");
    return data;
  },

  updateGrantStatus: async (token, id, status) => {
    const res = await fetch(`${BASE_URL}/business/updateGrantStatus/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data.message || "Failed to update grant status");
    return data;
  },

  getGrantById: async (token, id) => {
    const res = await fetch(`${BASE_URL}/business/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch grant details");
    return data;
  },
};
