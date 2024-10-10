import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface EmailSMTP {
  id: string;
  mailDriver: string;
  mailDriverHost: string;
  mailPort: string;
  mailUsername: string;
  mailPassword: string;
  mailEncryption: string;
  mailFromAddress: string;
  mailFromName: string;
}

interface EmailSMTPState {
  emailSMTPs: EmailSMTP[];
  currentEmailSMTP: EmailSMTP | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EmailSMTPState = {
  emailSMTPs: [],
  currentEmailSMTP: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const addEmailSMTP = createAsyncThunk(
  "emailSMTP/addEmailSMTP",
  async (emailSMTPData: Omit<EmailSMTP, "id">) => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/add-email-smtp`,
      emailSMTPData
    );
    return response.data.emailSMTP;
  }
);

export const getEmailSMTPs = createAsyncThunk(
  "emailSMTP/getEmailSMTPs",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/emails`);
    return response.data.emailSMTP;
  }
);

export const getEmailSMTPById = createAsyncThunk(
  "emailSMTP/getEmailSMTPById",
  async (id: string) => {
    const response = await axios.post(`${API_BASE_URL}/admin/email`, { id });
    return response.data.emailSMTP;
  }
);

export const updateEmailSMTP = createAsyncThunk(
  "emailSMTP/updateEmailSMTP",
  async (emailSMTPData: EmailSMTP) => {
    const response = await axios.post(
      `${API_BASE_URL}/admin/update-email-smtp`,
      emailSMTPData
    );
    return response.data.emailSMTP;
  }
);

export const deleteEmailSMTP = createAsyncThunk(
  "emailSMTP/deleteEmailSMTP",
  async (id: string) => {
    await axios.post(`${API_BASE_URL}/admin/delete-email-smtp`, { id });
    return id;
  }
);

const emailSMTPSlice = createSlice({
  name: "emailSMTP",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEmailSMTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addEmailSMTP.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.emailSMTPs.push(action.payload);
      })
      .addCase(addEmailSMTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getEmailSMTPs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmailSMTPs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.emailSMTPs = action.payload;
      })
      .addCase(getEmailSMTPs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getEmailSMTPById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmailSMTPById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentEmailSMTP = action.payload;
      })
      .addCase(getEmailSMTPById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateEmailSMTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEmailSMTP.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.emailSMTPs.findIndex(
          (smtp) => smtp.id === action.payload.id
        );
        if (index !== -1) {
          state.emailSMTPs[index] = action.payload;
        }
        state.currentEmailSMTP = action.payload;
      })
      .addCase(updateEmailSMTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteEmailSMTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteEmailSMTP.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.emailSMTPs = state.emailSMTPs.filter(
          (smtp) => smtp.id !== action.payload
        );
        if (
          state.currentEmailSMTP &&
          state.currentEmailSMTP.id === action.payload
        ) {
          state.currentEmailSMTP = null;
        }
      })
      .addCase(deleteEmailSMTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default emailSMTPSlice.reducer;
