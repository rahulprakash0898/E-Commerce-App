import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const initialState = {
    isAuthenticated : false,
    isLoading : true,
    user : null
};

export const registerUser = createAsyncThunk(
    "/auth/register",
  
    async (formData) => {
      const response = await axios.post(
        `${API_BASE_URL}/auths/register`,
        formData,
        {
          withCredentials: true,
        }
      );
  
      return response.data;
    }
  );

  export const loginUser = createAsyncThunk(
    "/auth/login",
  
    async (formData) => {
      const response = await axios.post(
        `${API_BASE_URL}/auths/login`,
        formData,
        {
          withCredentials: true,
        }
      );
  
      return response.data;
    }
  );

  export const logoutUser = createAsyncThunk(
    "/auth/logout",
  
    async () => {
      const response = await axios.post(
        `${API_BASE_URL}/auths/logout`,
        {},
        {
          withCredentials: true,
        }
      );
  
      return response.data;
    }
  );

  export const updateUserProfile = createAsyncThunk(
  "/auth/updateProfile",
  async ({ userId, formData }) => {
    const response = await axios.put(
      `${API_BASE_URL}/auths/update-profile/${userId}`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auths/check-auth`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        // Attempt automatic refresh token
        try {
          const refreshRes = await axios.post(
            `${API_BASE_URL}/auths/refresh-token`,
            {},
            { withCredentials: true }
          );

          if (refreshRes?.data?.success) {
            return refreshRes.data;
          }
        } catch (refreshErr) {
          return { success: false };
        }
      }
      return { success: false };
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user = action.payload.user;
        }
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;