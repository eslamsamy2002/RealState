import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { PropertyCard } from '../common/PropertyCard';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface FeaturedSectionProps {
  properties: Property[];
  onQuickInquiry: (property: Property) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  properties,
  onQuickInquiry,
}) => {
  const { t, language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const featured = properties.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('heading.featuredProperties')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
              {language === 'ar' ? 'أحدث العروض الحصرية والمميزة' : 'Latest Featured Exclusive Listings'}
            </h2>
            <p className="text-xs sm:text-sm text-navy-600 mt-1 max-w-xl">
              {t('heading.featuredSubtitle')}
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-navy-800 text-navy-900 hover:bg-navy-900 hover:text-white font-bold text-xs sm:text-sm transition-all mt-4 sm:mt-0"
          >
            <span>{language === 'ar' ? 'تصفح كل العقارات' : 'Browse All Properties'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onQuickInquiry={onQuickInquiry}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
