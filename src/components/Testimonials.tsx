import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, CheckCircle2, Plus, Sparkles, Filter, X, Send, Award, Film, Radio, Video } from 'lucide-react';
import { Language } from '../types';
import { Testimonial, subscribeApprovedTestimonials, submitTestimonial, INITIAL_TESTIMONIALS } from '../services/testimonialsService';
import { useAuth } from '../context/AuthContext';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const { user, isAdmin } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'podcasts' | 'reels' | 'commercials'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New review form
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceCategory, setServiceCategory] = useState<'podcasts' | 'reels' | 'commercials' | 'studio'>('podcasts');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeApprovedTestimonials((items) => {
      if (items && items.length > 0) {
        setTestimonials(items);
      }
    });
    return () => unsub();
  }, []);

  const filteredTestimonials = testimonials.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.serviceCategory === selectedCategory;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) {
      setSubmitError(lang === 'ar' ? 'يرجى كتابة الاسم ورأيك في الاستوديو.' : 'Please enter your name and review.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitTestimonial(
        {
          clientName: name.trim(),
          companyOrRole: company.trim() || undefined,
          rating,
          reviewAr: reviewText.trim(),
          reviewEn: reviewText.trim(),
          serviceCategory,
          verified: true,
          approved: isAdmin ? true : false,
        },
        isAdmin
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess(false);
        setName('');
        setCompany('');
        setReviewText('');
        setRating(5);
      }, 2500);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setSubmitError(lang === 'ar' ? 'تعذر إرسال التقييم، يرجى المحاولة مرة أخرى.' : 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceBadge = (cat: Testimonial['serviceCategory']) => {
    switch (cat) {
      case 'podcasts':
        return {
          label: lang === 'ar' ? 'بودكاست ولقاءات' : 'Podcast Session',
          icon: Radio,
          color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
        };
      case 'reels':
        return {
          label: lang === 'ar' ? 'باقات ريلز شهرية' : 'Reels Campaign',
          icon: Film,
          color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
        };
      case 'commercials':
        return {
          label: lang === 'ar' ? 'إعلانات تجارية' : 'Commercial Shoot',
          icon: Video,
          color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        };
      default:
        return {
          label: lang === 'ar' ? 'إنتاج سينمائي' : 'Studio Production',
          icon: Sparkles,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
        };
    }
  };

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#FAFAFA] dark:bg-[#141211] border-b border-black/8 dark:border-white/10 transition-colors duration-300 relative overflow-hidden">
      {/* Cinematic subtle background glow */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C82626]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C82626]/10 text-[#C82626] text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'آراء العملاء وشركاء النجاح' : 'Client Endorsements & Trust'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#141211] dark:text-white tracking-tight leading-tight">
              {lang === 'ar' ? (
                <>
                  ماذا يقول <span className="text-[#C82626]">صناع المحتوى</span> والبراندات عن KIN؟
                </>
              ) : (
                <>
                  Trusted by Top Creators & <span className="text-[#C82626]">Leading Brands</span>
                </>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#141211]/70 dark:text-white/70 leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'أكثر من 150+ حلقة بودكاست وحملة ريلز تم تصويرها في استوديو الكوربة بأعلى درجات الإتقان والعزل الصوتي.'
                : 'Over 150+ podcast episodes and viral social campaigns produced inside our Korba studio with cinema-grade execution.'}
            </p>
          </div>

          {/* Action to add review */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C82626] hover:bg-[#a51e1e] text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'أضف تقييمك للتجربة' : 'Share Your Review'}</span>
            </button>
          </div>
        </div>

        {/* Social Proof Strip / Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1A18] border border-black/8 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-[#141211] dark:text-white font-mono">4.95</span>
                <span className="text-xs text-[#141211]/50 dark:text-white/50">/ 5.0</span>
              </div>
              <p className="text-[11px] text-[#141211]/60 dark:text-white/60">
                {lang === 'ar' ? 'متوسط تقييم العملاء' : 'Average Client Rating'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1A18] border border-black/8 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C82626]/10 text-[#C82626] flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-[#141211] dark:text-white font-mono">150+</p>
              <p className="text-[11px] text-[#141211]/60 dark:text-white/60">
                {lang === 'ar' ? 'جلسة تم تسليمها 4K' : 'Delivered 4K Sessions'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1A18] border border-black/8 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-[#141211] dark:text-white font-mono">98%</p>
              <p className="text-[11px] text-[#141211]/60 dark:text-white/60">
                {lang === 'ar' ? 'نسبة تجديد الاشتراكات' : 'Client Retention Rate'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1A18] border border-black/8 dark:border-white/10 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-[#141211] dark:text-white font-mono">100%</p>
              <p className="text-[11px] text-[#141211]/60 dark:text-white/60">
                {lang === 'ar' ? 'عزل صوتي هادئ بالكوربة' : 'Acoustic Studio Isolation'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#C82626] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1A18] text-[#141211]/70 dark:text-white/70 border border-black/8 dark:border-white/10 hover:border-[#C82626]'
            }`}
          >
            {lang === 'ar' ? 'جميع التقييمات' : 'All Reviews'}
          </button>

          <button
            onClick={() => setSelectedCategory('podcasts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'podcasts'
                ? 'bg-[#C82626] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1A18] text-[#141211]/70 dark:text-white/70 border border-black/8 dark:border-white/10 hover:border-[#C82626]'
            }`}
          >
            {lang === 'ar' ? 'بودكاست وبرامج' : 'Podcasts'}
          </button>

          <button
            onClick={() => setSelectedCategory('reels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'reels'
                ? 'bg-[#C82626] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1A18] text-[#141211]/70 dark:text-white/70 border border-black/8 dark:border-white/10 hover:border-[#C82626]'
            }`}
          >
            {lang === 'ar' ? 'ريلز وسوشيال ميديا' : 'Reels'}
          </button>

          <button
            onClick={() => setSelectedCategory('commercials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'commercials'
                ? 'bg-[#C82626] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1A18] text-[#141211]/70 dark:text-white/70 border border-black/8 dark:border-white/10 hover:border-[#C82626]'
            }`}
          >
            {lang === 'ar' ? 'إعلانات وحملات تجارية' : 'Commercials'}
          </button>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((t) => {
            const badge = getServiceBadge(t.serviceCategory);
            const Icon = badge.icon;
            const reviewContent = lang === 'ar' ? t.reviewAr : (t.reviewEn || t.reviewAr);

            return (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#1C1A18] border border-black/8 dark:border-white/10 hover:border-[#C82626]/40 dark:hover:border-[#C82626]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Top: Stars + Service Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < t.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-black/10 dark:text-white/10'
                          }`}
                        />
                      ))}
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="relative pt-1">
                    <MessageSquareQuote className="w-6 h-6 text-[#C82626]/20 absolute -top-1 start-0 -translate-x-1" />
                    <p className="text-xs sm:text-sm text-[#141211]/80 dark:text-white/80 leading-relaxed italic ps-4">
                      "{reviewContent}"
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Client Bio & Verification */}
                <div className="pt-5 mt-5 border-t border-black/6 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl}
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C82626]/20 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C82626] to-[#801212] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {t.clientName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[#141211] dark:text-white truncate">
                          {t.clientName}
                        </h4>
                        {t.verified && (
                          <span title={lang === 'ar' ? 'عميل موثق تم تصوير مشروعه بالاستوديو' : 'Verified Studio Client'}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C82626] shrink-0" />
                          </span>
                        )}
                      </div>
                      {t.companyOrRole && (
                        <p className="text-[11px] text-[#141211]/50 dark:text-white/50 truncate">
                          {t.companyOrRole}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-[#141211]/40 dark:text-white/40 font-mono shrink-0">
                    {t.createdAt.split('T')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* SUBMISSION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-white dark:bg-[#1C1A18] text-[#141211] dark:text-white rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#C82626]/10 text-[#C82626]">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#141211] dark:text-white">
                    {lang === 'ar' ? 'شاركنا تجربتك في استوديو KIN' : 'Share Your KIN Studio Experience'}
                  </h3>
                  <p className="text-xs text-[#141211]/60 dark:text-white/60">
                    {lang === 'ar' ? 'رأيك يهمنا ويساعد صناع المحتوى في اختيار الاستوديو الأنسب.' : 'Your feedback shapes our craft and guides creators.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-md text-black/60 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#141211] dark:text-white">
                  {lang === 'ar' ? 'شكراً جزيلاً لرأيك الملهم!' : 'Thank you for your valuable review!'}
                </h4>
                <p className="text-xs text-[#141211]/70 dark:text-white/70 max-w-sm mx-auto">
                  {isAdmin
                    ? (lang === 'ar' ? 'تم اعتماد التقييم ونشره في الموقع مباشرة بصفتك أدمن الاستوديو.' : 'Review published directly with admin verification.')
                    : (lang === 'ar' ? 'تم استلام تقييمك وسيتم اعتماده ونشره في قسم آراء العملاء قريباً.' : 'Your review has been received and will be displayed shortly.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#141211] dark:text-white">
                      {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: م. أحمد يوسف' : 'e.g. John Doe'}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#141211] text-[#141211] dark:text-white focus:outline-none focus:border-[#C82626]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#141211] dark:text-white">
                      {lang === 'ar' ? 'اسم البرنامج أو الشركة' : 'Company or Show Name'}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: بودكاست كذا / شركة XYZ' : 'e.g. Acme Media'}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#141211] text-[#141211] dark:text-white focus:outline-none focus:border-[#C82626]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="space-y-1">
                    <label className="font-bold text-[#141211] dark:text-white">
                      {lang === 'ar' ? 'نوع الخدمة' : 'Service Type'}
                    </label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#141211] text-[#141211] dark:text-white focus:outline-none"
                    >
                      <option value="podcasts">{lang === 'ar' ? 'بودكاست ولقاءات' : 'Podcasts'}</option>
                      <option value="reels">{lang === 'ar' ? 'باقات ريلز شهرية' : 'Reels'}</option>
                      <option value="commercials">{lang === 'ar' ? 'إعلانات وحملات' : 'Commercials'}</option>
                      <option value="studio">{lang === 'ar' ? 'إيجار استوديو بالساعة' : 'Studio Rental'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#141211] dark:text-white">
                      {lang === 'ar' ? 'التقييم' : 'Rating'}
                    </label>
                    <div className="flex items-center gap-1.5 pt-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              starVal <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-black/20 dark:text-white/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#141211] dark:text-white">
                    {lang === 'ar' ? 'رأيك وتفاصيل تجربتك مع الاستوديو *' : 'Your Review & Experience *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={
                      lang === 'ar'
                        ? 'تحدث عن جودة التصوير، الإضاءة، التعامل، التزام المواعيد، أو المونتاج...'
                        : 'Describe your production experience, acoustic quality, crew professionalism...'
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#141211] text-[#141211] dark:text-white focus:outline-none focus:border-[#C82626] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#C82626] hover:bg-[#a51e1e] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                      : (lang === 'ar' ? 'إرسال التقييم الآن' : 'Publish Review')}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
