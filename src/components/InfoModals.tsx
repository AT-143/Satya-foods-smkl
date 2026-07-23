import React from 'react';
import { X, Phone, MapPin, Mail, MessageSquare, ShieldCheck, Heart, Award, Clock } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface InfoModalsProps {
  type: 'about' | 'gallery' | 'contact' | null;
  onClose: () => void;
  lang: 'te' | 'en';
}

const GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=600',
    titleTe: 'స్వచ్ఛమైన నెయ్యి మిఠాయిల తయారీ',
    titleEn: 'Pure Desi Ghee Sweet Making',
  },
  {
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600',
    titleTe: 'సామర్లకోట హోమ్‌మేడ్ మామిడికాయ ఆవకాయ',
    titleEn: 'Traditional Samalkot Mango Avakaya',
  },
  {
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
    titleTe: 'కరకరలాడే మిక్చర్ & పిండివంటలు',
    titleEn: 'Crunchy South Indian Savouries',
  },
  {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
    titleTe: 'సాంప్రదాయ ఘుమఘుమలాడే కారపొడులు',
    titleEn: 'Aromatic Spicy Podulu & Powders',
  },
  {
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    titleTe: 'స్వచ్ఛమైన గానుగ పల్లీ & నువ్వుల నూనెలు',
    titleEn: 'Cold Pressed Wood Pressed Oils',
  },
  {
    url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=600',
    titleTe: 'వ్యాక్యూమ్ లీక్-ప్రూఫ్ ప్యాకింగ్',
    titleEn: 'Hygienic Leak-Proof Packaging',
  },
];

export const InfoModals: React.FC<InfoModalsProps> = ({ type, onClose, lang }) => {
  if (!type) return null;
  const isTe = lang === 'te';

  return (
    <div id="info-modal-backdrop" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#fffdfa] border-2 border-amber-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-900 hover:text-red-900 bg-amber-100 hover:bg-amber-200 p-2 rounded-full transition-colors font-bold"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. ABOUT MODAL */}
        {type === 'about' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="bg-red-100 text-red-900 text-xs font-black px-3 py-1 rounded-full uppercase border border-red-200">
                {isTe ? 'మా గురించి (About Us)' : 'Our Story & Tradition'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#3e1b12] font-serif">
                {isTe ? 'సత్య ఫుడ్స్ హోమ్ ఫుడ్స్ - సామర్లకోట' : 'Satya Foods - Pure Home Foods'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed">
              {isTe
                ? 'తూర్పు గోదావరి జిల్లా సామర్లకోటలో మొదలైన సత్య ఫుడ్స్, తరతరాల నుండి వస్తున్న సాంప్రదాయ పద్ధతుల్లో ఎటువంటి కెమికల్ ప్రిజర్వేటివ్స్ లేదా కృత్రిమ రంగులు వాడకుండా స్వచ్ఛమైన గేదె నెయ్యి, కట్టెగానుగ నూనెలు మరియు చేతితో నూరిన మసాలా దినుసులతో పిండివంటలు మరియు ఆవకాయలను తయారుచేస్తుంది.'
                : 'Originating from Samalkot in East Godavari district, Satya Foods preserves age-old recipes handed down through generations. We prepare traditional Andhra sweets, snacks, podulu, and pickles without synthetic preservatives, artificial colors, or refined oils.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center space-y-1">
                <Heart className="w-5 h-5 text-red-800 mx-auto" />
                <h4 className="text-xs font-bold text-red-950">{isTe ? '100% హోమ్‌మేడ్' : '100% Homemade'}</h4>
                <p className="text-[11px] text-amber-900">{isTe ? 'ఇంటి సభ్యుల ప్రేమానురాగాలతో' : 'Made with love & care'}</p>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center space-y-1">
                <Award className="w-5 h-5 text-emerald-700 mx-auto" />
                <h4 className="text-xs font-bold text-red-950">{isTe ? 'స్వచ్ఛమైన నెయ్యి' : 'Pure Desi Ghee'}</h4>
                <p className="text-[11px] text-amber-900">{isTe ? 'గేదె & ఆవు నెయ్యి మాత్రమే' : '100% Buffalo & Cow Ghee'}</p>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber-700 mx-auto" />
                <h4 className="text-xs font-bold text-red-950">{isTe ? 'హైజీనిక్ ప్యాకింగ్' : 'Vacuum Packaging'}</h4>
                <p className="text-[11px] text-amber-900">{isTe ? 'లీక్-ప్రూఫ్ సేఫ్ డెలివరీ' : 'Leak-proof for dispatch'}</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="bg-[#6b1e22] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#52171a]"
              >
                {isTe ? 'ముందుకు వెళ్లండి' : 'Close & Continue Shopping'}
              </button>
            </div>
          </div>
        )}

        {/* 2. GALLERY MODAL */}
        {type === 'gallery' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-[#3e1b12] font-serif">
                {isTe ? 'ఫొటో గ్యాలరీ' : 'Photo Gallery'}
              </h2>
              <p className="text-xs text-amber-900">
                {isTe ? 'సామర్లకోటలో మా తయారీ మరియు ప్రత్యేక ఉత్పత్తుల చిత్రాలు' : 'Glimpse of our kitchen, freshly made sweets, & pickles'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1 scrollbar-thin">
              {GALLERY_IMAGES.map((img, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden border border-amber-200 bg-amber-100 shadow-xs">
                  <img
                    src={img.url}
                    alt={isTe ? img.titleTe : img.titleEn}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 flex items-end p-2">
                    <span className="text-[10px] font-bold text-amber-100 line-clamp-2">
                      {isTe ? img.titleTe : img.titleEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CONTACT MODAL */}
        {type === 'contact' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
                {isTe ? 'సంప్రదించండి (Contact Us)' : 'Get in Touch'}
              </span>
              <h2 className="text-2xl font-black text-[#3e1b12] font-serif">
                {isTe ? 'సత్య ఫుడ్స్ సామర్లకోట' : 'Satya Foods Store & Kitchen'}
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <MapPin className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-[#3e1b12]">{isTe ? 'మా చిరునామా' : 'Store Address'}</h4>
                  <p className="text-amber-950/80 mt-0.5">{isTe ? STORE_INFO.locationTe : STORE_INFO.locationEn}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${STORE_INFO.phone1}`}
                  className="flex items-center gap-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Phone className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#3e1b12]">{isTe ? 'ఫోన్ నంబర్లు' : 'Phone Numbers'}</h4>
                    <p className="text-xs font-extrabold text-red-900 mt-0.5">{STORE_INFO.phone1} / {STORE_INFO.phone2}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600 fill-emerald-600/20 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-950">{isTe ? 'వాట్సాప్ ఆర్డర్స్' : 'WhatsApp Instant Order'}</h4>
                    <p className="text-xs font-extrabold text-emerald-800 mt-0.5">{STORE_INFO.whatsapp}</p>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#3e1b12]">{isTe ? 'పనివేళలు' : 'Working Hours'}</h4>
                  <p className="text-xs text-amber-900 mt-0.5">ఉదయం 8:00 AM నుండి రాత్రి 9:00 PM వరకు (ఆదివారంతో సహా)</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                  isTe
                    ? 'నమస్కారం! సామర్లకోట సత్య ఫుడ్స్ దుకాణము వివరాలు తెలుసుకోవాలి.'
                    : 'Hello Satya Foods! I would like to inquire about ordering items.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#05a854] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-emerald-700"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{isTe ? 'వాట్సాప్‌లో మెసేజ్ చేయండి' : 'Chat directly on WhatsApp'}</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
