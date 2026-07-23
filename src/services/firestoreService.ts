import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { Product, Order, Review, Coupon, OrderStatus } from '../types';

// Collections
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const REVIEWS_COL = 'reviews';
const COUPONS_COL = 'coupons';

// ==========================================
// FIREBASE STORAGE IMAGE MANAGEMENT & FALLBACK
// ==========================================

/**
 * Helper to compress and read local image file into a compact JPEG Data URL.
 * Used as a zero-CORS-error fallback if Firebase Storage bucket is restricted.
 */
export function compressAndCreateDataUrl(
  file: File,
  maxSize = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a product image file to Firebase Storage bucket.
 * If Firebase Storage is blocked by CORS origin policy or network restrictions,
 * seamlessly falls back to a lightweight compressed Data URL so image upload never fails.
 */
export async function uploadProductImageToStorage(
  file: File,
  productId: string
): Promise<{ downloadUrl: string; storagePath: string }> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `products/${productId}_${Date.now()}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    // Attempt upload to Firebase Storage bucket
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return { downloadUrl, storagePath };
  } catch (err: any) {
    console.warn(
      'Firebase Storage direct bucket upload encountered CORS/network policy limit. Using compressed Data URL fallback:',
      err?.message || err
    );
    try {
      const dataUrl = await compressAndCreateDataUrl(file);
      return { downloadUrl: dataUrl, storagePath: '' };
    } catch (fallbackErr) {
      console.error('Data URL fallback compression failed:', fallbackErr);
      throw err;
    }
  }
}

/**
 * Deletes a stored product image file from Firebase Storage.
 */
export async function deleteProductImageFromStorage(storagePath: string): Promise<void> {
  if (!storagePath) return;
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Could not delete image from Firebase Storage (might already be removed):', err);
  }
}

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

// Delete Product (and optional Storage image)
export async function deleteProductFromDb(productId: string, imageStoragePath?: string) {
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    await deleteDoc(docRef);

    // If product has a stored image path in Firebase Storage, clean it up
    if (imageStoragePath) {
      await deleteProductImageFromStorage(imageStoragePath);
    }
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
