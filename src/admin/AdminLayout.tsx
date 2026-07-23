import React from 'react';
import { ShieldCheck, LogOut, Store, Sparkles, Lock, Unlock, Home, Globe } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface AdminLayoutProps {
  children: React.ReactNode;
  lang: 'te' | 'en';
  setLang: (lang: 'te' | 'en') => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onBackToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  lang,
  setLang,
  isAuthenticated,
  onLogout,
  onBackToStore,
}) => {
  const isTe = lang === 'te';

  return (
    <div className="min-h-screen bg-amber-50/40 text-amber-950 flex flex-col font-sans selection:bg-amber-300">
      {/* Dedicated Admin Header */}
      <header className="bg-gradient-to-r from-red-950 via-amber-950 to-red-900 text-amber-100 border-b-2 border-amber-500/40 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Admin Title & Store Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-400/30">
                  {isTe ? 'అడ్మిన్ పోర్టల్' : 'Owner Admin Portal'}
                </span>
                {isAuthenticated && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>{isTe ? 'సెషన్ యాక్టివ్' : 'Authorized Session'}</span>
                  </span>
                )}
              </div>
              <h1 className="text-lg font-black font-serif tracking-wide text-amber-100 mt-0.5">
                {STORE_INFO.nameEn} Management Portal
              </h1>
            </div>
          </div>

          {/* Action Tools: Language, Store Return & Logout */}
          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-900/50 hover:bg-amber-900 text-amber-200 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'te' ? 'English' : 'తెలుగు'}</span>
            </button>

            {/* Back to Customer Storefront */}
            <button
              onClick={onBackToStore}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTe ? 'కస్టమర్ షాప్‌కి వెళ్లు' : 'View Customer Store'}</span>
            </button>

            {/* Admin Logout */}
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-lg bg-red-900 hover:bg-red-950 text-amber-100 border border-red-500/50 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs"
                title="Logout Admin Session"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-300" />
                <span>{isTe ? 'లాగౌట్' : 'Logout'}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-amber-950 text-amber-300/80 text-xs py-4 px-4 border-t border-amber-800/50 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {STORE_INFO.nameEn} • Secure Store Administrator Panel</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>System Status: Fully Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
