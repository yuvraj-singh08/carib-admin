import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export type FlightRule = {
  id: string;
  title: string;
  supplier: string;
  code: string;
  flightNumber: string;
  from: string;
  to: string;
  updateTime: string;
};

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

export const fetchFlightRules = createAsyncThunk(
  "flightRules/fetchFlightRules",
  async () => {
    const response = await axiosInstance.get(`${apiUrl}/admin/firewall`);
    return response.data.firewall;
  }
);

export const addFlightRule = createAsyncThunk(
  "flightRules/addFlightRule",
  async (data: Omit<FlightRule, "id" | "updateTime">) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/add-firewall`, data);
    return response.data.firewall; 
  }
);

export const deleteFlightRule = createAsyncThunk(
  "flightRules/deleteFlightRule",
  async (id: string) => {
    await axiosInstance.post(`${apiUrl}/admin/delete-firewall`, { id });
    return id;
  }
);

const flightRulesSlice = createSlice({
  name: "flightRules",
  initialState: {
    rules: [] as FlightRule[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlightRules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFlightRules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rules = action.payload;
      })
      .addCase(fetchFlightRules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addFlightRule.fulfilled, (state, action) => {
        state.rules.push(action.payload);
      })
      .addCase(deleteFlightRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter((rule) => rule.id !== action.payload);
      });
  },
});

export default flightRulesSlice.reducer;