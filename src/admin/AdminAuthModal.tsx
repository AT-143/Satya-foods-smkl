import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
  lang: 'te' | 'en';
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  lang,
}) => {
  const isTe = lang === 'te';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Default Admin Password
  const DEFAULT_ADMIN_PASS = 'satya123';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.trim() === DEFAULT_ADMIN_PASS) {
      setSuccess(true);
      setTimeout(() => {
        onAuthenticate();
        setPassword('');
        setSuccess(false);
      }, 500);
    } else {
      setError(
        isTe
          ? 'పాస్‌వర్డ్ సరిపోలేదు. దయచేసి సరైన అడ్మిన్ పిన్ నమోదు చేయండి.'
          : 'Invalid admin password. Please enter the correct PIN.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-amber-600/40 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-amber-950 relative">
        
        {/* Header Header */}
        <div className="bg-gradient-to-r from-red-900 via-amber-950 to-red-950 text-amber-100 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-300 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>

          <h3 className="text-lg font-extrabold font-serif">
            {isTe ? 'అడ్మిన్ లాగిన్ రక్షణ' : 'Admin Restricted Access'}
          </h3>
          <p className="text-xs text-amber-200/80 mt-1">
            {isTe
              ? 'షాప్ కేటలాగ్ & ఆర్డర్‌లను నిర్వహించడానికి అడ్మిన్ పిన్ నమోదు చేయండి.'
              : 'Enter admin passcode to manage inventory, pricing, orders & coupons.'}
          </p>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{isTe ? 'లాగిన్ విజయవంతమైంది!' : 'Access Granted! Redirecting...'}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-red-950 mb-1.5 flex items-center justify-between">
              <span>{isTe ? 'అడ్మిన్ పాస్‌వర్డ్ (Admin PIN)' : 'Admin Password / PIN'}</span>
              <span className="text-[10px] text-amber-800 font-mono font-normal">Default: satya123</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter passcode (e.g. satya123)"
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-amber-50/50 border border-amber-300 rounded-xl text-sm font-bold text-red-950 focus:outline-hidden focus:ring-2 focus:ring-amber-600 shadow-xs"
              />
              <Key className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-950 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <p className="font-bold text-red-950 mb-0.5">💡 {isTe ? 'సూచన' : 'Owner Note'}:</p>
            {isTe
              ? 'సురక్షిత అడ్మిన్ డాష్‌బోర్డ్ తెరిచేందుకు డిఫాల్ట్ పిన్ "satya123" వాడండి.'
              : 'Default access password is "satya123". Only store administrators should log in here.'}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 rounded-xl transition-colors"
            >
              {isTe ? 'రద్దు చేయి' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-red-800 via-amber-900 to-red-950 text-amber-100 text-xs font-extrabold rounded-xl shadow-md hover:from-red-900 hover:to-amber-950 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTe ? 'అడ్మిన్ ప్యానెల్ తెరువు' : 'Unlock Dashboard'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
