import { axiosInstance } from "@/provider/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export type SocialPlatform = {
  platform: string;
  url: string;
  enabled: boolean;
};

export type SocialSettings = {
  id: string;
  socialsEnable: boolean;
  socialPlatforms: SocialPlatform[];
};

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

export const fetchSocialSettings = createAsyncThunk<SocialSettings[]>(
  "socialSettings/fetchSocialSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/admin/socials`);
      return response.data.socials as SocialSettings[];
    } catch (error: any) {
      return rejectWithValue(
        error.response.data || "Failed to fetch social settings"
      );
    }
  }
);

export const fetchSocialSettingById = createAsyncThunk<SocialSettings, string>(
  "socialSettings/fetchSocialSettingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/admin/get-social`, { id });
      return response.data.social as SocialSettings;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data || `Failed to fetch social setting for ID: ${id}`
      );
    }
  }
);

export const addSocialSettings = createAsyncThunk<
  SocialSettings,
  Omit<SocialSettings, "id">
>("socialSettings/addSocialSettings", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/admin/add-social`, data);
    return response.data.social as SocialSettings;
  } catch (error: any) {
    return rejectWithValue(
      error.response.data || "Failed to add social settings"
    );
  }
});

export const updateSocialSettings = createAsyncThunk<
  SocialSettings,
  SocialSettings
>("socialSettings/updateSocialSettings", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/admin/update-social`, data);
    return response.data.social as SocialSettings;
  } catch (error: any) {
    return rejectWithValue(
      error.response.data || "Failed to update social settings"
    );
  }
});

export const deleteSocialSettings = createAsyncThunk<string, string>(
  "socialSettings/deleteSocialSettings",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`${apiUrl}/admin/delete-social`, { id });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data || `Failed to delete social setting for ID: ${id}`
      );
    }
  }
);

interface SocialSettingsState {
  settings: SocialSettings[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SocialSettingsState = {
  settings: [],
  status: "idle",
  error: null,
};

const socialSettingsSlice = createSlice({
  name: "socialSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSocialSettings.fulfilled,
        (state, action: PayloadAction<SocialSettings[]>) => {
          state.status = "succeeded";
          state.settings = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchSocialSettings.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload as string;
        }
      )

      .addCase(fetchSocialSettingById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSocialSettingById.fulfilled,
        (state, action: PayloadAction<SocialSettings>) => {
          state.status = "succeeded";
          const index = state.settings.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) {
            state.settings[index] = action.payload;
          } else {
            state.settings.push(action.payload);
          }
          state.error = null;
        }
      )
      .addCase(
        fetchSocialSettingById.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload as string;
        }
      )

      .addCase(
        addSocialSettings.fulfilled,
        (state, action: PayloadAction<SocialSettings>) => {
          state.settings.push(action.payload);
          state.error = null;
        }
      )
      .addCase(
        addSocialSettings.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload as string;
        }
      )

      .addCase(
        updateSocialSettings.fulfilled,
        (state, action: PayloadAction<SocialSettings>) => {
          const index = state.settings.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) {
            state.settings[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(
        updateSocialSettings.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload as string;
        }
      )

      .addCase(
        deleteSocialSettings.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.settings = state.settings.filter(
            (setting) => setting.id !== action.payload
          );
          state.error = null;
        }
      )
      .addCase(
        deleteSocialSettings.rejected,
        (state, action: PayloadAction<any>) => {
          state.error = action.payload as string;
        }
      );
  },
});

export default socialSettingsSlice.reducer;
