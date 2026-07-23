import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES_DATA } from '../data/products';
import { Sparkles, Flame, Droplet, Utensils, Citrus, Cookie, Popcorn } from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  lang: 'te' | 'en';
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4 text-orange-600" />,
  Droplet: <Droplet className="w-4 h-4 text-amber-600" />,
  Utensils: <Utensils className="w-4 h-4 text-red-600" />,
  Citrus: <Citrus className="w-4 h-4 text-emerald-600" />,
  Cookie: <Cookie className="w-4 h-4 text-amber-700" />,
  Popcorn: <Popcorn className="w-4 h-4 text-yellow-600" />,
};

const CATEGORY_AVATARS: { id: CategoryId | 'all'; labelTe: string; labelEn: string; image: string }[] = [
  {
    id: 'all',
    labelTe: 'అన్ని రకాలు',
    labelEn: 'All Items',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'sweets',
    labelTe: 'స్వీట్స్ & పిండివంటలు',
    labelEn: 'Sweets',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'snacks',
    labelTe: 'హాట్స్ & స్నాక్స్',
    labelEn: 'Savouries / Hot',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'veg_pickles',
    labelTe: 'వెజ్ ఆవకాయలు',
    labelEn: 'Veg Pickles',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'nonveg_pickles',
    labelTe: 'నాన్-వెజ్ ఆవకాయలు',
    labelEn: 'Non-Veg Pickles',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'powders',
    labelTe: 'కారపొడులు',
    labelEn: 'Podulu / Powders',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'oils',
    labelTe: 'నూనెలు & నెయ్యి',
    labelEn: 'Oils & Ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300',
  },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  lang,
}) => {
  const isTe = lang === 'te';

  return (
    <div id="category-bar-container" className="my-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5">
      
      {/* Circular Image Avatars Category Navigation (Maharaja Foods Style) */}
      <div className="bg-white/80 p-4 rounded-3xl border border-amber-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-red-950 font-serif tracking-wide uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{isTe ? 'ప్రసిద్ధ విభాగాలు (Shop by Category)' : 'Popular Categories'}</span>
          </h3>
          <span className="text-[11px] text-amber-800 font-medium">
            {isTe ? 'చిత్రంపై క్లిక్ చేసి ఎంచుకోండి' : 'Click category to view'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {CATEGORY_AVATARS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-avatar-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className="group flex flex-col items-center shrink-0 min-w-[76px] sm:min-w-[90px] focus:outline-hidden"
              >
                {/* Circular Avatar Ring */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 relative ${
                    isSelected
                      ? 'bg-gradient-to-tr from-red-700 via-amber-500 to-red-900 shadow-md scale-105 ring-2 ring-amber-400'
                      : 'bg-amber-100 hover:bg-amber-300 group-hover:scale-105'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={isTe ? cat.labelTe : cat.labelEn}
                    className="w-full h-full object-cover rounded-full border-2 border-white shadow-xs"
                  />
                  {isSelected && (
                    <span className="absolute bottom-0 right-0 bg-red-800 text-amber-300 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-amber-300 shadow-xs">
                      ✓
                    </span>
                  )}
                </div>

                {/* Avatar Label */}
                <span
                  className={`text-xs font-bold mt-2 text-center transition-colors line-clamp-1 ${
                    isSelected ? 'text-red-900 font-extrabold' : 'text-amber-950 group-hover:text-red-900'
                  }`}
                >
                  {isTe ? cat.labelTe : cat.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pill Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as CategoryId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-gradient-to-r from-red-800 to-amber-900 text-amber-100 border-amber-500 shadow-md scale-102'
                  : 'bg-white hover:bg-amber-100/70 text-amber-950 border-amber-200/90 shadow-xs'
              }`}
            >
              <span className={isSelected ? 'text-amber-300' : ''}>
                {ICON_MAP[cat.icon] || <Sparkles className="w-4 h-4" />}
              </span>
              <span>{isTe ? cat.nameTe : cat.nameEn}</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-amber-400 text-red-950' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

