const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
