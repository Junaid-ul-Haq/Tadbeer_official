import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { businessGrantService } from "@/services/businessGrantService";

export const createGrant = createAsyncThunk(
  "businessGrant/createGrant",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      return await businessGrantService.createGrant(token, formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMyGrants = createAsyncThunk(
  "businessGrant/getMyGrants",
  async (token, { rejectWithValue }) => {
    try {
      return await businessGrantService.getMyGrants(token);
    } catch (error) {
      // Silently handle connection errors (backend not running)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        return []; // Return empty array instead of rejecting
      }
      return rejectWithValue(error.message);
    }
  }
);

export const getAllGrants = createAsyncThunk(
  "businessGrant/getAllGrants",
  async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      return await businessGrantService.getAllGrants(token, page, limit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGrantStatus = createAsyncThunk(
  "businessGrant/updateGrantStatus",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      return await businessGrantService.updateGrantStatus(token, id, status);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getGrantById = createAsyncThunk(
  "businessGrant/getGrantById",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      return await businessGrantService.getGrantById(token, id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const businessGrantSlice = createSlice({
  name: "businessGrant",
  initialState: {
  myGrants: [],
  allGrants: [],
  selectedGrant: null,
  loading: false,
  error: null,
  success: false,
  totalPages: 1, // ✅ Add this if pagination is used in the table
},

  reducers: {
    clearGrantState: (state) => {
      state.error = null;
      state.success = false;
    },
    setSelectedGrant: (state, action) => {
      state.selectedGrant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGrant.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGrant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myGrants.push(action.payload);
      })
      .addCase(createGrant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyGrants.fulfilled, (state, action) => {
        state.myGrants = action.payload;
      })
      .addCase(getAllGrants.fulfilled, (state, action) => {
        state.allGrants = action.payload.data || [];
      })
      .addCase(updateGrantStatus.fulfilled, (state, action) => {
        const index = state.allGrants.findIndex(
          (g) => g._id === action.meta.arg.id
        );
        if (index !== -1)
          state.allGrants[index].status = action.meta.arg.status;
      })
      .addCase(getGrantById.fulfilled, (state, action) => {
        state.selectedGrant = action.payload?.data || action.payload;
      });
  },
});

export const { clearGrantState, setSelectedGrant } = businessGrantSlice.actions;
export default businessGrantSlice.reducer;
