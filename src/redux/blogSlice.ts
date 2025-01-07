import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage } from "@/hooks/aws";
import axios from "axios";

// Define the API endpoints
const POST_API_URL = "https://travelcarib.tekniche.xyz/admin/add-blog";
const GET_API_URL = "https://travelcarib.tekniche.xyz/admin/blogs";

// Define the type for the blog payload
interface BlogPayload {
  mainImg: File | string;
  description: string;
  secondaryImg: (File | string)[];
  secondaryDesc: string;
}

// Define the type for the blog state
interface Blog {
  id: string;
  mainImg: string; // Updated to string for URL
  description: string;
  secondaryImg: string[]; // URLs for secondary images
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
      const mainImgUrl =
        typeof blogData.mainImg === "string"
          ? blogData.mainImg
          : await uploadImage(blogData.mainImg);

      const secondaryImgUrls = await Promise.all(
        blogData.secondaryImg.map((img) =>
          typeof img === "string" ? img : uploadImage(img)
        )
      );

      const newData = {
        mainImg: mainImgUrl,
        description: blogData.description,
        secondaryImg: secondaryImgUrls,
        secondaryDesc: blogData.secondaryDesc,
      };

      const response = await axios.post(POST_API_URL, newData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog"
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
