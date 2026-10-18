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
    'brand.tagline': 'للتسويق والاستثمار العقاري والقانوني - بورسعيد',
    'nav.home': 'الرئيسية',
    'nav.properties': 'عقارات بورسعيد',
    'nav.submitProperty': 'أضف عقارك',
    'nav.legalServices': 'الخدمات القانونية',
    'nav.investmentShares': 'حصص الاستثمار',
    'nav.account': 'حسابي',
    'nav.admin': 'لوحة الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    
    // Actions & Buttons
    'action.search': 'بحث في بورسعيد',
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
    'filter.location': 'الحي / المنطقة في بورسعيد',
    'filter.priceRange': 'نطاق السعر (ج.م)',
    'filter.minPrice': 'السعر الأدنى',
    'filter.maxPrice': 'السعر الأقصى',
    'filter.bedrooms': 'غرف النوم',
    'filter.sortBy': 'ترتيب حسب',
    'filter.newest': 'الأحدث أولاً',
    'filter.priceAsc': 'السعر: من الأقل للأعلى',
    'filter.priceDesc': 'السعر: من الأعلى للأقل',
    'filter.areaDesc': 'المساحة: الأكبر أولاً',
    'filter.searchPlaceholder': 'ابحث باسم الشارع، الحي، أو نوع العقار ببورسعيد...',
    
    // Property Specs
    'specs.area': 'المساحة',
    'specs.bedrooms': 'غرف نوم',
    'specs.bathrooms': 'حمامات',
    'specs.floor': 'الدور',
    'specs.finishing': 'نوع التشطيب',
    'specs.yearBuilt': 'سنة البناء',
    'specs.amenities': 'المزايا والمرافق',
    'specs.location': 'الموقع في بورسعيد',
    'specs.contactInfo': 'بيانات التواصل مع المعلن',
    
    // Status
    'status.pending': 'قيد المراجعة',
    'status.approved': 'معتمد ومنشور',
    'status.rejected': 'مرفوض',
    
    // Home Hero
    'hero.badge': 'منصة العقارات والاستثمار الأولى في محافظة بورسعيد',
    'hero.title': 'اعثر على عقارك المثالي في بورسعيد وبورفؤاد بكل ثقة وأمان',
    'hero.subtitle': 'استكشف أفضل الشقق السكنية، المحلات التجارية، المقرات الإدارية، والفلل في حي الشرق، العرب، المناخ، الضواحي، الزهور، وبورفؤاد مع دعم قانوني متخصص وتدقيق كامل للمستندات.',
    
    // Common Headings
    'heading.featuredProperties': 'عقارات مميزة في بورسعيد',
    'heading.featuredSubtitle': 'تشكيلة مختارة بعناية من أفضل الفرص السكنية والتجارية في أحياء بورسعيد وبورفؤاد',
    'heading.exploreServices': 'منظومة خدمات الحمد العقارية والقانونية',
    'heading.exploreSubtitle': 'تسويق، استثمار، وتدقيق قانوني شامل لصفقتك العقارية ببورسعيد',
    'heading.investmentSharesTeaser': 'حصص الاستثمار التجاري في بورسعيد',
    'heading.investmentSharesSubtitle': 'استثمر في عقارات تجارية ومقرات بنوك وخدمات ملاحية بعوائد دورية مجزية',
    'heading.legalServicesTeaser': 'حماية قانونية كاملة لعقارات بورسعيد',
    'heading.legalServicesSubtitle': 'فحص سندات الملكية، عقود البيع والشراء، وإجراءات الشهر العقاري والتراخيص',
    
    // Disclaimer
    'disclaimer.prototype': 'نسخة تجريبية (MVP) مخصصة لمحافظة بورسعيد وتعمل بالكامل محلياً (localStorage).',
    'disclaimer.legal': 'الاستشارات القانونية المعروضة هي إرشادية وتوضيحية للمنصة ولا تغني عن التوكيل الرسمي أمام الجهات القضائية.',
    'disclaimer.investment': 'نموذج حصص الاستثمار هو نموذج توضيحي فقط. المنصة لا تجمع أموالاً عبر الإنترنت.',
    
    // Footer
    'footer.description': 'مكتب الحمد للتسويق والاستثمار العقاري والقانوني — شريككم العقاري الموثوق في محافظة بورسعيد ومدينة بورفؤاد.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'خدماتنا',
    'footer.contactUs': 'تواصل معنا في بورسعيد',
    'footer.address': 'شارع الجمهورية تقاطع عاطف السادات، حي الشرق، بورسعيد، مصر',
    'footer.phone': '+20 66 320 0000 / +20 100 123 4567',
    'footer.email': 'info@elhamd-realestate.com',
    'footer.rights': 'جميع الحقوق محفوظة © الحمد للتسويق والاستثمار العقاري والقانوني - بورسعيد',
  },
  en: {
    // Brand & Navigation
    'brand.name': 'El-Hamd',
    'brand.fullName': 'El-Hamd Real Estate, Investment & Legal Services',
    'brand.tagline': 'Real Estate, Investment & Legal Services - Port Said',
    'nav.home': 'Home',
    'nav.properties': 'Port Said Properties',
    'nav.submitProperty': 'List Property',
    'nav.legalServices': 'Legal Services',
    'nav.investmentShares': 'Investment Shares',
    'nav.account': 'My Account',
    'nav.admin': 'Admin Portal',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    
    // Actions & Buttons
    'action.search': 'Search in Port Said',
    'action.filter': 'Filter Results',
    'action.reset': 'Reset',
    'action.viewDetails': 'View Details',
    'action.expressInterest': 'Express Interest',
    'action.contactWhatsApp': 'Chat on WhatsApp',
    'action.callNow': 'Call Now',
    'action.submit': 'Submit Listing',
    'action.cancel': 'Cancel',
    'action.close': 'Close',
    'action.approve': 'Approve & Publish',
    'action.reject': 'Reject Listing',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.save': 'Save Changes',
    'action.reserveShares': 'Express Share Interest',
    'action.requestConsultation': 'Request Legal Advice',
    'action.resetDemoData': 'Reset Demo Data',
    
    // Filters & Labels
    'filter.all': 'All',
    'filter.forSale': 'For Sale',
    'filter.forRent': 'For Rent',
    'filter.propertyType': 'Property Type',
    'filter.location': 'Port Said District',
    'filter.priceRange': 'Price Range (EGP)',
    'filter.minPrice': 'Min Price',
    'filter.maxPrice': 'Max Price',
    'filter.bedrooms': 'Bedrooms',
    'filter.sortBy': 'Sort By',
    'filter.newest': 'Newest Listings',
    'filter.priceAsc': 'Price: Low to High',
    'filter.priceDesc': 'Price: High to Low',
    'filter.areaDesc': 'Area: Largest First',
    'filter.searchPlaceholder': 'Search by street, district or property type...',
    
    // Property Specs
    'specs.area': 'Area',
    'specs.bedrooms': 'Bedrooms',
    'specs.bathrooms': 'Bathrooms',
    'specs.floor': 'Floor',
    'specs.finishing': 'Finishing',
    'specs.yearBuilt': 'Year Built',
    'specs.amenities': 'Amenities & Features',
    'specs.location': 'Port Said Location',
    'specs.contactInfo': 'Advertiser Contact',
    
    // Status
    'status.pending': 'Pending Review',
    'status.approved': 'Approved & Live',
    'status.rejected': 'Rejected',
    
    // Home Hero
    'hero.badge': 'The Premier Real Estate & Legal Platform in Port Said',
    'hero.title': 'Discover Exceptional Properties in Port Said & Port Fouad',
    'hero.subtitle': 'Explore premium apartments, retail shops, maritime offices, and villas across El Shark, El Arab, El Manakh, El Dawahi, El Zohour, and Port Fouad with certified legal due diligence.',
    
    // Common Headings
    'heading.featuredProperties': 'Featured Listings in Port Said',
    'heading.featuredSubtitle': 'Handpicked residential and commercial opportunities across Port Said governorate',
    'heading.exploreServices': 'El-Hamd Comprehensive Real Estate Ecosystem',
    'heading.exploreSubtitle': 'Marketing, fractional investments, and legal contract auditing under one roof',
    'heading.investmentSharesTeaser': 'Port Said Commercial Investment Shares',
    'heading.investmentSharesSubtitle': 'Fractional ownership in prime retail, medical, and maritime logistics assets',
    'heading.legalServicesTeaser': 'Legal Security for Port Said Real Estate',
    'heading.legalServicesSubtitle': 'Title deed audits, notary registration, and contract drafting in Port Said',
    
    // Disclaimer
    'disclaimer.prototype': 'Port Said Edition MVP Prototype running locally with localStorage.',
    'disclaimer.legal': 'All legal information is informational and does not constitute formal legal counsel.',
    'disclaimer.investment': 'Investment shares are a conceptual demonstration only. No payments are processed online.',
    
    // Footer
    'footer.description': 'El-Hamd Real Estate Marketing, Investment & Legal Services — Your trusted property partner in Port Said and Port Fouad.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.contactUs': 'Contact Us in Port Said',
    'footer.address': 'El Gomhoureya St at Atef El Sadat, El Shark, Port Said, Egypt',
    'footer.phone': '+20 66 320 0000 / +20 100 123 4567',
    'footer.email': 'info@elhamd-realestate.com',
    'footer.rights': 'All rights reserved © El-Hamd Real Estate - Port Said',
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
