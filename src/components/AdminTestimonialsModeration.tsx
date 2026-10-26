import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, ShieldCheck, MessageSquare, Plus, Award } from 'lucide-react';
import { Language } from '../types';
import { Testimonial, setTestimonialApproval, deleteTestimonial, submitTestimonial } from '../services/testimonialsService';

interface AdminTestimonialsModerationProps {
  lang: Language;
  testimonials: Testimonial[];
  onRefresh?: () => void;
}

export const AdminTestimonialsModeration: React.FC<AdminTestimonialsModerationProps> = ({
  lang,
  testimonials,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Manual Add Form Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newCategory, setNewCategory] = useState<'podcasts' | 'reels' | 'commercials' | 'studio'>('podcasts');
  const [newReviewAr, setNewReviewAr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = testimonials.filter((t) => {
    if (filter === 'pending') return !t.approved;
    if (filter === 'approved') return t.approved;
    return true;
  });

  const handleToggleApproval = async (id: string, currentApproved: boolean) => {
    setActionLoadingId(id);
    try {
      await setTestimonialApproval(id, !currentApproved);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error toggling approval:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    try {
      await deleteTestimonial(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newReviewAr.trim()) return;

    setIsSubmitting(true);
    try {
      await submitTestimonial(
        {
          clientName: newClientName.trim(),
          companyOrRole: newCompany.trim() || undefined,
          rating: newRating,
          reviewAr: newReviewAr.trim(),
          reviewEn: newReviewAr.trim(),
          serviceCategory: newCategory,
          verified: true,
          approved: true,
        },
        true
      );
      setShowAddForm(false);
      setNewClientName('');
      setNewCompany('');
      setNewReviewAr('');
      setNewRating(5);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error creating review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = testimonials.filter((t) => !t.approved).length;

  return (
    <div className="space-y-4">
      {/* Moderation Controls Header */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[#141211] dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C82626]" />
            <span>{lang === 'ar' ? 'إدارة واعتماد آراء وتقييمات العملاء' : 'Client Testimonials Moderation'}</span>
          </h4>
          <p className="text-xs text-[#141211]/60 dark:text-white/60">
            {lang === 'ar'
              ? 'مراجعة تقييمات العملاء، اعتمادها للنشر على الصفحة الرئيسية، أو إضافة شهادات معتمدة جديدة.'
              : 'Approve client reviews for public display or add verified endorsements.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'all' ? 'bg-[#C82626] text-white shadow-sm' : 'text-[#141211]/70 dark:text-white/70'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'} ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'pending' ? 'bg-[#C82626] text-white shadow-sm' : 'text-[#141211]/70 dark:text-white/70'
              }`}
            >
              <span>{lang === 'ar' ? 'بانتظار الموافقة' : 'Pending'}</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === 'approved' ? 'bg-[#C82626] text-white shadow-sm' : 'text-[#141211]/70 dark:text-white/70'
              }`}
            >
              {lang === 'ar' ? 'المنشورة' : 'Approved'}
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#C82626] hover:bg-[#a51e1e] rounded-xl cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة تقييم معتمد' : 'Add Endorsement'}</span>
          </button>
        </div>
      </div>

      {/* Testimonials List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-2 rounded-2xl bg-white dark:bg-[#1a1716] border border-dashed border-black/10 dark:border-white/10">
          <MessageSquare className="w-10 h-10 mx-auto text-[#141211]/20 dark:text-white/20" />
          <p className="text-sm font-bold text-[#141211] dark:text-white">
            {lang === 'ar' ? 'لا توجد تقييمات في هذا التصنيف' : 'No testimonials found in this filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#141211] dark:text-white">
                      {item.clientName}
                    </span>
                    {item.companyOrRole && (
                      <span className="text-xs text-[#141211]/50 dark:text-white/50">
                        • {item.companyOrRole}
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.approved
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                  >
                    {item.approved
                      ? (lang === 'ar' ? 'معتمد ومنشور ✓' : 'Approved')
                      : (lang === 'ar' ? 'قيد المراجعة' : 'Pending')}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-black/10 dark:text-white/10'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-mono text-[#141211]/40 dark:text-white/40 ms-2">
                    {item.serviceCategory}
                  </span>
                </div>

                <p className="text-xs text-[#141211]/80 dark:text-white/80 italic leading-relaxed pt-1">
                  "{item.reviewAr}"
                </p>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
                <span className="text-[10px] font-mono text-[#141211]/40 dark:text-white/40">
                  {item.createdAt.split('T')[0]}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApproval(item.id, item.approved)}
                    disabled={actionLoadingId === item.id}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs flex items-center gap-1 ${
                      item.approved
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {item.approved ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إلغاء النشر' : 'Unpublish'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'اعتماد ونشر' : 'Approve & Publish'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={actionLoadingId === item.id}
                    className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 cursor-pointer"
                    title={lang === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Manual Review Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1716] max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <h4 className="text-base font-bold text-[#141211] dark:text-white">
              {lang === 'ar' ? 'إضافة تقييم معتمد جديد' : 'Add Verified Client Review'}
            </h4>

            <form onSubmit={handleAdminCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">{lang === 'ar' ? 'اسم العميل' : 'Client Name'}</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141211]"
                />
              </div>

              <div>
                <label className="font-bold">{lang === 'ar' ? 'اسم الشركة أو البودكاست' : 'Company / Show'}</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141211]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold">{lang === 'ar' ? 'نوع الخدمة' : 'Service'}</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141211]"
                  >
                    <option value="podcasts">{lang === 'ar' ? 'بودكاست' : 'Podcasts'}</option>
                    <option value="reels">{lang === 'ar' ? 'ريلز' : 'Reels'}</option>
                    <option value="commercials">{lang === 'ar' ? 'إعلانات' : 'Commercials'}</option>
                    <option value="studio">{lang === 'ar' ? 'استوديو' : 'Studio'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold">{lang === 'ar' ? 'التقييم (نجوم)' : 'Rating'}</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141211]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold">{lang === 'ar' ? 'نص الرأي أو الشهادة' : 'Review Text'}</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewAr}
                  onChange={(e) => setNewReviewAr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141211]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#C82626] text-white font-bold cursor-pointer"
                >
                  {lang === 'ar' ? 'نشر مباشرة' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="py-2.5 px-4 rounded-xl bg-black/5 dark:bg-white/10 font-semibold cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
