import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import Checkout from "@/components/Checkout";
import AuthModal from "@/components/AuthModal";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const { items, total } = useSelector((state: RootState) => state.cart);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Add some products to your cart to proceed with checkout.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login to Continue</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to proceed with checkout.
          </p>
          <AuthModal onSuccess={() => setShowCheckout(true)}>
            <Button size="lg">Login to Checkout</Button>
          </AuthModal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase below</p>
        </div>

        <Checkout onSuccess={() => console.log("Order placed successfully")} />
      </div>
    </div>
  );
};

export default CheckoutPage;
