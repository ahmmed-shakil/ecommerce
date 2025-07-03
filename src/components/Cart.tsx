import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store/store";
import {
  removeFromCart,
  updateQuantity,
  setCartOpen,
} from "@/store/slices/cartSlice";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, total, itemCount, isOpen } = useSelector(
    (state: RootState) => state.cart
  );

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(productId));
      toast({
        title: "Item removed",
        description: "Product has been removed from your cart.",
      });
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast({
      title: "Item removed",
      description: "Product has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    dispatch(setCartOpen(false));
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => dispatch(setCartOpen(false))}
      />

      {/* Cart panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 shadow-2xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Shopping Cart
              </h2>
              <p className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setCartOpen(false))}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add some products to get started
                </p>
                <Button
                  onClick={() => dispatch(setCartOpen(false))}
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-muted/20 rounded-lg"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-card-foreground line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product.brand}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-primary">
                          ${item.product.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Badge
                            variant="secondary"
                            className="px-2 py-1 min-w-[2rem] text-center"
                          >
                            {item.quantity}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0"
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-card-foreground">Total:</span>
                <span className="text-primary">${total.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => dispatch(setCartOpen(false))}
                >
                  Continue Shopping
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
