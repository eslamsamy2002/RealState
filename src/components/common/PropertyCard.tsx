import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { formatPrice, formatArea, getPropertyTypeLabel, getPurposeLabel } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface PropertyCardProps {
  property: Property;
  showStatus?: boolean;
  onQuickInquiry?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showStatus = false,
  onQuickInquiry,
}) => {
  const { language, isRTL } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

  const title = language === 'en' && property.titleEn ? property.titleEn : property.title;
  const district =
    language === 'en' && property.location.districtEn
      ? property.location.districtEn
      : property.location.district;
  const city =
    language === 'en' && property.location.cityEn
      ? property.location.cityEn
      : property.location.city;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-sand-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
        <img
          src={imageError ? fallbackImage : property.primaryImage}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Sale / Rent Tag */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                property.purpose === 'sale'
                  ? 'bg-navy-900 text-white border border-navy-700'
                  : 'bg-gold-500 text-navy-950 font-extrabold border border-gold-400'
              }`}
            >
              {getPurposeLabel(property.purpose, language)}
              {property.purpose === 'rent' && property.rentFrequency === 'monthly'
                ? language === 'ar'
                  ? ' / شهري'
                  : ' / Mo'
                : ''}
            </span>

            {/* Featured Badge */}
            {property.featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-navy-950 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'ar' ? 'مميز' : 'Featured'}</span>
              </span>
            )}
          </div>

          {/* Status Badge (if enabled) */}
          {showStatus && (
            <div className="pointer-events-auto">
              <StatusBadge status={property.status} size="sm" />
            </div>
          )}
        </div>

        {/* Bottom Image Overlay: Price Tag */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white z-10">
          <div>
            <span className="text-xs text-sand-200 block font-medium">
              {getPropertyTypeLabel(property.type, language)}
            </span>
            <div className="text-lg sm:text-xl font-black text-white drop-shadow-md">
              {formatPrice(property.price, language)}
            </div>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-navy-600 mb-2">
            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span className="truncate">
              {district}, {city}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/properties/${property.id}`}
            className="block group-hover:text-gold-600 transition-colors font-bold text-navy-900 line-clamp-2 text-base leading-snug mb-3"
            title={title}
          >
            {title}
          </Link>
        </div>

        {/* Specs Overview Row */}
        <div className="pt-3 border-t border-sand-200/80">
          <div className="grid grid-cols-3 gap-2 text-xs text-navy-700 py-2 bg-sand-50/80 rounded-xl px-3 mb-4">
            {/* Bedrooms */}
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-4 h-4 text-navy-500 shrink-0" />
              <span>
                {property.bedrooms}{' '}
                <span className="text-[11px] text-navy-400">
                  {language === 'ar' ? 'غرف' : 'Beds'}
                </span>
              </span>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-1.5 justify-center border-x border-sand-200">
              <Bath className="w-4 h-4 text-navy-500 shrink-0" />
              <span>
                {property.bathrooms}{' '}
                <span className="text-[11px] text-navy-400">
                  {language === 'ar' ? 'حمام' : 'Baths'}
                </span>
              </span>
            </div>

            {/* Area */}
            <div className="flex items-center gap-1.5 justify-center">
              <Maximize2 className="w-4 h-4 text-navy-500 shrink-0" />
              <span className="font-semibold">{formatArea(property.area, language)}</span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2">
            <Link
              to={`/properties/${property.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-sm group-hover:bg-gold-600 group-hover:text-navy-950"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>

            {onQuickInquiry && (
              <button
                onClick={() => onQuickInquiry(property)}
                className="py-2.5 px-3 rounded-xl border border-sand-300 hover:border-gold-500 text-navy-800 hover:text-gold-600 hover:bg-gold-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                title={language === 'ar' ? 'طلب معاينة أو استفسار' : 'Quick Inquiry'}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {language === 'ar' ? 'استفسار' : 'Inquire'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
