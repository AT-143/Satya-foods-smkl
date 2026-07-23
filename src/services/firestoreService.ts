import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, Review, Coupon, OrderStatus } from '../types';

// Collections
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const REVIEWS_COL = 'reviews';
const COUPONS_COL = 'coupons';

// Subscribe to Products
export function subscribeProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, PRODUCTS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore products subscribe error:', err);
      if (onError) onError(err);
    }
  );
}

// Save / Update Product
export async function saveProductToDb(product: Product) {
  try {
    const docRef = doc(db, PRODUCTS_COL, product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
}

// Delete Product
export async function deleteProductFromDb(productId: string) {
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
}

// Subscribe to Orders
export function subscribeOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, ORDERS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore orders subscribe error:', err);
      if (onError) onError(err);
    }
  );
}

// Add Order
export async function addOrderToDb(order: Order) {
  try {
    const docRef = doc(db, ORDERS_COL, order.id);
    await setDoc(docRef, order);
  } catch (err) {
    console.error('Error adding order to Firestore:', err);
  }
}

// Update Order Status
export async function updateOrderStatusInDb(orderId: string, status: OrderStatus) {
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }
}

// Subscribe to Reviews
export function subscribeReviews(
  onUpdate: (reviews: Review[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, REVIEWS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Review[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore reviews subscribe error:', err);
      if (onError) onError(err);
    }
  );
}

// Add Review
export async function addReviewToDb(review: Review) {
  try {
    const docRef = doc(db, REVIEWS_COL, review.id);
    await setDoc(docRef, review);
  } catch (err) {
    console.error('Error adding review to Firestore:', err);
  }
}

// Delete Review
export async function deleteReviewFromDb(reviewId: string) {
  try {
    const docRef = doc(db, REVIEWS_COL, reviewId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting review from Firestore:', err);
  }
}

// Subscribe to Coupons
export function subscribeCoupons(
  onUpdate: (coupons: Coupon[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, COUPONS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Coupon[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Coupon);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore coupons subscribe error:', err);
      if (onError) onError(err);
    }
  );
}

// Add Coupon
export async function addCouponToDb(coupon: Coupon) {
  try {
    const docRef = doc(db, COUPONS_COL, coupon.code);
    await setDoc(docRef, coupon);
  } catch (err) {
    console.error('Error adding coupon to Firestore:', err);
  }
}

// Delete Coupon
export async function deleteCouponFromDb(code: string) {
  try {
    const docRef = doc(db, COUPONS_COL, code);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting coupon from Firestore:', err);
  }
}

// Seed initial data to Firestore (Disabled for clean production setup)
export async function seedInitialFirestoreData(
  _initialProducts: Product[],
  _initialCoupons: Coupon[],
  _initialReviews: Review[]
) {
  // Production ready: No automatic dummy data seeding
  return;
}
