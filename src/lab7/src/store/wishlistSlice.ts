import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  ids: number[];
}
const initialState: WishlistState = { ids: [] };

// THỬ THÁCH (BT7.C1) — dùng lại ở buổi sau
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // BT7.C1 (thử thách): nếu id đã có trong state.ids thì bỏ ra, chưa có thì thêm vào
    toggleWishlist(state, action: PayloadAction<number>) {
      const idx = state.ids.indexOf(action.payload);
      if (idx >= 0) {
        state.ids.splice(idx, 1);
      } else {
        state.ids.push(action.payload);
      }
    },
    hydrateWishlist(state, action: PayloadAction<number[]>) {
      state.ids = action.payload;
    },
  },
});

export const { toggleWishlist, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
