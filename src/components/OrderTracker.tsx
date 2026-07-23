import React, { useState } from 'react';
import { Order } from '../types';
import { formatINR } from '../utils/pricing';
import { Search, Truck, Clock, CheckCircle, AlertCircle, PackageCheck, MessageSquare, MapPin } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface OrderTrackerProps {
  orders: Order[];
  lang: 'te' | 'en';
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orders, lang }) => {
  const isTe = lang === 'te';
  const [searchKey, setSearchKey] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const key = searchKey.trim().toUpperCase();
    const result = orders.find(
      (o) => o.id.toUpperCase() === key || o.customer.phone.includes(key)
    );
    setFoundOrder(result || null);
  };

  const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div id="order-tracker-container" className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300">
          <Truck className="w-4 h-4 text-amber-700" />
          <span>{isTe ? 'ఆర్డర్ ట్రాకింగ్ సిస్టమ్' : 'Live Order Tracking'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-red-950 font-serif">
          {isTe ? 'మీ ఆర్డర్ స్థితి చూడండి' : 'Track Your Satya Foods Order'}
        </h2>
        <p className="text-xs sm:text-sm text-amber-900/80 max-w-md mx-auto">
          {isTe
            ? 'మీ ఆర్డర్ ఐడి (ఉదా: SATYA-849201) లేదా రిజిస్టర్డ్ ఫోన్ నంబర్ నమోదు చేయండి.'
            : 'Enter your Order ID (e.g. SATYA-849201) or phone number to check status.'}
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder={isTe ? 'ఆర్డర్ ఐడి లేదా ఫోన్ నంబర్...' : 'Order ID or Phone Number...'}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-600 focus:outline-hidden shadow-xs"
          />
          <Search className="w-4 h-4 text-amber-800 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          id="order-tracker-search-btn"
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-red-800 to-amber-900 hover:from-red-900 hover:to-amber-950 text-amber-50 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95"
        >
          {isTe ? 'ట్రాక్ చేయి' : 'Track'}
        </button>
      </form>

      {/* Results Box */}
      {searched && (
        <div className="mt-6">
          {!foundOrder ? (
            <div className="bg-amber-100/60 p-6 rounded-2xl border border-amber-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-red-800 mx-auto" />
              <h3 className="text-sm font-bold text-red-950">
                {isTe ? 'ఆర్డర్ లభించలేదు' : 'No Order Found'}
              </h3>
              <p className="text-xs text-amber-900/80">
                {isTe
                  ? 'దయచేసి సరైన ఆర్డర్ ఐడి నమోదు చేయండి లేదా వాట్సాప్‌లో మా సహాయక బృందాన్ని సంప్రదించండి.'
                  : 'Please check the Order ID or contact us on WhatsApp for assistance.'}
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-amber-300 shadow-xl space-y-6">
              
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-200">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                    {isTe ? 'సామర్లకోట ఆర్డర్ ఐడి' : 'Order Reference'}
                  </span>
                  <h3 className="text-xl font-black text-red-950 font-mono">
                    {foundOrder.id}
                  </h3>
                  <span className="text-xs text-amber-900/70">{foundOrder.date}</span>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 inline-block">
                    {foundOrder.status}
                  </span>
                  <div className="text-xs font-bold text-red-900 mt-1">
                    {formatINR(foundOrder.totalAmount)} ({foundOrder.paymentMethod})
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  {isTe ? 'ఆర్డర్ ప్రయాణ వివరాలు (Order Status Timeline)' : 'Delivery Progress'}
                </h4>

                <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                  {STATUS_STEPS.map((st, idx) => {
                    const currentIdx = getStepIndex(foundOrder.status);
                    const isCompleted = idx <= currentIdx;

                    return (
                      <div key={st} className="flex flex-col items-center space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isCompleted
                              ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                              : 'bg-amber-100 text-amber-700 border-amber-300'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-bold ${
                            isCompleted ? 'text-emerald-900' : 'text-amber-800/60'
                          }`}
                        >
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="text-xs font-extrabold text-red-950 font-serif">
                  {isTe ? 'ఆర్డర్ చేసిన వస్తువులు:' : 'Items in this Order:'}
                </h4>
                <div className="space-y-1 text-xs text-amber-950">
                  {foundOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between border-b border-amber-200/60 pb-1">
                      <span>
                        {isTe ? it.product.nameTe : it.product.nameEn} ({it.weight}) x {it.quantity}
                      </span>
                      <span className="font-bold">{formatINR(it.unitPrice * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex items-start gap-2 text-xs text-amber-950 bg-white p-3 rounded-xl border border-amber-200">
                <MapPin className="w-4 h-4 text-red-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{isTe ? 'డెలివరీ చిరునామా:' : 'Delivery Address:'}</span>{' '}
                  {foundOrder.customer.fullName}, {foundOrder.customer.address}, {foundOrder.customer.city} ({foundOrder.customer.pincode})
                </div>
              </div>

              {/* WhatsApp Support CTA */}
              <div className="text-center pt-2">
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(`నమస్కారం! నా ఆర్డర్ ఐడి ${foundOrder.id} గురించి వివరాలు కావాలి.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>{isTe ? 'ఈ ఆర్డర్ కోసం వాట్సాప్ హెల్ప్‌లైన్' : 'WhatsApp Query for this Order'}</span>
                </a>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
