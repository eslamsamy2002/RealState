import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  FileCheck,
  Scale,
  Compass,
} from 'lucide-react';

export const InvestmentTeaser: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الاستثمار العقاري المشترك' : 'Shared Real Estate Investment'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {language === 'ar' ? (
                <>
                  استثمر في كبرى العقارات التجارية عبر{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                    رؤية مدروسة وتوثيق قانوني
                  </span>
                </>
              ) : (
                <>
                  Invest in Prime Commercial Real Estate Through{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                    Structured Due Diligence
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm text-sand-300 leading-relaxed">
              {language === 'ar'
                ? 'نقدّم للمستثمرين دليلاً شاملاً واستشارات متخصصة للمشاركة في ملكية أصول عقارية تجارية وإدارية وملاحية في حي العرب وحي الشرق وبورفؤاد، مع توثيق الحصص والحقوق بعقود رسمية مسجلة بالشهر العقاري.'
                : 'Providing investors with comprehensive guidance and advisory for participating in commercial, administrative, and maritime properties in Port Said & Port Fouad with documented notarial contracts.'}
            </p>

            {/* Value bullets */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-sand-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'فحص شامل لسندات الملكية والتراخيص الرسمية قبل طرح أي فرصة'
                    : 'Comprehensive title deed audits and regulatory verification'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'دراسات جدوى واقعية وشفافة تستند إلى قوى السوق الفعلية'
                    : 'Realistic, transparent feasibility studies backed by market data'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'صياغة عقود مشاركة ملزمة تضمن حقوق جميع الشركاء والمستثمرين'
                    : 'Binding partnership agreements safeguarding all stakeholder rights'}
                </span>
              </li>
            </ul>

            {/* Disclaimer pill */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-900 border border-navy-800 text-xs text-sand-400">
              <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p>
                {language === 'ar'
                  ? 'الاستثمار العقاري يخضع لمخاطر السوق وقوى العرض والطلب؛ المنصة لا تقدم أرباحاً مؤكدة ولا تجمع أموالاً عبر الإنترنت.'
                  : 'Real estate investment is subject to market risks; we do not guarantee profits or process online fund collections.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/investment-shares"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm shadow-lg shadow-gold-500/20 transition-all"
              >
                <span>{language === 'ar' ? 'استكشف دليل وخدمات الاستثمار' : 'Explore Investment Guide'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Featured Card Showcase */}
          <div className="lg:col-span-7">
            <div className="bg-navy-900/90 rounded-3xl border border-navy-800 p-6 sm:p-8 shadow-2xl relative">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 relative bg-navy-950">
                <img
                  src="/images/commercial-building.jpg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80') {
                      target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
                    }
                  }}
                  alt={language === 'ar' ? 'مبنى تجاري واستثماري في بورسعيد' : 'Commercial Real Estate in Port Said'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-gold-500 text-navy-950 text-xs font-black shadow-md flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'أصول تجارية وإدارية' : 'Commercial Assets'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gold-400 font-bold uppercase tracking-wider block">
                    {language === 'ar' ? 'استشارات وفرص استثمارية موثقة' : 'Verified Investment Consultations'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {language === 'ar'
                      ? 'منظومة الاستثمار العقاري التجاري والإداري ببورسعيد'
                      : 'Port Said Commercial Real Estate Investment Hub'}
                  </h3>
                  <p className="text-xs text-sand-300 mt-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-gold-400" />
                    <span>
                      {language === 'ar'
                        ? 'نطاق العمل: حي العرب التجاري • حي الشرق الإداري • بورفؤاد'
                        : 'Locations: El Arab, El Shark & Port Fouad'}
                    </span>
                  </p>
                </div>

                {/* 4 Informational Service Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-navy-800 text-center">
                  <div className="bg-navy-950/60 p-2.5 rounded-xl">
                    <Scale className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                    <span className="text-[10px] text-navy-400 block mb-0.5">
                      {language === 'ar' ? 'التوثيق القانوني' : 'Legal Audits'}
                    </span>
                    <strong className="text-xs font-bold text-sand-200">
                      {language === 'ar' ? 'عقود موثقة' : 'Certified'}
                    </strong>
                  </div>

                  <div className="bg-navy-950/60 p-2.5 rounded-xl">
                    <FileCheck className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                    <span className="text-[10px] text-navy-400 block mb-0.5">
                      {language === 'ar' ? 'دراسات الجدوى' : 'Feasibility'}
                    </span>
                    <strong className="text-xs font-bold text-sand-200">
                      {language === 'ar' ? 'فحص واقعي' : 'Audited'}
                    </strong>
                  </div>

                  <div className="bg-navy-950/60 p-2.5 rounded-xl">
                    <Building2 className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                    <span className="text-[10px] text-navy-400 block mb-0.5">
                      {language === 'ar' ? 'نوعية الأصول' : 'Asset Types'}
                    </span>
                    <strong className="text-xs font-bold text-sand-200">
                      {language === 'ar' ? 'تجاري وإداري' : 'Commercial'}
                    </strong>
                  </div>

                  <div className="bg-navy-950/60 p-2.5 rounded-xl">
                    <ShieldAlert className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                    <span className="text-[10px] text-navy-400 block mb-0.5">
                      {language === 'ar' ? 'الشفافية' : 'Transparency'}
                    </span>
                    <strong className="text-xs font-bold text-emerald-400">
                      {language === 'ar' ? 'إفصاح كامل' : '100%'}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-navy-950/40 rounded-xl text-xs text-sand-300 leading-relaxed">
                  <span className="text-gold-400 font-bold">
                    {language === 'ar' ? 'آلية العمل:' : 'Our Approach:'}
                  </span>{' '}
                  {language === 'ar'
                    ? 'نوفر دراسات الجدوى والتدقيق القانوني المستقل للأصول التجارية القائمة للمستثمرين والشركاء الراغبين في استثمار آمن وموثق.'
                    : 'We provide independent legal diligence and feasibility reviews for operating commercial assets for investors seeking secure, transparent opportunities.'}
                </div>

                <div className="pt-2">
                  <Link
                    to="/investment-shares"
                    className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{language === 'ar' ? 'طلب استشارة أو تفاصيل استثمارية' : 'Request Consultation & Feasibility'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
