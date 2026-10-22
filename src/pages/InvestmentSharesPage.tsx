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
  AlertCircle,
  Check,
  MapPin,
  Scale,
  FileText,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const InvestmentSharesPage: React.FC = () => {
  const { createInvestmentInquiry, currentUser } = useData();
  const { language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Inquiry Form State
  const [userName, setUserName] = useState(currentUser.name || '');
  const [userPhone, setUserPhone] = useState(currentUser.phone || '');
  const [userEmail, setUserEmail] = useState(currentUser.email || '');
  const [investmentCategory, setInvestmentCategory] = useState(
    language === 'ar' ? 'محلات وتجاري (حي العرب / حي الشرق)' : 'Retail & Commercial (El Arab / El Shark)'
  );
  const [budgetRange, setBudgetRange] = useState('100,000 - 300,000 ج.م');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      setError(err?.message || (language === 'ar' ? 'حدث خطأ أثناء إرسال استفسارك.' : 'An error occurred while submitting your inquiry.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/201000352695?text=${encodeURIComponent(
    'مرحباً، أود الاستفسار عن فرص ودراسات الجدوى للاستثمار العقاري التجاري ببورسعيد.'
  )}`;

  const faqs = [
    {
      qAr: 'ما هو مفهوم الاستثمار العقاري المشترك؟',
      qEn: 'What is the concept of shared real estate investment?',
      aAr: 'هو نموذج قانوني يتيح لاثنين أو أكثر من الشركاء المشاركة في ملكية أصل عقاري تجاري أو إداري ذي قيمة استثمارية عالية، بحيث يمتلك كل مستثمر حصة محددة ومسجلة رسميًا، ويحصل على نصيبه النسبي من التدفقات الإيجارية بعد خصم المصروفات التشغيلية وفقاً للعقود الموثقة.',
      aEn: 'It is a structured legal framework enabling two or more partners to co-own high-value commercial or office assets, where each partner holds an officially documented equity share and receives proportional net rental distributions.',
    },
    {
      qAr: 'هل تقدم المنصة عوائد مالية ثابتة أو أرباحاً مؤكدة؟',
      qEn: 'Does the platform offer guaranteed financial returns or fixed yields?',
      aAr: 'كلا، نحن نلتزم بالنزاهة والشفافية القانونية التامة؛ فالاستثمار العقاري يخضع لقوى السوق الفعلية، ونسب الإشغال، ومصروفات الصيانة والإدارة. لا نضمن أي أرباح محددة ولا نقوم بجمع أو إدارة أموال عبر الإنترنت، بل نساعد المستثمرين في الفحص الفني والقانوني واختيار الأصول المدروسة.',
      aEn: 'No. In full compliance with real estate standards, property returns depend on market occupancy, tenant leases, and operating expenses. We never promise guaranteed yields or handle online funds, focusing on due diligence, legal verification, and transparent advisory.',
    },
    {
      qAr: 'ما هي الضمانات والمستندات القانونية التي يحصل عليها المستثمر؟',
      qEn: 'What legal documents and protections do investors receive?',
      aAr: 'يتم فحص سند الملكية والتراخيص الهندسية للعقار قبل أي خطوة، وتُحرر عقود المشاركة وحصص الملكية وتُسجل وتُوثق بمصلحة الشهر العقاري والمحاكم المختصة بموجب القوانين المصرية المنظمة للملكية الشائعة والتجارية.',
      aEn: 'Prior to any transaction, property titles and permits undergo rigorous legal audit. Partnership agreements and title stakes are notarized and registered at official Egyptian Notarial offices.',
    },
    {
      qAr: 'ما هي المناطق الأكثر حيوية للأنشطة التجارية في محافظة بورسعيد؟',
      qEn: 'What are the highest demand commercial districts in Port Said?',
      aAr: 'تتصدر شوارع حي العرب (شارع الثلاثيني، التجاري، ومحمد علي) حركة التجارة والبيع بالتجزئة والبنوك، بينما يشتهر حي الشرق بالمقرات الإدارية والتوكيلات الملاحية لقربه من الميناء، وتتميز بورفؤاد بالأنشطة الخدمية والطلب السكني السياحي المستقر.',
      aEn: 'El Arab district (commercial avenues) leads retail and banking activity, El Shark hosts maritime shipping and administrative agencies near Port Said Port, while Port Fouad offers strong service and residential demand.',
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-3 border border-gold-300/40">
            <TrendingUp className="w-3.5 h-3.5 text-gold-700" />
            <span>{language === 'ar' ? 'الاستثمار العقاري المشترك والتجاري' : 'Shared & Commercial Real Estate'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy-950 mb-3 tracking-tight">
            {language === 'ar'
              ? 'دليل وخدمات الاستثمار العقاري التجاري ببورسعيد'
              : 'Commercial & Shared Real Estate Advisory in Port Said'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            {language === 'ar'
              ? 'دليل إرشادي وخدمات متخصصة توضح آلية المشاركة في الأصول العقارية التجارية والإدارية في بورسعيد وبورفؤاد، مع فحص السجلات وتوثيق العقود بشفافية كاملة ودون أي وعود وهمية.'
              : 'Practical guide and advisory services detailing commercial property participation in Port Said and Port Fouad, backed by transparent due diligence and legal notarization.'}
          </p>
        </div>

        {/* Commercial Building Visual Feature Showcase */}
        <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative aspect-[16/11] lg:aspect-auto lg:h-full bg-navy-950 min-h-[260px] sm:min-h-[340px]">
              <img
                src="/images/commercial-building.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80') {
                    target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
                alt={language === 'ar' ? 'مبنى تجاري واستثماري في بورسعيد' : 'Commercial Real Estate Building in Port Said'}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 start-4 px-3 py-1.5 rounded-full bg-navy-950/90 text-gold-300 text-xs font-bold border border-gold-500/30 flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                <Building2 className="w-3.5 h-3.5 text-gold-400" />
                <span>{language === 'ar' ? 'أصول تجارية وإدارية واقعية' : 'Commercial Assets'}</span>
              </div>
            </div>

            {/* Context & Sectors Column */}
            <div className="lg:col-span-6 p-6 sm:p-10 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-gold-700 tracking-wider uppercase block">
                  {language === 'ar' ? 'مجالات الاستثمار في بورسعيد' : 'Key Investment Sectors'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-navy-950">
                  {language === 'ar'
                    ? 'الفرص التجارية والإدارية في المحافظة'
                    : 'Port Said Commercial & Office Landscape'}
                </h2>
                <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                  {language === 'ar'
                    ? 'تتمتع محافظة بورسعيد بموقع لوجستي وتجاري فريد، حيث تتنوع الأنشطة ذات الإقبال الإيجاري والاستثماري بين المحلات التجارية والمقرات الإدارية والعيادات التخصصية.'
                    : 'Port Said provides unique commercial potential driven by the Suez Canal logistics, maritime trade, and prime retail hubs across the city.'}
                </p>
              </div>

              {/* Districts / Category Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-2 text-navy-900 font-bold">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{language === 'ar' ? 'حي العرب التجاري' : 'El Arab Commercial Hub'}</span>
                  </div>
                  <p className="text-[11px] text-navy-600 leading-relaxed">
                    {language === 'ar'
                      ? 'محلات ومجمعات تجارية كبرى ذات كثافة تسوق ومشاة مرتفعة.'
                      : 'High-density retail strips and commercial shopping avenues.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-2 text-navy-900 font-bold">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{language === 'ar' ? 'حي الشرق الملاحي' : 'El Shark Corporate District'}</span>
                  </div>
                  <p className="text-[11px] text-navy-600 leading-relaxed">
                    {language === 'ar'
                      ? 'مقرات إدارية وتوكيلات ملاحية وشحن بإطلالات حيوية قرب الميناء.'
                      : 'Maritime headquarters and logistics offices near port facilities.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-2 text-navy-900 font-bold">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{language === 'ar' ? 'حي المناخ الطبي' : 'El Manakh Medical Hub'}</span>
                  </div>
                  <p className="text-[11px] text-navy-600 leading-relaxed">
                    {language === 'ar'
                      ? 'عيادات متخصصة ومراكز تحاليل وأشعة قرب المنظومة الصحية.'
                      : 'Specialized healthcare clinics and diagnostic medical centers.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 space-y-1">
                  <div className="flex items-center gap-2 text-navy-900 font-bold">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <span>{language === 'ar' ? 'مدينة بورفؤاد' : 'Port Fouad Area'}</span>
                  </div>
                  <p className="text-[11px] text-navy-600 leading-relaxed">
                    {language === 'ar'
                      ? 'أنشطة خدمية وتجارية وسكنية راقية تحافظ على نمو القيمة.'
                      : 'Service properties and high-end residential demand.'}
                  </p>
                </div>
              </div>

              {/* Verified Badge Row */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-navy-600 font-medium">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'ar' ? 'فحص سندات الملكية' : 'Title Audited'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'ar' ? 'عقود موثقة رسمياً' : 'Notarial Contracts'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'ar' ? 'بدون وعود وهمية' : 'Zero Fake Claims'}
                </span>
              </div>
            </div>
          </div>
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
                ? 'الاستثمار العقاري يخضع لقوى السوق وتقلبات الإشغال ومصاريف التشغيل والصيانة والالتزامات الضريبية. لا تضمن المنصة أي عوائد مالية ثابتة أو أرباح مؤكدة، ولا تقوم بجمع أموال المستثمرين عبر الإنترنت. أي اتفاق استثماري يخضع لدراسة جدوى واقعية مستقلة وعقود قانونية موثقة بالشهر العقاري وجهات الاختصاص وفقاً للقوانين المصرية المعمول بها.'
                : 'Real estate investment is subject to market dynamics, occupancy fluctuations, and operating costs. We never guarantee profits or collect funds online. Any verified opportunity requires independent feasibility diligence and official notarial contracts in compliance with Egyptian laws.'}
            </p>
          </div>
        </div>

        {/* 4-Step Educational Concept Cards */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-card">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-navy-950">
              {language === 'ar' ? 'كيف تعمل آلية الاستثمار العقاري المشترك؟' : 'How Shared Real Estate Investment Works'}
            </h2>
            <p className="text-xs text-navy-500 mt-1">
              {language === 'ar'
                ? 'نموذج يعتمد على توزيع ملكية الأصل التجاري بين مجموعة من الشركاء وفق إجراءات قانونية واضحة'
                : 'A structured model allocating commercial asset ownership among partners through clear legal procedures'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'دراسة وفحص الأصل العقاري' : 'Due Diligence & Title Audit'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'اختيار موقع تجاري أو إداري حيوي ببورسعيد، والتحقق من التراخيص وسلامة سند الملكية وخلوه من النزاعات.'
                  : 'Selecting prime commercial properties in Port Said and verifying municipal permits and conflict-free title deeds.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'تحديد الحصص وهيكل المشاركة' : 'Equity Share Structuring'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'تحديد القيمة العادلة للأصل وفق دراسة سوقية مستقلة وتقسيمه إلى حصص واضحة ومحددة لكل شريك.'
                  : 'Defining fair market valuation through independent appraisal divided into transparent equity stakes.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'التوثيق بالشهر العقاري' : 'Notarial Registration'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'صياغة عقود المشاركة وحفظ حقوق الأطراف رسمياً لدى مصلحة الشهر العقاري لضمان الحماية القانونية الكاملة.'
                  : 'Drafting binding agreements and registering investor rights before Egyptian Notarial authorities.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-200 space-y-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-navy-950 font-black text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-navy-900 text-sm">
                {language === 'ar' ? 'الإدارة وتوزيع الإيرادات' : 'Lease Oversight & Yields'}
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'إدارة عقود الإيجار مع المستأجرين التجاريين وتوزيع صافي الإيرادات بعد خصم الصيانة وفق نسبة الحصص.'
                  : 'Managing tenant leases and distributing net revenues proportionally after operational and maintenance deductions.'}
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
                <span>{language === 'ar' ? 'المشاركة برؤوس أموال ميسرة في أصول تجارية كبرى دون الحاجة لشراء عقار كامل منفرد.' : 'Lower capital requirement than purchasing full commercial assets independently.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'تنويع المحفظة الاستثمارية على أكثر من موقع أو نشاط تجاري وإداري في بورسعيد.' : 'Portfolio diversification across multiple locations or property categories.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'حماية رأس المال من التضخم عبر امتلاك أصول عقارية ملموسة تسجل نمواً تاريخياً في القيمة.' : 'Inflation hedge through tangible asset ownership and long-term land appreciation.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'عقود إيجار تجارية مؤسسية ومتابعة قانونية وإدارية منتظمة.' : 'Structured commercial leases overseen by professional property managers.'}</span>
              </li>
            </ul>
          </div>

          {/* Potential Risks & Limitations */}
          <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 text-navy-950">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold">
                {language === 'ar' ? 'المخاطر والالتزامات الواجب مراعاتها' : 'Risks & Obligations'}
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-700">
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'مخاطر خلو العقار أو فترات البحث عن مستأجر جديد عند انتهاء مدة التعاقد.' : 'Vacancy periods during tenant transitions impacting periodic cash flows.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'تكاليف الصيانة الدورية، الضرائب العقارية، والرسوم البلدية التي تُخصم من الإيراد.' : 'Maintenance outlays, municipal property taxes, and mandatory operational costs.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'سيولة العقار أقل من الودائع البنكية؛ فالتخارج يتطلب بيع الحصة لشريك أو مشترٍ جديد.' : 'Lower asset liquidity compared to cash deposits; exits require finding a buyer.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'ar' ? 'التقلبات الاقتصادية وتغيرات النشاط التجاري وحركة الشحن في السوق المحلي.' : 'Macroeconomic changes impacting commercial retail and office demand.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Steps to Request Investment Details Section */}
        <div className="bg-gradient-to-br from-navy-950 to-navy-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block mb-1">
              {language === 'ar' ? 'إجراءات طلب الاستشارة' : 'Inquiry Process'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {language === 'ar'
                ? 'خطوات طلب دراسة الجدوى وتفاصيل الاستثمار'
                : 'Steps for Requesting Investment Details'}
            </h2>
            <p className="text-xs sm:text-sm text-sand-300 mt-1">
              {language === 'ar'
                ? 'نرافقك خطوة بخطوة من مرحلة الاستفسار وحتى المعاينة والتوثيق الرسمي'
                : 'Guided support from initial consultation to on-site inspection and legal registration'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-gold-400">01</span>
              <h4 className="font-bold text-sm text-white">
                {language === 'ar' ? 'تسجيل الاهتمام' : 'Submit Inquiry'}
              </h4>
              <p className="text-xs text-sand-300 leading-relaxed">
                {language === 'ar'
                  ? 'حدّد الفئة المفضلة (تجاري، إداري، طبي) والميزانية المقترحة عبر النموذج.'
                  : 'Specify your preferred category and target budget via the form below.'}
              </p>
            </div>

            <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-gold-400">02</span>
              <h4 className="font-bold text-sm text-white">
                {language === 'ar' ? 'دراسة الجدوى' : 'Feasibility Review'}
              </h4>
              <p className="text-xs text-sand-300 leading-relaxed">
                {language === 'ar'
                  ? 'مراجعة الموقف القانوني وسجل العقار ودراسة التدفقات الإيجارية المتوقعة.'
                  : 'Review the legal audit, municipal records, and realistic rental cashflow model.'}
              </p>
            </div>

            <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-gold-400">03</span>
              <h4 className="font-bold text-sm text-white">
                {language === 'ar' ? 'المعاينة الواقعية' : 'Physical Inspection'}
              </h4>
              <p className="text-xs text-sand-300 leading-relaxed">
                {language === 'ar'
                  ? 'زيارة العقار على أرض الواقع في بورسعيد مع مستشارنا وفحص الموقع والمستأجرين.'
                  : 'On-site property inspection in Port Said with our advisory team.'}
              </p>
            </div>

            <div className="bg-navy-900/80 border border-navy-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-black text-gold-400">04</span>
              <h4 className="font-bold text-sm text-white">
                {language === 'ar' ? 'التوثيق الرسمي' : 'Legal Closing'}
              </h4>
              <p className="text-xs text-sand-300 leading-relaxed">
                {language === 'ar'
                  ? 'توقيع عقود الشراكة وتوثيقها رسمياً بالشهر العقاري لحفظ حقوق جميع الأطراف.'
                  : 'Executing official partnership agreements at the Notarial registry office.'}
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-card">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 text-navy-800 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
              <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-navy-950">
              {language === 'ar'
                ? 'استفسارات متكررة حول الاستثمار العقاري'
                : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs text-navy-500 mt-1">
              {language === 'ar'
                ? 'إجابات واضحة ومباشرة حول الجوانب القانونية والاستثمارية'
                : 'Direct answers regarding legal protections and operational aspects'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-sand-200 overflow-hidden transition-all bg-sand-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start hover:bg-sand-100/50 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-navy-950">
                      {language === 'ar' ? faq.qAr : faq.qEn}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gold-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-navy-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-navy-600 leading-relaxed border-t border-sand-200/60 pt-3">
                      {language === 'ar' ? faq.aAr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Investment Inquiry & Consultation Form */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-card" id="consultation-form">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استشارة استثمارية مجانية' : 'Free Consultation'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-950">
                {language === 'ar'
                  ? 'مهتم بالاستثمار في عقارات بورسعيد؟'
                  : 'Interested in Port Said Real Estate Investment?'}
              </h2>
              <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                {language === 'ar'
                  ? 'سجّل اهتمامك وسيقوم مستشارنا العقاري بالتواصل معك لمناقشة الخيارات التجارية والإدارية المتاحة ودراسات الجدوى القانونية، دون أي التزام مالي.'
                  : 'Submit your contact details and our advisory team will reach out to discuss verified commercial and office options in Port Said.'}
              </p>

              <div className="pt-4 space-y-3">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ar' ? 'محادثة عبر واتساب: 01000352695' : 'Direct WhatsApp: 01000352695'}</span>
                </a>

                <a
                  href="tel:01000352695"
                  className="w-full py-3 px-4 rounded-xl border border-sand-300 hover:bg-sand-50 text-navy-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? 'اتصال هاتفي مباشر: 01000352695' : 'Direct Call: 01000352695'}</span>
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
                      <option value="عقارات ومحلات تجارية (حي العرب / حي الشرق)">
                        {language === 'ar' ? 'محلات تجارية ومجمعات تسوق (حي العرب / حي الشرق)' : 'Retail & Commercial Hubs'}
                      </option>
                      <option value="مكاتب إدارية وخدمات ملاحية (حي الشرق / بورفؤاد)">
                        {language === 'ar' ? 'مكاتب إدارية وخدمات ملاحية (حي الشرق / بورفؤاد)' : 'Maritime & Corporate Offices'}
                      </option>
                      <option value="مراكز طبية وعيادات تخصصية (حي المناخ)">
                        {language === 'ar' ? 'مراكز طبية وعيادات تخصصية (حي المناخ)' : 'Medical & Clinical Hubs'}
                      </option>
                      <option value="شقق وفلل سكنية للتأجير السنوي والشهري">
                        {language === 'ar' ? 'عقارات سكنية استثمارية مدرّة للدخل (بورفؤاد / الشرق)' : 'Residential Rental Units'}
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
