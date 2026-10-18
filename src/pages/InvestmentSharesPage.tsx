import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { InvestmentShare } from '../types';
import { formatPrice } from '../utils/formatters';
import { Modal } from '../components/common/Modal';
import {
  TrendingUp,
  PieChart,
  ShieldAlert,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Plus,
  Minus,
  Send,
  Building2,
} from 'lucide-react';

export const InvestmentSharesPage: React.FC = () => {
  const { investments, createInvestmentInquiry, currentUser } = useData();
  const { language } = useLanguage();

  // Selected Opportunity for Modal
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentShare | null>(null);
  const [requestedShares, setRequestedShares] = useState<number>(2);
  const [userName, setUserName] = useState(currentUser.name || '');
  const [userPhone, setUserPhone] = useState(currentUser.phone || '');
  const [userEmail, setUserEmail] = useState(currentUser.email || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const openInquiryModal = (inv: InvestmentShare) => {
    setSelectedInvestment(inv);
    setRequestedShares(inv.minimumShares);
    setSubmitted(false);
    setError('');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvestment) return;
    if (!userName.trim() || !userPhone.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال اسمك ورقم هاتفك للتواصل.'
          : 'Please enter your name and phone number.'
      );
      return;
    }

    createInvestmentInquiry({
      investmentId: selectedInvestment.id,
      investmentTitle: selectedInvestment.title,
      sharePrice: selectedInvestment.sharePrice,
      sharesRequested: requestedShares,
      totalAmount: requestedShares * selectedInvestment.sharePrice,
      userName: userName.trim(),
      userPhone: userPhone.trim(),
      userEmail: userEmail.trim(),
      notes: notes.trim(),
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-gold-700" />
            <span>{language === 'ar' ? 'الاستثمار العقاري الجزئي (نموذج توضيحي)' : 'Fractional Real Estate (Concept Demo)'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy-950 mb-3">
            {language === 'ar'
              ? 'امتلك حصصاً في كبرى العقارات التجارية والإدارية'
              : 'Own Shares in Prime Commercial & Office Real Estate'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            {language === 'ar'
              ? 'فكرة مبتكرة تتيح للمستثمرين الأفراد المشاركة في ملكية أصول عقارية تجارية كبرى مؤجرة بعقود طويلة الأجل، مع توزيع عوائد إيجارية منتظمة ونمو رأسمالي مع حركة السوق.'
              : 'An innovative concept enabling individual investors to participate in high-yield commercial assets leased to institutional tenants, enjoying quarterly rental income and appreciation.'}
          </p>
        </div>

        {/* Prominent Mandatory Compliance Disclaimer */}
        <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-start gap-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 space-y-1 leading-relaxed">
            <h4 className="font-black text-amber-900">
              {language === 'ar' ? 'تنويه قانوني واستثماري هام جداً:' : 'Important Regulatory & Legal Notice:'}
            </h4>
            <p>
              {language === 'ar'
                ? 'هذه الصفحة هي مجرد "عرض توضيحي ونموذج تجريبي (MVP Demonstration)" لفكرة الملكية الجزئية في العقار. المنصة لا تقدم أي وعود بعوائد مالية مضمونة، ولا تجمع أموالاً عبر الإنترنت، ولا تمثل أي صندوق استثماري معتمد. المشاركة الفعلية في أي استثمار تتطلب تحققا قانونياً، ومستندات رسمية موثقة، وهيكلاً ملكياً متوافقاً مع القوانين واللوائح المعمول بها.'
                : 'This page is strictly an illustrative prototype demonstrating the concept of fractional real estate ownership. We do not process payments, guarantee returns, or represent fractional ownership as legally established here. Real investments require legal due diligence and compliant corporate structuring.'}
            </p>
          </div>
        </div>

        {/* Educational 3-Step Concept Bar */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card">
          <h2 className="text-base sm:text-lg font-bold text-navy-950 mb-6 text-center">
            {language === 'ar' ? 'كيف تعمل فكرة الاستثمار العقاري الجزئي؟' : 'How Fractional Real Estate Works Conceptually'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="font-bold text-navy-900 text-sm mb-1">
                {language === 'ar' ? 'اختيار الأصل التجاري' : 'Vetted Commercial Asset'}
              </h3>
              <p className="text-xs text-navy-600">
                {language === 'ar'
                  ? 'يتم اختيار عقار تجاري أو طبي قائم ومؤجر لشركات وبنوك كبرى بعقود مستقرة.'
                  : 'Prime assets leased to banks, medical centers, or multinational firms.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="font-bold text-navy-900 text-sm mb-1">
                {language === 'ar' ? 'تقسيم الملكية إلى حصص' : 'Fractionalized Share Units'}
              </h3>
              <p className="text-xs text-navy-600">
                {language === 'ar'
                  ? 'تجزئة قيمة العقار إلى حصص متساوية ميسرة تتيح الدخول برؤوس أموال تبدأ من 40,000 ج.م.'
                  : 'Total value split into affordable units starting from 40,000 EGP per share.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="font-bold text-navy-900 text-sm mb-1">
                {language === 'ar' ? 'عوائد إيجارية دورية' : 'Periodic Rental Payouts'}
              </h3>
              <p className="text-xs text-navy-600">
                {language === 'ar'
                  ? 'تحصيل القيمة الإيجارية وتوزيعها على ملاك الحصص كل 3 أشهر مع حفظ القيمة الرأسمالية.'
                  : 'Quarterly rental cash flow distributed proportionally to share owners.'}
              </p>
            </div>
          </div>
        </div>

        {/* Investment Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {investments.map((inv) => {
            const fundedPercent = Math.round(
              ((inv.totalShares - inv.availableShares) / inv.totalShares) * 100
            );

            return (
              <div
                key={inv.id}
                className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & ROI Tag */}
                  <div className="relative aspect-[16/10] bg-sand-100 overflow-hidden">
                    <img
                      src={inv.image}
                      alt={inv.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-navy-950/90 text-gold-300 text-xs font-black shadow-md border border-gold-500/30">
                      {inv.expectedRoi}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-xs text-gold-700 font-bold uppercase tracking-wider block">
                        {language === 'ar' ? inv.propertyType : inv.propertyTypeEn}
                      </span>
                      <h3 className="text-lg font-black text-navy-950 mt-1 leading-snug">
                        {language === 'ar' ? inv.title : inv.titleEn}
                      </h3>
                      <p className="text-xs text-navy-500 mt-1 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-gold-600" />
                        <span>{language === 'ar' ? inv.location : inv.locationEn}</span>
                      </p>
                    </div>

                    <p className="text-xs text-navy-600 leading-relaxed line-clamp-3">
                      {language === 'ar' ? inv.description : inv.descriptionEn}
                    </p>

                    {/* Funding / Available Shares Progress */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-navy-600">
                          {language === 'ar' ? 'الحصص المحجوزة' : 'Allocated Shares'}
                        </span>
                        <span className="text-gold-700 font-bold">{fundedPercent}%</span>
                      </div>
                      <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gold-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${fundedPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-navy-500">
                        <span>
                          {language === 'ar' ? 'متاح:' : 'Available:'}{' '}
                          <strong className="text-navy-900">{inv.availableShares}</strong>{' '}
                          {language === 'ar' ? 'حصة' : 'shares'}
                        </span>
                        <span>
                          {language === 'ar' ? 'إجمالي:' : 'Total:'}{' '}
                          <strong className="text-navy-900">{inv.totalShares}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Financial Metrics Table */}
                    <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-sand-200 text-xs">
                      <div className="p-2.5 rounded-xl bg-sand-50">
                        <span className="text-[10px] text-navy-500 block mb-0.5">
                          {language === 'ar' ? 'سعر الحصة' : 'Share Price'}
                        </span>
                        <strong className="text-sm font-black text-navy-950">
                          {formatPrice(inv.sharePrice, language)}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-sand-50">
                        <span className="text-[10px] text-navy-500 block mb-0.5">
                          {language === 'ar' ? 'الحد الأدنى' : 'Min Shares'}
                        </span>
                        <strong className="text-sm font-bold text-navy-950">
                          {inv.minimumShares} {language === 'ar' ? 'حصص' : 'shares'}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-sand-50">
                        <span className="text-[10px] text-navy-500 block mb-0.5">
                          {language === 'ar' ? 'قيمة الأصل' : 'Total Asset'}
                        </span>
                        <strong className="text-xs font-bold text-navy-950">
                          {formatPrice(inv.totalValue, language)}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-sand-50">
                        <span className="text-[10px] text-navy-500 block mb-0.5">
                          {language === 'ar' ? 'صرف العوائد' : 'Payout'}
                        </span>
                        <strong className="text-xs font-semibold text-navy-950 truncate block">
                          {language === 'ar' ? inv.payoutSchedule : inv.payoutScheduleEn}
                        </strong>
                      </div>
                    </div>

                    {/* Tenant Badge */}
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {language === 'ar' ? inv.tenantInfo : inv.tenantInfoEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => openInquiryModal(inv)}
                    className="w-full py-3 px-4 rounded-xl bg-navy-900 hover:bg-gold-500 text-white hover:text-navy-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إبداء اهتمام بحجز حصة (تجريبي)' : 'Express Interest in Shares'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reservation / Express Interest Modal */}
      <Modal
        isOpen={!!selectedInvestment}
        onClose={() => setSelectedInvestment(null)}
        title={language === 'ar' ? 'طلب إبداء اهتمام بحصص الاستثمار' : 'Express Interest in Investment Shares'}
        subtitle={selectedInvestment?.title}
      >
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-navy-950">
              {language === 'ar' ? 'تم تسجيل اهتمامك بنجاح!' : 'Expression of Interest Saved!'}
            </h3>
            <p className="text-xs sm:text-sm text-navy-600 leading-relaxed max-w-md mx-auto">
              {language === 'ar'
                ? `تم حفظ طلبك لحجز (${requestedShares}) حصص بقيمة تقديرية ${formatPrice(
                    requestedShares * (selectedInvestment?.sharePrice || 0),
                    language
                  )}. سيقوم مستشار دار إستيت بالتواصل معك لشرح الإطار القانوني وهيكل العقود.`
                : 'Your inquiry has been recorded. An advisor will contact you with legal information.'}
            </p>
            <div className="pt-4">
              <button
                onClick={() => setSelectedInvestment(null)}
                className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-colors"
              >
                {language === 'ar' ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        ) : selectedInvestment ? (
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            {/* Share Calculator Box */}
            <div className="p-4 rounded-2xl bg-sand-100/70 border border-sand-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-navy-600">{language === 'ar' ? 'سعر الحصة الواحدة:' : 'Share Price:'}</span>
                <strong className="text-navy-950 font-bold">
                  {formatPrice(selectedInvestment.sharePrice, language)}
                </strong>
              </div>

              {/* Number of Shares Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-sand-200">
                <span className="text-xs font-bold text-navy-800">
                  {language === 'ar' ? 'عدد الحصص المطلوبة:' : 'Number of Shares:'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setRequestedShares((prev) =>
                        Math.max(selectedInvestment.minimumShares, prev - 1)
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-sand-300 flex items-center justify-center font-bold text-navy-800 hover:bg-sand-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-base font-black text-navy-950 w-8 text-center">
                    {requestedShares}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setRequestedShares((prev) =>
                        Math.min(selectedInvestment.availableShares, prev + 1)
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-sand-300 flex items-center justify-center font-bold text-navy-800 hover:bg-sand-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Calculated Amount */}
              <div className="flex items-center justify-between pt-2 border-t border-sand-200 text-sm">
                <span className="font-bold text-navy-700">
                  {language === 'ar' ? 'القيمة التقديرية الإجمالية:' : 'Total Estimated Value:'}
                </span>
                <strong className="text-base font-black text-gold-700">
                  {formatPrice(requestedShares * selectedInvestment.sharePrice, language)}
                </strong>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="محمد علي"
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                dir="ltr"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'ملاحظات أو أسئلة' : 'Notes or Questions'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'مثال: متى يبدأ توزيع العائد الإيجاري؟ هل يمكن التنازل عن الحصة لاحقاً؟'
                    : 'Any specific questions regarding payouts or terms...'
                }
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
              />
            </div>

            {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

            {/* Disclaimer in modal */}
            <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 leading-snug">
              {language === 'ar'
                ? 'ملاحظة: هذا تسجيل اهتمام تجريبي فقط. لا يتم خصم أو تحويل أي مبالغ مالية عبر المنصة.'
                : 'Note: This is a demo inquiry only. No funds are deducted or processed.'}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedInvestment(null)}
                className="px-4 py-2 rounded-xl border border-sand-300 text-navy-700 text-xs font-bold hover:bg-sand-100"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تأكيد إبداء الاهتمام' : 'Submit Interest'}</span>
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </div>
  );
};
