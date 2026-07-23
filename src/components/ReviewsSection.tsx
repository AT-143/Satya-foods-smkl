import React, { useState } from 'react';
import { Review } from '../types';
import { Star, MessageSquare, ShieldCheck, Plus, CheckCircle, ThumbsUp } from 'lucide-react';
import { SAMPLE_REVIEWS } from '../data/products';

interface ReviewsSectionProps {
  lang: 'te' | 'en';
  reviews?: Review[];
  onAddReview?: (review: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  lang,
  reviews: externalReviews,
  onAddReview: externalAddReview,
}) => {
  const isTe = lang === 'te';
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const reviewsList = externalReviews !== undefined ? externalReviews : localReviews;

  const [showAddModal, setShowAddModal] = useState(false);

  // New review form
  const [newAuthor, setNewAuthor] = useState('');
  const [newLoc, setNewLoc] = useState('Samalkot');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const newRev: Review = {
      id: `r-${Date.now()}`,
      productId: 'general',
      customerName: newAuthor,
      location: newLoc,
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newComment,
      verifiedPurchase: true,
    };

    if (externalAddReview) {
      externalAddReview(newRev);
    } else {
      setLocalReviews([newRev, ...localReviews]);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddModal(false);
      setNewAuthor('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section id="reviews-section" className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-red-900 via-amber-900 to-emerald-950 p-6 rounded-3xl text-amber-50 shadow-xl border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isTe ? '100% వినియోగదారుల నమ్మకం' : '100% Verified Customer Trust'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif">
            {isTe ? 'వినియోగదారుల అభిప్రాయాలు' : 'What Our Customers Say'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-xl mt-1">
            {isTe
              ? 'సామర్లకోట ఆర్గానిక్స్ స్వచ్ఛత, రుచి మరియు ప్యాకింగ్ గురించి మా కస్టమర్లు ఏమంటున్నారో చూడండి.'
              : 'Read genuine feedback from thousands of happy customers enjoying Samalkot Organics worldwide.'}
          </p>
        </div>

        <div className="text-center bg-black/30 p-4 rounded-2xl border border-amber-400/30 shrink-0">
          <div className="text-3xl font-black text-amber-300">4.9 / 5.0</div>
          <div className="flex justify-center my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="text-[11px] text-amber-200 font-bold">500+ Verified Orders</div>
        </div>
      </div>

      {/* Add Review Trigger Button */}
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-base font-extrabold text-red-950 font-serif">
          {isTe ? 'ఇటీవలి రివ్యూలు (Recent Reviews)' : 'Recent Customer Reviews'}
        </h3>
        <button
          id="write-review-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-amber-50 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{isTe ? 'మీ రివ్యూ రాయండి' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Review Cards Grid */}
      {reviewsList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-amber-200/80 shadow-xs space-y-3 px-4">
          <MessageSquare className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="text-sm font-bold text-red-950">
            {isTe ? 'ఇంకా రివ్యూలు లేవు' : 'No Customer Reviews Yet'}
          </h4>
          <p className="text-xs text-amber-800 max-w-sm mx-auto">
            {isTe
              ? 'మా ఉత్పత్తులు ఉపయోగించిన మొదటి కస్టమర్‌గా మీ అభిప్రాయాన్ని ఇక్కడ పంచుకోండి!'
              : 'Be the first customer to share your experience with Satya Foods!'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-800 to-amber-900 text-amber-100 text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isTe ? 'మొదటి రివ్యూ రాయండి' : 'Write First Review'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-sm hover:shadow-md transition-shadow space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-red-950 font-serif">
                    {rev.customerName}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    📍 {rev.location}
                  </span>
                </div>
                <span className="text-[10px] text-amber-800 font-medium">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                {rev.verifiedPurchase && (
                  <span className="ml-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Verified Buyer
                  </span>
                )}
              </div>

              <p className="text-xs text-amber-950 leading-relaxed font-sans">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-amber-50 w-full max-w-md rounded-3xl p-6 border border-amber-300 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-black text-red-950 font-serif">
                {isTe ? 'సత్య ఫుడ్స్‌కి రివ్యూ ఇవ్వండి' : 'Review Satya Foods'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-amber-800 font-bold"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-extrabold text-emerald-900">
                  {isTe ? 'రివ్యూ విజయవంతంగా జోడించబడింది!' : 'Thank you for your feedback!'}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    {isTe ? 'మీ పేరు (Name) *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Srinivas Rao"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    {isTe ? 'మీ ప్రదేశం (Location)' : 'Your City / Country'}
                  </label>
                  <input
                    type="text"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="e.g. Hyderabad / USA"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    {isTe ? 'రేటింగ్ ఎంచుకోండి:' : 'Rating:'}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewRating(num)}
                        className={`p-2 rounded-lg border text-xs font-bold ${
                          newRating >= num
                            ? 'bg-amber-400 border-amber-500 text-red-950'
                            : 'bg-white border-amber-200'
                        }`}
                      >
                        ★ {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    {isTe ? 'మీ అనుభవం / కామెంట్ *' : 'Your Feedback *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isTe ? 'రుచి, ప్యాకింగ్, స్వచ్ఛత గురించి రాయండి...' : 'Write about taste, aroma, packing...'}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-800 to-amber-900 text-amber-50 rounded-xl font-bold text-xs shadow-md"
                >
                  {isTe ? 'రివ్యూ సబ్మిట్ చేయండి' : 'Submit Review'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
