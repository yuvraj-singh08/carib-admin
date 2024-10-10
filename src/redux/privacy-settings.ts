import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface PrivacyPolicy {
  id: string;
  isEnabled: boolean;
  content: any[];
}

interface PrivacyPolicyState {
  privacyPolicies: PrivacyPolicy[];
  currentPrivacyPolicy: PrivacyPolicy | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PrivacyPolicyState = {
  privacyPolicies: [],
  currentPrivacyPolicy: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const addPrivacyPolicy = createAsyncThunk(
  "privacyPolicy/addPrivacyPolicy",
  async (privacyPolicyData: Omit<PrivacyPolicy, "id">) => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/add-privacy`,
      privacyPolicyData
    );
    return response.data.privacy;
  }
);

export const getPrivacyPolicies = createAsyncThunk(
  "privacyPolicy/getPrivacyPolicies",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/privacies`);
    return response.data.privacy;
  }
);

export const getPrivacyPolicyById = createAsyncThunk(
  "privacyPolicy/getPrivacyPolicyById",
  async (id: string) => {
    const response = await axios.post(`${API_BASE_URL}/admin/privacy/`, { id });
    return response.data.privacy;
  }
);

export const updatePrivacyPolicy = createAsyncThunk(
  "privacyPolicy/updatePrivacyPolicy",
  async (privacyPolicyData: PrivacyPolicy) => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/update-privacy`,
      privacyPolicyData
    );
    return response.data.privacy;
  }
);

export const deletePrivacyPolicy = createAsyncThunk(
  "privacyPolicy/deletePrivacyPolicy",
  async (id: string) => {
    await axios.post(`${API_BASE_URL}/admin/delete-privacy`, { id });
    return id;
  }
);

const privacyPolicySlice = createSlice({
  name: "privacyPolicy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPrivacyPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPrivacyPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.privacyPolicies.push(action.payload);
      })
      .addCase(addPrivacyPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getPrivacyPolicies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPrivacyPolicies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.privacyPolicies = action.payload;
      })
      .addCase(getPrivacyPolicies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getPrivacyPolicyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPrivacyPolicyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentPrivacyPolicy = action.payload;
      })
      .addCase(getPrivacyPolicyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updatePrivacyPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.privacyPolicies.findIndex(
          (policy) => policy.id === action.payload.id
        );
        if (index !== -1) {
          state.privacyPolicies[index] = action.payload;
        }
        state.currentPrivacyPolicy = action.payload;
      })
      .addCase(updatePrivacyPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deletePrivacyPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePrivacyPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.privacyPolicies = state.privacyPolicies.filter(
          (policy) => policy.id !== action.payload
        );
        if (
          state.currentPrivacyPolicy &&
          state.currentPrivacyPolicy.id === action.payload
        ) {
          state.currentPrivacyPolicy = null;
        }
      })
      .addCase(deletePrivacyPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default privacyPolicySlice.reducer;