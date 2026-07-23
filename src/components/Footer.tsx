import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORE_INFO } from '../data/products';
import { Phone, MessageSquare, MapPin, ChevronDown, ChevronUp, ShieldCheck, Heart, Lock, Unlock } from 'lucide-react';

interface FooterProps {
  lang: 'te' | 'en';
  onOpenAdminModal?: () => void;
  isAdminAuthenticated?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdminModal, isAdminAuthenticated }) => {
  const isTe = lang === 'te';
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      qTe: 'పికిల్స్ మరియు ఘీ లీకేజీ లేకుండా డెలివరీ ఎలా చేస్తారు?',
      qEn: 'How is leak-proof packaging handled for pickles and ghee?',
      aTe: 'మేము 3-లేయర్ ప్రొటెక్టివ్ బాటిల్ సీలింగ్ మరియు ఎయిర్-బబుల్ ర్యాపింగ్ ఉపయోగిస్తాము. ఇండియాలో ఎక్కడికైనా లీకేజ్ లేకుండా క్షేమంగా డెలివరీ అవుతుంది.',
      aEn: 'We use 3-layer bottle induction sealing and air-bubble cushions ensuring zero leakage during courier transport across India.',
    },
    {
      qTe: 'నాన్-వెజ్ పికిల్స్ ఎంతకాలం నిల్వ ఉంటాయి?',
      qEn: 'What is the shelf life of Non-Veg pickles?',
      aTe: 'స్వచ్ఛమైన పల్లీ నూనె, సహజ నిమ్మరసంతో చేయడం వల్ల ఫ్రిజ్‌లో ఉంచితే 3 నెలలకు పైగా తాజా రుచితో నిల్వ ఉంటాయి.',
      aEn: 'Made with cold pressed groundnut oil and natural lemon juice, non-veg pickles remain fresh for over 3 months.',
    },
    {
      qTe: 'డెలివరీ సమయం ఎంత పడుతుంది?',
      qEn: 'What is the estimated delivery time?',
      aTe: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణలో 2-3 రోజుల్లో, ఇతర రాష్ట్రాల్లో 4-5 రోజుల్లో హోమ్ డెలివరీ అవుతుంది.',
      aEn: 'Orders within AP & Telangana are delivered in 2-3 days, and other states within 4-5 working days.',
    },
  ];

  return (
    <footer id="main-footer" className="bg-gradient-to-b from-amber-950 via-red-950 to-black text-amber-100/90 pt-10 pb-6 border-t-2 border-amber-500/40 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Address Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-extrabold text-red-900 text-xs border border-amber-300">
                A2Z
              </div>
              <h3 className="text-lg font-black text-amber-200 font-serif">
                {isTe ? STORE_INFO.nameTe : STORE_INFO.nameEn}
              </h3>
            </div>

            <p className="text-xs text-amber-200/80 leading-relaxed font-sans">
              {isTe ? STORE_INFO.taglineTe : STORE_INFO.taglineEn}
            </p>

            <div className="space-y-1.5 text-xs text-amber-200/90 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{isTe ? STORE_INFO.locationTe : STORE_INFO.locationEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {STORE_INFO.phone1} / {STORE_INFO.phone2}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-bold text-amber-300"
                >
                  WhatsApp Help: {STORE_INFO.phone1}
                </a>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-amber-200 uppercase tracking-wider font-serif">
              {isTe ? 'తరచూ అడిగే ప్రశ్నలు (FAQ)' : 'Frequently Asked Questions'}
            </h4>
            <div className="space-y-2 text-xs">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="bg-amber-900/30 border border-amber-500/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-2.5 text-left font-bold flex items-center justify-between gap-2 text-amber-100 hover:text-amber-300"
                    >
                      <span>{isTe ? f.qTe : f.qEn}</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-2.5 pt-0 text-amber-200/80 leading-relaxed border-t border-amber-500/20 bg-black/20">
                        {isTe ? f.aTe : f.aEn}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality & Tradition Promise */}
          <div className="space-y-3 bg-amber-900/20 p-4 rounded-2xl border border-amber-500/20">
            <h4 className="text-sm font-extrabold text-amber-200 font-serif">
              {isTe ? 'సామర్లకోట ఆర్గానిక్స్ హామీ' : 'Samalkot Organics Quality Promise'}
            </h4>
            <ul className="text-xs space-y-2 text-amber-200/90 font-medium">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isTe ? '100% గానుగ నూనె & శుద్ధమైన నెయ్యి' : '100% Wood-pressed oils & A2 Cow Ghee'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isTe ? 'ఎటువంటి కెమికల్ కలర్స్ లేవు' : 'Zero artificial colors or preservatives'}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isTe ? 'భారతదేశమంతటా సురక్షిత హోమ్ డెలివరీ' : 'Pan-India safe door delivery'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-amber-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-300/70 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              © {new Date().getFullYear()} {STORE_INFO.nameEn} ({STORE_INFO.nameTe}). Samalkot, AP.
            </span>
            <button
              onClick={() => {
                navigate('/admin');
                if (onOpenAdminModal) onOpenAdminModal();
              }}
              className="text-amber-400/90 hover:text-amber-200 font-bold underline flex items-center gap-1 text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 transition-colors"
            >
              {isAdminAuthenticated ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
              <span>{isTe ? 'స్టోర్ యజమాని ప్యానెల్ (Owner Portal)' : 'Store Owner Portal'}</span>
            </button>
          </div>
          <div className="flex items-center gap-1 text-amber-200 font-semibold">
            <span>{isTe ? 'మన సంప్రదాయం... మన రుచులు...' : 'Made with love for Godavari Delicacies'}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>

      </div>
    </footer>
  );
};
