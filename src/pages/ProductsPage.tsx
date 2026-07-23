import React, { useState } from 'react';
import { Filter, Search, Sparkles } from 'lucide-react';
import { Product, CategoryId, WeightOption } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  products: Product[];
  lang: 'te' | 'en';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddToCart: (product: Product, weight: WeightOption, qty: number) => void;
  onOpenQuickView: (product: Product) => void;
}

const CATEGORY_ITEMS: { id: CategoryId | 'all'; labelEn: string; labelTe: string }[] = [
  { id: 'all', labelEn: 'All Items', labelTe: 'అన్ని రకాలు' },
  { id: 'sweets', labelEn: 'Sweets', labelTe: 'మిఠాయిలు (స్వీట్స్)' },
  { id: 'savouries', labelEn: 'Hot Items / Savouries', labelTe: 'హాట్స్ & పిండివంటలు' },
  { id: 'pickles', labelEn: 'Pickles', labelTe: 'ఆవకాయ పచ్చళ్ళు' },
  { id: 'ghee', labelEn: 'Ghee', labelTe: 'స్వచ్ఛమైన నెయ్యి' },
  { id: 'honey', labelEn: 'Honey', labelTe: 'తేనె' },
  { id: 'sugarfree', labelEn: 'Sugar Free Items', labelTe: 'షుగర్ ఫ్రీ నో-షుగర్' },
];

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  lang,
  searchQuery,
  setSearchQuery,
  onAddToCart,
  onOpenQuickView,
}) => {
  const isTe = lang === 'te';
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Filter products by search query & category
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.nameEn.toLowerCase().includes(q) ||
      p.nameTe.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q) ||
      p.descriptionTe.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="products-page-container" className="min-h-screen bg-[#fdf8f2] py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto space-y-2 text-left sm:text-center pb-4 border-b border-amber-200/80">
        <h1 className="text-3xl sm:text-5xl font-black text-[#3e1b12] font-serif tracking-tight">
          {isTe ? 'మా ఉత్పత్తులు' : 'Our Products'}
        </h1>
        <p className="text-sm sm:text-base text-amber-950/80 max-w-2xl mx-auto">
          {isTe
            ? 'సామర్లకోట సాంప్రదాయ పద్ధతుల్లో స్వచ్ఛంగా తయారు చేసిన స్వీట్స్, హాట్స్, కారపొడులు & పచ్చళ్ళు'
            : 'Authentic homemade Indian sweets, snacks, pickles, ghee, and organic honey'}
        </p>
      </div>

      {/* Main Content Layout (Sidebar Categories + Product Grid) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Categories */}
        <div className={`lg:col-span-3 ${showMobileSidebar ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs sticky top-24 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <h3 className="text-lg font-black text-[#3e1b12] font-serif">
                {isTe ? 'కేటగిరీలు' : 'Categories'}
              </h3>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                {CATEGORY_ITEMS.length - 1}
              </span>
            </div>

            <div className="space-y-1.5">
              {CATEGORY_ITEMS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`category-btn-${cat.id}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowMobileSidebar(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#6b1e22] text-white shadow-md'
                        : 'text-amber-950/85 hover:bg-amber-100/60 hover:text-[#6b1e22]'
                    }`}
                  >
                    <span>{isTe ? cat.labelTe : cat.labelEn}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-300" />}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Main Grid */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Top Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
            
            {/* Mobile Filter Toggle Button */}
            <button
              id="mobile-filter-toggle-btn"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden flex items-center gap-2 bg-amber-100/80 text-amber-950 font-bold text-xs px-4 py-2 rounded-xl border border-amber-300"
            >
              <Filter className="w-4 h-4 text-[#6b1e22]" />
              <span>{isTe ? 'ఫిల్టర్లు' : 'Filters'}</span>
            </button>

            {/* Showing Count */}
            <div className="text-xs sm:text-sm font-semibold text-amber-950">
              {isTe ? (
                <>మొత్తం <span className="font-extrabold text-[#6b1e22]">{filteredProducts.length}</span> ఉత్పత్తులు లభిస్తున్నాయి</>
              ) : (
                <>Showing <span className="font-extrabold text-[#6b1e22]">{filteredProducts.length}</span> products</>
              )}
            </div>

            {/* Search Box Input */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTe ? 'ఉత్పత్తి కోసం వెతకండి...' : 'Search products...'}
                className="w-full pl-9 pr-3 py-1.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
            </div>

          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-amber-200 text-center space-y-3">
              <p className="text-sm font-bold text-amber-900">
                {isTe ? 'ఉత్పత్తులేవీ లభించలేదు' : 'No products match your filter or search query.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="bg-[#6b1e22] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                {isTe ? 'అన్నీ చూడండి' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  onAddToCart={onAddToCart}
                  onOpenQuickView={onOpenQuickView}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
