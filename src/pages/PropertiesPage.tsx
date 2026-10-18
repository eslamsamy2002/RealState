import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Property, FilterState } from '../types';
import { PropertyCard } from '../components/common/PropertyCard';
import { PropertyFilterBar } from '../components/property/PropertyFilterBar';
import { InquiryModal } from '../components/property/InquiryModal';
import { Building2, SearchX, RotateCcw } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  purpose: 'all',
  type: '',
  location: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  searchQuery: '',
  sortBy: 'newest',
};

export const PropertiesPage: React.FC = () => {
  const { publicApprovedProperties } = useData();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL search params if provided
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      purpose: (searchParams.get('purpose') as any) || 'all',
      type: searchParams.get('type') || '',
      location: searchParams.get('location') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : '',
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : '',
      bedrooms: searchParams.get('bedrooms') || '',
      searchQuery: searchParams.get('q') || '',
      sortBy: (searchParams.get('sort') as any) || 'newest',
    };
  });

  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const purposeParam = searchParams.get('purpose') as any;
    const typeParam = searchParams.get('type');
    const locationParam = searchParams.get('location');

    if (purposeParam || typeParam || locationParam) {
      setFilters((prev) => ({
        ...prev,
        purpose: purposeParam || prev.purpose,
        type: typeParam !== null ? typeParam : prev.type,
        location: locationParam !== null ? locationParam : prev.location,
      }));
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    let result = [...publicApprovedProperties];

    // Filter by Purpose (sale / rent)
    if (filters.purpose !== 'all') {
      result = result.filter((p) => p.purpose === filters.purpose);
    }

    // Filter by Property Type
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    // Filter by Location substring
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (p) =>
          p.location.city.toLowerCase().includes(loc) ||
          p.location.district.toLowerCase().includes(loc) ||
          p.location.address.toLowerCase().includes(loc) ||
          (p.location.cityEn && p.location.cityEn.toLowerCase().includes(loc)) ||
          (p.location.districtEn && p.location.districtEn.toLowerCase().includes(loc))
      );
    }

    // Filter by Min Price
    if (filters.minPrice !== '') {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }

    // Filter by Max Price
    if (filters.maxPrice !== '') {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Filter by Bedrooms
    if (filters.bedrooms) {
      const reqBeds = Number(filters.bedrooms);
      if (reqBeds >= 5) {
        result = result.filter((p) => p.bedrooms >= 5);
      } else {
        result = result.filter((p) => p.bedrooms === reqBeds);
      }
    }

    // Search query keyword across title & description
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.location.district.toLowerCase().includes(q)
      );
    }

    // Sort Logic
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area_desc':
        result.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [publicApprovedProperties, filters]);

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'العقارات المعتمدة للبيع والإيجار' : 'Verified Listings For Sale & Rent'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
            {language === 'ar' ? 'دليل العقارات في مصر' : 'Real Estate Catalog in Egypt'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1 max-w-2xl">
            {language === 'ar'
              ? 'تصفح باقة منتقاة من الشقق السكنية، الفلل المستقلة، المحلات التجارية، والمكاتب الإدارية مع إمكانية التصفية المتقدمة وفق رغبتك.'
              : 'Browse a vetted selection of apartments, villas, commercial shops, and office spaces with advanced multi-criteria filters.'}
          </p>
        </div>

        {/* Filter Bar Component */}
        <PropertyFilterBar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResults={filteredProperties.length}
        />

        {/* Results Grid or Empty State */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onQuickInquiry={(property) => setSelectedPropertyForInquiry(property)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-sand-100 text-navy-400 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-navy-950 mb-2">
              {language === 'ar'
                ? 'لم يتم العثور على عقارات مطابقة'
                : 'No Properties Match Your Search'}
            </h3>
            <p className="text-xs sm:text-sm text-navy-600 mb-6 leading-relaxed">
              {language === 'ar'
                ? 'جرّب توسيع نطاق البحث أو تغيير نوع العقار أو إلغاء بعض معايير التصفية للوصول لنتائج أفضل.'
                : 'Try adjusting your search filters, broadening the price range, or clearing selections.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'إعادة ضبط كافة الفلاتر' : 'Reset All Filters'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={!!selectedPropertyForInquiry}
        onClose={() => setSelectedPropertyForInquiry(null)}
        property={selectedPropertyForInquiry}
      />
    </div>
  );
};
