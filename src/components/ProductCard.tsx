import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Star, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "./AuthModal";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product }));
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      dispatch(addToWishlist(product));
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : product.discount || 0;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-card bg-card/50 backdrop-blur"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discountPercentage}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-background/80 backdrop-blur hover:bg-background"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist ? "fill-primary text-primary" : ""
              }`}
            />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-background/80 backdrop-blur hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick add overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 to-transparent transition-all duration-300 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs mb-1">
            {product.brand}
          </Badge>
          <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.inStock && product.stockCount <= 10 && (
          <p className="text-xs text-destructive mt-1">
            Only {product.stockCount} left in stock
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
