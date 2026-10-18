import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { PORT_SAID_DISTRICTS } from '../../data/portSaidLocations';
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (location) params.set('location', location);
    if (propertyType) params.set('type', propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-[640px] lg:min-h-[700px] flex items-center justify-center bg-navy-950 overflow-hidden">
      {/* Background Photography with Luxury Atmosphere */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Modern Architecture"
          className="w-full h-full object-cover object-center opacity-30 scale-105 animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/60" />
      </div>

      {/* Decorative Gold Glow Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>{t('hero.badge')}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] mb-6">
          {language === 'ar' ? (
            <>
              وجهتك الأولى لتملك <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">العقارات الفاخرة</span> والاستثمار في بورسعيد
            </>
          ) : (
            <>
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">Premium Real Estate</span> & Investments in Port Said
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-sand-200/90 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          {t('hero.subtitle')}
        </p>

        {/* Main Search Filter Box */}
        <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border border-sand-200/80 max-w-4xl mx-auto text-navy-900 text-start">
          {/* Purpose Tabs: Sale / Rent */}
          <div className="flex items-center gap-2 mb-4 border-b border-sand-200 pb-3">
            <button
              type="button"
              onClick={() => setPurpose('sale')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                purpose === 'sale'
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-sand-100/70 text-navy-700 hover:bg-sand-200/60'
              }`}
            >
              {language === 'ar' ? 'عقارات للبيع' : 'Properties for Sale'}
            </button>
            <button
              type="button"
              onClick={() => setPurpose('rent')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                purpose === 'rent'
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-sand-100/70 text-navy-700 hover:bg-sand-200/60'
              }`}
            >
              {language === 'ar' ? 'عقارات للإيجار' : 'Properties for Rent'}
            </button>
          </div>

          {/* Search Inputs Grid */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {/* Location Select (Port Said Districts) */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-navy-600 mb-1">
                {t('filter.location')}
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-sand-50/50"
                >
                  <option value="">{language === 'ar' ? 'جميع المناطق والأحياء' : 'All Districts'}</option>
                  {PORT_SAID_DISTRICTS.map((district) => (
                    <option key={district.id} value={district.id}>
                      {language === 'ar' ? district.nameAr : district.nameEn}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-gold-600 absolute end-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Property Type Select */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-navy-600 mb-1">
                {t('filter.propertyType')}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-sand-50/50"
                >
                  <option value="">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                  <option value="apartment">{language === 'ar' ? 'شقق سكنية' : 'Apartments'}</option>
                  <option value="villa">{language === 'ar' ? 'فلل مستقلة' : 'Villas'}</option>
                  <option value="duplex">{language === 'ar' ? 'دوبلكس' : 'Duplexes'}</option>
                  <option value="commercial_shop">{language === 'ar' ? 'محلات تجارية' : 'Commercial Shops'}</option>
                  <option value="office">{language === 'ar' ? 'مكاتب إدارية' : 'Offices'}</option>
                  <option value="clinic">{language === 'ar' ? 'عيادات طبية' : 'Clinics'}</option>
                  <option value="chalet">{language === 'ar' ? 'شاليهات' : 'Chalets'}</option>
                </select>
                <Building2 className="w-4 h-4 text-gold-600 absolute end-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Search Submit Button */}
            <div className="pt-2 sm:pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 shadow-lg shadow-gold-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>{t('action.search')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Highlights / Trust Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-sand-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'عقارات مفحوصة قانونياً' : 'Legally Verified Listings'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'أسعار حقيقية بالجنيه المصري' : 'Transparent EGP Pricing'}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'فرص استثمار جزئي بعوائد دورية' : 'Fractional Ownership Demo'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
