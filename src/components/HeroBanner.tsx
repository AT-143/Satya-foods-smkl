import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  lang: 'te' | 'en';
}

const HERO_SLIDES = [
  {
    id: 'savouries',
    titleEn: 'Crispy Savouries',
    titleTe: 'కరకరలాడే హాట్స్ & పిండివంటలు',
    subtitleEn: 'Enjoy our crunchy mixture, janthikalu, ribbon pakoda, and chekodilu made with pure wood-pressed oil.',
    subtitleTe: 'స్వచ్ఛమైన పల్లీ నూనెతో తయారుచేసిన మిక్చర్, జంతికలు, రిబ్బన్ పకోడీ మరియు చేకోడీల అసలైన రుచి.',
    badgeEn: '100% Homemade',
    badgeTe: '100% హోమ్‌మేడ్',
    tagEn: 'Perfect Tea-Time Snack',
    tagTe: 'సాయంత్రం స్నాక్స్ ప్రత్యేకం',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'pickles',
    titleEn: 'Authentic Avakaya Pickles',
    titleTe: 'సాంప్రదాయ ఆవకాయ పచ్చళ్ళు',
    subtitleEn: 'Handmade Samalkot mango pickle, Gongura pickle, chicken & prawn pickles rich in aromatic spices.',
    subtitleTe: 'సామర్లకోట హోమ్‌మేడ్ మామిడికాయ ఆవకాయ, గోంగూర మరియు చికెన్, ప్రాన్స్ పికిల్స్.',
    badgeEn: 'Fresh Samalkot',
    badgeTe: 'సామర్లకోట ప్రత్యేకం',
    tagEn: 'Zero Preservatives',
    tagTe: 'ఎటువంటి రసాయనాలు లేవు',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'sweets',
    titleEn: 'Pure Desi Ghee Sweets',
    titleTe: 'స్వచ్ఛమైన గేదె నెయ్యి మిఠాయిలు',
    subtitleEn: 'Delicious Kakaraja Kaja, Sunnundalu, Bobbatlu & Ariselu cooked in 100% pure desi ghee.',
    subtitleTe: '100% ప్యూర్ గేదె నెయ్యితో చేసిన కాకినాడ కాజా, సున్నుండలు, బొబ్బట్లు మరియు అరిసెలు.',
    badgeEn: '100% Pure Ghee',
    badgeTe: '100% ప్యూర్ నెయ్యి',
    tagEn: 'Traditional Recipe',
    tagTe: 'గోదావరి సాంప్రదాయ వంటకాలు',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ lang }) => {
  const isTe = lang === 'te';
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const scrollToProducts = () => {
    const catalog = document.getElementById('product-catalog-grid');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCategoryBar = () => {
    const catBar = document.getElementById('category-bar-container');
    if (catBar) {
      catBar.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-banner-section" className="relative overflow-hidden bg-[#f8f1e5] my-4 mx-4 sm:mx-6 lg:mx-8 rounded-3xl border border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:py-16 flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 relative">
        
        {/* Left Text & Call-To-Action Content */}
        <div className="flex-1 space-y-5 text-left z-10">
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#3e1b12] font-serif tracking-tight leading-tight transition-all duration-500">
              {isTe ? slide.titleTe : slide.titleEn}
            </h2>
            <p className="text-sm sm:text-base text-amber-950/80 max-w-lg font-sans leading-relaxed transition-all duration-500">
              {isTe ? slide.subtitleTe : slide.subtitleEn}
            </p>
          </div>

          {/* Action Buttons (Exact Maharaja Home Foods Style) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              id="hero-shop-now-btn"
              onClick={scrollToProducts}
              className="bg-[#6b1e22] hover:bg-[#52171a] text-white px-7 py-3 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{isTe ? 'ఇప్పుడే కొనండి' : 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-learn-more-btn"
              onClick={scrollToCategoryBar}
              className="border border-[#6b1e22] text-[#6b1e22] hover:bg-amber-200/40 px-6 py-3 rounded-lg font-bold text-sm transition-colors cursor-pointer"
            >
              {isTe ? 'కేటగిరీలు చూడండి' : 'Learn More'}
            </button>
          </div>

          {/* Carousel Slide Nav Controls (Left Arrow, Pills, Right Arrow) */}
          <div className="flex items-center gap-3 pt-4">
            <button
              id="hero-carousel-prev-btn"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-amber-800/40 bg-white/80 hover:bg-white text-[#3e1b12] flex items-center justify-center transition-transform active:scale-90 shadow-xs"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-7 bg-[#6b1e22]' : 'w-2 bg-amber-300 hover:bg-amber-400'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              id="hero-carousel-next-btn"
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-amber-800/40 bg-white/80 hover:bg-white text-[#3e1b12] flex items-center justify-center transition-transform active:scale-90 shadow-xs"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Side Image Showcase Circle Frame */}
        <div className="relative shrink-0 w-full sm:w-80 md:w-96 lg:w-[420px] flex justify-center items-center py-4">
          
          {/* Double Gold Ring Frame */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full p-2.5 border-2 border-amber-700/30 bg-amber-100/30 shadow-lg">
            
            <div className="w-full h-full rounded-full overflow-hidden border border-amber-300 bg-white relative">
              <img
                src={slide.image}
                alt={isTe ? slide.titleTe : slide.titleEn}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            </div>

            {/* Top Right Floating White Badge (100% Homemade) */}
            <div className="absolute top-2 right-2 bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-amber-200 text-center z-20">
              <span className="block text-sm font-black text-[#6b1e22] leading-tight">
                {slide.badgeEn.split(' ')[0]}
              </span>
              <span className="block text-[10px] font-bold text-amber-950 uppercase tracking-wider">
                {slide.badgeEn.split(' ').slice(1).join(' ') || 'Homemade'}
              </span>
            </div>

            {/* Bottom Right Floating Tag */}
            <div className="absolute -bottom-2 right-6 bg-[#3e1b12] text-amber-200 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-md border border-amber-500/30 z-20">
              {isTe ? slide.tagTe : slide.tagEn}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

