import React from 'react';
import { Sparkles, Camera } from 'lucide-react';

interface GalleryPageProps {
  lang: 'te' | 'en';
}

const GALLERY_ITEMS = [
  {
    id: 1,
    categoryEn: 'Sweets',
    categoryTe: 'స్వీట్స్',
    titleEn: 'Pure Ghee Sweets & Laddu',
    titleTe: 'స్వచ్ఛమైన గేదె నెయ్యి మిఠాయిలు',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    categoryEn: 'Savouries',
    categoryTe: 'పిండివంటలు',
    titleEn: 'Crunchy Janthikalu & Mixture',
    titleTe: 'కరకరలాడే జంతికలు, చెకోడీలు & మిక్చర్',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    categoryEn: 'Pickles',
    categoryTe: 'ఆవకాయ పచ్చళ్ళు',
    titleEn: 'Samalkot Avakaya & Gongura Pickles',
    titleTe: 'సామర్లకోట హోమ్‌మేడ్ మామిడి ఆవకాయ',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    categoryEn: 'Pure Ghee',
    categoryTe: 'స్వచ్ఛమైన నెయ్యి',
    titleEn: 'A2 Buffalo & Cow Ghee',
    titleTe: '100% ప్యూర్ గేదె & ఆవు నెయ్యి',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 5,
    categoryEn: 'Natural Honey',
    categoryTe: 'స్వచ్ఛమైన తేనె',
    titleEn: 'Wild Forest Raw Honey',
    titleTe: 'అడవి తేనె (100% ఆర్గానిక్)',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 6,
    categoryEn: 'Traditional Sweets',
    categoryTe: 'సాంప్రదాయ మిఠాయిలు',
    titleEn: 'Kakaraja Kaja & Sunnundalu',
    titleTe: 'కాకినాడ కాజా & మినప సున్నుండలు',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 7,
    categoryEn: 'Spicy Podulu',
    categoryTe: 'కారపొడులు',
    titleEn: 'Idli Podi & Aromatic Spice Powders',
    titleTe: 'ఘుమఘుమలాడే ఇడ్లీ కారప్పొడి & కరివేపాకు పొడి',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 8,
    categoryEn: 'Non-Veg Pickles',
    categoryTe: 'మాంసాహార పచ్చళ్ళు',
    titleEn: 'Godavari Chicken & Prawn Pickles',
    titleTe: 'చికెన్ & రొయ్యల నిల్వ పచ్చళ్ళు',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 9,
    categoryEn: 'Wood Pressed Oil',
    categoryTe: 'గానుగ నూనెలు',
    titleEn: 'Pure Sesame & Peanut Oil',
    titleTe: 'కట్టెగానుగ పల్లీ & నువ్వుల నూనె',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
  },
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ lang }) => {
  const isTe = lang === 'te';

  return (
    <div id="gallery-page-container" className="min-h-screen bg-[#fdf8f2] py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      
      {/* Page Header Banner */}
      <div className="max-w-7xl mx-auto bg-[#f8f1e5] border border-amber-200/80 rounded-3xl p-8 text-center space-y-3 shadow-xs">
        <span className="inline-flex items-center gap-1.5 bg-amber-200/60 text-[#6b1e22] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>{isTe ? 'ఫొటో గ్యాలరీ' : 'Visual Gallery'}</span>
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-[#3e1b12] font-serif tracking-tight">
          {isTe ? 'రుచుల దృశ్యమాలిక' : 'A Visual Journey Through Our Delicacies'}
        </h1>

        <p className="text-sm sm:text-base text-amber-950/80 max-w-2xl mx-auto font-sans leading-relaxed">
          {isTe
            ? 'సామర్లకోట సత్య ఫుడ్స్ కిచెన్‌లో సాంప్రదాయ పద్ధతిలో తయారైన స్వచ్ఛమైన పదార్థాల చిత్రమాలిక'
            : 'Explore the artistry behind our traditional foods — from preparation to perfection.'}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-3xl overflow-hidden border border-amber-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-500"
          >
            <div className="aspect-4/3 w-full overflow-hidden bg-amber-950 relative">
              <img
                src={item.image}
                alt={isTe ? item.titleTe : item.titleEn}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white space-y-1 transition-opacity">
                <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                  {isTe ? item.categoryTe : item.categoryEn}
                </span>
                <h3 className="text-lg font-bold font-serif leading-snug drop-shadow-md">
                  {isTe ? item.titleTe : item.titleEn}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
