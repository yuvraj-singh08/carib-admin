import { axiosInstance } from "@/provider/axios";
import { RootState } from "@/provider/redux-provider";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import { RootState} from '../store';
// import { UseSelector } from 'react-redux';

export interface User {
  mobileNumber: string;
  gender: string;
  dob: Date;
  pincode: string;
  address: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role?: string;
  password: string;
  avatarSrc: string;
  passportDetails?: {
    passportNumber: string;
    issuingCountry: string;
    expiryDate: string;
    passportImg: string;
  };
  coTraveler?: {
    name: string;
    email: string;
    dateOfBirth: string;
    passportNumber: string;
    phoneNumber: string;
  }[];
  frequentlyFlyer?: {
    flyerNumber: string;
    airlines: string[];
  };
}

interface UserProfileProps {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  gender?: string;
  dob?: string;
  pincode?: string;
  address?: string;
  avatarSrc?: string;
  role?: string;
  password?: string;
  passportDetails?: {
    passportNumber: string;
    issuingCountry: string;
    expiryDate: string;
    passportImg: string;
  };
  coTraveler?: {
    name: string;
    email: string;
    dateOfBirth: string;
    passportNumber: string;
    phoneNumber: string;
  }[];
  frequentlyFlyer?: {
    flyerNumber: string;
    airlines: string[];
  };
}

export interface UserState {
  user: User | null;
  loginStatus: "idle" | "loading" | "succeeded" | "failed";
  signupStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchUserStatus: "idle" | "loading" | "succeeded" | "failed";
  updateProfileStatus: "idle" | "loading" | "succeeded" | "failed";
  updatePasswordStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loginStatus: "idle",
  signupStatus: "idle",
  fetchUserStatus: "idle",
  updateProfileStatus: "idle",
  updatePasswordStatus: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/user/login", credentials);
      const jwtToken = response?.data?.token;
      const userId = response?.data?.data?.userId;
      if (jwtToken) {
        window.localStorage.setItem("authToken", jwtToken);
        window.localStorage.setItem("userId", userId);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signup = createAsyncThunk(
  "user/register",
  async (
    credentials: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/user/register", credentials);
      const jwtToken = response?.data?.data?.token;
      if (jwtToken) {
        window.localStorage.setItem("token", jwtToken);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/profile");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Fetch user failed";
      console.error("Error fetching user:", message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (updatedProfileData: UserProfileProps, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/user/profile",
        updatedProfileData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Profile update failed");
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (newPassword: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/update-password", {
        password: newPassword,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Password update failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = null;
      state.loginStatus = "idle";
      state.signupStatus = "idle";
      state.fetchUserStatus = "idle";
      state.updateProfileStatus = "idle";
      state.updatePasswordStatus = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload as string;
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.signupStatus = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.signupStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupStatus = "failed";
        state.error = action.payload as string;
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.fetchUserStatus = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.fetchUserStatus = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.fetchUserStatus = "failed";
        state.error = action.payload as string;
      });
    //update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.updateProfileStatus = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateProfileStatus = "succeeded";
        state.user = action.payload; // Update the user profile in the state with new data
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateProfileStatus = "failed";
        state.error = action.payload as string;
      });
    // update password
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.updatePasswordStatus = "loading";
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.updatePasswordStatus = "succeeded";
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.updatePasswordStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
export const selectLoginStatus = (state: RootState): UserState["loginStatus"] =>
  state.user.loginStatus;
export const selectUpdatePasswordStatus = (
  state: RootState
): UserState["updatePasswordStatus"] => state.user.updatePasswordStatus;
