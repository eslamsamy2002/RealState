import React, { useState } from 'react';
import { FilterState, PropertyType, PropertyPurpose } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  MapPin,
  ChevronDown,
  Bed,
  Tag,
} from 'lucide-react';

interface PropertyFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const PropertyFilterBar: React.FC<PropertyFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const { t, language } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const locations = [
    { id: '', label: language === 'ar' ? 'جميع أحياء بورسعيد وبورفؤاد' : 'All Port Said Districts' },
    { id: 'حي الشرق', label: language === 'ar' ? 'حي الشرق' : 'El Shark District' },
    { id: 'حي العرب', label: language === 'ar' ? 'حي العرب' : 'El Arab District' },
    { id: 'حي المناخ', label: language === 'ar' ? 'حي المناخ' : 'El Manakh District' },
    { id: 'حي الضواحي', label: language === 'ar' ? 'حي الضواحي' : 'El Dawahi District' },
    { id: 'حي الزهور', label: language === 'ar' ? 'حي الزهور' : 'El Zohour District' },
    { id: 'حي الجنوب', label: language === 'ar' ? 'حي الجنوب' : 'El Ganoub District' },
    { id: 'حي غرب', label: language === 'ar' ? 'حي غرب' : 'Hay Gharb' },
    { id: 'بورفؤاد', label: language === 'ar' ? 'مدينة بورفؤاد' : 'Port Fouad City' },
  ];

  const propertyTypes = [
    { id: '', label: language === 'ar' ? 'جميع أنواع العقارات' : 'All Property Types' },
    { id: 'apartment', label: language === 'ar' ? 'شقة سكنية' : 'Apartment' },
    { id: 'villa', label: language === 'ar' ? 'فيلا مستقلة' : 'Villa' },
    { id: 'duplex', label: language === 'ar' ? 'دوبلكس' : 'Duplex' },
    { id: 'commercial_shop', label: language === 'ar' ? 'محل تجاري' : 'Commercial Shop' },
    { id: 'office', label: language === 'ar' ? 'مكتب إداري' : 'Office' },
    { id: 'clinic', label: language === 'ar' ? 'عيادة طبية' : 'Clinic' },
    { id: 'chalet', label: language === 'ar' ? 'شاليه' : 'Chalet' },
  ];

  const updateField = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.purpose !== 'all' ||
    filters.type !== '' ||
    filters.location !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.bedrooms !== '' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 shadow-card p-4 sm:p-6 mb-8">
      {/* Top Search Bar & Purpose Selector */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-4 border-b border-sand-200">
        {/* Purpose Buttons: All / Sale / Rent */}
        <div className="flex items-center gap-1.5 p-1 bg-sand-100/80 rounded-xl shrink-0 self-start lg:self-auto">
          {[
            { id: 'all', label: t('filter.all') },
            { id: 'sale', label: t('filter.forSale') },
            { id: 'rent', label: t('filter.forRent') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => updateField('purpose', tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filters.purpose === tab.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-700 hover:text-navy-900 hover:bg-sand-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Free-text Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateField('searchQuery', e.target.value)}
            placeholder={t('filter.searchPlaceholder')}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm text-navy-900 placeholder:text-navy-400 bg-sand-50/50"
          />
          <Search className="w-4 h-4 text-navy-400 absolute start-3.5 top-3.5 pointer-events-none" />
          {filters.searchQuery && (
            <button
              onClick={() => updateField('searchQuery', '')}
              className="absolute end-3.5 top-3 text-xs text-navy-400 hover:text-navy-900"
            >
              ✕
            </button>
          )}
        </div>

        {/* Advanced Filters Toggle & Reset Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-gold-50 border-gold-300 text-gold-800'
                : 'border-sand-300 text-navy-700 hover:bg-sand-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('action.filter')}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-navy-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title={t('action.reset')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('action.reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {/* Location Dropdown */}
        <div>
          <label className="block text-xs font-bold text-navy-700 mb-1.5">
            {t('filter.location')}
          </label>
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div>
          <label className="block text-xs font-bold text-navy-700 mb-1.5">
            {t('filter.propertyType')}
          </label>
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
            >
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bedrooms count */}
        <div>
          <label className="block text-xs font-bold text-navy-700 mb-1.5">
            {t('filter.bedrooms')}
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => updateField('bedrooms', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
          >
            <option value="">{language === 'ar' ? 'الكل (أي عدد)' : 'Any'}</option>
            <option value="1">1 {language === 'ar' ? 'غرفة' : 'Bed'}</option>
            <option value="2">2 {language === 'ar' ? 'غرف' : 'Beds'}</option>
            <option value="3">3 {language === 'ar' ? 'غرف' : 'Beds'}</option>
            <option value="4">4 {language === 'ar' ? 'غرف' : 'Beds'}</option>
            <option value="5">5+ {language === 'ar' ? 'غرف أو أكثر' : 'Beds or more'}</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="block text-xs font-bold text-navy-700 mb-1.5">
            {t('filter.sortBy')}
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateField('sortBy', e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
          >
            <option value="newest">{t('filter.newest')}</option>
            <option value="price_asc">{t('filter.priceAsc')}</option>
            <option value="price_desc">{t('filter.priceDesc')}</option>
            <option value="area_desc">{t('filter.areaDesc')}</option>
          </select>
        </div>
      </div>

      {/* Advanced Drawer: Price Range inputs */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-sand-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">
              {t('filter.minPrice')} ({language === 'ar' ? 'ج.م' : 'EGP'})
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) =>
                updateField('minPrice', e.target.value ? Number(e.target.value) : '')
              }
              className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">
              {t('filter.maxPrice')} ({language === 'ar' ? 'ج.م' : 'EGP'})
            </label>
            <input
              type="number"
              placeholder="50,000,000"
              value={filters.maxPrice}
              onChange={(e) =>
                updateField('maxPrice', e.target.value ? Number(e.target.value) : '')
              }
              className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
          </div>
        </div>
      )}

      {/* Active Results Counter */}
      <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between text-xs text-navy-600">
        <div>
          {language === 'ar' ? (
            <span>
              تم العثور على <strong className="text-navy-950 font-bold">{totalResults}</strong> عقار متاح
            </span>
          ) : (
            <span>
              Found <strong className="text-navy-950 font-bold">{totalResults}</strong> matching properties
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <span className="text-gold-700 font-medium">
            {language === 'ar' ? 'الفلاتر نشطة' : 'Filters applied'}
          </span>
        )}
      </div>
    </div>
  );
};
