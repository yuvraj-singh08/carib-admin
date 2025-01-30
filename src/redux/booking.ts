import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// import { DateRange } from "react-day-picker";

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

export enum AdminStatus {
  TICKETED = "TICKETED",
  PENDING_TICKET = "PENDING_TICKET",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  EXPIRED = "EXPIRED",
  FAILED_BOOKING = "FAILED_BOOKING",
}

export interface Booking {
  id: string;
  contactDetail: {
    email: string;
    phone: string;
  };
  flightDetails: any[];
  payment: any[];
  passenger: any[];
  address: Record<string, unknown>;
  baseFare: any[];
  tax_fee_surges: any[];
  otherCharges: any[];
  discount?: any;
  totalAmount: number;
  currency: string;
  adminStatus: AdminStatus;
  userId: string;
  sendEmail?: boolean;
  
}

interface BookingState {
  bookings: Booking[];
  total:number
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  loading: boolean;
  emailSending: { [key: string]: boolean };
  emailError: { [key: string]: string | null };
  
}

const initialState: BookingState = {
  bookings: [],
  total:0,
  status: "idle",
  error: null,
  loading: false,
  emailSending: {},
  emailError: {},
};

export const sendBookingEmail = createAsyncThunk(
  "bookings/sendEmail",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/email/send",
        { bookingId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { bookingId, data: response.data };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ bookingId, error: error.message });
      }
      return rejectWithValue({ bookingId, error: "Failed to send email" });
    }
  }
);

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (
    params: {
      // date?: DateRange | undefined;
      from:Date | undefined ,
      to:Date | undefined,
      pageIndex: number;
      pageSize: number;
      globalFilter?: string;
      searchKey?:string;
      status?:string
    },

     { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/book/bookings`,
       params
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch bookings");
    }
  }
);


export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`${apiUrl}/book/delete-booking`, { id });
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete booking");
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async (bookingData: Partial<Booking> & { id: string }, { rejectWithValue }) => {
    try {
      const { id, ...data } = bookingData;
      const response = await axiosInstance.post(`${apiUrl}/book/update-booking`, {
        id,
        ...data,
      });
      return response.data.booking;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update booking");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    resetState: (state) => {
      state.status = "idle";
      state.error = null;
      state.loading = false;
      state.emailSending = {};
      state.emailError = {};
    },
    clearEmailError: (state, action: PayloadAction<string>) => {
      state.emailError[action.payload] = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(sendBookingEmail.pending, (state, action) => {
      const bookingId = action.meta.arg;
      state.emailSending[bookingId] = true;
      state.emailError[bookingId] = null;
    })
    .addCase(sendBookingEmail.fulfilled, (state, action) => {
      const { bookingId } = action.payload;
      state.emailSending[bookingId] = false;
      state.emailError[bookingId] = null;
      // Update the booking to mark email as sent
      const booking = state.bookings.find(b => b.id === bookingId);
      if (booking) {
        booking.sendEmail = true;
      }
    })
    .addCase(sendBookingEmail.rejected, (state, action) => {
      const payload = action.payload as { bookingId: string; error: string };
      state.emailSending[payload.bookingId] = false;
      state.emailError[payload.bookingId] = payload.error;
    })
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.loading = false;
        //state.bookings = action.payload.data;
        state.bookings = action.payload.data.map((booking: Booking) => ({
          ...booking,
          sendEmail: booking.sendEmail ?? false
        }));
        state.total=action.payload.total;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string ?? "Failed to fetch bookings";
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      })
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { resetState, clearEmailError } = bookingsSlice.actions;

export default bookingsSlice.reducer;

export const selectBookingStatusCounts = (state: { bookings: BookingState }) => {
  const bookingCounts: Record<AdminStatus, number> = {
    [AdminStatus.TICKETED]: 0,
    [AdminStatus.PENDING_TICKET]: 0,
    [AdminStatus.PENDING_PAYMENT]: 0,
    [AdminStatus.EXPIRED]: 0,
    [AdminStatus.FAILED_BOOKING]: 0,
  };

  if (!state.bookings.bookings?.length) {
    return bookingCounts;
  }

  state.bookings.bookings.forEach((booking) => {
    if (booking.adminStatus in bookingCounts) {
      bookingCounts[booking.adminStatus]++;
    }
  });

  return bookingCounts;
};