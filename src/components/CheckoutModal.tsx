import React, { useState } from 'react';
import { CartItem, CustomerDetails, Order, PaymentMethod } from '../types';
import { calculateWeightPrice, formatINR, generateWhatsAppMessage } from '../utils/pricing';
import { X, CheckCircle, ShieldCheck, MessageSquare, QrCode, CreditCard, Banknote, Truck, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  couponDiscount: number;
  couponCode?: string;
  lang: 'te' | 'en';
  onOrderPlaced: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  couponDiscount,
  couponCode,
  lang,
  onOrderPlaced,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const isTe = lang === 'te';

  // Step state
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Customer Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Samalkot',
    state: 'Andhra Pradesh',
    pincode: '533440',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI_QR');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 999 ? 0 : 80;
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.pincode) {
      alert(isTe ? 'దయచేసి అన్ని వివరాలు పూర్తి చేయండి.' : 'Please fill all required fields.');
      return;
    }
    setStep('payment');
  };

  const handleCompleteOrder = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrderId = `SATYA-${randomNum}`;

    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customer,
      items: cartItems,
      subtotal,
      discount: couponDiscount,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PAID',
      status: 'PROCESSING',
      trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      couponCode,
    };

    setCreatedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setStep('success');
  };

  const openWhatsAppConfirmation = () => {
    if (!createdOrder) return;
    const msg = generateWhatsAppMessage(
      createdOrder.id,
      createdOrder.items,
      createdOrder.customer,
      createdOrder.subtotal,
      createdOrder.discount,
      createdOrder.deliveryFee,
      createdOrder.totalAmount,
      createdOrder.paymentMethod,
      lang
    );
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-300 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-900 via-amber-900 to-emerald-950 text-amber-100 flex items-center justify-between border-b border-amber-700">
          <div>
            <h2 className="text-lg font-black font-serif">
              {isTe ? 'సత్య ఫుడ్స్ సామర్లకోట - చెక్‌అవుట్' : 'Satya Foods Checkout'}
            </h2>
            <p className="text-xs text-amber-200/80">
              {step === 'details' && (isTe ? '1/2: డెలివరీ చిరునామా వివరాలు' : 'Step 1/2: Shipping & Contact')}
              {step === 'payment' && (isTe ? '2/2: చెల్లింపు విధానం' : 'Step 2/2: Select Payment Method')}
              {step === 'success' && (isTe ? 'ఆర్డర్ పూర్తయింది!' : 'Order Placed Successfully!')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-800 rounded-full text-amber-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    {isTe ? 'పూర్తి పేరు (Full Name) *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder={isTe ? 'ఉదా: వెంకట రామారావు' : 'e.g. K. Venkata Rao'}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    {isTe ? 'వాట్సాప్ ఫోన్ నంబర్ *' : 'WhatsApp Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-950 block mb-1">
                  {isTe ? 'పూర్తి డెలివరీ చిరునామా (Address) *' : 'Complete Shipping Address *'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder={isTe ? 'డోర్ నంబర్, వీధి పేరు, ప్రాంతం...' : 'House No, Street, Landmark...'}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-amber-950 block mb-1">
                    {isTe ? 'ఊరు / సిటీ' : 'City / Town'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-950 block mb-1">
                    {isTe ? 'రాష్ట్రం' : 'State'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-950 block mb-1">
                    {isTe ? 'పిన్‌కోడ్ *' : 'Pincode *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-950 block mb-1">
                  {isTe ? 'ప్రత్యేక నోట్స్ (కారం ఎక్కువ / తక్కువ, ప్యాకింగ్)' : 'Special Instructions'}
                </label>
                <input
                  type="text"
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder={isTe ? 'ఉదా: కారం మీడియం ఉండేలా చూడగలరు' : 'e.g. Medium spice level'}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs"
                />
              </div>

              {/* Order Amount Preview */}
              <div className="bg-amber-100/70 p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-900 font-bold">
                    {isTe ? 'మొత్తం చెల్లించవలసినది' : 'Total Payable Amount'}
                  </div>
                  <div className="text-xs text-emerald-800">
                    {cartItems.length} {isTe ? 'వస్తువులు' : 'items'} ({subtotal >= 999 ? 'Free Shipping' : 'Standard Delivery'})
                  </div>
                </div>
                <div className="text-xl font-black text-red-950">
                  {formatINR(totalAmount)}
                </div>
              </div>

              <button
                id="checkout-step1-next-btn"
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-800 to-amber-900 text-amber-50 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:from-red-900 hover:to-amber-950"
              >
                <span>{isTe ? 'చెల్లింపుల పేజీకి వెళ్లండి' : 'Proceed to Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-red-950">
                {isTe ? 'చెల్లింపు విధానం ఎంచుకోండి (Select Payment Method):' : 'Select Payment Method:'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* UPI QR */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI_QR')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'UPI_QR'
                      ? 'bg-amber-100/90 border-amber-600 shadow-sm ring-2 ring-amber-600'
                      : 'bg-white border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-red-950">UPI QR / GPay / PhonePe</div>
                    <div className="text-[10px] text-amber-900/80">Scan QR Code or Pay to {STORE_INFO.upiId}</div>
                  </div>
                </button>

                {/* Direct WhatsApp */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WHATSAPP')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'WHATSAPP'
                      ? 'bg-emerald-100 border-emerald-600 shadow-sm ring-2 ring-emerald-600'
                      : 'bg-white border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5 fill-emerald-700/20" />
                  <div>
                    <div className="text-xs font-extrabold text-emerald-950">Direct WhatsApp Confirmation</div>
                    <div className="text-[10px] text-emerald-900">Send order directly to owner WhatsApp</div>
                  </div>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-amber-100/90 border-amber-600 shadow-sm ring-2 ring-amber-600'
                      : 'bg-white border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-red-950">Online Card / NetBanking</div>
                    <div className="text-[10px] text-amber-900/80">Instant secure online payment</div>
                  </div>
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'COD'
                      ? 'bg-amber-100/90 border-amber-600 shadow-sm ring-2 ring-amber-600'
                      : 'bg-white border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-red-950">Cash on Delivery (COD)</div>
                    <div className="text-[10px] text-amber-900/80">Pay when order arrives at home</div>
                  </div>
                </button>
              </div>

              {/* Display UPI QR Details if selected */}
              {paymentMethod === 'UPI_QR' && (
                <div className="bg-white p-4 rounded-2xl border border-amber-300 text-center space-y-2">
                  <div className="text-xs font-bold text-amber-950">
                    {isTe ? 'సత్య ఫుడ్స్ UPI డీటెయిల్స్:' : 'Scan to Pay Satya Foods:'}
                  </div>
                  <div className="inline-block p-2 bg-white rounded-xl border border-amber-200 shadow-inner">
                    {/* Simulated UPI QR Box */}
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-950 to-red-900 text-amber-100 rounded-lg flex flex-col items-center justify-center p-2 text-center border border-amber-400/40">
                      <QrCode className="w-12 h-12 text-amber-300 mb-1" />
                      <span className="text-[9px] font-mono font-bold">{STORE_INFO.upiId}</span>
                      <span className="text-[8px] text-amber-200 font-bold">{formatINR(totalAmount)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-900 font-semibold">
                    UPI ID: <span className="font-mono bg-amber-100 px-2 py-0.5 rounded font-bold text-red-900">{STORE_INFO.upiId}</span>
                  </p>
                </div>
              )}

              {/* Order Total Review Box */}
              <div className="p-3 bg-amber-100/60 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                <div>
                  <span className="font-bold">{isTe ? 'మొత్తం ధర:' : 'Total Amount:'}</span>{' '}
                  <span className="text-base font-black text-red-950 ml-1">{formatINR(totalAmount)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs font-bold text-amber-800 hover:underline"
                >
                  {isTe ? 'చిరునామా మార్చు' : 'Edit Address'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-3 px-4 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-xl font-bold text-xs"
                >
                  {isTe ? 'వెనక్కి' : 'Back'}
                </button>
                <button
                  id="checkout-confirm-order-btn"
                  type="button"
                  onClick={handleCompleteOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isTe ? 'ఆర్డర్ కన్ఫర్మ్ చేయండి' : 'Confirm & Place Order'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 'success' && createdOrder && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300 inline-block mb-1">
                  ORDER PLACED
                </span>
                <h3 className="text-xl font-black text-red-950 font-serif">
                  {isTe ? 'ధన్యవాదాలు! మీ ఆర్డర్ స్వీకరించబడింది' : 'Thank You! Order Successfully Placed'}
                </h3>
                <p className="text-xs text-amber-900 font-bold mt-1">
                  {isTe ? 'ఆర్డర్ ఐడి:' : 'Order ID:'}{' '}
                  <span className="font-mono text-red-900 text-sm bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    {createdOrder.id}
                  </span>
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-300 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b pb-1 font-bold">
                  <span>Customer: {createdOrder.customer.fullName}</span>
                  <span>Phone: {createdOrder.customer.phone}</span>
                </div>
                <div className="text-amber-900 font-medium">
                  {createdOrder.customer.address}, {createdOrder.customer.city} - {createdOrder.customer.pincode}
                </div>
                <div className="border-t pt-1 font-bold flex justify-between text-red-950">
                  <span>Total Amount Paid/Payable:</span>
                  <span className="text-sm font-black">{formatINR(createdOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 max-w-md mx-auto">
                <button
                  id="success-whatsapp-send-btn"
                  type="button"
                  onClick={openWhatsAppConfirmation}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>{isTe ? 'వాట్సాప్‌కి ఆర్డర్ పంపండి' : 'Send Receipt to WhatsApp'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-300"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isTe ? 'రశీదు ప్రింట్' : 'Print Invoice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>{isTe ? 'హోమ్‌కి వెళ్లండి' : 'Back to Store'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
