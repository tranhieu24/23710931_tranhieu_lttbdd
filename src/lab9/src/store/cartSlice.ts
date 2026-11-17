import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types";

interface CartState {
  items: CartItem[];
}
const initialState: CartState = { items: [] };

const clamp = (q: number, stock: number) => Math.max(1, Math.min(q, stock));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm 1 sản phẩm; nếu đã có thì tăng số lượng (không vượt tồn kho)
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      if (action.payload.stock <= 0) return;
      const found = state.items.find((i) => i.bookId === action.payload.bookId);
      if (found) Object.assign(found, action.payload, { quantity: clamp(found.quantity + 1, action.payload.stock) });
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    // Mua lại dùng thông tin sách mới nhất, cộng số lượng và giới hạn theo tồn kho hiện tại.
    addItems(state, action: PayloadAction<CartItem[]>) {
      for (const item of action.payload) {
        if (item.stock <= 0 || item.quantity <= 0) continue;
        const found = state.items.find((i) => i.bookId === item.bookId);
        const quantity = clamp((found?.quantity ?? 0) + item.quantity, item.stock);
        if (found) Object.assign(found, item, { quantity });
        else state.items.push({ ...item, quantity });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
    },
    setQuantity(state, action: PayloadAction<{ bookId: number; quantity: number }>) {
      const found = state.items.find((i) => i.bookId === action.payload.bookId);
      if (found) found.quantity = clamp(action.payload.quantity, found.stock);
    },
    clearCart(state) {
      state.items = [];
    },
    // Nạp lại giỏ hàng đã lưu trong AsyncStorage
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, addItems, removeItem, setQuantity, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
