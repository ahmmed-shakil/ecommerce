import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store/store';
import { toggleCart } from '@/store/slices/cartSlice';
import { setSearchQuery } from '@/store/slices/productsSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const { itemCount: wishlistCount } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const categories = [
    'Phones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Accessories', 'Gaming', 'Camera'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-border/20">
          <div className="hidden md:flex items-center gap-6 text-secondary-foreground/70">
            <span>📧 info@techstore.com</span>
            <span>📞 +1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-4 text-secondary-foreground/70">
            <span className="text-primary font-medium">Free shipping on orders $99+</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <span className="text-primary-foreground font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-secondary-foreground font-bold text-xl">TechStore</h1>
              <p className="text-xs text-secondary-foreground/60">Since 2024</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-12 pr-4 py-3 bg-background/50 border-border/30 focus:border-primary transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="relative text-secondary-foreground hover:text-primary">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-secondary-foreground hover:text-primary"
              onClick={() => dispatch(toggleCart())}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            <Button variant="ghost" size="sm" className="text-secondary-foreground hover:text-primary">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile menu */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-secondary-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Categories navigation */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-border/20">
          {categories.map((category) => (
            <button
              key={category}
              className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/20 py-4">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-background/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </form>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="text-left text-secondary-foreground/80 hover:text-primary transition-colors text-sm font-medium py-2"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;