import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/services/authService";

// ✅ Load from localStorage (if user previously logged in)
const storedUser =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user")) || null
    : null;

// ✅ Signup
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.signupUser(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);

// ✅ Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.loginUser(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ✅ Complete Profile
export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async (formData, thunkAPI) => {
    try {
      const response = await authService.completeProfile(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to complete profile"
      );
    }
  }
);

const initialState = {
  user: storedUser ? storedUser.user : null,
  token: storedUser ? storedUser.token : null,
  isLoggedIn: !!storedUser,
  isHydrated: false, // ✅ used by ProtectedRoute
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Manually log in (e.g., after token verification)
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        })
      );
    },

    // ✅ Hydrate Redux from localStorage (for ProtectedRoute)
    hydrate: (state) => {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.token) {
        state.user = stored.user;
        state.token = stored.token;
        state.isLoggedIn = true;
      } else {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      }
      state.isHydrated = true;
    },

    // ✅ Logout and clear storage
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },

    // ✅ Update user payment status (when payment is verified)
    updatePaymentStatus: (state, action) => {
      if (state.user) {
        state.user.paymentVerified = action.payload.paymentVerified;
        state.user.creditHours = action.payload.creditHours ?? state.user.creditHours;
        // Update localStorage
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        if (stored.token) {
          stored.user = state.user;
          localStorage.setItem("user", JSON.stringify(stored));
        }
      }
    },

    // ✅ Update user data (refresh from backend)
    updateUserData: (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        // Update localStorage
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        if (stored.token) {
          stored.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(stored));
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Complete Profile
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem(
          "user",
          JSON.stringify({
            user: action.payload.user,
            token: state.token,
          })
        );
      });
  },
});

export const { logout, loginSuccess, hydrate, updatePaymentStatus, updateUserData } = authSlice.actions;
export default authSlice.reducer;
