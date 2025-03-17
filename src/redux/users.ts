import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  mobileNumber?: string;
  email: string;
  address?: string;
  dob?: string;
  passportNo?: string;
  lastBooking?: string;
  country?: string;
  gender?: string;
  pincode?: string;
  avatarSrc?: string;
  passportImage?: string;
  password?: string;
  cotraveler: any[];
}

interface UserState {
  users: User[];
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  status: "idle",
  error: null,
};

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axiosInstance.get<User[]>(`${API_BASE_URL}/user`);
  return response.data;
});

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (id: string) => {
    const response = await axiosInstance.get<User>(`${API_BASE_URL}/user/${id}`);
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (userData: Partial<User>) => {
    const response = await axiosInstance.put<User>(
      `${API_BASE_URL}/user/profile`,
      userData
    );
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: User) => {
    const response = await axiosInstance.put<User>(
      `${API_BASE_URL}/admin/user`,
      userData
    );
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => {
    await axiosInstance.post(`${API_BASE_URL}/admin/user/${id}`);
    return id;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser && state.currentUser.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.currentUser && state.currentUser.id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default userSlice.reducer;