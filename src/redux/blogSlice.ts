import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/provider/axios"; // Adjust path based on your project structure

// Define the API endpoint
const API_URL = "/admin/add-blog";

// Define the type for the blog payload
interface BlogPayload {
  mainImg: File;
  description: string;
  secondaryImg: File[];
  secondaryDesc: string;
}

// Define the state type
interface BlogState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

// Initial state
const initialState: BlogState = {
  loading: false,
  success: false,
  error: null,
};

// Thunk for posting a blog
export const postBlog = createAsyncThunk(
  "blog/postBlog",
  async (blogData: BlogPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("mainImg", blogData.mainImg);
      formData.append("description", blogData.description);
      blogData.secondaryImg.forEach((file, index) => {
        formData.append(`secondaryImg[${index}]`, file);
      });
      formData.append("secondaryDesc", blogData.secondaryDesc);

      const response = await axiosInstance.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Create slice
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postBlog.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(postBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = blogSlice.actions;
export default blogSlice.reducer;
