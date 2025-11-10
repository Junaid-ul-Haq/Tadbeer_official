import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { consultationService } from "@/services/consultationService";

// 🧑‍🎓 User: Create consultation
export const createConsultation = createAsyncThunk(
  "consultation/createConsultation",
  async ({ token, data }, thunkAPI) => {
    try {
      const res = await consultationService.createConsultation(token, data);
      return res.consultation || res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🧑‍🎓 User: Fetch consultations
export const fetchUserConsultations = createAsyncThunk(
  "consultation/fetchUserConsultations",
  async (token, thunkAPI) => {
    try {
      const res = await consultationService.getMyConsultations(token);
      return res;
    } catch (error) {
      // Silently handle connection errors (backend not running)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        return []; // Return empty array instead of rejecting
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🧑‍🎓 Fetch categories
export const fetchCategories = createAsyncThunk(
  "consultation/fetchCategories",
  async (token, thunkAPI) => {
    try {
      const res = await consultationService.getCategories(token);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 👑 Admin: All consultations
export const fetchAllConsultations = createAsyncThunk(
  "consultation/fetchAllConsultations",
  async ({ token, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const res = await consultationService.getAllConsultations(token, page, limit);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 👑 Admin: Update status
export const updateConsultationStatus = createAsyncThunk(
  "consultation/updateConsultationStatus",
  async ({ token, id, status }, thunkAPI) => {
    try {
      const res = await consultationService.updateConsultationStatus(token, id, status);
      return res.consultation || res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 👑 Admin: Get single consultation
export const fetchConsultationById = createAsyncThunk(
  "consultation/fetchConsultationById",
  async ({ token, id }, thunkAPI) => {
    try {
      const res = await consultationService.getConsultationById(token, id);
      return res.consultation || res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  userConsultations: [],
  allConsultations: [],
  selectedConsultation: null,
  loading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    setSelectedConsultation: (state, action) => {
      state.selectedConsultation = action.payload;
    },
    resetConsultationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create consultation
      .addCase(createConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConsultation.fulfilled, (state, action) => {
        state.loading = false;
        state.userConsultations.push(action.payload);
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // User consultations
      .addCase(fetchUserConsultations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.userConsultations = action.payload;
      })
      .addCase(fetchUserConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Admin consultations
      .addCase(fetchAllConsultations.pending, (state) => {
        state.loading = true;
      })
     .addCase(fetchAllConsultations.fulfilled, (state, action) => {
  state.loading = false;
  state.allConsultations = action.payload.data || [];
  state.totalPages = action.payload.totalPages || 1;
})


      .addCase(fetchAllConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin status update
     
.addCase(updateConsultationStatus.fulfilled, (state, action) => {
  const idx = state.allConsultations.findIndex(c => c._id === action.payload._id);
  if (idx >= 0) state.allConsultations[idx].status = action.payload.status;

  const userIdx = state.userConsultations.findIndex(c => c._id === action.payload._id);
  if (userIdx >= 0) state.userConsultations[userIdx].status = action.payload.status;
})


      // Admin fetch by ID
      .addCase(fetchConsultationById.fulfilled, (state, action) => {
        state.selectedConsultation = action.payload;
      });
  },
});

export const { setSelectedConsultation, resetConsultationState } = consultationSlice.actions;
export default consultationSlice.reducer;
