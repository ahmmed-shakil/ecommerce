import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Product } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addReview, Review } from '@/store/slices/userSlice';
import { updateProductRating } from '@/store/slices/productsSlice';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import AuthModal from './AuthModal';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  useEffect(() => {
    // Load reviews for this product
    const productReviews = authService.getReviews(product.id);
    setReviews(productReviews);
  }, [product.id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
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
        description: `${product.name} removed from your wishlist.`,
      });
    } else {
      dispatch(addToWishlist(product));
      toast({
        title: "Added to wishlist",
        description: `${product.name} added to your wishlist.`,
      });
    }
  };

  const handleSubmitReview = () => {
    if (!user) return;

    const review = {
      id: `review_${Date.now().toString(36)}`,
      userId: user.id,
      userName: user.name,
      productId: product.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString(),
    };

    const success = authService.saveReview(review);
    if (success) {
      dispatch(addReview(review));
      setReviews(prev => [...prev, review]);
      
      // Update product rating
      const { rating } = authService.getProductAverageRating(product.id);
      dispatch(updateProductRating({ productId: product.id, rating }));
      
      setReviewForm({ rating: 5, comment: '' });
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
    }
  };

  const hasUserReviewed = reviews.some(review => review.userId === user?.id);

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`p-0 h-auto ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </Button>
        ))}
      </div>
    );
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 bg-card rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image section */}
          <div className="md:w-1/2 bg-muted/20 p-6 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            
            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="md:w-1/2 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex-1 pr-4">
                <Badge variant="outline" className="mb-2">{product.brand}</Badge>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">{product.name}</h2>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {product.isNew && (
                    <Badge className="bg-accent text-accent-foreground">New</Badge>
                  )}
                  {discountPercentage > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      -{discountPercentage}% OFF
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary">Out of Stock</Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="specs">Specs</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  {product.stockCount <= 10 && product.inStock && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <p className="text-destructive font-medium">
                        ⚠️ Only {product.stockCount} left in stock!
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="specs" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Specifications</h4>
                    <div className="space-y-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-border/30 last:border-0">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shipping" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                      <Truck className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Free Shipping</p>
                        <p className="text-sm text-muted-foreground">On orders over $99</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                      <Shield className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium">2-Year Warranty</p>
                        <p className="text-sm text-muted-foreground">Comprehensive coverage</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                      <RotateCcw className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">30-Day Returns</p>
                        <p className="text-sm text-muted-foreground">Free returns & exchanges</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 space-y-4">
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <Separator />

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className={isInWishlist ? 'text-primary border-primary' : ''}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;