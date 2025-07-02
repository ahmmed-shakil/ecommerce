import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import { setProducts } from '@/store/slices/productsSlice';
import { mockProducts } from '@/data/products';

const Index = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize products with mock data
    dispatch(setProducts(mockProducts));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Cart />
    </div>
  );
};

export default Index;
