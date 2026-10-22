import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Send,
  MessageCircle,
  Phone,
  FileCheck,
  HelpCircle,
  AlertCircle,
  Check,
} from 'lucide-react';

export const InvestmentSharesPage: React.FC = () => {
  const { createInvestmentInquiry, currentUser } = useData();
  const { language } = useLanguage();

  // Inquiry Form State
  const [userName, setUserName] = useState(currentUser.name || '');
  const [userPhone, setUserPhone] = useState(currentUser.phone || '');
  const [userEmail, setUserEmail] = useState(currentUser.email || '');
  const [investmentCategory, setInvestmentCategory] = useState('عقارات تجارية ومحلات (حي العرب / حي الشرق)');
  const [budgetRange, setBudgetRange] = useState('100,000 - 300,000 ج.م');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName.trim() || !userPhone.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال اسمك ورقم الهاتف للتواصل.'
          : 'Please enter your name and phone number.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await createInvestmentInquiry({
        investmentId: 'general-consultation',
        investmentTitle: `طلب استفسار: ${investmentCategory} (${budgetRange})`,
        sharePrice: 0,
        sharesRequested: 1,
        totalAmount: 0,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userEmail: userEmail.trim(),
        notes: `الفئة المفضلة: ${investmentCategory}\nالميزانية المقترحة: ${budgetRange}\nملاحظات العميل: ${notes.trim()}`,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء إرسال استفسارك.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/201000352695?text=${encodeURIComponent(
    'مرحباً، أود الاستفسار عن فرص ومفهوم حصص الاستثمار العقاري التجاري ببورسعيد.'
  )}`;

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-gold-700" />
            <span>{language === 'ar' ? 'الاستثمار العقاري المشترك' : 'Shared Real Estate Investment'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy-950 mb-3">
            {language === 'ar'
              ? 'مفهوم حصص الاستثمار العقاري في بورسعيد'
              : 'Shared Real Estate Investment Concept in Port Said'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            {language === 'ar'
              ? 'دليل تعريفي يوضح آلية المشاركة في الأصول العقارية التجارية والإدارية عبر حصص استثمارية، مع توضيح الاشتراطات القانونية والمخاطر الاستثمارية بشفافية كاملة.'
              : 'An informational guide detailing shared commercial and residential property investment participation in Port Said, backed by legal transparency and risk disclosure.'}
          </p>
        </div>

        {/* Legal & Financial Risk Disclosure Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-start gap-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 space-y-1.5 leading-relaxed">
            <h4 className="font-black text-amber-900 text-sm sm:text-base">
              {language === 'ar' ? 'إفصاح قانوني ومالي هام للمستثمرين:' : 'Important Legal & Financial Risk Disclosure:'}
            </h4>
            <p>
              {language === 'ar'
                ? 'الاستثمار العقاري يخضع لقوى السوق وتقلبات الإشغال ومصاريف التشغيل والصيانة. لا تضمن المنصة أي عوائد مالية ثابتة أو أرباح مؤكدة، ولا تقوم بجمع أموال المستثمرين عبر الإنترنت. أي اتفاق استثماري يخضع لدراسة جدوى واقعية مستقلة وعقود قانونية موثقة بالشهر العقاري وجهات الاختصاص وفقاً للقوانين المصرية المعمول بها.'
                : 'Real estate investment is subject to market dynamics, occupancy fluctuations, and operating costs. We never guarantee profits or collect funds online. Any verified opportunity requires independent feasibility diligence and official notarial contracts in compliance with Egyptian laws.'}
            </p>
          </div>
        </div>

        {/* 3-Step Educational Concept Cards */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-card">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-navy-950">
              {language === 'ar' ? 'كيف يعمل الاستثمار العقاري المشترك؟' : 'How Shared Real Estate Investment Works'}
            </h2>
            <p className="text-xs text-navy-500 mt-1">
              {language === 'ar'
                ? 'نموذج يعتمد على توزيع ملكية الأصل التجاري بين مجموعة من الشركاء'
                : 'A structured model allocating commercial asset ownership among partners'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'دراسة وفحص الأصل العقاري' : 'Due Diligence & Asset Vetting'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'اختيار موقع تجاري أو إداري حيوي ببورسعيد (مثل حي العرب أو حي الشرق)، والتحقق من سلامة التراخيص وسندات الملكية.'
                  : 'Selecting high-traffic commercial or office locations in Port Said after rigorous title deed and municipal permit audit.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'تحديد الحصص ونسب المشاركة' : 'Share Structuring & Participation'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'تحديد القيمة الكلية للعقار وتقسيمها إلى حصص مشاركة محددة القيمة، مع توثيق حصة كل شريك في العقد الرسمي.'
                  : 'Defining total asset valuation divided into clear fractional units with documented equity stakes in official legal contracts.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'إدارة الإيجار وتوزيع العوائد' : 'Lease Management & Distributions'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'تأجير الأصل لكيانات تجارية مستقرة، وتوزيع الإيرادات الإيجارية دورياً وفقاً لنسبة الحصة المملوكة لكل طرف.'
                  : 'Leasing to creditworthy commercial tenants and distributing net rental yields proportionally based on ownership stakes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits vs Risks Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Potential Benefits */}
          <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 text-navy-950">
              <Building2 className="w-5 h-5 text-gold-600" />
              <h3 className="text-base font-bold">
                {language === 'ar' ? 'مزايا الاستثمار العقاري المشترك' : 'Key Advantages'}
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'إمكانية المشاركة برؤوس أموال ميسرة دون الحاجة لشراء عقار كامل بملايين الجنيهات.' : 'Lower capital requirement than purchasing full commercial assets independently.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'تنويع المحفظة الاستثمارية على أكثر من موقع أو نشاط تجاري.' : 'Portfolio diversification across multiple locations or property categories.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'الحماية من التضخم عبر الأصول العقارية الحقيقية والنمو الرأسمالي لقيمة الأرض والبناء.' : 'Inflation hedge through tangible asset ownership and land value growth.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'عقود إيجار مؤسسية تخضع لإشراف ومتابعة إدارية متخصصة.' : 'Structured commercial leases overseen by professional property managers.'}</span>
              </li>
            </ul>
          </div>

          {/* Potential Risks & Limitations */}
          <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 text-navy-950">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold">
                {language === 'ar' ? 'المخاطر والالتزامات الواجب مراعاتها' : 'Risks & Limitations'}
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-700">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'مخاطر خلو العقار أو فترات البحث عن مستأجر جديد عند انتهاء عقد الإيجار.' : 'Vacancy periods during tenant transitions impacting periodic cash flows.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'تكاليف الصيانة الدورية، الضرائب العقارية، والتأمين الإلزامي على المنشأة.' : 'Maintenance outlays, municipal property taxes, and mandatory insurance costs.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'سيولة أقل مقارنة بالأسهم أو الودائع؛ بيع الحصة يتطلب وجود مشترٍ أو إنهاء الاتفاق.' : 'Lower asset liquidity compared to cash deposits or liquid stock markets.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'التقلبات الاقتصادية وتغيرات القوة الشرائية في السوق العقاري المحلي.' : 'Macroeconomic changes impacting commercial retail and office demand.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Investment Inquiry & Consultation Form */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استشارة استثمارية' : 'Investment Consultation'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-950">
                {language === 'ar'
                  ? 'مهتم بالاستثمار في عقارات بورسعيد؟'
                  : 'Interested in Port Said Real Estate Investment?'}
              </h2>
              <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'سجّل اهتمامك لتزويدك بدراسات الجدوى والفرص التجارية المؤجرة المتاحة حالياً في محافظة بورسعيد وبورفؤاد فور جاهزيتها، دون أي التزام مالي.'
                  : 'Submit your interest to receive verified property feasibility studies and available commercial opportunities in Port Said.'}
              </p>

              <div className="pt-4 space-y-3">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ar' ? 'محادثة عبر واتساب مباشرة: 01000352695' : 'Direct WhatsApp Inquiry: 01000352695'}</span>
                </a>

                <a
                  href="tel:01000352695"
                  className="w-full py-3 px-4 rounded-xl border border-sand-300 hover:bg-sand-50 text-navy-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? 'اتصال هاتفي: 01000352695' : 'Direct Call: 01000352695'}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-navy-950">
                    {language === 'ar' ? 'تم استلام استفسارك بنجاح!' : 'Inquiry Received!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-navy-600 max-w-md mx-auto">
                    {language === 'ar'
                      ? 'شكراً لتواصلك معنا. سيقوم فريق الاستثمار العقاري بالتواصل معك على رقم هاتفك لمناقشة الخيارات المتاحة ودراسات الجدوى القانونية.'
                      : 'Thank you for reaching out. Our real estate team will get in touch with you shortly to discuss available opportunities.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
                  >
                    {language === 'ar' ? 'إرسال استفسار آخر' : 'Submit Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1.5">
                        {language === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: محمد السيد' : 'Full Name'}
                        className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1.5">
                        {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="010XXXXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1.5">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1.5">
                        {language === 'ar' ? 'الميزانية التقريبية المقترحة' : 'Budget Range'}
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                      >
                        <option value="50,000 - 100,000 ج.م">50,000 - 100,000 ج.م</option>
                        <option value="100,000 - 300,000 ج.م">100,000 - 300,000 ج.م</option>
                        <option value="300,000 - 500,000 ج.م">300,000 - 500,000 ج.م</option>
                        <option value="أكثر من 500,000 ج.م">أكثر من 500,000 ج.م</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'فئة العقار المفضلة للاستثمار' : 'Preferred Property Category'}
                    </label>
                    <select
                      value={investmentCategory}
                      onChange={(e) => setInvestmentCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                    >
                      <option value="عقارات تجارية ومحلات (حي العرب / حي الشرق)">
                        {language === 'ar' ? 'محلات تجارية ومجمعات بنوك (حي العرب / حي الشرق)' : 'Retail & Banking Complexes'}
                      </option>
                      <option value="مكاتب إدارية وخدمات ملاحية (حي الشرق / بورفؤاد)">
                        {language === 'ar' ? 'مكاتب إدارية وشركات ملاحية (حي الشرق / بورفؤاد)' : 'Maritime & Corporate Offices'}
                      </option>
                      <option value="مراكز طبية وعيادات تخصصية (حي المناخ)">
                        {language === 'ar' ? 'مراكز طبية وعيادات تخصصية (حي المناخ)' : 'Medical & Clinical Hubs'}
                      </option>
                      <option value="شقق وفلل سكنية للتأجير السنوي والشهري">
                        {language === 'ar' ? 'شقق وفلل سكنية للتأجير (بورفؤاد / حي الشرق)' : 'Residential Rental Units'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'ملاحظات أو استفسارات إضافية' : 'Additional Notes'}
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'اذكر أي تفاصيل إضافية عن رغبتك الاستثمارية أو الفترة الزمنية المفضلة...'
                          : 'Any specific questions or preferred investment horizons...'
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? language === 'ar'
                          ? 'جارٍ إرسال الاستفسار...'
                          : 'Sending...'
                        : language === 'ar'
                        ? 'إرسال طلب الاستفسار الاستثماري'
                        : 'Submit Investment Inquiry'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
