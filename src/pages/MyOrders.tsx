import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Truck,
  CheckCircle,
  X,
  Star,
  MessageSquare,
} from "lucide-react";
import { RootState } from "@/store/store";
import {
  updateOrderStatus,
  addReview,
  setOrders,
  setReviews,
} from "@/store/slices/userSlice";
import { updateProductRating } from "@/store/slices/productsSlice";
import { authService } from "@/services/authService";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orders, user, reviews } = useSelector(
    (state: RootState) => state.user
  );
  const { products } = useSelector((state: RootState) => state.products);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    productId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const userOrders = authService.getOrders(user.id);
      dispatch(setOrders(userOrders));

      // Load reviews from localStorage
      const userReviews = authService.getUserReviews(user.id);
      dispatch(setReviews(userReviews));
    }
  }, [user, dispatch]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleCancelOrder = (orderId: string) => {
    const success = authService.updateOrderStatus(orderId, "cancelled");
    if (success) {
      dispatch(updateOrderStatus({ orderId, status: "cancelled" }));
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkDelivered = (orderId: string) => {
    const success = authService.updateOrderStatus(orderId, "delivered");
    if (success) {
      dispatch(updateOrderStatus({ orderId, status: "delivered" }));
      toast({
        title: "Order marked as delivered",
        description: "Thank you for confirming delivery!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = () => {
    if (!user || !reviewForm.productId) return;

    const review = {
      id: `review_${Date.now().toString(36)}`,
      userId: user.id,
      userName: user.name,
      productId: reviewForm.productId,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString(),
    };

    const success = authService.saveReview(review);
    if (success) {
      dispatch(addReview(review));

      // Update product rating
      const productReviews = authService.getReviews(reviewForm.productId);
      const { rating } = authService.getProductAverageRating(
        reviewForm.productId
      );
      dispatch(
        updateProductRating({ productId: reviewForm.productId, rating })
      );

      setReviewForm({ productId: "", rating: 5, comment: "" });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasReviewed = (productId: string) => {
    return reviews.some((review) => review.productId === productId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600">
            You need to be logged in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here.
              </p>
              <Button onClick={() => (window.location.href = "/")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">
                          {order.status.toUpperCase()}
                        </span>
                      </Badge>
                      <span className="font-semibold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.status === "delivered" &&
                            !hasReviewed(item.productId) && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setReviewForm((prev) => ({
                                        ...prev,
                                        productId: item.productId,
                                      }))
                                    }
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Write a Review</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Rating</Label>
                                      <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Button
                                            key={star}
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              setReviewForm((prev) => ({
                                                ...prev,
                                                rating: star,
                                              }))
                                            }
                                            className="p-1"
                                          >
                                            <Star
                                              className={`h-5 w-5 ${
                                                star <= reviewForm.rating
                                                  ? "fill-yellow-400 text-yellow-400"
                                                  : "text-gray-300"
                                              }`}
                                            />
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="comment">Comment</Label>
                                      <Textarea
                                        id="comment"
                                        value={reviewForm.comment}
                                        onChange={(e) =>
                                          setReviewForm((prev) => ({
                                            ...prev,
                                            comment: e.target.value,
                                          }))
                                        }
                                        placeholder="Share your thoughts about this product..."
                                        className="mt-2"
                                      />
                                    </div>
                                    <Button
                                      onClick={handleSubmitReview}
                                      className="w-full"
                                    >
                                      Submit Review
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          {hasReviewed(item.productId) && (
                            <Badge variant="secondary" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {order.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                    {order.status === "shipped" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkDelivered(order.id)}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                    {order.trackingNumber && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Tracking:</span>{" "}
                        {order.trackingNumber}
                      </div>
                    )}
                    {order.estimatedDelivery &&
                      order.status !== "delivered" &&
                      order.status !== "cancelled" && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Expected:</span>{" "}
                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleDateString()}
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
