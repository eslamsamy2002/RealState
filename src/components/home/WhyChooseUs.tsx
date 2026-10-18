import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  PlusCircle,
  ShieldCheck,
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 bg-sand-100/60 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sell / List Your Property CTA Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-400/30">
                {language === 'ar' ? 'للملاك والمطورين' : 'For Property Owners & Developers'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                {language === 'ar'
                  ? 'تريد بيع أو تأجير عقارك بأعلى عائد وأسرع وقت؟'
                  : 'Looking to Sell or Rent Your Property Fast?'}
              </h2>
              <p className="text-sm text-sand-300 max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'اعرض عقارك على منصة دار إستيت لتصل إلى آلاف المشترين والمستثمرين الجادين في مصر والخليج العربي. نقوم بمراجعة العقار وتوثيق بياناته ونشره فور اعتماده.'
                  : 'List your property on DarEstate to reach thousands of qualified buyers and investors in Egypt and the Gulf. Listings are verified and published upon admin approval.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-sand-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  {language === 'ar' ? 'فحص ومراجعة دقيقة' : 'Rigorous Review'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  {language === 'ar' ? 'تسويق واستهداف احترافي' : 'Professional Marketing'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  {language === 'ar' ? 'حماية بيانات المالك' : 'Owner Privacy Protection'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                to="/submit-property"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-gold-500/20 transform hover:-translate-y-1 transition-all"
              >
                <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                <span>{language === 'ar' ? 'أضف عقارك الآن مجاناً' : 'Submit Property Now'}</span>
                <ArrowIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Why DarEstate 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">
              {language === 'ar' ? 'أمان قانوني وثقة مطلقة' : 'Legal Safety & Integrity'}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {language === 'ar'
                ? 'لا يتم عرض أي عقار قبل التأكد من سلامة مستنداته وأوراق ملكيته، مع إمكانية فحص العقود بالشهر العقاري.'
                : 'Every listing is vetted for ownership legitimacy and title deed clarity before being published.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">
              {language === 'ar' ? 'شفافية كاملة بالأسعار' : 'Transparent Market Pricing'}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {language === 'ar'
                ? 'أسعار حقيقية ومحدثة بالجنيه المصري دون مبالغة، مع تفاصيل المساحات والتشطيبات والموقع الفعلي.'
                : 'Accurate real-time prices in EGP with transparent breakdowns of area, finishes, and exact district.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-card">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">
              {language === 'ar' ? 'استثمار ذكي وشامل' : 'Comprehensive Investment Hub'}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {language === 'ar'
                ? 'سواء كنت تشتري مسكناً لعائلتك، أو تبحث عن متجر لمشروعك، أو تستثمر في حصص تجارية تدر عوائد ربع سنوية.'
                : 'From family homes and retail shops to fractional commercial assets with quarterly rental returns.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
