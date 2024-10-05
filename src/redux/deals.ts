import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Deal {
  id: string;
  title: string;
  way: string;
  code: string;
  origin: string | null;
  discount: string;
  discountType: string;
  airlineCode: string | null;
  userLimit: number;
  used: number;
  flightCode: string | null;
  expiryDate: Date;
  imageUrl: string;
  description: string;
}

interface DealsState {
  deals: Deal[];
  currentDeal: Deal | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DealsState = {
  deals: [],
  currentDeal: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const createDeal = createAsyncThunk(
  "deals/createDeal",
  async (dealData: Omit<Deal, "id">) => {
    const response = await axios.post<Deal>(
      `${API_BASE_URL}/admin/add-deal`,
      dealData
    );
    return response.data;
  }
);

export const getDeals = createAsyncThunk("deals/getDeals", async () => {
  const response = await axios.get<Deal[]>(`${API_BASE_URL}/admin/deals`);
  return response.data;
});

export const getDealById = createAsyncThunk(
  "deals/getDealById",
  async (id: string) => {
    const response = await axios.get<Deal>(`${API_BASE_URL}/deal/${id}`);
    return response.data;
  }
);

export const getDealByCode = createAsyncThunk(
  "deals/getDealByCode",
  async (code: string) => {
    const response = await axios.get<{ deal: Deal }>(`${API_BASE_URL}/deal/code/${code}`);
    return response.data.deal;
  }
);

export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async (dealData: Deal) => {
    const response = await axios.post<Deal>(
      `${API_BASE_URL}/admin/update-deal`,
      dealData
    );
    return response.data;
  }
);

export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id: string) => {
    await axios.post(`${API_BASE_URL}/admin/delete-deal`, { id });
    return id;
  }
);

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.status = "succeeded";
        state.deals.push(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getDeals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDeals.fulfilled, (state, action: PayloadAction<Deal[]>) => {
        state.status = "succeeded";
        state.deals = action.payload;
      })
      .addCase(getDeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getDealById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDealById.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.status = "succeeded";
        state.currentDeal = action.payload;
      })
      .addCase(getDealById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getDealByCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDealByCode.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.status = "succeeded";
        state.currentDeal = action.payload;
      })
      .addCase(getDealByCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateDeal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDeal.fulfilled, (state, action: PayloadAction<Deal>) => {
        state.status = "succeeded";
        const index = state.deals.findIndex(
          (deal) => deal.id === action.payload.id
        );
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
        state.currentDeal = action.payload;
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteDeal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDeal.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.deals = state.deals.filter((deal) => deal.id !== action.payload);
        if (state.currentDeal && state.currentDeal.id === action.payload) {
          state.currentDeal = null;
        }
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default dealsSlice.reducer;