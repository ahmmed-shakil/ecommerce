import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { clearCart } from "@/store/slices/cartSlice";
import { addOrder } from "@/store/slices/userSlice";
import { authService } from "@/services/authService";
import { CreditCard, Truck, MapPin, Clock } from "lucide-react";

interface CheckoutProps {
  onSuccess?: () => void;
}

const Checkout = ({ onSuccess }: CheckoutProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const shippingCost = total > 99 ? 0 : 9.99;
  const tax = Math.round(total * 0.08 * 100) / 100; // 8% tax
  const finalTotal = total + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    // Validate shipping address
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zip
    ) {
      toast({
        title: "Incomplete address",
        description: "Please fill in all address fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate payment info for card payments
    if (paymentMethod === "card") {
      if (
        !paymentInfo.cardNumber ||
        !paymentInfo.expiryDate ||
        !paymentInfo.cvv ||
        !paymentInfo.nameOnCard
      ) {
        toast({
          title: "Incomplete payment information",
          description: "Please fill in all payment fields.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order = {
        id: `order_${Date.now().toString(36)}`,
        userId: user.id,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: finalTotal,
        status: "pending" as const,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(), // 5 days from now
        shippingAddress,
        paymentMethod:
          paymentMethod === "card"
            ? `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`
            : "Cash on Delivery",
        trackingNumber: `TRK${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
      };

      // Save order
      const orderSaved = authService.saveOrder(order);
      if (orderSaved) {
        dispatch(addOrder(order));
        dispatch(clearCart());

        toast({
          title: "Order placed successfully!",
          description: `Your order #${order.id} has been placed and will be delivered in 3-5 business days.`,
        });

        onSuccess?.();
        navigate(`/order-confirmation/${order.id}`);
      } else {
        throw new Error("Failed to save order");
      }
    } catch (error) {
      toast({
        title: "Order failed",
        description:
          "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to your cart to proceed with checkout.
        </p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }))
                  }
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    placeholder="NY"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={shippingAddress.zip}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        zip: e.target.value,
                      }))
                    }
                    placeholder="10001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          nameOnCard: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </span>
                  <span>
                    {shippingCost === 0 ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Estimated delivery: 3-5 business days</span>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handlePlaceOrder}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Place Order - $${finalTotal.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
