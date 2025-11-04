const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const paymentService = {
  createPayment: async (token, formData) => {
    const res = await fetch(`${BASE_URL}/payment/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to submit payment");
    return data;
  },

  getMyPayment: async (token) => {
    const res = await fetch(`${BASE_URL}/payment/my-payment`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch payment");
    return data;
  },

  getAllPayments: async (token, page = 1, limit = 10, status = "") => {
    const statusParam = status ? `&status=${status}` : "";
    const res = await fetch(
      `${BASE_URL}/payment/all?page=${page}&limit=${limit}${statusParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch payments");
    return data;
  },

  getPaymentById: async (token, id) => {
    const res = await fetch(`${BASE_URL}/payment/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to fetch payment details");
    return data;
  },

  verifyPayment: async (token, id, status, adminNotes = "") => {
    const res = await fetch(`${BASE_URL}/payment/verify/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, adminNotes }),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Failed to verify payment");
    return data;
  },
};

