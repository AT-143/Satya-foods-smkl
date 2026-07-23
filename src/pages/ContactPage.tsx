import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface ContactPageProps {
  lang: 'te' | 'en';
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const isTe = lang === 'te';

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendWhatsAppMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !message) {
      alert(isTe ? 'దయచేసి మీ పేరు మరియు సమాచారాన్ని నమోదు చేయండి.' : 'Please enter your name and message.');
      return;
    }

    const text = isTe
      ? `నమస్కారం! నేను సత్య ఫుడ్స్ వెబ్‌సైట్ నుండి మెసేజ్ చేస్తున్నాను.\n\n*పేరు:* ${fullName}\n*ఫోన్:* ${phoneNumber || 'లభించలేదు'}\n*ఈమెయిల్:* ${emailAddress || 'లభించలేదు'}\n*సందేశం:* ${message}`
      : `Hello Satya Foods! I am sending an inquiry from your website.\n\n*Name:* ${fullName}\n*Phone:* ${phoneNumber || 'N/A'}\n*Email:* ${emailAddress || 'N/A'}\n*Message:* ${message}`;

    const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  return (
    <div id="contact-page-container" className="min-h-screen bg-[#fdf8f2] py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      
      {/* Top Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <span className="inline-block bg-amber-200/60 text-[#6b1e22] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          {isTe ? 'సంప్రదించండి' : 'Get in Touch'}
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-[#3e1b12] font-serif tracking-tight">
          {isTe ? 'మమ్మల్ని నేరుగా సంప్రదించండి' : "We'd Love to Hear From You"}
        </h1>

        <p className="text-sm sm:text-base text-amber-950/80 max-w-xl mx-auto leading-relaxed">
          {isTe
            ? 'ఆర్డర్ వివరాలు, బల్క్ ఆర్డర్లు లేదా సందేహాల కోసం నేరుగా మమ్మల్ని వాట్సాప్ లేదా ఫోన్ ద్వారా సంప్రదించవచ్చు.'
            : 'Have questions about our products? Want to place a bulk order? Reach out to us and we will get back to you as soon as possible.'}
        </p>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Information */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#3e1b12] font-serif border-b border-amber-100 pb-3">
            {isTe ? 'చిరునామా & వివరాలు' : 'Contact Information'}
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-amber-950/90">
            
            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-[#6b1e22]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#3e1b12]">{isTe ? 'ఫోన్ నంబర్లు' : 'Phone'}</h4>
                <p className="font-semibold text-amber-900">{STORE_INFO.phone1} / {STORE_INFO.phone2}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4 text-[#6b1e22]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#3e1b12]">{isTe ? 'ఈమెయిల్' : 'Email'}</h4>
                <p className="font-semibold text-amber-900 break-all">satyafoodssmlk@gmail.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#6b1e22]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#3e1b12]">{isTe ? 'చిరునామా' : 'Address'}</h4>
                <p className="font-semibold text-amber-900">
                  {isTe ? STORE_INFO.locationTe : STORE_INFO.locationEn}
                </p>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Instagram className="w-4 h-4 text-[#6b1e22]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#3e1b12]">{isTe ? 'ఇన్‌స్టాగ్రామ్' : 'Instagram'}</h4>
                <p className="font-semibold text-amber-900">@satya_foods</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-[#6b1e22]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#3e1b12]">{isTe ? 'పనివేళలు' : 'Business Hours'}</h4>
                <p className="font-semibold text-amber-900">Mon - Sun: 8:00 AM to 9:00 PM</p>
              </div>
            </div>

          </div>

          {/* Quick WhatsApp CTA Button */}
          <div className="pt-2 border-t border-amber-100">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('నమస్కారం! ఆర్డర్ వివరాల కోసం మెసేజ్ చేస్తున్నాను.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#6b1e22] hover:bg-[#52171a] text-white py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>{isTe ? 'వాట్సాప్‌లో చాట్ చేయండి' : 'Chat on WhatsApp'}</span>
            </a>
          </div>

        </div>

        {/* Right Column: Send us a Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-xl sm:text-2xl font-black text-[#3e1b12] font-serif border-b border-amber-100 pb-3">
            {isTe ? 'సందేశం పంపండి' : 'Send us a Message'}
          </h2>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {isTe
                  ? 'మీ సందేశం వాట్సాప్‌లో సిద్ధం చేయబడింది! వాట్సాప్ తెరవబడింది.'
                  : 'Your message was opened in WhatsApp! We will reply promptly.'}
              </span>
            </div>
          )}

          <form onSubmit={handleSendWhatsAppMessage} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-[#3e1b12] mb-1">
                {isTe ? 'మీ పూర్తి పేరు' : 'Enter your full name'} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isTe ? 'ఉదా: రాజు రమేష్' : 'e.g. Rahul Sharma'}
                className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-xl font-medium text-amber-950 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3e1b12] mb-1">
                  {isTe ? 'ఫోన్ నంబర్' : 'Enter your phone number'}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-xl font-medium text-amber-950 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3e1b12] mb-1">
                  {isTe ? 'ఈమెయిల్ అడ్రస్' : 'Enter your email address'}
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-xl font-medium text-amber-950 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3e1b12] mb-1">
                {isTe ? 'మీ సందేశం లేదా ప్రశ్న' : 'How can we help you?'} *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isTe
                    ? 'మీకు కావలసిన పదార్థాల వివరాలు లేదా బల్క్ ఆర్డర్ ప్రశ్నలను ఇక్కడ రాయండి...'
                    : 'Enter details about your query or bulk order request...'
                }
                className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-xl font-medium text-amber-950 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6b1e22] hover:bg-[#52171a] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-300 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isTe ? 'వాట్సాప్ ద్వారా పంపండి' : 'Send via WhatsApp'}</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
