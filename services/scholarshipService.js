const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const scholarshipService = {
  createScholarship: async (token, degreeLevel, course, files) => {
    const formData = new FormData();
    formData.append("degreeLevel", degreeLevel);
    formData.append("course", course);

    if (files && files.length > 0) {
      Array.from(files).forEach(file => formData.append("documents", file));
    }

    const res = await fetch(`${BASE_URL}/scholarship/createScholarship`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to submit scholarship");
    return data;
  },

  getMyScholarships: async (token) => {
    const res = await fetch(`${BASE_URL}/scholarship/getMyScholarships`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch your scholarships");
    return data;
  },

  getAllScholarships: async (token, page = 1, limit = 10) => {
    const res = await fetch(`${BASE_URL}/scholarship/getAllScholarships?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch all scholarships");
    return data;
  },

  updateScholarshipStatus: async (token, id, status) => {
    const res = await fetch(`${BASE_URL}/scholarship/updateScholarshipStatus/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to update status");
    return data;
  },

  getScholarshipById: async (token, id) => {
    const res = await fetch(`${BASE_URL}/scholarship/get/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch scholarship details");
    return data;
  },

  getDegreeLevels: async (token) => {
    const res = await fetch(`${BASE_URL}/scholarship/degree-levels`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch degree levels");
    return data.levels || [];
  },

  // Scholarship Opportunities (Admin)
  createOpportunity: async (token, opportunityData) => {
    const res = await fetch(`${BASE_URL}/scholarship/opportunities/create`, {
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

  getAllOpportunities: async (token, page = 1, limit = 10, search = "") => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const res = await fetch(
      `${BASE_URL}/scholarship/opportunities?page=${page}&limit=${limit}${searchParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch opportunities");
    return data;
  },

  updateOpportunity: async (token, id, opportunityData) => {
    const res = await fetch(`${BASE_URL}/scholarship/opportunities/${id}`, {
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

  deleteOpportunity: async (token, id) => {
    const res = await fetch(`${BASE_URL}/scholarship/opportunities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to delete opportunity");
    return data;
  },

  // User: Search opportunities by degree and course
  searchOpportunities: async (token, degreeLevel, course) => {
    const res = await fetch(
      `${BASE_URL}/scholarship/opportunities/search?degreeLevel=${encodeURIComponent(degreeLevel)}&course=${encodeURIComponent(course)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to search opportunities");
    return data;
  },

  getAllCourses: async (token) => {
    const res = await fetch(`${BASE_URL}/scholarship/courses`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch courses");
    return data.courses || [];
  },

  getAllCountries: async (token) => {
    const res = await fetch(`${BASE_URL}/scholarship/countries`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch countries");
    return data.countries || [];
  },
};
