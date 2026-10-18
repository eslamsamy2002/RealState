import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & Navigation
    'brand.name': 'دار إستيت',
    'brand.tagline': 'منصتكم الموثوقة للعقارات والاستثمار في مصر',
    'nav.home': 'الرئيسية',
    'nav.properties': 'تصفح العقارات',
    'nav.submitProperty': 'أضف عقارك',
    'nav.legalServices': 'الخدمات القانونية',
    'nav.investmentShares': 'حصص الاستثمار',
    'nav.account': 'حسابي',
    'nav.admin': 'لوحة الإدارة',
    
    // Actions & Buttons
    'action.search': 'بحث',
    'action.filter': 'تصفية النتائج',
    'action.reset': 'إعادة ضبط',
    'action.viewDetails': 'تفاصيل العقار',
    'action.expressInterest': 'إبداء اهتمام',
    'action.contactWhatsApp': 'تواصل عبر واتساب',
    'action.callNow': 'اتصال هاتفي',
    'action.submit': 'إرسال',
    'action.cancel': 'إلغاء',
    'action.close': 'إغلاق',
    'action.approve': 'اعتماد ونشر',
    'action.reject': 'رفض العقار',
    'action.delete': 'حذف',
    'action.edit': 'تعديل',
    'action.save': 'حفظ التغييرات',
    'action.reserveShares': 'طلب حجز حصة',
    'action.requestConsultation': 'طلب استشارة قانونية',
    'action.resetDemoData': 'استعادة البيانات الافتراضية',
    
    // Filters & Labels
    'filter.all': 'الكل',
    'filter.forSale': 'للبيع',
    'filter.forRent': 'للإيجار',
    'filter.propertyType': 'نوع العقار',
    'filter.location': 'المدينة أو المنطقة',
    'filter.priceRange': 'نطاق السعر',
    'filter.minPrice': 'السعر الأدنى',
    'filter.maxPrice': 'السعر الأقصى',
    'filter.bedrooms': 'غرف النوم',
    'filter.sortBy': 'ترتيب حسب',
    'filter.newest': 'الأحدث أولاً',
    'filter.priceAsc': 'السعر: من الأقل للأعلى',
    'filter.priceDesc': 'السعر: من الأعلى للأقل',
    'filter.areaDesc': 'المساحة: الأكبر أولاً',
    'filter.searchPlaceholder': 'ابحث باسم المنطقة أو الكمبوند أو نوع العقار...',
    
    // Property Specs
    'specs.area': 'المساحة',
    'specs.bedrooms': 'غرف نوم',
    'specs.bathrooms': 'حمامات',
    'specs.floor': 'الدور',
    'specs.finishing': 'نوع التشطيب',
    'specs.yearBuilt': 'سنة البناء',
    'specs.amenities': 'المزايا والمرافق',
    'specs.location': 'الموقع والعنوان',
    'specs.contactInfo': 'بيانات التواصل مع المعلن',
    
    // Status
    'status.pending': 'قيد المراجعة',
    'status.approved': 'معتمد ومنشور',
    'status.rejected': 'مرفوض',
    
    // Home Hero
    'hero.badge': 'بوابتك للاستثمار العقاري الذكي في مصر',
    'hero.title': 'اعثر على عقارك المثالي بكل ثقة وأمان',
    'hero.subtitle': 'استكشف آلاف الشقق، الفلل، والمحلات التجارية للبيع والإيجار في أرقى مناطق القاهرة والجيزة والساحل الشمالي، مع دعم قانوني متكامل وفرص استثمار جزئي مميزة.',
    
    // Common Headings
    'heading.featuredProperties': 'عقارات مميزة ومختارة',
    'heading.featuredSubtitle': 'تشكيلة مختارة بعناية من أفضل الفرص السكنية والتجارية في مصر',
    'heading.exploreServices': 'منظومة خدمات دار إستيت المتكاملة',
    'heading.exploreSubtitle': 'كل ما تحتاجه لاتخاذ قرار عقاري استثماري سليم في مكان واحد',
    'heading.investmentSharesTeaser': 'نموذج الاستثمار العقاري الجزئي',
    'heading.investmentSharesSubtitle': 'ابدأ الاستثمار في عقارات تجارية وإدارية عالية العائد بحصص مالية ميسرة',
    'heading.legalServicesTeaser': 'حماية قانونية متكاملة لصفقتك العقارية',
    'heading.legalServicesSubtitle': 'نساعدك على فحص الملكية، وصياغة العقود، وإتمام إجراءات الشهر العقاري بأمان تام',
    
    // Disclaimer
    'disclaimer.prototype': 'نسخة تجريبية (MVP) مخصصة للعرض والعروض التوضيحية وتعمل بالكامل محلياً (localStorage).',
    'disclaimer.legal': 'جميع المعلومات والخدمات الاستشارية المعروضة على المنصة هي استرشادية وتوضيحية ولا تغني عن الاستشارة القانونية الرسمية.',
    'disclaimer.investment': 'نموذج حصص الاستثمار هو نموذج تصوري وعرض توضيحي فقط. المنصة لا تقدم وعوداً مالية ولا تجمع أموالاً عبر الإنترنت.',
    
    // Footer
    'footer.description': 'المنصة الرائدة في تسويق وإدارة العقارات الفاخرة والاستثمار في جمهورية مصر العربية.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'خدماتنا',
    'footer.contactUs': 'تواصل معنا',
    'footer.address': 'مبنى دار إستيت، شارع التسعين الجنوبي، التجمع الخامس، القاهرة، مصر',
    'footer.phone': '+20 2 2810 5000 / +20 100 123 4567',
    'footer.email': 'info@darestate.eg',
    'footer.rights': 'جميع الحقوق محفوظة © دار إستيت',
  },
  en: {
    // Brand & Navigation
    'brand.name': 'DarEstate',
    'brand.tagline': 'Your Trusted Real Estate & Investment Partner in Egypt',
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.submitProperty': 'List Property',
    'nav.legalServices': 'Legal Services',
    'nav.investmentShares': 'Investment Shares',
    'nav.account': 'My Account',
    'nav.admin': 'Admin Portal',
    
    // Actions & Buttons
    'action.search': 'Search',
    'action.filter': 'Filter Results',
    'action.reset': 'Reset',
    'action.viewDetails': 'View Details',
    'action.expressInterest': 'Express Interest',
    'action.contactWhatsApp': 'Chat on WhatsApp',
    'action.callNow': 'Call Now',
    'action.submit': 'Submit',
    'action.cancel': 'Cancel',
    'action.close': 'Close',
    'action.approve': 'Approve & Publish',
    'action.reject': 'Reject Listing',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.save': 'Save Changes',
    'action.reserveShares': 'Express Share Interest',
    'action.requestConsultation': 'Request Legal Consultation',
    'action.resetDemoData': 'Reset Demo Data',
    
    // Filters & Labels
    'filter.all': 'All',
    'filter.forSale': 'For Sale',
    'filter.forRent': 'For Rent',
    'filter.propertyType': 'Property Type',
    'filter.location': 'City or District',
    'filter.priceRange': 'Price Range',
    'filter.minPrice': 'Min Price',
    'filter.maxPrice': 'Max Price',
    'filter.bedrooms': 'Bedrooms',
    'filter.sortBy': 'Sort By',
    'filter.newest': 'Newest Listings',
    'filter.priceAsc': 'Price: Low to High',
    'filter.priceDesc': 'Price: High to Low',
    'filter.areaDesc': 'Area: Largest First',
    'filter.searchPlaceholder': 'Search by district, compound, or property type...',
    
    // Property Specs
    'specs.area': 'Area',
    'specs.bedrooms': 'Bedrooms',
    'specs.bathrooms': 'Bathrooms',
    'specs.floor': 'Floor',
    'specs.finishing': 'Finishing',
    'specs.yearBuilt': 'Year Built',
    'specs.amenities': 'Amenities & Features',
    'specs.location': 'Location & Address',
    'specs.contactInfo': 'Contact Information',
    
    // Status
    'status.pending': 'Pending Review',
    'status.approved': 'Approved & Live',
    'status.rejected': 'Rejected',
    
    // Home Hero
    'hero.badge': 'Your Gateway to Smart Real Estate in Egypt',
    'hero.title': 'Find Your Dream Property with Complete Confidence',
    'hero.subtitle': 'Explore premium apartments, villas, and commercial shops across New Cairo, Sheikh Zayed, 6th of October, and North Coast with full legal backing and fractional investment opportunities.',
    
    // Common Headings
    'heading.featuredProperties': 'Featured Properties',
    'heading.featuredSubtitle': 'Handpicked premium residential and commercial opportunities across Egypt',
    'heading.exploreServices': 'DarEstate Comprehensive Ecosystem',
    'heading.exploreSubtitle': 'Everything you need to make confident, profitable property decisions',
    'heading.investmentSharesTeaser': 'Fractional Real Estate Investment',
    'heading.investmentSharesSubtitle': 'Invest in high-yield commercial & office real estate through accessible fractional shares',
    'heading.legalServicesTeaser': 'Complete Legal Protection for Your Deal',
    'heading.legalServicesSubtitle': 'Title deed audits, contract drafting, and notary registration handled safely',
    
    // Disclaimer
    'disclaimer.prototype': 'Interactive Prototype (MVP) running entirely client-side with localStorage persistence.',
    'disclaimer.legal': 'All legal information is informational and does not constitute formal legal counsel.',
    'disclaimer.investment': 'Investment shares are a conceptual demonstration only. No payments are processed online.',
    
    // Footer
    'footer.description': 'Egypt\'s premier platform for luxury real estate marketing, advisory, and fractional investments.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.contactUs': 'Contact Us',
    'footer.address': 'DarEstate Tower, South 90th St, Fifth Settlement, New Cairo, Egypt',
    'footer.phone': '+20 2 2810 5000 / +20 100 123 4567',
    'footer.email': 'info@darestate.eg',
    'footer.rights': 'All rights reserved © DarEstate',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return getFromStorage<Language>(STORAGE_KEYS.LANGUAGE, 'ar');
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    saveToStorage(STORAGE_KEYS.LANGUAGE, language);
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['ar']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
