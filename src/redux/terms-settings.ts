import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


interface TermsAndConditions {
  id: string;
  isEnabled: boolean;
  content: any[];
}

interface TermsAndConditionsState {
  termsAndConditions: TermsAndConditions[];
  currentTermsAndConditions: TermsAndConditions | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TermsAndConditionsState = {
  termsAndConditions: [],
  currentTermsAndConditions: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const addTermsAndConditions = createAsyncThunk(
  "termsAndConditions/addTermsAndConditions",
  async (termsData: Omit<TermsAndConditions, "id">) => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/admin/add-term`,
      termsData
    );
    return response.data.privacy;
  }
);

export const getTermsAndConditions = createAsyncThunk(
  "termsAndConditions/getTermsAndConditions",
  async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/admin/terms`);
    return response.data.privacy;
  }
);

export const getTermsAndConditionsById = createAsyncThunk(
  "termsAndConditions/getTermsAndConditionsById",
  async (id: string) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/admin/term/${id}`);
    return response.data.privacy;
  }
);

export const updateTermsAndConditions = createAsyncThunk(
  "termsAndConditions/updateTermsAndConditions",
  async (termsData: TermsAndConditions) => {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/admin/update-term`,
      termsData
    );
    return response.data.privacy;
  }
);

export const deleteTermsAndConditions = createAsyncThunk(
  "termsAndConditions/deleteTermsAndConditions",
  async (id: string) => {
    await axiosInstance.post(`${API_BASE_URL}/admin/delete-term`, { id });
    return id;
  }
);

const termsAndConditionsSlice = createSlice({
  name: "termsAndConditions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTermsAndConditions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTermsAndConditions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.termsAndConditions.push(action.payload);
      })
      .addCase(addTermsAndConditions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getTermsAndConditions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTermsAndConditions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.termsAndConditions = action.payload;
      })
      .addCase(getTermsAndConditions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getTermsAndConditionsById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTermsAndConditionsById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentTermsAndConditions = action.payload;
      })
      .addCase(getTermsAndConditionsById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateTermsAndConditions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTermsAndConditions.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.termsAndConditions.findIndex(
          (terms) => terms.id === action.payload.id
        );
        if (index !== -1) {
          state.termsAndConditions[index] = action.payload;
        }
        state.currentTermsAndConditions = action.payload;
      })
      .addCase(updateTermsAndConditions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteTermsAndConditions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTermsAndConditions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.termsAndConditions = state.termsAndConditions.filter(
          (terms) => terms.id !== action.payload
        );
        if (
          state.currentTermsAndConditions &&
          state.currentTermsAndConditions.id === action.payload
        ) {
          state.currentTermsAndConditions = null;
        }
      })
      .addCase(deleteTermsAndConditions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default termsAndConditionsSlice.reducer;