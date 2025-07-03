import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, Home, ArrowLeft } from "lucide-react";
import { RootState } from "@/store/store";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useSelector((state: RootState) => state.user);

  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Badge className={getStatusColor(order.status)}>
                {order.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Order Number
                </p>
                <p className="text-lg font-mono">{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Order Date</p>
                <p className="text-lg">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-lg font-semibold">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Estimated Delivery
                </p>
                <p className="text-lg">
                  {order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString()
                    : "TBD"}
                </p>
              </div>
              {order.trackingNumber && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">
                    Tracking Number
                  </p>
                  <p className="text-lg font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
