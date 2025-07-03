import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  sortBy: "price-low" | "price-high" | "rating" | "newest" | "popular";
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategory: "all",
  searchQuery: "",
  sortBy: "popular",
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
      state.categories = Array.from(
        new Set(action.payload.map((p) => p.category))
      );
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      productsSlice.caseReducers.applyFilters(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      productsSlice.caseReducers.applyFilters(state);
    },
    setSortBy: (state, action: PayloadAction<ProductsState["sortBy"]>) => {
      state.sortBy = action.payload;
      productsSlice.caseReducers.applyFilters(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateProductRating: (
      state,
      action: PayloadAction<{ productId: string; rating: number }>
    ) => {
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      );
      if (product) {
        product.rating = action.payload.rating;
        product.reviewCount += 1;
      }
      // Update filtered products as well
      const filteredProduct = state.filteredProducts.find(
        (p) => p.id === action.payload.productId
      );
      if (filteredProduct) {
        filteredProduct.rating = action.payload.rating;
        filteredProduct.reviewCount += 1;
      }
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      // Apply category filter
      if (state.selectedCategory !== "all") {
        filtered = filtered.filter(
          (product) => product.category === state.selectedCategory
        );
      }

      // Apply search filter
      if (state.searchQuery) {
        filtered = filtered.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            product.brand
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase())
        );
      }

      // Apply sorting
      switch (state.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case "popular":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }

      state.filteredProducts = filtered;
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
  updateProductRating,
  applyFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
