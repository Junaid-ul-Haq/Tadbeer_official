import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scholarshipService } from "@/services/scholarshipService";

// Fetch user scholarships
export const fetchUserScholarships = createAsyncThunk(
  "scholarship/fetchUser",
  async (token, thunkAPI) => {
    try {
      const res = await scholarshipService.getMyScholarships(token);
      return res.applications || res.scholarships || [];
    } catch (error) {
      // Silently handle connection errors (backend not running)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        return []; // Return empty array instead of rejecting
      }
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch scholarships");
    }
  }
)
// Fetch all scholarships (Admin)
export const fetchAllScholarships = createAsyncThunk(
  "scholarship/fetchAll",
  async ({ token, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const res = await scholarshipService.getAllScholarships(token, page, limit);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch all scholarships");
    }
  }
);

// Update scholarship status (Admin)
export const updateScholarshipStatus = createAsyncThunk(
  "scholarship/updateStatus",
  async ({ token, id, status }, thunkAPI) => {
    try {
      const res = await scholarshipService.updateScholarshipStatus(token, id, status);
      return res.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update scholarship status");
    }
  }
);

const initialState = {
  userScholarships: [],
  allScholarships: [],
  degreeLevels: [],
  selectedScholarship: null,
  loading: false,
  error: null,
};

const scholarshipSlice = createSlice({
  name: "scholarship",
  initialState,
  reducers: {
    setDegreeLevels: (state, action) => {
      state.degreeLevels = action.payload;
    },
    setSelectedScholarship: (state, action) => {
      state.selectedScholarship = action.payload;
    },
    resetScholarshipState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch user scholarships
      .addCase(fetchUserScholarships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserScholarships.fulfilled, (state, action) => {
        state.loading = false;
        state.userScholarships = action.payload;
      })
      .addCase(fetchUserScholarships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all scholarships
      .addCase(fetchAllScholarships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllScholarships.fulfilled, (state, action) => {
        state.loading = false;
        state.allScholarships = action.payload.data || [];
      })
      .addCase(fetchAllScholarships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update scholarship status
      .addCase(updateScholarshipStatus.fulfilled, (state, action) => {
        // Update allScholarships (Admin view)
        const idx = state.allScholarships.findIndex(s => s._id === action.payload._id);
        if (idx >= 0) {
          state.allScholarships[idx] = {
            ...state.allScholarships[idx],
            status: action.payload.status,
          };
        }

        // Update userScholarships (User view)
        const userIdx = state.userScholarships.findIndex(s => s._id === action.payload._id);
        if (userIdx >= 0) {
          state.userScholarships[userIdx] = {
            ...state.userScholarships[userIdx],
            status: action.payload.status,
          };
        }
      });
  },
});

export const { setDegreeLevels, setSelectedScholarship, resetScholarshipState } = scholarshipSlice.actions;
export default scholarshipSlice.reducer;
