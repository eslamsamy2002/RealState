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
    'brand.name': 'الحمد',
    'brand.fullName': 'الحمد للتسويق والاستثمار العقاري والقانوني',
    'brand.tagline': 'العقارات والاستثمار في بورسعيد',
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.submitProperty': 'أضف عقارك',
    'nav.legalServices': 'الخدمات القانونية',
    'nav.investmentShares': 'حصص الاستثمار',
    'nav.account': 'حسابي',
    'nav.admin': 'لوحة الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    
    // Actions & Buttons
    'action.search': 'بحث',
    'action.filter': 'تصفية النتائج',
    'action.reset': 'إعادة ضبط',
    'action.viewDetails': 'تفاصيل العقار',
    'action.expressInterest': 'إبداء اهتمام',
    'action.contactWhatsApp': 'تواصل عبر واتساب',
    'action.callNow': 'اتصال هاتفي',
    'action.submit': 'إرسال العقار',
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
    'filter.location': 'المدينة أو الحي',
    'filter.priceRange': 'نطاق السعر',
    'filter.minPrice': 'السعر الأدنى',
    'filter.maxPrice': 'السعر الأقصى',
    'filter.bedrooms': 'غرف النوم',
    'filter.sortBy': 'ترتيب حسب',
    'filter.newest': 'الأحدث أولاً',
    'filter.priceAsc': 'السعر: من الأقل للأعلى',
    'filter.priceDesc': 'السعر: من الأعلى للأقل',
    'filter.areaDesc': 'المساحة: الأكبر أولاً',
    'filter.searchPlaceholder': 'ابحث بالحي، اسم الشارع، أو نوع العقار...',
    
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
    'hero.badge': 'بوابتك الذكية لتملك العقارات',
    'hero.title': 'اعثر على عقارك المثالي بثقة وأمان كامل',
    'hero.subtitle': 'تصفح باقة مختارة من أرقى الشقق، الفلل، والمحلات التجارية والمكاتب الإدارية مع دعم قانوني متخصص وفرص استثمارية واعدة.',
    
    // Common Headings
    'heading.featuredProperties': 'عقارات مميزة ومختارة',
    'heading.featuredSubtitle': 'تشكيلة مختارة بعناية من أفضل الفرص السكنية والتجارية',
    'heading.exploreServices': 'منظومة خدمات الحمد المتكاملة',
    'heading.exploreSubtitle': 'كل ما تحتاجه لاتخاذ قرار عقاري استثماري سليم في مكان واحد',
    'heading.investmentSharesTeaser': 'نموذج الاستثمار العقاري الجزئي',
    'heading.investmentSharesSubtitle': 'ابدأ الاستثمار في عقارات تجارية وإدارية عالية العائد بحصص مالية ميسرة',
    'heading.legalServicesTeaser': 'حماية قانونية متكاملة لصفقتك العقارية',
    'heading.legalServicesSubtitle': 'نساعدك على فحص الملكية، وصياغة العقود، وإتمام إجراءات الشهر العقاري بأمان تام',
    
    // Disclaimer
    'disclaimer.prototype': 'منصة الحمد للتسويق والاستثمار العقاري والقانوني — بورسعيد.',
    'disclaimer.legal': 'جميع المعلومات والخدمات الاستشارية المعروضة على المنصة هي استرشادية وتخضع للتوثيق القانوني الرسمي بالشهر العقاري.',
    'disclaimer.investment': 'الاستثمار في العقارات المشتركة يخضع لدراسات الجدوى وعقود التوثيق الرسمية ولا توجد أرباح مضمونة دون تقييم واقعي للأصل.',
    
    // Footer
    'footer.description': 'المنصة الرائدة في تسويق وإدارة العقارات والاستثمار والخدمات القانونية بمحافظة بورسعيد وبورفؤاد.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'خدماتنا',
    'footer.contactUs': 'تواصل معنا',
    'footer.address': 'شارع الجمهورية تقاطع عاطف السادات، بورسعيد، مصر',
    'footer.phone': '01000352695 / +20 66 320 0000',
    'footer.email': 'info@elhamd-realestate.com',
    'footer.rights': 'جميع الحقوق محفوظة © الحمد للتسويق والاستثمار العقاري والقانوني',
  },
  en: {
    // Brand & Navigation
    'brand.name': 'El-Hamd',
    'brand.fullName': 'El-Hamd Real Estate, Investment & Legal Services',
    'brand.tagline': 'Real Estate & Investment in Port Said',
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.submitProperty': 'List Property',
    'nav.legalServices': 'Legal Services',
    'nav.investmentShares': 'Investment Shares',
    'nav.account': 'My Account',
    'nav.admin': 'Admin Portal',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    
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
    'hero.badge': 'Your Gateway to Smart Real Estate',
    'hero.title': 'Find Your Dream Property with Complete Confidence',
    'hero.subtitle': 'Explore premium apartments, villas, and commercial shops across Port Said with full legal backing and fractional investment opportunities.',
    
    // Common Headings
    'heading.featuredProperties': 'Featured Properties',
    'heading.featuredSubtitle': 'Handpicked premium residential and commercial opportunities',
    'heading.exploreServices': 'El-Hamd Comprehensive Ecosystem',
    'heading.exploreSubtitle': 'Everything you need to make confident, profitable property decisions',
    'heading.investmentSharesTeaser': 'Fractional Real Estate Investment',
    'heading.investmentSharesSubtitle': 'Invest in high-yield commercial & office real estate through accessible fractional shares',
    'heading.legalServicesTeaser': 'Complete Legal Protection for Your Deal',
    'heading.legalServicesSubtitle': 'Title deed audits, contract drafting, and notary registration handled safely',
    
    // Disclaimer
    'disclaimer.prototype': 'El-Hamd Real Estate & Legal Services — Port Said Edition.',
    'disclaimer.legal': 'All legal information is advisory and subject to official documentation before the competent notary authorities.',
    'disclaimer.investment': 'Shared property investments are subject to feasibility diligence and official notarial contracts with zero guaranteed returns.',
    
    // Footer
    'footer.description': 'Premier platform for real estate marketing, advisory, and shared property investments in Port Said & Port Fouad.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.contactUs': 'Contact Us',
    'footer.address': 'El Gomhoureya St at Atef El Sadat, Port Said, Egypt',
    'footer.phone': '+20 100 035 2695 / +20 66 320 0000',
    'footer.email': 'info@elhamd-realestate.com',
    'footer.rights': 'All rights reserved © El-Hamd Real Estate & Legal Services',
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
