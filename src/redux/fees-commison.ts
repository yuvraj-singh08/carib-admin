import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface CommissionType {
  id: string;
  type: string;
  commissionTitle: string;
  supplier: string;
  commissionFees: string;
  feeType: "PERCENT" | "FIXED";
  updateTime: string;
}

export interface CommissionTypeItem {
  id: string;
  type: string;
}

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

// Commission Thunks
export const fetchCommissions = createAsyncThunk(
  "commissionManager/fetchCommissions",
  async () => {
    const response = await axiosInstance.get(`${apiUrl}/admin/commission`);
    return response.data.commission;
  }
);

export const addCommission = createAsyncThunk(
  "commissionManager/addCommission",
  async (data: Omit<CommissionType, "id" | "updateTime">) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/add-commission`, data);
    return response.data.commission;
  }
);

export const updateCommission = createAsyncThunk(
  "commissionManager/updateCommission",
  async (data: CommissionType) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/update-commission`, data);
    return response.data.commission;
  }
);

export const deleteCommission = createAsyncThunk(
  "commissionManager/deleteCommission",
  async (id: string) => {
    await axiosInstance.post(`${apiUrl}/admin/delete-commission`, { id });
    return id;
  }
);

// Commission Type Thunks
export const fetchCommissionTypes = createAsyncThunk(
  "commissionManager/fetchCommissionTypes",
  async () => {
    const response = await axiosInstance.get(`${apiUrl}/admin/types`);
    return response.data.commissionTypes;
  }
);

export const addCommissionType = createAsyncThunk(
  "commissionManager/addCommissionType",
  async (type: string) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/add-type`, { type });
    return response.data.commissionType;
  }
);

export const updateCommissionType = createAsyncThunk(
  "commissionManager/updateCommissionType",
  async ({ id, type }: { id: string; type: string }) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/update-type`, { id, type });
    return response.data.commissionType;
  }
);

export const deleteCommissionType = createAsyncThunk(
  "commissionManager/deleteCommissionType",
  async (id: string) => {
    await axiosInstance.post(`${apiUrl}/admin/delete-type`, { id });
    return id;
  }
);

const commissionManagerSlice = createSlice({
  name: "commissionManager",
  initialState: {
    commissions: [] as CommissionType[],
    commissionTypes: [] as CommissionTypeItem[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Commission cases
      .addCase(fetchCommissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.commissions = action.payload;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addCommission.fulfilled, (state, action) => {
        state.commissions.push(action.payload);
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        const index = state.commissions.findIndex(
          (commission) => commission.id === action.payload.id
        );
        if (index !== -1) {
          state.commissions[index] = action.payload;
        }
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.commissions = state.commissions.filter(
          (commission) => commission.id !== action.payload
        );
      })
      // Commission Type cases
      .addCase(fetchCommissionTypes.fulfilled, (state, action) => {
        state.commissionTypes = action.payload;
      })
      .addCase(addCommissionType.fulfilled, (state, action) => {
        state.commissionTypes.push(action.payload);
      })
      .addCase(updateCommissionType.fulfilled, (state, action) => {
        const index = state.commissionTypes.findIndex(
          (type) => type.id === action.payload.id
        );
        if (index !== -1) {
          state.commissionTypes[index] = action.payload;
        }
      })
      .addCase(deleteCommissionType.fulfilled, (state, action) => {
        state.commissionTypes = state.commissionTypes.filter(
          (type) => type.id !== action.payload
        );
      });
  },
});

export default commissionManagerSlice.reducer;