import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { Language } from '../types';
import { DeliverableItem } from '../services/deliverablesService';
import { BookingRecord, computeDashboardMetrics } from '../services/bookingsService';
import { TrendingUp, DollarSign, Award, Film, Radio, Video, CheckCircle2, Calendar, ArrowUpRight, Plus, Eye, Download, Users } from 'lucide-react';

interface AdminVisualDashboardProps {
  lang: Language;
  deliverables: DeliverableItem[];
  bookings: BookingRecord[];
  onNavigateToAdd: () => void;
  onNavigateToList: () => void;
}

export const AdminVisualDashboard: React.FC<AdminVisualDashboardProps> = ({
  lang,
  deliverables,
  bookings,
  onNavigateToAdd,
  onNavigateToList,
}) => {
  const [timeRange, setTimeRange] = useState<'6m' | 'quarter' | 'year'>('6m');
  const metrics = computeDashboardMetrics(bookings, deliverables);

  // Custom Recharts Tooltip for Dark/Light luxury theme
  const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-[#141211] text-white border border-white/15 shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-[#C82626] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? data.monthAr : data.monthEn}</span>
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">{lang === 'ar' ? 'إجمالي الإيرادات:' : 'Revenue:'}</span>
            <span className="font-mono font-bold text-emerald-400">
              {Number(payload[0].value).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
          {data.bookingsCount && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-white/70">{lang === 'ar' ? 'عدد الجلسات:' : 'Booked Sessions:'}</span>
              <span className="font-mono font-bold text-sky-400">
                {data.bookingsCount} {lang === 'ar' ? 'جلسة' : 'sessions'}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-[#141211] text-white border border-white/15 shadow-xl text-xs space-y-1.5">
          <p className="font-bold" style={{ color: data.color }}>
            {lang === 'ar' ? data.nameAr : data.nameEn}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">{lang === 'ar' ? 'نسبة الإقبال:' : 'Share:'}</span>
            <span className="font-mono font-bold">{data.value}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">{lang === 'ar' ? 'إجمالي الجلسات:' : 'Sessions:'}</span>
            <span className="font-mono font-bold">{data.sessions}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white/70">{lang === 'ar' ? 'العائد المالي:' : 'Revenue:'}</span>
            <span className="font-mono font-bold text-emerald-400">
              {Number(data.revenueEgp).toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Executive KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Pipeline Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#141211]/60 dark:text-white/60">
              {lang === 'ar' ? 'إجمالي الإيرادات التعاقدية' : 'Total Pipeline Revenue'}
            </span>
            <div className="p-2 rounded-xl bg-[#C82626]/10 text-[#C82626]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-[#141211] dark:text-white font-mono">
              {metrics.totalRevenue.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-[#C82626]">
              {lang === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+28% {lang === 'ar' ? 'نمو مقارنة بالربع السابق' : 'vs last quarter'}</span>
          </div>
        </div>

        {/* Metric 2: Average Project Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#141211]/60 dark:text-white/60">
              {lang === 'ar' ? 'متوسط قيمة المشروع' : 'Average Project Value'}
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-[#141211] dark:text-white font-mono">
              {metrics.avgProjectValue.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-sky-500">
              {lang === 'ar' ? 'ج.م' : 'EGP'}
            </span>
          </div>
          <p className="text-[11px] text-[#141211]/50 dark:text-white/50">
            {lang === 'ar' ? 'باقات تصوير ومونتاج متكاملة' : 'Full production package average'}
          </p>
        </div>

        {/* Metric 3: Delivery Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#141211]/60 dark:text-white/60">
              {lang === 'ar' ? 'معدل تسليم الماستر 4K' : '4K Master Delivery Rate'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {metrics.completionRate}%
            </p>
          </div>
          <p className="text-[11px] text-[#141211]/50 dark:text-white/50">
            {lang === 'ar' ? 'تسليم بدون تأخير وبأعلى جودة' : 'Zero delay production rate'}
          </p>
        </div>

        {/* Metric 4: Total Sessions Volume */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#141211]/60 dark:text-white/60">
              {lang === 'ar' ? 'إجمالي جلسات التصوير' : 'Studio Sessions Logged'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-black text-[#141211] dark:text-white font-mono">
              {metrics.totalSessions}
            </p>
            <span className="text-xs text-[#141211]/50 dark:text-white/50 font-bold">
              {lang === 'ar' ? 'جلسة' : 'sessions'}
            </span>
          </div>
          <p className="text-[11px] text-[#141211]/50 dark:text-white/50">
            {lang === 'ar' ? 'بودكاست، ريلز، وحملات تجارية' : 'Podcasts, Reels & Ads'}
          </p>
        </div>
      </div>

      {/* Main Visual Chart: Monthly Revenue & Booking Growth */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-[#141211] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C82626]" />
              <span>{lang === 'ar' ? 'مسار نمو الإيرادات الشهرية وحجوزات الاستوديو' : 'Monthly Revenue & Studio Bookings Growth'}</span>
            </h4>
            <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-0.5">
              {lang === 'ar'
                ? 'متابعة حية لتطور إيرادات باقات البودكاست والريلز المنفذة في استوديو مصر الجديدة'
                : 'Real-time financial performance trajectory across all KIN media services'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/10 self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '6m' ? 'bg-[#C82626] text-white shadow-sm' : 'text-[#141211]/70 dark:text-white/70'
              }`}
            >
              {lang === 'ar' ? 'آخر 6 أشهر' : 'Last 6 Months'}
            </button>
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === 'quarter' ? 'bg-[#C82626] text-white shadow-sm' : 'text-[#141211]/70 dark:text-white/70'
              }`}
            >
              {lang === 'ar' ? 'الربع الحالي' : 'Quarter'}
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === 'year' ? 'bg-[#C82626] text-white shadow-sm' : 'text-[#141211]/70 dark:text-white/70'
              }`}
            >
              {lang === 'ar' ? 'السنة كاملة' : 'Full Year'}
            </button>
          </div>
        </div>

        {/* Recharts AreaChart */}
        <div className="h-[280px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="kinRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C82626" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#C82626" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-black/5 dark:text-white/5" />
              <XAxis
                dataKey={lang === 'ar' ? 'monthAr' : 'monthEn'}
                stroke="currentColor"
                className="text-[11px] text-[#141211]/60 dark:text-white/60 font-medium"
                tickLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-[11px] text-[#141211]/60 dark:text-white/60 font-mono"
                tickLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <RechartsTooltip content={<CustomRevenueTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C82626"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#kinRevenueGradient)"
                activeDot={{ r: 6, fill: '#C82626', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Grid: Service Popularity Pie Chart + Service Revenue Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 2: Service Popularity PieChart (Donut) */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#141211] dark:text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-[#C82626]" />
                <span>{lang === 'ar' ? 'شعبية الخدمات ونسب الإقبال' : 'Service Popularity Distribution'}</span>
              </h4>
              <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-0.5">
                {lang === 'ar' ? 'توزيع نسبة الطلب بين البودكاست والريلز والإعلانات' : 'Share of demand across studio production lines'}
              </p>
            </div>
          </div>

          <div className="h-[240px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.servicePopularity}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {metrics.servicePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend Cards */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {metrics.servicePopularity.map((service) => (
              <div
                key={service.key}
                className="p-2.5 rounded-xl bg-black/2 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: service.color }} />
                  <span className="font-semibold text-[#141211] dark:text-white truncate">
                    {lang === 'ar' ? service.nameAr : service.nameEn}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#C82626] shrink-0">
                  {service.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Revenue Breakdown by Production Line */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1a1716] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#141211] dark:text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'ar' ? 'العائد المالي لكل خط إنتاج (EGP)' : 'Revenue per Service Line'}</span>
              </h4>
              <p className="text-xs text-[#141211]/60 dark:text-white/60 mt-0.5">
                {lang === 'ar' ? 'مقارنة الحجم المالي المتولد من كل فئة تصوير' : 'Financial breakdown by production category'}
              </p>
            </div>
          </div>

          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.servicePopularity}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-black/5 dark:text-white/5" />
                <XAxis
                  dataKey={lang === 'ar' ? 'nameAr' : 'nameEn'}
                  stroke="currentColor"
                  className="text-[10px] text-[#141211]/60 dark:text-white/60"
                  tickLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[10px] text-[#141211]/60 dark:text-white/60 font-mono"
                  tickLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <RechartsTooltip content={<CustomPieTooltip />} />
                <Bar dataKey="revenueEgp" radius={[8, 8, 0, 0]}>
                  {metrics.servicePopularity.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Action Strip */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onNavigateToAdd}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#C82626] hover:bg-[#a51e1e] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة مشروع / رابط جديد' : 'New Deliverable Link'}</span>
            </button>
            <button
              onClick={onNavigateToList}
              className="py-2.5 px-4 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#141211] dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              {lang === 'ar' ? 'إدارة الروابط' : 'View Deliverables'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
