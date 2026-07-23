import React, { useState } from 'react';
import { Product, WeightOption, Review } from '../types';
import { calculateWeightPrice, formatINR } from '../utils/pricing';
import { X, Star, ShoppingCart, MessageSquare, ShieldCheck, Leaf, HeartHandshake, Check } from 'lucide-react';
import { STORE_INFO, SAMPLE_REVIEWS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'te' | 'en';
  onAddToCart: (product: Product, weight: WeightOption) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  lang,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const isTe = lang === 'te';
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>('1kg');
  const [added, setAdded] = useState(false);

  // Filter reviews for this product
  const reviews = SAMPLE_REVIEWS.filter((r) => r.productId === product.id);

  const price = calculateWeightPrice(product.pricePerKg, selectedWeight);

  const handleAdd = () => {
    onAddToCart(product, selectedWeight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsApp = () => {
    const pName = isTe ? product.nameTe : product.nameEn;
    const msg = `నమస్కారం! నాకు సత్య ఫుడ్స్ సామర్లకోట నుండి ఈ క్రింది వస్తువు కావాలి:\n- ${pName} (${selectedWeight}) = ${formatINR(price)}\nదయచేసి ఆర్డర్ చేయండి.`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-300 max-h-[90vh] flex flex-col">
        
        {/* Header Close Button */}
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-black/40 hover:bg-black/70 text-amber-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-100 border border-amber-200">
              <img
                src={product.image}
                alt={isTe ? product.nameTe : product.nameEn}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="absolute bottom-2 left-2 bg-emerald-900/90 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isTe ? 'సామర్లకోట ఆర్గానిక్స్ హామీ' : 'Samalkot Organics Certified'}</span>
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating} / 5.0</span>
                  <span className="text-amber-900/60">({product.reviewCount} {isTe ? 'అభిప్రాయాలు' : 'reviews'})</span>
                </div>

                <h2 className="text-2xl font-black text-red-950 font-serif">
                  {product.nameTe}
                </h2>
                <h3 className="text-sm font-bold text-amber-900/80 mb-2">
                  {product.nameEn}
                </h3>

                <p className="text-xs text-amber-950/80 leading-relaxed font-sans bg-amber-100/60 p-3 rounded-xl border border-amber-200">
                  {isTe ? product.descriptionTe : product.descriptionEn}
                </p>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-extrabold text-red-950 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isTe ? 'పదార్థాలు (Ingredients):' : 'Pure Ingredients:'}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(isTe ? product.ingredientsTe : product.ingredientsEn).map((ing, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-amber-950 text-xs font-medium px-2.5 py-1 rounded-lg border border-amber-200"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shelf Life & Storage */}
              <div className="text-xs text-amber-900 flex items-center gap-4 bg-amber-100/40 p-2.5 rounded-xl border border-amber-200">
                <div>
                  <span className="font-bold">{isTe ? 'నిల్వ సమయం:' : 'Shelf Life:'}</span>{' '}
                  <span className="text-red-900 font-extrabold">{product.shelfLife}</span>
                </div>
                <div>
                  <span className="font-bold">{isTe ? 'నిల్వ పద్ధతి:' : 'Storage:'}</span>{' '}
                  <span>{isTe ? 'పొడి ప్రాంతంలో ఉంచండి' : 'Store in Cool Dry Place'}</span>
                </div>
              </div>

              {/* Weight Selector */}
              <div>
                <label className="text-xs font-bold text-amber-950 block mb-1.5">
                  {isTe ? 'పరిమాణం ఎంచుకోండి (Select Quantity):' : 'Select Package Size:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['250g', '500g', '1kg'] as WeightOption[]).map((w) => {
                    const active = selectedWeight === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWeight(w)}
                        className={`py-2 text-xs font-extrabold rounded-xl border transition-all ${
                          active
                            ? 'bg-amber-900 text-amber-50 border-amber-800 shadow-sm'
                            : 'bg-white text-amber-950 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Price & Add Buttons */}
              <div className="pt-2 border-t border-amber-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-red-950">
                    {formatINR(price)}
                  </span>
                  <span className="text-xs text-amber-900 font-bold">
                    {isTe ? 'సామర్లకోట డైరెక్ట్ సరఫరా' : 'Direct Samalkot Packing'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAdd}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      added
                        ? 'bg-emerald-700 text-white'
                        : 'bg-amber-900 hover:bg-amber-950 text-amber-50'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{isTe ? 'కార్ట్‌లో చేర్చబడింది!' : 'Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isTe ? 'కార్ట్‌కి చేర్చు' : 'Add to Cart'}</span>
                      </>
                    )}
                  </button>

                  <button
                    id="modal-whatsapp-buy-btn"
                    onClick={handleWhatsApp}
                    className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>{isTe ? 'వాట్సాప్‌లో కొనండి' : 'Buy on WhatsApp'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="pt-4 border-t border-amber-200">
            <h3 className="text-base font-bold text-red-950 font-serif mb-3">
              {isTe ? 'వినియోగదారుల రివ్యూలు (Customer Reviews)' : 'Verified Customer Reviews'}
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-amber-900/70 italic">
                {isTe
                  ? 'ఈ ప్రాడక్ట్ కోసం ఇప్పటివరకూ రివ్యూలు లేవు. మీరు కొనుగోలు చేసిన తర్వాత రివ్యూ ఇవ్వండి!'
                  : 'No specific reviews yet for this product. Be the first to try and leave a review!'}
              </p>
            ) : (
              <div className="space-y-2">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{rev.customerName} ({rev.location})</span>
                      <span className="text-[10px] text-amber-800">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-amber-900 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
