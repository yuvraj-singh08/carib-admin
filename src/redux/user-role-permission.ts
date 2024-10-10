import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type Permission = {
  view: boolean;
  update: boolean;
};

export interface PermissionGroup {
  name: string;
  active: boolean;
  permissions: {
    [key: string]: Permission;
  };
}

export interface RoleType {
  id: string;
  name: string;
  description: string;
  permissionGroups: PermissionGroup[];
}

const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await axios.get(`${apiUrl}/admin/roles`);
  return response.data.roles;
});

export const addRole = createAsyncThunk(
  "roles/addRole",
  async (data: Omit<RoleType, "id">) => {
    const response = await axios.post(`${apiUrl}/admin/add-roles`, data);
    return response.data.roles;
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id: string) => {
    await axios.post(`${apiUrl}/admin/delete-roles`, { id });
    return id;
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (data: RoleType) => {
    const { id, name, description, permissionGroups } = data; 
    const response = await axios.post(`${apiUrl}/admin/update-roles`, {
      id,
      title: name,
      description,
      permissionGroups,
    });
    return response.data.roles;
  }
);


const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [] as RoleType[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const updatedRole = action.payload;
        const index = state.roles.findIndex(
          (role) => role.id === updatedRole.id
        );
        if (index !== -1) {
          state.roles[index] = updatedRole; 
        }
      });
  },
});

export default rolesSlice.reducer;
