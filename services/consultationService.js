const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://tadbeerresource.com";

export const consultationService = {
  // Create consultation
  createConsultation: async (token, data) => {
    const res = await fetch(`${BASE_URL}/consultation/createConsultation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to submit consultation");
    return result;
  },

  // Get categories dynamically
  getCategories: async (token) => {
    const res = await fetch(`${BASE_URL}/consultation/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const result = await res.json().catch(() => []);
    if (!res.ok) throw new Error(result.message || "Failed to fetch categories");
    return result.categories || [];
  },

  // Get logged-in user's consultations
  getMyConsultations: async (token) => {
    const res = await fetch(`${BASE_URL}/consultation/getMyConsultations`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to fetch your consultations");
    return result.consultations || [];
  },

  // Admin: Get all consultations
  getAllConsultations: async (token, page = 1, limit = 10) => {
    const res = await fetch(
      `${BASE_URL}/consultation/getAllConsultations?page=${page}&limit=${limit}`,
      { 
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to fetch all consultations");
    return result;
  },

  // Admin: Update status
  updateConsultationStatus: async (token, id, status) => {
    const res = await fetch(`${BASE_URL}/consultation/updateConsultationStatus/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to update consultation status");
    return result;
  },

  // Admin: Get single consultation
  getConsultationById: async (token, id) => {
    const res = await fetch(`${BASE_URL}/consultation/getById/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || "Failed to fetch consultation details");
    return result;
  },
};
