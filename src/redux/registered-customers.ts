import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Cotraveler {
  name: string;
  dob: string;
  email: string;
  passportNo: string;
  phoneNumber: string;
}

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  mobileNumber?: string;
  email: string;
  address?: string;
  dob?: string;
  role: "ADMIN" | "USER";
  passportNo?: string;
  lastBooking?: string;
  country?: string;
  gender?: string;
  pincode?: string;
  avatarSrc?: string;
  passportImage?: string;
  password?: string;
  cotraveler: Cotraveler[];
}

interface CustomerState {
  customers: Customer[];
  currentCustomers: Customer | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  currentCustomers: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const fetchCustomers = createAsyncThunk("users/fetchCustomers", async () => {
  const response = await axios.get<Customer[]>(`${API_BASE_URL}/user`);
  return response.data;
});

const customerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCustomers.fulfilled,
        (state, action: PayloadAction<Customer[]>) => {
          state.status = "succeeded";
          state.customers = action.payload;
        }
      )
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default customerSlice.reducer;
