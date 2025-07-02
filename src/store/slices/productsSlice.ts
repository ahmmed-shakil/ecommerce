import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  specifications: { [key: string]: string };
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export interface ProductsState {
  products: Product[];
  categories: string[];
  filteredProducts: Product[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular';
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'popular',
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      state.categories = Array.from(new Set(action.payload.map(p => p.category)));
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filteredProducts = state.products.filter(product => 
        action.payload === 'all' || product.category === action.payload
      );
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredProducts = state.products.filter(product =>
        product.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        product.brand.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSortBy: (state, action: PayloadAction<ProductsState['sortBy']>) => {
      state.sortBy = action.payload;
      const sortedProducts = [...state.filteredProducts];
      
      switch (action.payload) {
        case 'price-low':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'popular':
          sortedProducts.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
      
      state.filteredProducts = sortedProducts;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;