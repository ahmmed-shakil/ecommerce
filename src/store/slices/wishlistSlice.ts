import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productsSlice';

export interface WishlistState {
  items: Product[];
  itemCount: number;
}

// Load wishlist from localStorage
const loadWishlistFromStorage = (): WishlistState => {
  try {
    const savedWishlist = localStorage.getItem('ecommerce_wishlist');
    if (savedWishlist) {
      const parsed = JSON.parse(savedWishlist);
      return {
        items: parsed.items || [],
        itemCount: parsed.itemCount || 0,
      };
    }
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
  }
  
  return {
    items: [],
    itemCount: 0,
  };
};

// Save wishlist to localStorage
const saveWishlistToStorage = (state: WishlistState) => {
  try {
    localStorage.setItem('ecommerce_wishlist', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

const initialState: WishlistState = loadWishlistFromStorage();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        state.itemCount = state.items.length;
        saveWishlistToStorage(state);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.itemCount = state.items.length;
      saveWishlistToStorage(state);
    },
    clearWishlist: (state) => {
      state.items = [];
      state.itemCount = 0;
      saveWishlistToStorage(state);
    },
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.length;
      saveWishlistToStorage(state);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;