import React, { useState } from 'react';
import { PODCAST_PACKAGES, REELS_PACKAGES, ADDONS_DATA, COMPANY_INFO } from '../data/content';
import { Language, PricingPackage } from '../types';
import { Check, Star, Calculator, Image as ImageIcon, MessageCircle, Calendar, Plus, Sparkles, ShieldCheck } from 'lucide-react';

interface PricingCalculatorProps {
  lang: Language;
  activeCategory: 'podcasts' | 'reels';
  onCategoryChange: (category: 'podcasts' | 'reels') => void;
  onOpenBooking: (pkgId: string, customAddons?: string[], calculatedTotal?: number) => void;
  onViewPoster: (type: 'podcasts' | 'reels') => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  lang,
  activeCategory,
  onCategoryChange,
  onOpenBooking,
  onViewPoster,
}) => {
  // Calculator state
  const [selectedPackageId, setSelectedPackageId] = useState<string>('podcast-doubleday');
  const [extraGuests, setExtraGuests] = useState<number>(0);
  const [extraHours, setExtraHours] = useState<number>(0);
  const [includeOutdoorShoot, setIncludeOutdoorShoot] = useState<boolean>(false);
  const [requestCustomSet, setRequestCustomSet] = useState<boolean>(false);

  // Switch package list
  const currentPackages = activeCategory === 'podcasts' ? PODCAST_PACKAGES : REELS_PACKAGES;

  // Selected package object for calculator
  const allPackages = [...PODCAST_PACKAGES, ...REELS_PACKAGES];
  const currentSelectedPkg = allPackages.find((p) => p.id === selectedPackageId) || PODCAST_PACKAGES[2];

  // Calculate live total price
  const calculateTotal = (): number => {
    let total = currentSelectedPkg.price;
    if (currentSelectedPkg.category === 'podcasts') {
      total += extraGuests * 3500;
    } else {
      if (includeOutdoorShoot) total += 4000;
      total += extraHours * 1000;
    }
    return total;
  };

  const currentTotal = calculateTotal();

  const generateWhatsAppUrl = (pkg: PricingPackage, isCustom = false) => {
    let text = '';
    if (isCustom) {
      text =
        lang === 'ar'
          ? `مرحباً KIN Media Production، أود حجز الباقة التالية:\n- الباقة: ${currentSelectedPkg.name} (${currentSelectedPkg.category === 'podcasts' ? 'بودكاست ولقاءات' : 'ريلز شهرية'})\n` +
            (extraGuests > 0 ? `- ضيوف إضافيين: ${extraGuests} (+${extraGuests * 3500} ج)\n` : '') +
            (includeOutdoorShoot ? `- تصوير خارجي: نعم (+4000 ج)\n` : '') +
            (extraHours > 0 ? `- ساعات إضافية: ${extraHours} (+${extraHours * 1000} ج)\n` : '') +
            (requestCustomSet ? `- طلب ديكور مخصص أو خلفية AI: نعم\n` : '') +
            `- الإجمالي التقديري: ${currentTotal.toLocaleString()} ج.م\nأرجو إفادتي بأقرب المواعيد المتاحة في استوديو الكوربة.`
          : `Hello KIN Media Production, I would like to book the following configuration:\n- Package: ${currentSelectedPkg.name} (${currentSelectedPkg.category})\n` +
            (extraGuests > 0 ? `- Extra Guests: ${extraGuests} (+${extraGuests * 3500} EGP)\n` : '') +
            (includeOutdoorShoot ? `- Outdoor Shoot: Yes (+4000 EGP)\n` : '') +
            (extraHours > 0 ? `- Extra Hours: ${extraHours} (+${extraHours * 1000} EGP)\n` : '') +
            (requestCustomSet ? `- Custom Set / AI Backdrop: Yes\n` : '') +
            `- Total Estimated: ${currentTotal.toLocaleString()} EGP\nPlease let me know available recording slots in Korba studio.`;
    } else {
      text =
        lang === 'ar'
          ? `مرحباً استوديو KIN، أود حجز باقة "${pkg.name}" (${pkg.category === 'podcasts' ? 'بودكاست ولقاءات' : 'ريلز شهرية'}) بسعر ${pkg.price.toLocaleString()} ج.م. أرجو تأكيد المواعيد المتاحة.`
          : `Hello KIN Studio, I want to book the "${pkg.name}" package (${pkg.category}) for ${pkg.price.toLocaleString()} EGP. Please confirm available slots.`;
    }
    return `https://wa.me/${COMPANY_INFO.whatsappNumbers[0]}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white dark:bg-[#141211] border-b border-black/8 dark:border-white/10 scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C82626] mb-3">
              {lang === 'ar' ? 'الشفافية الكاملة' : 'Transparent Pricing'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141211] dark:text-white tracking-tight leading-tight text-balance">
              {lang === 'ar' ? 'الباكدجات والأسعار الرسمية' : 'Official Studio Packages & Rates'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#141211]/70 dark:text-white/70 leading-relaxed">
              {lang === 'ar'
                ? 'جميع الأسعار بالجنيه المصري وهي أسعار التصوير داخل استوديو KIN بالكوربة. اختر نوع الخدمة أو استخدم الحاسبة لتخصيص جلستك.'
                : 'All rates are in Egyptian Pounds (EGP) for in-studio production at KIN Studio in Korba. Choose a service or customize your session.'}
            </p>
          </div>

          {/* View Official Graphic Poster Button */}
          <button
            onClick={() => onViewPoster(activeCategory)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#141211] dark:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 rounded-lg border border-black/10 dark:border-white/20 transition-colors whitespace-nowrap shrink-0 self-start md:self-end cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-[#C82626]" />
            <span>
              {lang === 'ar' ? 'عرض البوستر الأصلي المعتمد' : 'View Official Price Poster'}
            </span>
          </button>
        </div>

        {/* Interactive Category Segmented Control */}
        <div className="flex items-center justify-center mb-14">
          <div className="inline-flex p-1.5 bg-[#FAFAFA] dark:bg-[#1C1A18] border border-black/10 dark:border-white/15 rounded-xl max-w-md w-full sm:w-auto shadow-inner">
            <button
              onClick={() => {
                onCategoryChange('podcasts');
                setSelectedPackageId('podcast-doubleday');
              }}
              className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === 'podcasts'
                  ? 'bg-[#141211] dark:bg-[#C82626] text-white shadow'
                  : 'text-[#141211]/70 dark:text-white/70 hover:text-[#141211] dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'بودكاست ولقاءات' : 'Podcasts & Interviews'}
            </button>
            <button
              onClick={() => {
                onCategoryChange('reels');
                setSelectedPackageId('reels-pro');
              }}
              className={`flex-1 sm:flex-initial px-6 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === 'reels'
                  ? 'bg-[#141211] dark:bg-[#C82626] text-white shadow'
                  : 'text-[#141211]/70 dark:text-white/70 hover:text-[#141211] dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'ريلز شهرية' : 'Monthly Reels'}
            </button>
          </div>
        </div>

        {/* Dynamic Category Tagline Banner */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C82626] font-semibold block mb-1">
            {activeCategory === 'podcasts' ? 'YOUR SHOW, ON SCREEN' : 'CONTENT THAT SPEAKS FOR YOUR BRAND'}
          </span>
          <p className="text-sm text-[#141211]/70 dark:text-white/70 max-w-xl mx-auto">
            {activeCategory === 'podcasts'
              ? (lang === 'ar'
                  ? 'حلقات متصورة بأكتر من كاميرا في ستوديو KIN — الحلقة كاملة متمنتجة + كليبات قصيرة جاهزة للسوشيال.'
                  : 'Multi-camera episodes recorded at KIN — the full episode edited, plus short clips ready for social.')
              : (lang === 'ar'
                  ? 'شريك محتوى شهري لصناع المحتوى والبراندات الشخصية — تخطيط وتصوير ومونتاج في مكان واحد.'
                  : 'A monthly content partner for creators and personal brands — planned, shot and edited in one place.')}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className={`grid grid-cols-1 gap-8 mb-16 ${
          activeCategory === 'podcasts'
            ? 'md:grid-cols-2 lg:grid-cols-4'
            : 'md:grid-cols-3'
        }`}>
          {currentPackages.map((pkg) => {
            const isRec = pkg.recommended;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                  isRec
                    ? 'bg-[#141211] dark:bg-[#1E1B19] text-white shadow-xl scale-[1.02] border-2 border-[#C82626] p-7'
                    : 'bg-[#FAFAFA] dark:bg-[#1C1A18] text-[#141211] dark:text-white border border-black/8 dark:border-white/10 hover:border-black/20 dark:hover:border-white/25 hover:shadow-md p-6'
                }`}
              >
                {/* Recommended Tag */}
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C82626] text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{lang === 'ar' ? 'الباقة المقترحة' : 'RECOMMENDED'}</span>
                  </div>
                )}

                <div>
                  {/* Package Name & Unit */}
                  <div className="mb-6">
                    <h3 className={`text-xl font-black tracking-tight ${isRec ? 'text-white' : 'text-[#141211] dark:text-white'}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-xs mt-1 ${isRec ? 'text-white/70' : 'text-[#141211]/60 dark:text-white/60'}`}>
                      {lang === 'ar' ? pkg.deliverablesAr : pkg.deliverablesEn}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 pb-6 border-b border-black/8 dark:border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight ${isRec ? 'text-white' : 'text-[#141211] dark:text-white'}`}>
                        {pkg.price.toLocaleString()}
                      </span>
                      <span className={`text-xs font-semibold ${isRec ? 'text-[#C82626]' : 'text-[#C82626]'}`}>
                        {lang === 'ar' ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                    <span className={`text-xs font-medium block mt-1 ${isRec ? 'text-white/60' : 'text-[#141211]/50 dark:text-white/50'}`}>
                      {lang === 'ar' ? pkg.unitAr : pkg.unitEn}
                    </span>
                    <span className={`text-[11px] inline-block mt-1 font-mono uppercase ${isRec ? 'text-[#C82626]' : 'text-black/40 dark:text-white/40'}`}>
                      {lang === 'ar' ? 'سعر التصوير بالاستوديو' : 'In-studio production rate'}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                    {(lang === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isRec ? 'text-[#C82626]' : 'text-[#C82626]'}`} />
                        <span className={isRec ? 'text-white/85' : 'text-[#141211]/80 dark:text-white/80'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA Actions */}
                <div className="space-y-2 pt-4 border-t border-black/8 dark:border-white/10">
                  <a
                    href={generateWhatsAppUrl(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isRec
                        ? 'bg-[#C82626] text-white hover:bg-[#a31d1d] shadow'
                        : 'bg-[#141211] dark:bg-white/10 text-white hover:bg-[#C82626] dark:hover:bg-[#C82626]'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'احجز عبر واتساب' : 'Book on WhatsApp'}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      onOpenBooking(pkg.id);
                    }}
                    className={`w-full text-center py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isRec
                        ? 'text-white/70 hover:text-white'
                        : 'text-[#141211]/60 dark:text-white/60 hover:text-[#141211] dark:hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? 'تخصيص في فورم الحجز' : 'Customize Booking'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Add-ons & Overtime Strip */}
        <div className="bg-[#FAFAFA] dark:bg-[#1C1A18] rounded-2xl p-6 sm:p-8 border border-black/8 dark:border-white/10 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/8 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C82626]" />
              <h4 className="text-base font-bold text-[#141211] dark:text-white">
                {lang === 'ar' ? 'إضافات وخيارات الترقية المتاحة' : 'Available Add-ons & Upgrades'}
              </h4>
            </div>
            <span className="text-xs text-[#141211]/60 dark:text-white/60">
              {lang === 'ar' ? 'يمكن إضافتها مع أي باكدج' : 'Available on any package'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-white dark:bg-[#201D1B] rounded-xl border border-black/6 dark:border-white/10">
              <div className="font-bold text-[#141211] dark:text-white">{lang === 'ar' ? 'ضيف زيادة' : 'Extra Guest'}</div>
              <div className="text-[#C82626] font-mono font-bold mt-1">+3,500 {lang === 'ar' ? 'ج.م' : 'EGP'}</div>
              <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-1">{lang === 'ar' ? 'مايك إضافي وهندسة صوت مخصصة' : 'Dedicated mic & sound routing'}</p>
            </div>

            <div className="p-4 bg-white dark:bg-[#201D1B] rounded-xl border border-black/6 dark:border-white/10">
              <div className="font-bold text-[#141211] dark:text-white">{lang === 'ar' ? 'تصوير خارجي' : 'Outdoor Shoot'}</div>
              <div className="text-[#C82626] font-mono font-bold mt-1">+4,000 {lang === 'ar' ? 'ج.م' : 'EGP'}</div>
              <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-1">{lang === 'ar' ? 'انتقال الكرو والمعدات لموقعك' : 'Full crew & gear mobilization'}</p>
            </div>

            <div className="p-4 bg-white dark:bg-[#201D1B] rounded-xl border border-black/6 dark:border-white/10">
              <div className="font-bold text-[#141211] dark:text-white">{lang === 'ar' ? 'ساعة تصوير زيادة' : 'Extra Studio Hour'}</div>
              <div className="text-[#C82626] font-mono font-bold mt-1">+1,000 {lang === 'ar' ? 'ج.م' : 'EGP'}</div>
              <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-1">{lang === 'ar' ? 'ساعة إضافية بالاستوديو والكرو' : 'Additional hour in studio'}</p>
            </div>

            <div className="p-4 bg-white dark:bg-[#201D1B] rounded-xl border border-black/6 dark:border-white/10">
              <div className="font-bold text-[#141211] dark:text-white">{lang === 'ar' ? 'ديكور مخصوص أو خلفية AI' : 'Custom Set / AI Backdrop'}</div>
              <div className="text-[#C82626] font-mono font-bold mt-1">{lang === 'ar' ? 'بالاتفاق' : 'Quoted per show'}</div>
              <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-1">{lang === 'ar' ? 'خلفية افتراضية ثلاثية الأبعاد أو سيت خاص' : '3D virtual set or custom props'}</p>
            </div>
          </div>
        </div>

        {/* Interactive Custom Quote Calculator Drawer/Box */}
        <div className="bg-[#141211] text-white rounded-2xl p-6 sm:p-10 border border-black/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C82626] uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حاسبة الباكدج الفورية' : 'Instant Package Customizer'}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                {lang === 'ar' ? 'خصص جلستك واحسب التكلفة الإجمالية مباشرة' : 'Customize Your Production & Calculate Real-Time Quote'}
              </h3>
            </div>

            {/* Live Price Display */}
            <div className="bg-white/5 border border-white/15 px-6 py-3 rounded-xl flex items-baseline gap-2 shrink-0">
              <span className="text-xs uppercase text-white/60">{lang === 'ar' ? 'التكلفة التقديرية:' : 'Estimated Total:'}</span>
              <span className="text-3xl font-black font-mono tabular-nums text-white">
                {currentTotal.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-[#C82626]">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-8 space-y-6">
              {/* Select Package */}
              <div>
                <label className="block text-xs font-semibold uppercase text-white/70 mb-2">
                  {lang === 'ar' ? 'اختر الباقة الأساسية:' : 'Select Base Package:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentPackages.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPackageId(p.id)}
                      className={`p-3 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer border ${
                        selectedPackageId === p.id
                          ? 'bg-[#C82626] border-[#C82626] text-white shadow'
                          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold">{p.name}</div>
                      <div className="text-[11px] font-mono mt-0.5 opacity-90">{p.price.toLocaleString()} {lang === 'ar' ? 'ج' : 'EGP'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Add-ons according to Category */}
              {currentSelectedPkg.category === 'podcasts' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Extra Guests */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{lang === 'ar' ? 'ضيوف إضافيين (+3,500 ج/ضيف)' : 'Extra Guests (+3.5K EGP/guest)'}</div>
                      <div className="text-xs text-white/60">{lang === 'ar' ? 'مايك + زاوية كاميرا مخصصة' : 'Dedicated mic & camera angle'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExtraGuests(Math.max(0, extraGuests - 1))}
                        className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono text-base font-bold w-4 text-center">{extraGuests}</span>
                      <button
                        onClick={() => setExtraGuests(extraGuests + 1)}
                        className="w-8 h-8 rounded bg-[#C82626] hover:bg-[#a31d1d] text-white flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Custom Set */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{lang === 'ar' ? 'ديكور مخصوص أو خلفية AI' : 'Custom Set / AI Backdrop'}</div>
                      <div className="text-xs text-white/60">{lang === 'ar' ? 'يتم الاتفاق وتأكيد المتطلبات' : 'Quoted separately with production'}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={requestCustomSet}
                      onChange={(e) => setRequestCustomSet(e.target.checked)}
                      className="w-5 h-5 accent-[#C82626] rounded cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Outdoor Shoot */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{lang === 'ar' ? 'تصوير خارجي (+4,000 ج)' : 'Outdoor Shoot (+4K EGP)'}</div>
                      <div className="text-xs text-white/60">{lang === 'ar' ? 'تصوير في مقر شركتك أو موقعك' : 'Filming at your company or exterior'}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeOutdoorShoot}
                      onChange={(e) => setIncludeOutdoorShoot(e.target.checked)}
                      className="w-5 h-5 accent-[#C82626] rounded cursor-pointer"
                    />
                  </div>

                  {/* Extra Hours */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{lang === 'ar' ? 'ساعات تصوير إضافية (+1,000 ج/ساعة)' : 'Extra Hours (+1K EGP/hr)'}</div>
                      <div className="text-xs text-white/60">{lang === 'ar' ? 'وقت إضافي للاستوديو والكرو' : 'Additional hours booked'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExtraHours(Math.max(0, extraHours - 1))}
                        className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono text-base font-bold w-4 text-center">{extraHours}</span>
                      <button
                        onClick={() => setExtraHours(extraHours + 1)}
                        className="w-8 h-8 rounded bg-[#C82626] hover:bg-[#a31d1d] text-white flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary & Immediate Action */}
            <div className="lg:col-span-4 bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col justify-between h-full">
              <div>
                <p className="text-xs font-mono uppercase text-[#C82626] font-semibold mb-2">
                  {lang === 'ar' ? 'ملخص الحجز المخصص' : 'Custom Config Summary'}
                </p>
                <div className="text-base font-bold">{currentSelectedPkg.name} — {currentSelectedPkg.category === 'podcasts' ? (lang === 'ar' ? 'بودكاست' : 'Podcast') : (lang === 'ar' ? 'ريلز' : 'Reels')}</div>
                <div className="text-xs text-white/70 mt-1">{lang === 'ar' ? currentSelectedPkg.deliverablesAr : currentSelectedPkg.deliverablesEn}</div>
                
                <div className="my-4 pt-3 border-t border-white/10 text-xs space-y-1.5 text-white/75 font-mono">
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'السعر الأساسي:' : 'Base:'}</span>
                    <span>{currentSelectedPkg.price.toLocaleString()} {lang === 'ar' ? 'ج' : 'EGP'}</span>
                  </div>
                  {extraGuests > 0 && (
                    <div className="flex justify-between text-[#C82626]">
                      <span>{lang === 'ar' ? `ضيوف إضافيين (${extraGuests}):` : `Extra Guests (${extraGuests}):`}</span>
                      <span>+{(extraGuests * 3500).toLocaleString()} {lang === 'ar' ? 'ج' : 'EGP'}</span>
                    </div>
                  )}
                  {includeOutdoorShoot && (
                    <div className="flex justify-between text-[#C82626]">
                      <span>{lang === 'ar' ? 'تصوير خارجي:' : 'Outdoor Shoot:'}</span>
                      <span>+4,000 {lang === 'ar' ? 'ج' : 'EGP'}</span>
                    </div>
                  )}
                  {extraHours > 0 && (
                    <div className="flex justify-between text-[#C82626]">
                      <span>{lang === 'ar' ? `ساعات زيادة (${extraHours}):` : `Extra Hours (${extraHours}):`}</span>
                      <span>+{(extraHours * 1000).toLocaleString()} {lang === 'ar' ? 'ج' : 'EGP'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={generateWhatsAppUrl(currentSelectedPkg, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold text-white bg-[#C82626] hover:bg-[#a31d1d] rounded shadow cursor-pointer transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إرسال الحجز لواتساب الاستوديو' : 'Send Quote to WhatsApp'}</span>
                </a>

                <button
                  onClick={() =>
                    onOpenBooking(
                      currentSelectedPkg.id,
                      [
                        extraGuests > 0 ? `Extra Guests: ${extraGuests}` : '',
                        includeOutdoorShoot ? 'Outdoor Shoot' : '',
                        extraHours > 0 ? `Extra Hours: ${extraHours}` : '',
                        requestCustomSet ? 'Custom Set / AI Backdrop' : '',
                      ].filter(Boolean),
                      currentTotal
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تحديد ميعاد في الفورم' : 'Schedule via Booking Form'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
