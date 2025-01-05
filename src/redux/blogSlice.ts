import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API endpoints
const POST_API_URL = "https://travelcarib.tekniche.xyz/admin/add-blog";
const GET_API_URL = "https://travelcarib.tekniche.xyz/admin/blogs";

// Define the type for the blog payload
interface BlogPayload {
  mainImg: string;
  description: string;
  secondaryImg: string[];
  secondaryDesc: string;
}

// Define the type for the blog state
interface Blog {
  id: string;
  mainImg: string;
  description: string;
  secondaryImg: string[];
  secondaryDesc: string;
}

// Define the state type
interface BlogState {
  blogs: Blog[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

// Initial state
const initialState: BlogState = {
  blogs: [],
  loading: false,
  success: false,
  error: null,
};

// Thunk for posting a blog
export const postBlog = createAsyncThunk(
  "blog/postBlog",
  async (blogData: BlogPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(POST_API_URL, blogData, {
        headers: {
          "Content-Type": "application/json",
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

// Thunk for fetching blogs
export const getBlogs = createAsyncThunk(
  "blog/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(GET_API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
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
      // POST Blog
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
      })

      // GET Blogs
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = blogSlice.actions;
export default blogSlice.reducer;
