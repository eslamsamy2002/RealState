import { PropertyPurpose, PropertyType, ListingStatus } from '../types';

export function formatPrice(price: number, lang: 'ar' | 'en' = 'ar'): string {
  if (isNaN(price) || price === null || price === undefined) return '';
  const formatted = price.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  const currency = lang === 'ar' ? 'ج.م' : 'EGP';
  return `${formatted} ${currency}`;
}

export function formatNumber(num: number, lang: 'ar' | 'en' = 'ar'): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return num.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
}

export function formatArea(area: number, lang: 'ar' | 'en' = 'ar'): string {
  const num = formatNumber(area, lang);
  return lang === 'ar' ? `${num} م²` : `${num} m²`;
}

export function getPropertyTypeLabel(type: PropertyType | string, lang: 'ar' | 'en' = 'ar'): string {
  const map: Record<string, { ar: string; en: string }> = {
    apartment: { ar: 'شقة سكنية', en: 'Apartment' },
    villa: { ar: 'فيلا مستقلة', en: 'Stand-alone Villa' },
    duplex: { ar: 'دوبلكس', en: 'Duplex' },
    commercial_shop: { ar: 'محل تجاري', en: 'Commercial Shop' },
    office: { ar: 'مكتب إداري', en: 'Administrative Office' },
    clinic: { ar: 'عيادة طبية', en: 'Medical Clinic' },
    chalet: { ar: 'شاليه سياحي', en: 'Chalet' },
  };
  return map[type]?.[lang] || type;
}

export function getPurposeLabel(purpose: PropertyPurpose | 'all', lang: 'ar' | 'en' = 'ar'): string {
  const map: Record<string, { ar: string; en: string }> = {
    sale: { ar: 'للبيع', en: 'For Sale' },
    rent: { ar: 'للإيجار', en: 'For Rent' },
    all: { ar: 'الكل', en: 'All' },
  };
  return map[purpose]?.[lang] || purpose;
}

export function getStatusBadgeInfo(status: ListingStatus, lang: 'ar' | 'en' = 'ar'): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  switch (status) {
    case 'approved':
      return {
        label: lang === 'ar' ? 'معتمد ومنشور' : 'Approved & Live',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
      };
    case 'pending':
      return {
        label: lang === 'ar' ? 'قيد المراجعة' : 'Pending Review',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-200',
      };
    case 'rejected':
      return {
        label: lang === 'ar' ? 'مرفوض' : 'Rejected',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-200',
      };
    default:
      return {
        label: status,
        bgClass: 'bg-gray-50',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
      };
  }
}

export function formatDate(isoString: string, lang: 'ar' | 'en' = 'ar'): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}
