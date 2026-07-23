import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Phone, MessageSquare, ShieldCheck, Truck, Sparkles, RefreshCw, Lock, Unlock, LogOut, Info, Image as GalleryIcon, Mail } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface HeaderProps {
  activeTab: 'store' | 'tracking' | 'reviews' | 'admin';
  setActiveTab: (tab: 'store' | 'tracking' | 'reviews' | 'admin') => void;
  lang: 'te' | 'en';
  setLang: (lang: 'te' | 'en') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdminAuthenticated: boolean;
  onOpenAdminModal: () => void;
  onAdminLogout: () => void;
  onOpenAbout?: () => void;
  onOpenGallery?: () => void;
  onOpenContact?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  isAdminAuthenticated,
  onOpenAdminModal,
  onAdminLogout,
  onOpenAbout,
  onOpenGallery,
  onOpenContact,
}) => {
  const isTe = lang === 'te';
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isProducts = location.pathname === '/products';
  const isGallery = location.pathname === '/gallery';
  const isReviews = location.pathname === '/reviews';
  const isContact = location.pathname === '/contact';
  const isTrack = location.pathname === '/track';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#fdf8f2] backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      
      {/* 1. Top Green Announcement Bar (Exact Maharaja Foods Style) */}
      <div id="top-announcement-bar" className="bg-[#05a854] text-white text-xs py-2 px-4 font-semibold tracking-wide shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-3 text-center">
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <span className="shrink-0 font-medium">
              🚚 {isTe ? 'రూ. 1000 దాటితే ఉచిత డెలివరీ పొందండి' : 'Orders above ₹1000 get'}
            </span>
            <span className="bg-white text-[#05a854] font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-xs">
              FREE DELIVERY
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white text-[#05a854]" />
              <span>WhatsApp: {STORE_INFO.phone1}</span>
            </a>
            <a href={`tel:${STORE_INFO.phone1}`} className="flex items-center gap-1 hover:underline transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>{STORE_INFO.phone2}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => {
              setActiveTab('store');
              navigate('/');
            }}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-12 h-12 rounded-full border-2 border-amber-800 p-0.5 bg-amber-900/10 shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-red-900 text-amber-100 flex flex-col items-center justify-center p-1 text-center shadow-inner">
                <span className="text-[11px] font-black leading-tight font-serif tracking-tight">SATYA</span>
                <span className="text-[7px] font-extrabold text-amber-300 uppercase leading-none">FOODS</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#3e1b12] tracking-tight font-serif">
                  Satya Foods
                </h1>
              </div>
              <p className="text-[11px] text-amber-900/80 font-medium tracking-wide">
                Home Foods • Samalkot
              </p>
            </div>
          </button>

          {/* Center Navigation Links (Maharaja Home Foods Style) */}
          <nav id="header-center-menu" className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#4a2618]">
            <button
              id="menu-link-home"
              onClick={() => {
                setActiveTab('store');
                navigate('/');
              }}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isHome ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'హోమ్' : 'Home'}
            </button>

            <button
              id="menu-link-about"
              onClick={() => navigate('/about')}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isAbout ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'మా గురించి' : 'About'}
            </button>

            <button
              id="menu-link-products"
              onClick={() => navigate('/products')}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isProducts ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'ఉత్పత్తులు' : 'Products'}
            </button>

            <button
              id="menu-link-gallery"
              onClick={() => navigate('/gallery')}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isGallery ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'గ్యాలరీ' : 'Gallery'}
            </button>

            <button
              id="menu-link-reviews"
              onClick={() => {
                setActiveTab('reviews');
                navigate('/reviews');
              }}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isReviews || activeTab === 'reviews' ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'రివ్యూలు' : 'Reviews'}
            </button>

            <button
              id="menu-link-contact"
              onClick={() => navigate('/contact')}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isContact ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'సంప్రదించండి' : 'Contact'}
            </button>

            <button
              id="menu-link-track"
              onClick={() => {
                setActiveTab('tracking');
                navigate('/track');
              }}
              className={`hover:text-red-900 transition-colors py-1 relative ${
                isTrack || activeTab === 'tracking' ? 'text-red-900 font-extrabold border-b-2 border-red-800' : ''
              }`}
            >
              {isTe ? 'ఆర్డర్ ట్రాక్' : 'Track'}
            </button>

            <button
              id="menu-link-admin"
              onClick={() => {
                navigate('/admin');
                setActiveTab('admin');
              }}
              className={`hover:text-red-900 transition-colors py-1 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
                isAdmin || activeTab === 'admin'
                  ? 'bg-red-900 text-white border-red-900'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {isAdminAuthenticated ? <Unlock className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3" />}
              <span>{isTe ? 'అడ్మిన్' : 'Admin'}</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Search Input Trigger */}
            <div className="relative hidden sm:block">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTe ? 'వెతకండి...' : 'Search items...'}
                className="w-36 lg:w-48 pl-8 pr-3 py-1.5 bg-white border border-amber-300 rounded-full text-xs focus:outline-hidden focus:w-56 transition-all shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-amber-800 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className="px-2.5 py-1 rounded-full bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold transition-all flex items-center gap-1"
              title="Change Language"
            >
              <RefreshCw className="w-3 h-3 text-amber-800" />
              <span>{lang === 'te' ? 'EN' : 'తెలుగు'}</span>
            </button>

            {/* Shopping Cart Icon (Exact Maharaja Style) */}
            <button
              id="cart-drawer-toggle-btn"
              onClick={onOpenCart}
              className="p-2.5 text-[#3e1b12] hover:text-red-900 transition-colors relative group focus:outline-hidden"
              title="Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-red-800 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Horizontal Sub-menu Navigation */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs border-t border-amber-200/60 mt-2 scrollbar-none font-semibold">
          <button
            onClick={() => {
              setActiveTab('store');
              navigate('/');
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isHome ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'హోమ్' : 'Home'}
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isAbout ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'మా గురించి' : 'About'}
          </button>
          <button
            onClick={() => navigate('/products')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isProducts ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'ఉత్పత్తులు' : 'Products'}
          </button>
          <button
            onClick={() => navigate('/gallery')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isGallery ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'గ్యాలరీ' : 'Gallery'}
          </button>
          <button
            onClick={() => {
              setActiveTab('reviews');
              navigate('/reviews');
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isReviews || activeTab === 'reviews' ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'రివ్యూలు' : 'Reviews'}
          </button>
          <button
            onClick={() => navigate('/contact')}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isContact ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'సంప్రదించండి' : 'Contact'}
          </button>
          <button
            onClick={() => {
              setActiveTab('tracking');
              navigate('/track');
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isTrack || activeTab === 'tracking' ? 'bg-red-900 text-white' : 'bg-amber-100 text-amber-950'
            }`}
          >
            {isTe ? 'ఆర్డర్ ట్రాక్' : 'Track'}
          </button>
          <button
            onClick={() => {
              navigate('/admin');
              setActiveTab('admin');
            }}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isAdmin || activeTab === 'admin' ? 'bg-red-900 text-white' : 'bg-amber-200 text-red-950 font-bold'
            }`}
          >
            {isTe ? 'అడ్మిన్' : 'Admin'}
          </button>
        </div>

      </div>
    </header>
  );
};

