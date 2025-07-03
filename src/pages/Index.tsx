import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import { setProducts } from "@/store/slices/productsSlice";
import { setUser, setOrders, setReviews } from "@/store/slices/userSlice";
import { mockProducts } from "@/data/products";
import { authService } from "@/services/authService";
import { RootState } from "@/store/store";

const Index = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Initialize products with mock data
    dispatch(setProducts(mockProducts));

    // Check for existing user session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      dispatch(setUser(currentUser));

      // Load user orders and reviews
      const orders = authService.getOrders(currentUser.id);
      const reviews = authService.getUserReviews(currentUser.id);
      dispatch(setOrders(orders));
      dispatch(setReviews(reviews));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <section id="products-section">
          <ProductGrid />
        </section>
      </main>
      <Cart />
    </div>
  );
};

export default Index;
