import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { formatINR } from '../utils/pricing';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, MessageSquare, Truck, ShieldCheck } from 'lucide-react';
import { INITIAL_COUPONS, STORE_INFO } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, weight: string, newQty: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  onClearCart: () => void;
  onProceedCheckout: (couponDiscount: number, appliedCouponCode: string) => void;
  lang: 'te' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
  lang,
}) => {
  if (!isOpen) return null;

  const isTe = lang === 'te';
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = appliedCoupon.flatDiscount;
    }
  }

  // Free delivery above ₹999
  const FREE_SHIPPING_THRESHOLD = 999;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 80;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.trim().toUpperCase()
    );

    if (!found) {
      setCouponError(isTe ? 'చెల్లుబాటు కాని కూపన్ కోడ్' : 'Invalid coupon code');
      return;
    }

    if (subtotal < found.minOrderValue) {
      setCouponError(
        isTe
          ? `ఈ కూపన్ వర్తించాలంటే కనీస ఆర్డర్ ${formatINR(found.minOrderValue)} ఉండాలి`
          : `Minimum order value for ${found.code} is ${formatINR(found.minOrderValue)}`
      );
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleDirectWhatsAppCart = () => {
    let msg = `*${STORE_INFO.nameEn} (${STORE_INFO.nameTe})*\n`;
    msg += `📍 Samalkot Organics Quick WhatsApp Cart\n`;
    msg += `----------------------------------------\n`;
    cartItems.forEach((item, index) => {
      const pName = isTe ? item.product.nameTe : item.product.nameEn;
      msg += `${index + 1}. ${pName} (${item.weight}) x ${item.quantity} = ${formatINR(item.unitPrice * item.quantity)}\n`;
    });
    msg += `----------------------------------------\n`;
    msg += `మొత్తం వెల (Subtotal): ${formatINR(subtotal)}\n`;
    if (discount > 0) msg += `డిస్కౌంట్ (Discount): -${formatINR(discount)}\n`;
    msg += `డెలివరీ (Delivery): ${deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}\n`;
    msg += `*మొత్తం చెల్లించవలసినది (TOTAL): ${formatINR(total)}*\n\n`;
    msg += `దయచేసి నా చిరునామా తీసుకుని ఆర్డర్ కన్ఫర్మ్ చేయగలరు.`;

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-amber-50 h-full shadow-2xl flex flex-col border-l border-amber-300">
        
        {/* Top Cart Title Header */}
        <div className="p-4 bg-gradient-to-r from-red-900 to-amber-900 text-amber-100 flex items-center justify-between border-b border-amber-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="text-base font-extrabold font-serif">
              {isTe ? 'మీ షాపింగ్ కార్ట్' : 'Your Shopping Cart'}
            </h2>
            <span className="bg-amber-400 text-red-950 font-bold text-xs px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1 hover:bg-amber-800 rounded-full text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {subtotal > 0 && (
          <div className="bg-amber-100/80 p-3 border-b border-amber-200 text-xs text-amber-950">
            <div className="flex items-center justify-between mb-1 font-bold">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                {isFreeDelivery
                  ? (isTe ? '🎉 మీరు ఉచిత డెలివరీ పొందారు!' : '🎉 You unlocked FREE Delivery!')
                  : (isTe
                      ? `ఉచిత డెలివరీకి రూ. ${formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} దూరంలో ఉన్నారు`
                      : `Add ${formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more for FREE Delivery`)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-red-950 font-serif">
                {isTe ? 'మీ కార్ట్ ఖాళీగా ఉంది' : 'Your cart is empty'}
              </h3>
              <p className="text-xs text-amber-900/70 max-w-xs">
                {isTe
                  ? 'సామర్లకోట ఆర్గానిక్స్ స్వచ్ఛమైన ఆవకాయలు, నెయ్యి, పొడులను కార్ట్‌కి చేర్చండి!'
                  : 'Explore our traditional Samalkot pickles, powders, ghee, and sweets!'}
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              const pName = isTe ? item.product.nameTe : item.product.nameEn;

              return (
                <div
                  key={`${item.product.id}-${item.weight}`}
                  className="bg-white p-3 rounded-2xl border border-amber-200/90 shadow-xs flex items-center gap-3 relative"
                >
                  <img
                    src={item.product.image}
                    alt={pName}
                    className="w-16 h-16 rounded-xl object-cover border border-amber-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-extrabold text-red-950 truncate font-serif">
                        {pName}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.weight)}
                        className="text-amber-800 hover:text-red-700 p-1"
                        title={isTe ? 'తొలగించు' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-amber-900 font-semibold">
                      {isTe ? `పరిమాణం: ${item.weight}` : `Weight: ${item.weight}`}{' '}
                      <span className="text-amber-700">({formatINR(item.unitPrice)}/{item.weight})</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Qty controls */}
                      <div className="flex items-center border border-amber-300 rounded-lg bg-amber-50">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.weight, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-amber-900 hover:bg-amber-200 font-bold text-xs rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-0.5 text-xs font-extrabold text-red-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.weight, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-amber-900 hover:bg-amber-200 font-bold text-xs rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-red-900">
                        {formatINR(itemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-amber-200 space-y-3">
            
            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={isTe ? 'కూపన్ కోడ్ (ఉదా: SAMALKOT10)' : 'Coupon Code (e.g. SAMALKOT10)'}
                    className="w-full pl-8 pr-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold uppercase focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                  <Tag className="w-3.5 h-3.5 text-amber-700 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-amber-100 font-bold text-xs rounded-xl shadow-xs"
                >
                  {isTe ? 'వర్తించు' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] text-red-600 font-bold">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-1.5 rounded-lg text-xs text-emerald-800 font-bold">
                  <span>
                    🎉 {appliedCoupon.code} Applied! ({appliedCoupon.description})
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-700 text-xs font-extrabold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-amber-950 font-medium pt-1 border-t border-amber-100">
              <div className="flex justify-between">
                <span>{isTe ? 'మొత్తం ధర (Subtotal):' : 'Subtotal:'}</span>
                <span className="font-bold">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{isTe ? 'కూపన్ డిస్కౌంట్:' : 'Coupon Discount:'}</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{isTe ? 'డెలివరీ ఛార్జీలు:' : 'Delivery Charges:'}</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700">{isTe ? 'ఉచితం (FREE)' : 'FREE'}</span>
                  ) : (
                    formatINR(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-red-950 pt-2 border-t border-amber-200">
                <span>{isTe ? 'చెల్లించవలసినది (Total):' : 'Total Amount:'}</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="cart-online-checkout-btn"
                onClick={() => {
                  onProceedCheckout(discount, appliedCoupon?.code || '');
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-red-800 to-amber-900 hover:from-red-900 hover:to-amber-950 text-amber-50 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
              >
                <span>{isTe ? 'ఆన్‌లైన్ చెక్‌అవుట్ (UPI / కార్డ్)' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="cart-whatsapp-checkout-btn"
                onClick={handleDirectWhatsAppCart}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
              >
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>{isTe ? 'వాట్సాప్‌లో నేరుగా చెల్లించండి' : 'Order via WhatsApp'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
