import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

// Defining the user interface based on Prisma model
export interface ManageUser {
  id: string;
  uniqueId: string;
  name: string;
  address: string;
  email: string;
  password: string;
  contact: string;
  roleId: string;
  roleName: string;
  status: "ACTIVE" | "INACTIVE";
}

interface UserState {
  users: ManageUser[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  status: 'idle',
  error: null,
};

// Thunks for CRUD operations

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const response = await axiosInstance.get(`${apiUrl}/admin/users`);
    return response.data.users;
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string) => {
    const response = await axiosInstance.get(`${apiUrl}/admin/user/${id}`);
    return response.data.user;
  }
);

// Add new user
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData: Omit<ManageUser, "id" | "password"> & { roleId: string }) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/add-user`, {
      ...userData,
      role: {
        connect: {
          id: userData.roleId,
        },
      },
    });
    return response.data.user;
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: Partial<ManageUser> & { id: string }) => {
    const response = await axiosInstance.post(`${apiUrl}/admin/update-user`, userData);
    return response.data.user;
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => {
    await axiosInstance.post(`${apiUrl}/admin/delete-user`, { id });
    return id;
  }
);

// User slice with extra reducers
const manageUsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // Fetch user by ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })

      // Add new user
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default manageUsersSlice.reducer;
