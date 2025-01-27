import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/provider/axios';

// Define types
interface FlightDetails {
  id: string;
  details: any; // Replace `any` with a proper type if available
  segment: any; // Replace `any` with a proper type if available
  price: any; // Replace `any` with a proper type if available
  passengers: any[]; // Replace `any` with a proper type if available
}

interface FlightState {
  flight: any;
  flightDetails: any | null ;
  loading: boolean;
  error: string | null;
}

interface UpdateFlightPayload {
  bookingId: string;
  updatedData: Record<string, any>; // Replace `any` with proper types if available
}

// Initial state
const initialState: FlightState = {
  flightDetails: null,
  loading: false,
  error: null,
  flight: undefined
};

// Async thunks

// Fetch Flight Details
export const fetchFlightDetails = createAsyncThunk<FlightDetails, string, { rejectValue: string }>(
  'flight/fetchFlightDetails',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/book/${bookingId}`);
      console.log("response...",response.data.data)
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Flight Details
export const updateFlightDetails = createAsyncThunk<FlightDetails, UpdateFlightPayload, { rejectValue: string }>(
  'flight/updateFlightDetails',
  async ({ bookingId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/v1/bookings/${bookingId}`, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Flight Details
      .addCase(fetchFlightDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlightDetails.fulfilled, (state, action: PayloadAction<FlightDetails>) => {
        state.loading = false;
        state.flightDetails = action.payload;
      })
      .addCase(fetchFlightDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch flight details';
      })

      // Update Flight Details
      .addCase(updateFlightDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlightDetails.fulfilled, (state, action: PayloadAction<FlightDetails>) => {
        state.loading = false;
        state.flightDetails = action.payload;
      })
      .addCase(updateFlightDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update flight details';
      });
  },
});

export default flightSlice.reducer;
