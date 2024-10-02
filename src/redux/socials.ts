import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type SocialPlatform = {
  url: string;
  enabled: boolean;
};

export type SocialSettings = {
  id: string;
  socialsEnable: boolean;
  socialPlatforms: SocialPlatform[];
};

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

// Fetch all social settings
export const fetchSocialSettings = createAsyncThunk(
  "socialSettings/fetchSocialSettings",
  async () => {
    const response = await axios.get(`${apiUrl}/admin/socials`);
    return response.data.socials as SocialSettings[]; 
  }
);

// Fetch a specific social setting by ID
export const fetchSocialSettingById = createAsyncThunk(
  "socialSettings/fetchSocialSettingById",
  async (id: string) => {
    const response = await axios.post(`${apiUrl}/admin/get-social`, { id });
    return response.data.social as SocialSettings;
  }
);

// Add new social settings
export const addSocialSettings = createAsyncThunk(
  "socialSettings/addSocialSettings",
  async (data: Omit<SocialSettings, "id">) => {
    const response = await axios.post(`${apiUrl}/admin/add-social`, data);
    return response.data.social as SocialSettings; // Assumes the backend returns the created social object
  }
);

// Update existing social settings
export const updateSocialSettings = createAsyncThunk(
  "socialSettings/updateSocialSettings",
  async (data: { id: string; socialsEnable: boolean; socialPlatforms: SocialPlatform[] }) => {
    const response = await axios.post(`${apiUrl}/admin/update-social`, data);
    return response.data.social as SocialSettings; // Assumes the backend returns the updated social object
  }
);

// Delete social settings
export const deleteSocialSettings = createAsyncThunk(
  "socialSettings/deleteSocialSettings",
  async (id: string) => {
    await axios.post(`${apiUrl}/admin/delete-social`, { id });
    return id; // Return the deleted ID for removing from the state
  }
);

const socialSettingsSlice = createSlice({
  name: "socialSettings",
  initialState: {
    settings: [] as SocialSettings[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch social settings
      .addCase(fetchSocialSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSocialSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings = action.payload;
      })
      .addCase(fetchSocialSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      // Handle fetching a single social setting by ID
      .addCase(fetchSocialSettingById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSocialSettingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update or add the fetched social setting into the settings list
        const index = state.settings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.settings[index] = action.payload;
        } else {
          state.settings.push(action.payload);
        }
      })
      .addCase(fetchSocialSettingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })

      // Handle adding new social settings
      .addCase(addSocialSettings.fulfilled, (state, action) => {
        state.settings.push(action.payload);
      })

      // Handle updating existing social settings
      .addCase(updateSocialSettings.fulfilled, (state, action) => {
        const index = state.settings.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.settings[index] = action.payload;
        }
      })

      // Handle deleting social settings
      .addCase(deleteSocialSettings.fulfilled, (state, action) => {
        state.settings = state.settings.filter((setting) => setting.id !== action.payload);
      });
  },
});

export default socialSettingsSlice.reducer;
