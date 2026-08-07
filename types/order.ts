export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItem = {
  productId: string;
  productName: string;
  productImage: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  currency: "AED" | "PKR";
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  emirate: string;
  country: string;
  postalCode?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: "AED" | "PKR";
  status: OrderStatus;
  paymentMethod: "cod" | "card" | "online";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
