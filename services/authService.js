import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/auth";

// 🟢 Signup
const signupUser = async (formData) => {
  const response = await axios.post(`${API_URL}/signup`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// 🟢 Login
const loginUser = async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData, {
    withCredentials: true,
  });

  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// 🟢 Complete Profile
const completeProfile = async (formData) => {
  const stored = localStorage.getItem("user");
  if (!stored) throw new Error("No user found. Please login again.");

  const user = JSON.parse(stored);
  const token = user?.token;

  // ✅ Use proper JSON content-type
  const response = await axios.put(`${API_URL}/complete-profile`, formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  // ✅ Update localStorage with new user data
  if (response.data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        user: response.data.user,
      })
    );
  }

  return response.data;
};

// 🟢 Logout
const logout = () => {
  localStorage.removeItem("user");
};

const authService = { signupUser, loginUser, completeProfile, logout };
export default authService;
