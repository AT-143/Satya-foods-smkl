export type CategoryId = 'all' | 'powders' | 'oils' | 'nonveg_pickles' | 'veg_pickles' | 'sweets' | 'snacks' | 'savouries' | 'pickles' | 'ghee' | 'honey' | 'sugarfree';

export type WeightOption = '250g' | '500g' | '1kg';

export interface Product {
  id: string;
  nameEn: string;
  nameTe: string;
  category: CategoryId;
  pricePerKg: number; // base price in INR for 1kg
  isCallForPrice?: boolean;
  image: string; // Image URL or Data URL for display
  imageStoragePath?: string; // Firebase Storage object path e.g. "products/prod_123_photo.jpg"
  descriptionEn: string;
  descriptionTe: string;
  ingredientsEn: string[];
  ingredientsTe: string[];
  shelfLife: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isPureOrganic?: boolean;
  rating: number;
  reviewCount: number;
  stockKg: number;
}

export interface CartItem {
  product: Product;
  weight: WeightOption;
  quantity: number;
  unitPrice: number; // Calculated price for the selected weight
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'WHATSAPP' | 'UPI_QR' | 'CARD' | 'COD';

export interface Order {
  id: string;
  date: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'COD';
  status: OrderStatus;
  trackingNumber?: string;
  couponCode?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderValue: number;
  description: string;
}
