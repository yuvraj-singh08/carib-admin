import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

// Enum for ticket status
export enum TicketStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  RESOLVE = "RESOLVE",
}

// Interface for Ticket based on the database model
export interface Ticket {
  id: string;
  subject: string;
  requesterName: string;
  requestedOn: string; // We'll use string for dates in the frontend
  status: TicketStatus;
  images: string[];
}

interface TicketState {
  tickets: Ticket[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  status: "idle",
  error: null,
};

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async () => {
    const response = await axios.get(`${apiUrl}/admin/tickets`);
    return response.data.tickets;
  }
);

export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (id: string) => {
    const response = await axios.get(`${apiUrl}/admin/ticket/${id}`);
    return response.data.ticket;
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async (ticketData: Partial<Ticket> & { id: string }) => {
    const response = await axios.post(`${apiUrl}/admin/update-ticket`, {
      id: ticketData.id,
    });
    return response.data.ticket;
  }
);

export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (id: string) => {
    await axios.post(`${apiUrl}/admin/delete-ticket`, { id });
    return id;
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        } else {
          state.tickets.push(action.payload);
        }
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(
          (ticket) => ticket.id !== action.payload
        );
      });
  },
});

export default ticketsSlice.reducer;
