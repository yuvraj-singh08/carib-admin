import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface SearchManagement {
  id: string;
  ruleTitle: string;
  gdsNdcSupplier: "AMADEUS" | "KIUSYS" | "DUFFEL" | "ALL" | "NONE";
  ruleType: "CREATE_COMBINATION" | "COMING_SOON";
  journeyType: "ONEWAY" | "ROUNDTRIP" | "MULTIWAY";
  fromOriginAirport: string[];
  toDestinationsAirport: string[];
  connectingAirports: string[][];
  airlinesIncluded: string;
  airlinesExcluded: string;
  flightExcluded: string;
  minConnectionTime: string;
  maxConnectionTime: string;
  status: string;
  noteDescription: string;
  priority: number;
  fareCodesExcluded: string;
  lastUpdate: Date;
}

interface SearchManagementState {
  entries: SearchManagement[];
  currentEntry: SearchManagement | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SearchManagementState = {
  entries: [],
  currentEntry: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const createSearchManagement = createAsyncThunk(
  "searchManagement/create",
  async (data: Omit<SearchManagement, "id" | "lastUpdate">) => {
    const response = await axios.post<SearchManagement>(
      `${API_BASE_URL}/admin/add-search`,
      data
    );
    return response.data;
  }
);

export const getSearchManagement = createAsyncThunk(
  "searchManagement/getAll",
  async () => {
    const response = await axios.get<SearchManagement[]>(
      `${API_BASE_URL}/admin/search`
    );
    return response.data;
  }
);

export const updateSearchManagement = createAsyncThunk(
  "searchManagement/update",
  async (data: SearchManagement) => {
    const response = await axios.post<SearchManagement>(
      `${API_BASE_URL}/admin/update-search`,
      data
    );
    return response.data;
  }
);

export const deleteSearchManagement = createAsyncThunk(
  "searchManagement/delete",
  async (id: string) => {
    await axios.post(`${API_BASE_URL}/admin/delete-search`, { id });
    return id;
  }
);

const searchManagementSlice = createSlice({
  name: "searchManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSearchManagement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createSearchManagement.fulfilled,
        (state, action: PayloadAction<SearchManagement>) => {
          state.status = "succeeded";
          state.entries.push(action.payload);
        }
      )
      .addCase(createSearchManagement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getSearchManagement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getSearchManagement.fulfilled,
        (state, action: PayloadAction<SearchManagement[]>) => {
          state.status = "succeeded";
          state.entries = action.payload;
        }
      )
      .addCase(getSearchManagement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateSearchManagement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateSearchManagement.fulfilled,
        (state, action: PayloadAction<SearchManagement>) => {
          state.status = "succeeded";
          const index = state.entries.findIndex(
            (entry) => entry.id === action.payload.id
          );
          if (index !== -1) {
            state.entries[index] = action.payload;
          }
          if (
            state.currentEntry &&
            state.currentEntry.id === action.payload.id
          ) {
            state.currentEntry = action.payload;
          }
        }
      )
      .addCase(updateSearchManagement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteSearchManagement.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteSearchManagement.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.entries = state.entries.filter(
            (entry) => entry.id !== action.payload
          );
          if (state.currentEntry && state.currentEntry.id === action.payload) {
            state.currentEntry = null;
          }
        }
      )
      .addCase(deleteSearchManagement.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default searchManagementSlice.reducer;
