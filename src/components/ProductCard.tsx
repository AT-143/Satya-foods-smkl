import React, { useState } from 'react';
import { Product, WeightOption } from '../types';
import { calculateWeightPrice, formatINR } from '../utils/pricing';
import { ShoppingCart, Star, Eye, MessageSquare, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface ProductCardProps {
  product: Product;
  lang: 'te' | 'en';
  onAddToCart: (product: Product, weight: WeightOption) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onAddToCart,
  onQuickView,
}) => {
  const isTe = lang === 'te';
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>('1kg');
  const [added, setAdded] = useState(false);

  const currentPrice = calculateWeightPrice(product.pricePerKg, selectedWeight);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedWeight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const generateSingleItemWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pName = isTe ? product.nameTe : product.nameEn;
    const msg = `నమస్కారం! నాకు సత్య ఫుడ్స్ నుండి ఈ క్రింది వస్తువు కావాలి:\n- ${pName} (${selectedWeight}) = ${formatINR(currentPrice)}\nదయచేసి ఆర్డర్ కన్ఫర్మ్ చేయగలరు.`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-amber-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Top Image Box */}
      <div className="relative aspect-4/3 w-full bg-amber-100/50 overflow-hidden">
        <img
          src={product.image}
          alt={isTe ? product.nameTe : product.nameEn}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="bg-red-800 text-amber-100 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider flex items-center gap-1 border border-red-600">
              <Sparkles className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
              {isTe ? 'హాట్ సేల్' : 'BESTSELLER'}
            </span>
          )}
          {product.isPureOrganic && (
            <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-emerald-600">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-300" />
              {isTe ? '100% ఆర్గానిక్' : 'PURE ORGANIC'}
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <button
          id={`quick-view-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-amber-900 rounded-full shadow-md transition-all opacity-80 group-hover:opacity-100"
          title={isTe ? 'వివరాలు చూడండి' : 'Quick View'}
        >
          <Eye className="w-4 h-4 text-amber-800" />
        </button>

        {/* Shelf Life Pill */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-amber-100 text-[10px] font-medium px-2 py-0.5 rounded-md">
          {isTe ? `నిల్వ కాలం: ${product.shelfLife}` : `Shelf Life: ${product.shelfLife}`}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-amber-800/60 font-normal">({product.reviewCount})</span>
          </div>

          {/* Telugu Title */}
          <h3 className="text-base sm:text-lg font-bold text-red-950 font-serif leading-snug group-hover:text-amber-900 transition-colors">
            {product.nameTe}
          </h3>

          {/* English Title */}
          <p className="text-xs text-amber-900/80 font-semibold mb-1">
            {product.nameEn}
          </p>

          {/* Short Description */}
          <p className="text-xs text-amber-900/70 line-clamp-2 leading-relaxed">
            {isTe ? product.descriptionTe : product.descriptionEn}
          </p>
        </div>

        {/* Weight Selector Options */}
        <div className="pt-1">
          <label className="text-[11px] font-bold text-amber-900 block mb-1">
            {isTe ? 'పరిమాణం (Weight):' : 'Select Quantity:'}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['250g', '500g', '1kg'] as WeightOption[]).map((w) => {
              const active = selectedWeight === w;
              return (
                <button
                  key={w}
                  id={`weight-opt-${product.id}-${w}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWeight(w);
                  }}
                  className={`py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    active
                      ? 'bg-amber-900 text-amber-100 border-amber-800 shadow-xs'
                      : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-2 border-t border-amber-100 flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-red-900">
                {formatINR(currentPrice)}
              </span>
              <span className="text-[11px] text-amber-800 font-medium ml-1">
                / {selectedWeight}
              </span>
            </div>
            {selectedWeight !== '1kg' && (
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                1kg = {formatINR(product.pricePerKg)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id={`add-to-cart-btn-${product.id}`}
              type="button"
              onClick={handleAdd}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-900 hover:bg-amber-950 text-amber-50 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isTe ? 'చేర్చబడింది!' : 'Added!'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{isTe ? 'కార్ట్‌కి చేర్చు' : 'Add to Cart'}</span>
                </>
              )}
            </button>

            <button
              id={`quick-whatsapp-btn-${product.id}`}
              type="button"
              onClick={generateSingleItemWhatsApp}
              className="py-2 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs active:scale-95"
              title="Buy directly on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white/20" />
              <span>{isTe ? 'వాట్సాప్ కొనుగోలు' : 'Buy WhatsApp'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
