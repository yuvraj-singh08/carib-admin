import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface CommissionType {
  id: string;
  type: string;
  commissionTitle: string;
  supplier: string;
  commissionFees: string;
  feeType: "PERCENT" | "FIXED";
  updateTime: string;
}

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

export const fetchCommissions = createAsyncThunk(
  "feesCommission/fetchCommissions",
  async () => {
    const response = await axios.get(`${apiUrl}/admin/commission`);
    console.log(response.data);
    return response.data.commission;
  }
);

export const addCommission = createAsyncThunk(
  "feesCommission/addCommission",
  async (data: Omit<CommissionType, "id" | "updateTime">) => {
    const response = await axios.post(`${apiUrl}/admin/add-commission`, data);
    return response.data.commission;
  }
);

export const updateCommission = createAsyncThunk(
  "feesCommission/updateCommission",
  async (data: CommissionType) => {
    const response = await axios.post(
      `${apiUrl}/admin/update-commission`,
      data
    );
    return response.data.commission;
  }
);

export const deleteCommission = createAsyncThunk(
  "feesCommission/deleteCommission",
  async (id: string) => {
    await axios.post(`${apiUrl}/admin/delete-commission`, { id });
    return id;
  }
);

const feesCommissionSlice = createSlice({
  name: "feesCommission",
  initialState: {
    commissions: [] as CommissionType[],
    types: ["AIRLINE", "HOTEL", "CAR_RENTAL"],
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    addType: (state, action) => {
      if (!state.types.includes(action.payload)) {
        state.types.push(action.payload);
      }
    },
    updateType: (state, action) => {
      const { oldType, newType } = action.payload;
      const index = state.types.indexOf(oldType);
      if (index !== -1) {
        state.types[index] = newType;
      }
    },
    deleteType: (state, action) => {
      state.types = state.types.filter((type) => type !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
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
        console.error("Error fetching commissions:", action.error.message);
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
      });
  },
});

export const { addType, updateType, deleteType } = feesCommissionSlice.actions;
export default feesCommissionSlice.reducer;
