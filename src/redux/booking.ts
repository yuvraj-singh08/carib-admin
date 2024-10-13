import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

// Enum for AdminStatus
export enum AdminStatus {
  TICKETED = "TICKETED",
  PENDING_TICKET = "PENDING_TICKET",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  EXPIRED = "EXPIRED",
  FAILED_BOOKING = "FAILED_BOOKING",
}

// Interface for Booking based on the database model
export interface Booking {
  id: string;
  contactDetail: {
    email: string;
    phone: string;
  };
  flightDetails: any[]; // You might want to create a more specific type for this
  payment: any[]; // You might want to create a more specific type for this
  passenger: any[]; // You might want to create a more specific type for this
  address: {
    // Add relevant address fields
  };
  baseFare: any[]; // You might want to create a more specific type for this
  tax_fee_surges: any[]; // You might want to create a more specific type for this
  otherCharges: any[]; // You might want to create a more specific type for this
  discount?: any; // You might want to create a more specific type for this
  totalAmount: number;
  currency: string;
  adminStatus: AdminStatus;
  userId: string;
}

interface BookingState {
  bookings: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  status: "idle",
  error: null,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => {
    const response = await axios.get(`${apiUrl}/book/bookings`);
    return response.data.booking;
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id: string) => {
    await axios.post(`${apiUrl}/book/delete-booking`, { id });
    return id;
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async (bookingData: Partial<Booking> & { id: string }) => {
    const { id, ...data } = bookingData;
    const response = await axios.post(`${apiUrl}/book/update-booking`, {
      id,
      ...data,
    });
    return response.data.booking;
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export default bookingsSlice.reducer;

export const selectBookingStatusCounts = (state: {
  bookings: BookingState;
}) => {
  const bookingCounts = {
    [AdminStatus.TICKETED]: 0,
    [AdminStatus.PENDING_TICKET]: 0,
    [AdminStatus.PENDING_PAYMENT]: 0,
    [AdminStatus.EXPIRED]: 0,
    [AdminStatus.FAILED_BOOKING]: 0,
  };

  state.bookings.bookings.forEach((booking) => {
    bookingCounts[booking.adminStatus]++;
  });

  return bookingCounts;
};
