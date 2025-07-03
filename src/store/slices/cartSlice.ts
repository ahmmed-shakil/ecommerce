import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productsSlice";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem("ecommerce_cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      return {
        ...parsed,
        isOpen: false, // Always start with cart closed
      };
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false,
  };
};

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    const cartToSave = {
      items: state.items,
      total: state.total,
      itemCount: state.itemCount,
    };
    localStorage.setItem("ecommerce_cart", JSON.stringify(cartToSave));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      saveCartToStorage(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product.id === productId);

      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== productId
          );
        }
      }

      state.itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.total = state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;

      saveCartToStorage(state);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
