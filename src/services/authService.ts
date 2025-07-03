import { User, Order, Review } from "@/store/slices/userSlice";

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegisterData extends AuthCredentials {
  name: string;
  phone?: string;
}

class AuthService {
  private readonly USERS_KEY = "ecommerce_users";
  private readonly CURRENT_USER_KEY = "ecommerce_current_user";
  private readonly ORDERS_KEY = "ecommerce_orders";
  private readonly REVIEWS_KEY = "ecommerce_reviews";

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.REVIEWS_KEY)) {
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify([]));
    }
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || "[]");
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async register(
    data: RegisterData
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();

      // Check if email already exists
      if (users.find((user) => user.email === data.email)) {
        return { success: false, error: "Email already exists" };
      }

      const newUser: User = {
        id: this.generateId(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateJoined: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.name
        )}&background=random`,
      };

      users.push(newUser);
      this.saveUsers(users);

      // Auto login after registration
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  }

  async login(
    credentials: AuthCredentials
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const user = users.find((u) => u.email === credentials.email);

      if (!user) {
        return { success: false, error: "User not found" };
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  updateUser(updatedUser: User): boolean {
    try {
      const users = this.getUsers();
      const index = users.findIndex((u) => u.id === updatedUser.id);

      if (index !== -1) {
        users[index] = updatedUser;
        this.saveUsers(users);
        localStorage.setItem(
          this.CURRENT_USER_KEY,
          JSON.stringify(updatedUser)
        );
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Order Management
  getOrders(userId: string): Order[] {
    const orders: Order[] = JSON.parse(
      localStorage.getItem(this.ORDERS_KEY) || "[]"
    );
    return orders.filter((order) => order.userId === userId);
  }

  saveOrder(order: Order): boolean {
    try {
      const orders: Order[] = JSON.parse(
        localStorage.getItem(this.ORDERS_KEY) || "[]"
      );
      orders.unshift(order);
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
      return true;
    } catch (error) {
      return false;
    }
  }

  updateOrderStatus(orderId: string, status: Order["status"]): boolean {
    try {
      const orders: Order[] = JSON.parse(
        localStorage.getItem(this.ORDERS_KEY) || "[]"
      );
      const orderIndex = orders.findIndex((o) => o.id === orderId);

      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Review Management
  getReviews(productId?: string): Review[] {
    const reviews: Review[] = JSON.parse(
      localStorage.getItem(this.REVIEWS_KEY) || "[]"
    );
    return productId
      ? reviews.filter((r) => r.productId === productId)
      : reviews;
  }

  getUserReviews(userId: string): Review[] {
    const reviews: Review[] = JSON.parse(
      localStorage.getItem(this.REVIEWS_KEY) || "[]"
    );
    return reviews.filter((r) => r.userId === userId);
  }

  saveReview(review: Review): boolean {
    try {
      const reviews: Review[] = JSON.parse(
        localStorage.getItem(this.REVIEWS_KEY) || "[]"
      );
      reviews.push(review);
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
      return true;
    } catch (error) {
      return false;
    }
  }

  getProductAverageRating(productId: string): {
    rating: number;
    count: number;
  } {
    const reviews = this.getReviews(productId);
    if (reviews.length === 0) return { rating: 0, count: 0 };

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      rating: Math.round((totalRating / reviews.length) * 10) / 10,
      count: reviews.length,
    };
  }
}

export const authService = new AuthService();
