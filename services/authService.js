import axios from "axios";

const API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com")) + "/auth";

// ✅ Global axios interceptor to handle 401 errors (user deleted/unauthorized)
if (typeof window !== 'undefined') {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized (user deleted or token invalid)
      if (error.response?.status === 401) {
        const message = error.response?.data?.message || '';
        
        // Check if user was deleted
        if (message.includes('User not found') || message.includes('account has been deleted')) {
          // Clear localStorage and redirect to login
          localStorage.removeItem("user");
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
}

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

// 🟢 Get current user (refresh user data)
const getCurrentUser = async (token) => {
  const API_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com")) + "/auth";
  
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (response.data.user) {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      stored.user = response.data.user;
      localStorage.setItem("user", JSON.stringify(stored));
    }

    return response.data;
  } catch (error) {
    // If user is deleted (401), logout and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw error;
  }
};

// 🟢 Logout
const logout = () => {
  localStorage.removeItem("user");
};

const authService = { signupUser, loginUser, completeProfile, getCurrentUser, logout };
export default authService;
