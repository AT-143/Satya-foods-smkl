import React from 'react';
import { Heart, Leaf, Award, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface AboutPageProps {
  lang: 'te' | 'en';
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const isTe = lang === 'te';

  return (
    <div id="about-page-container" className="min-h-screen bg-[#fdf8f2] py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-fadeIn">
      
      {/* Top Banner Section: Our Story */}
      <section className="max-w-7xl mx-auto bg-[#f8f1e5] border border-amber-200/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="md:col-span-7 space-y-5">
            <span className="inline-block bg-amber-200/60 text-[#6b1e22] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              {isTe ? 'మా చరిత్ర' : 'Our Story'}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#3e1b12] font-serif tracking-tight leading-tight">
              {isTe ? 'సాంప్రదాయం మరియు స్వచ్ఛమైన రుచులు' : 'The Royal Taste of Tradition'}
            </h1>

            <div className="space-y-4 text-amber-950/80 text-sm sm:text-base leading-relaxed">
              <p>
                {isTe
                  ? 'సత్య ఫుడ్స్ (మహారాజా హోమ్ ఫుడ్స్) తూర్పు గోదావరి జిల్లా సామర్లకోట ప్రాంతంలో మొదలైన ఒక కుటుంబ సాంప్రదాయ సంస్థ. ఎటువంటి కెమికల్స్ లేకుండా, తరతరాలుగా వస్తున్న స్వచ్ఛమైన వంటకాల పద్ధతిలో మిఠాయిలు, పిండివంటలు మరియు ఆవకాయలను తయారుచేసి అందిస్తున్నాము.'
                  : 'Welcome to Satya Foods (Maharaja Home Foods), where every bite tells a story of tradition, love, and the finest ingredients. We are a family-owned business dedicated to bringing you the authentic flavors of traditional Andhra cuisine.'}
              </p>
              <p>
                {isTe
                  ? 'స్వచ్ఛమైన గేదె నెయ్యి, కట్టెగానుగ నూనెలు, స్వచ్ఛమైన బెల్లం మరియు చేతితో దంచిన మసాలా కారపొడులతో తయారుచేసిన ప్రతి పదార్థం మీ ఇంట్లో చేసినట్టే ఆరోగ్యకరంగా ఉంటుంది.'
                  : 'Our journey began in the heart of Samalkot, East Godavari, Andhra Pradesh, with a simple mission: to share the taste of home-cooked goodness with everyone. What started as making sweets for family gatherings has grown into a beloved brand serving customers across the region.'}
              </p>
            </div>
          </div>

          {/* Right Visual Emblem */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-amber-800 p-2 bg-[#3e1b12] shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-full h-full rounded-full border-2 border-amber-400/50 bg-[#52171a] flex flex-col items-center justify-center p-6 text-amber-100 space-y-2">
                <div className="w-16 h-16 rounded-full bg-amber-900 border-2 border-amber-300 flex items-center justify-center text-amber-200 font-serif font-black text-xl shadow-inner">
                  SF
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-amber-200">
                  {STORE_INFO.nameEn}
                </h3>
                <p className="text-xs text-amber-300 font-serif">
                  {STORE_INFO.nameTe}
                </p>
                <div className="pt-2 border-t border-amber-400/30 w-full text-[11px] font-bold text-amber-200 uppercase tracking-widest">
                  10+ {isTe ? 'సంవత్సరాల నమ్మకం' : 'Years of Excellence'}
                </div>
              </div>
            </div>

            {/* Bottom Floating Badge */}
            <div className="absolute -bottom-4 right-4 bg-[#6b1e22] text-amber-100 text-xs font-black px-5 py-2.5 rounded-2xl shadow-lg border border-amber-400/40">
              10+ {isTe ? 'సంవత్సరాల సేవ' : 'Years of Excellence'}
            </div>
          </div>

        </div>
      </section>

      {/* Values Section: What Makes Us Special */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="inline-block bg-amber-200/60 text-[#6b1e22] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            {isTe ? 'మా విలువలు' : 'Our Values'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3e1b12] font-serif">
            {isTe ? 'మమ్మల్ని ప్రత్యేకం చేసేవి' : 'What Makes Us Special'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Made with Love */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-red-500 text-red-600" />
            </div>
            <h3 className="text-lg font-extrabold text-[#3e1b12]">
              {isTe ? 'ప్రేమతో తయారు చేసినవి' : 'Made with Love'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-950/75 leading-relaxed">
              {isTe
                ? 'ఇంటి సభ్యుల ఆరోగ్యం పట్ల శ్రద్ధతో ప్రతీ పదార్థం సొంతంగా తయారు చేయబడుతుంది.'
                : 'Every product is crafted with care and passion, just like homemade food should be.'}
            </p>
          </div>

          {/* 2. Pure Ingredients */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-extrabold text-[#3e1b12]">
              {isTe ? 'స్వచ్ఛమైన దినుసులు' : 'Pure Ingredients'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-950/75 leading-relaxed">
              {isTe
                ? 'ఎటువంటి కెమికల్ ప్రిజర్వేటివ్స్ లేదా కృత్రిమ రంగులు వాడకుండా 100% నేచురల్ పదార్థాలు.'
                : 'We use only the finest natural ingredients with no artificial additives or preservatives.'}
            </p>
          </div>

          {/* 3. Quality Assured */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-extrabold text-[#3e1b12]">
              {isTe ? 'నాణ్యతా ప్రమాణాలు' : 'Quality Assured'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-950/75 leading-relaxed">
              {isTe
                ? 'అత్యంత పరిశుభ్రమైన వాతావరణంలో లీక్-ప్రూఫ్ ప్యాకింగ్‌తో భద్రపరచబడతాయి.'
                : 'Our products maintain the highest standards of quality and hygiene.'}
            </p>
          </div>

          {/* 4. Family Recipes */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-extrabold text-[#3e1b12]">
              {isTe ? 'తరాల నాటి రుచులు' : 'Family Recipes'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-950/75 leading-relaxed">
              {isTe
                ? 'గోదావరి సాంప్రదాయ వంటకాల కలయికతో తయారుచేసిన అసలైన వంటకాలు.'
                : 'Traditional recipes passed down through generations, preserved for your enjoyment.'}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
