import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  Building2,
  Home,
  Store,
  Briefcase,
  Stethoscope,
  Palmtree,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const CategoryPills: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { publicApprovedProperties } = useData();

  const getCount = (type: string) => {
    return publicApprovedProperties.filter((p) => p.type === type).length;
  };

  const categories = [
    {
      type: 'apartment',
      nameAr: 'شقق سكنية',
      nameEn: 'Apartments',
      icon: Home,
      count: getCount('apartment'),
    },
    {
      type: 'villa',
      nameAr: 'فلل فاخرة',
      nameEn: 'Villas',
      icon: Building2,
      count: getCount('villa'),
    },
    {
      type: 'commercial_shop',
      nameAr: 'محلات تجارية',
      nameEn: 'Commercial Shops',
      icon: Store,
      count: getCount('commercial_shop'),
    },
    {
      type: 'office',
      nameAr: 'مكاتب إدارية',
      nameEn: 'Office Spaces',
      icon: Briefcase,
      count: getCount('office'),
    },
    {
      type: 'duplex',
      nameAr: 'دوبلكس',
      nameEn: 'Duplexes',
      icon: Layers,
      count: getCount('duplex'),
    },
    {
      type: 'chalet',
      nameAr: 'شاليهات ساحلية',
      nameEn: 'Coastal Chalets',
      icon: Palmtree,
      count: getCount('chalet'),
    },
  ];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-12 bg-white border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-navy-950">
              {language === 'ar' ? 'استكشف حسب نوع العقار' : 'Explore by Property Category'}
            </h2>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              {language === 'ar'
                ? 'خيارات سكنية واستثمارية وتجارية تلبي كافة المتطلبات'
                : 'Residential, commercial, and investment options tailored for you'}
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-700 mt-2 sm:mt-0"
          >
            <span>{language === 'ar' ? 'عرض كافة العقارات' : 'View all properties'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.type}
                to={`/properties?type=${cat.type}`}
                className="group p-4 rounded-2xl bg-sand-50/70 hover:bg-gold-50/50 border border-sand-200/80 hover:border-gold-300 transition-all text-center flex flex-col items-center justify-center transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-sand-200 flex items-center justify-center text-navy-800 group-hover:text-gold-600 group-hover:border-gold-300 shadow-sm transition-all mb-3">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-sm font-bold text-navy-900 group-hover:text-gold-700 transition-colors">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </h3>
                <span className="text-[11px] text-navy-500 mt-1">
                  {cat.count} {language === 'ar' ? 'عقار' : 'listings'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
