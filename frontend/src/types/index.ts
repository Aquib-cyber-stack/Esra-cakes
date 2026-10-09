export type CakeCategory = "BIRTHDAY" | "WEDDING" | "ANNIVERSARY" | "KIDS" | "CORPORATE" | "CUSTOM";

export interface CakeImage {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Cake {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CakeCategory;
  flavours: string[];
  sizes: string[];
  startingPrice: string | number;
  isAvailable: boolean;
  isFeatured: boolean;
  images: CakeImage[];
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "REVIEWING"
  | "QUOTE_SENT"
  | "CONFIRMED"
  | "BAKING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export type FulfillmentType = "PICKUP" | "DELIVERY";

export interface OrderReferenceImage {
  id: string;
  url: string;
}

export interface OrderNote {
  id: string;
  note: string;
  createdAt: string;
  admin?: { name: string } | null;
}

export interface Order {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  cakeId?: string | null;
  cake?: { name: string } | null;
  occasion: string;
  flavour: string;
  size: string;
  requiredDate: string;
  theme?: string | null;
  message?: string | null;
  instructions?: string | null;
  budget?: string | number | null;
  fulfillment: FulfillmentType;
  address?: string | null;
  status: OrderStatus;
  quote?: string | number | null;
  referenceImages: OrderReferenceImage[];
  notes?: OrderNote[];
  createdAt: string;
}

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  occasion?: string | null;
  status: ReviewStatus;
  isFeatured: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingRequests: number;
  confirmedOrders: number;
  completedOrders: number;
  revenue: number;
}
