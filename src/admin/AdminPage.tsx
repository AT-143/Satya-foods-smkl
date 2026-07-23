import React, { useState } from 'react';
import { Product, Order, OrderStatus, Review, Coupon } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminAuthModal } from './AdminAuthModal';
import { AdminLayout } from './AdminLayout';
import { ShieldAlert, Lock, Key, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AdminPageProps {
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  lang: 'te' | 'en';
  setLang: (lang: 'te' | 'en') => void;
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  orders,
  reviews,
  coupons,
  onUpdateOrderStatus,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteReview,
  onAddCoupon,
  onDeleteCoupon,
  lang,
  setLang,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onBackToStore,
}) => {
  const isTe = lang === 'te';
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isAuthenticated);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const DEFAULT_ADMIN_PASS = 'satya123';

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === DEFAULT_ADMIN_PASS) {
      onAuthenticate();
      setPasswordInput('');
      setErrorMsg('');
    } else {
      setErrorMsg(
        isTe
          ? 'పాస్‌వర్డ్ సరిపోలేదు. దయచేసి సరైన పిన్ నమోదు చేయండి.'
          : 'Invalid passcode. Please enter the correct PIN (default: satya123).'
      );
    }
  };

  return (
    <AdminLayout
      lang={lang}
      setLang={setLang}
      isAuthenticated={isAuthenticated}
      onLogout={onLogout}
      onBackToStore={onBackToStore}
    >
      {isAuthenticated ? (
        <AdminDashboard
          products={products}
          orders={orders}
          reviews={reviews}
          coupons={coupons}
          onUpdateOrderStatus={onUpdateOrderStatus}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          onDeleteReview={onDeleteReview}
          onAddCoupon={onAddCoupon}
          onDeleteCoupon={onDeleteCoupon}
          lang={lang}
        />
      ) : (
        <div className="max-w-md mx-auto my-12 p-8 bg-white border-2 border-amber-300 rounded-3xl shadow-2xl text-amber-950 text-center space-y-6 relative overflow-hidden">
          
          <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-amber-950 rounded-2xl border border-amber-400 flex items-center justify-center mx-auto text-amber-300 shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black font-serif text-red-950">
              {isTe ? 'అడ్మిన్ యాక్సెస్ లాక్ చేయబడింది' : 'Protected Store Admin Area'}
            </h2>
            <p className="text-xs text-amber-900 mt-2 leading-relaxed font-medium">
              {isTe
                ? 'స్టోర్ ఉత్పత్తులు, ఆర్డర్‌లు మరియు ధరలను నిర్వహించడానికి దయచేసి అడ్మిన్ పాస్‌వర్డ్ నమోదు చేయండి.'
                : 'Authentication required to manage products, pricing, coupons, and view customer orders.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2 text-left">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleInlineSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-red-950 mb-1 flex items-center justify-between">
                <span>{isTe ? 'అడ్మిన్ పాస్‌వర్డ్ (Admin PIN)' : 'Enter Admin Passcode'}</span>
                <span className="text-[10px] text-amber-800 font-mono font-normal">Default: satya123</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter passcode (satya123)"
                  className="w-full pl-10 pr-4 py-2.5 bg-amber-50/50 border border-amber-300 rounded-xl text-sm font-bold text-red-950 focus:ring-2 focus:ring-amber-600 focus:outline-hidden shadow-xs"
                  autoFocus
                />
                <Key className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onBackToStore}
                className="w-1/3 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isTe ? 'వెనక్కి' : 'Cancel'}</span>
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-gradient-to-r from-red-800 via-amber-900 to-red-950 text-amber-100 text-xs font-extrabold rounded-xl shadow-md hover:from-red-900 hover:to-amber-950 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{isTe ? 'లాగిన్ చేయి' : 'Unlock Admin Panel'}</span>
              </button>
            </div>
          </form>

          <AdminAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onAuthenticate={() => {
              onAuthenticate();
              setIsAuthModalOpen(false);
            }}
            lang={lang}
          />
        </div>
      )}
    </AdminLayout>
  );
};
