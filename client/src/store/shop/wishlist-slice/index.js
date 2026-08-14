import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const initialState = {
  isLoading: false,
  wishlistItems: [],
};

export const addToWishlist = createAsyncThunk(
  "/wishlist/addToWishlist",
  async ({ userId, productId }) => {
    const response = await axios.post(
      `${API_BASE_URL}/shops/wishlists/add`,
      {
        userId,
        productId,
      }
    );

    return response.data;
  }
);

export const getWishlistItems = createAsyncThunk(
  "/wishlist/getWishlistItems",
  async (userId) => {
    const response = await axios.get(
      `${API_BASE_URL}/shops/wishlists/get/${userId}`
    );

    return response.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  "/wishlist/removeFromWishlist",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `${API_BASE_URL}/shops/wishlists/delete/${userId}/${productId}`
    );

    return response.data;
  }
);

const shoppingWishlistSlice = createSlice({
  name: "shoppingWishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload?.data?.items || [];
      })
      .addCase(addToWishlist.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getWishlistItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload?.data?.items || [];
      })
      .addCase(getWishlistItems.rejected, (state) => {
        state.isLoading = false;
        state.wishlistItems = [];
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = action.payload?.data?.items || [];
      })
      .addCase(removeFromWishlist.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingWishlistSlice.reducer;
