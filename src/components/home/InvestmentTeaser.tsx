import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/formatters';
import {
  TrendingUp,
  PieChart,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Percent,
  Coins,
  CheckCircle2,
} from 'lucide-react';

export const InvestmentTeaser: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { investments } = useData();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const topInvestment = investments[0];

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
              <span>{language === 'ar' ? 'فكرة مبتكرة للعرض التجريبي' : 'Innovative Demo Concept'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {language === 'ar' ? (
                <>
                  استثمر في كبرى العقارات التجارية عبر{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                    حصص الملكية الجزئية
                  </span>
                </>
              ) : (
                <>
                  Invest in Prime Commercial Real Estate Through{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                    Fractional Shares
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm text-sand-300 leading-relaxed">
              {language === 'ar'
                ? 'نموذج توضيحي يُمكّن صغار المستثمرين من تملك حصص بعقارات تجارية وإدارية مؤجرة لكيانات دولية وبنوك في التجمع الخامس والشيخ زايد، والحصول على عوائد إيجارية دورية.'
                : 'A demo showcase enabling investors to acquire fractional ownership shares in premium commercial properties leased to multinational tenants and banks, generating periodic rental distributions.'}
            </p>

            {/* Value bullets */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-sand-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'تبدأ الحصص الاستثمارية من 40,000 ج.م فقط'
                    : 'Investment shares starting from only 40,000 EGP'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'عوائد إيجارية سنوية متوقعة بين 14% إلى 18.5%'
                    : 'Expected annual rental yields between 14% to 18.5%'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'أصول مؤجرة فعلياً بعقود ملزمة طويلة الأجل'
                    : 'Operating assets backed by long-term corporate leases'}
                </span>
              </li>
            </ul>

            {/* Disclaimer pill */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-900 border border-navy-800 text-xs text-sand-400">
              <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p>
                {language === 'ar'
                  ? 'هذا القسم نموذج توضيحي فقط، ولا يمثل طرحاً مالياً أو جمع أموال حقيقي.'
                  : 'This section is an architectural demonstration only and does not process real funds.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/investment-shares"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm shadow-lg shadow-gold-500/20 transition-all"
              >
                <span>{language === 'ar' ? 'استكشف الفرص الاستثمارية' : 'Explore Investment Shares'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Featured Card Showcase */}
          {topInvestment && (
            <div className="lg:col-span-7">
              <div className="bg-navy-900/90 rounded-3xl border border-navy-800 p-6 sm:p-8 shadow-2xl relative">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 relative">
                  <img
                    src={topInvestment.image}
                    alt={topInvestment.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 end-3 px-3 py-1 rounded-full bg-gold-500 text-navy-950 text-xs font-black shadow-md">
                    {topInvestment.expectedRoi}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gold-400 font-bold uppercase tracking-wider">
                      {topInvestment.propertyType}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {language === 'ar' ? topInvestment.title : topInvestment.titleEn}
                    </h3>
                    <p className="text-xs text-sand-300 mt-1">{topInvestment.location}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-navy-800 text-center">
                    <div className="bg-navy-950/60 p-2.5 rounded-xl">
                      <span className="text-[10px] text-navy-400 block mb-0.5">
                        {language === 'ar' ? 'سعر الحصة' : 'Share Price'}
                      </span>
                      <strong className="text-sm font-black text-gold-300">
                        {formatPrice(topInvestment.sharePrice, language)}
                      </strong>
                    </div>

                    <div className="bg-navy-950/60 p-2.5 rounded-xl">
                      <span className="text-[10px] text-navy-400 block mb-0.5">
                        {language === 'ar' ? 'قيمة العقار' : 'Asset Value'}
                      </span>
                      <strong className="text-sm font-bold text-white">
                        {formatPrice(topInvestment.totalValue, language)}
                      </strong>
                    </div>

                    <div className="bg-navy-950/60 p-2.5 rounded-xl">
                      <span className="text-[10px] text-navy-400 block mb-0.5">
                        {language === 'ar' ? 'الحصص المتاحة' : 'Available'}
                      </span>
                      <strong className="text-sm font-bold text-white">
                        {topInvestment.availableShares} / {topInvestment.totalShares}
                      </strong>
                    </div>

                    <div className="bg-navy-950/60 p-2.5 rounded-xl">
                      <span className="text-[10px] text-navy-400 block mb-0.5">
                        {language === 'ar' ? 'دورية العائد' : 'Payout'}
                      </span>
                      <strong className="text-xs font-semibold text-sand-200">
                        {topInvestment.payoutSchedule}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-sand-400">
                      {language === 'ar' ? 'المستأجر الحالي:' : 'Current Tenant:'} {topInvestment.tenantInfo}
                    </span>
                    <Link
                      to="/investment-shares"
                      className="text-xs font-bold text-gold-400 hover:text-gold-300 underline"
                    >
                      {language === 'ar' ? 'طلب تفاصيل الحصة' : 'Request Share Details'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
