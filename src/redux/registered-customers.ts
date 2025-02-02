import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface coTraveler {
  name: string;
  dateOfBirth: string;
  email: string;
  passportNumber: string;
  phoneNumber: string;
}

interface passportDetails {
  passportNumber: string;
  passportImg: string[];
  expiryDate: string;
  issuingCountry: string;
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
  lastBooking?: string;
  isBlocked?: boolean;
  country?: string;
  gender?: string;
  pincode?: string;
  avatarSrc?: string;
  passportDetails?: passportDetails;
  password?: string;
  coTraveler: coTraveler[];
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

// export const fetchCustomers = createAsyncThunk(
//   "users/fetchCustomers",
//   async () => {
//     const response = await axios.get<Customer[]>(`${API_BASE_URL}/user`);
//     return response.data;
//   }
// );

export const fetchCustomers = createAsyncThunk(
  "users/fetchCustomers",
  async () => {
    const response = await axios.get<Customer[]>(`${API_BASE_URL}/user`);
    // Filter out customers with "ADMIN" role
    return response.data.filter(customer => customer.role !== "ADMIN");
  }
);


export const deleteCustomer = createAsyncThunk(
  "users/deleteCustomer",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/user/del-user`, { id });
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred while deleting the user");
    }
  }
);

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
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteCustomer.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.customers = state.customers.filter(
            (customer) => customer.id !== action.payload
          );
        }
      )
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;
