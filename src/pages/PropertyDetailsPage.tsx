import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  formatPrice,
  formatArea,
  getPropertyTypeLabel,
  getPurposeLabel,
  formatDate,
} from '../utils/formatters';
import { InquiryModal } from '../components/property/InquiryModal';
import { PropertyCard } from '../components/common/PropertyCard';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Building,
  User,
  Info,
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, publicApprovedProperties } = useData();
  const { language, isRTL } = useLanguage();

  const property = getPropertyById(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-sand-200 shadow-sm">
          <Info className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-950 mb-2">
            {language === 'ar' ? 'العقار غير موجود أو تم حذفه' : 'Property Not Found'}
          </h2>
          <p className="text-xs text-navy-600 mb-6">
            {language === 'ar'
              ? 'العقار الذي تبحث عنه غير متاح حالياً، أو قيد المراجعة الإدارية.'
              : 'The requested listing might have been removed or is pending approval.'}
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
          >
            <span>{language === 'ar' ? 'العودة لقائمة العقارات' : 'Back to Properties'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = language === 'en' && property.titleEn ? property.titleEn : property.title;
  const description =
    language === 'en' && property.descriptionEn ? property.descriptionEn : property.description;
  const district =
    language === 'en' && property.location.districtEn
      ? property.location.districtEn
      : property.location.district;
  const city =
    language === 'en' && property.location.cityEn
      ? property.location.cityEn
      : property.location.city;

  const images = property.images && property.images.length > 0 ? property.images : [property.primaryImage];
  const activeImage = images[selectedImageIndex] || property.primaryImage;

  // Calculate Price Per Square Meter
  const pricePerM2 = property.area > 0 ? Math.round(property.price / property.area) : 0;

  // Similar Properties
  const similarProperties = publicApprovedProperties
    .filter((p) => p.id !== property.id && (p.type === property.type || p.purpose === property.purpose))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    language === 'ar'
      ? `مرحباً، أنا مهتم بالعقار المعروض على دار إستيت: "${property.title}" (كود: ${property.id})، وأرغب في معرفة المزيد.`
      : `Hello, I'm interested in the property on DarEstate: "${property.titleEn || property.title}" (ID: ${property.id}).`
  );

  return (
    <div className="min-h-screen bg-sand-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-navy-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-gold-600 transition-colors">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-gold-600 transition-colors">
            {language === 'ar' ? 'العقارات' : 'Properties'}
          </Link>
          <span>/</span>
          <span className="text-navy-900 font-bold truncate max-w-xs">{title}</span>
        </nav>

        {/* Main Grid: Details (8 cols) + Contact Box (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Card */}
            <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card p-4 sm:p-6">
              {/* Main Featured Photo */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-sand-100 mb-4">
                <img
                  src={activeImage}
                  alt={title}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Purpose & Status Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-md ${
                        property.purpose === 'sale'
                          ? 'bg-navy-900 text-white'
                          : 'bg-gold-500 text-navy-950'
                      }`}
                    >
                      {getPurposeLabel(property.purpose, language)}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-navy-900 backdrop-blur-sm shadow-md">
                      {getPropertyTypeLabel(property.type, language)}
                    </span>
                  </div>

                  <div className="pointer-events-auto">
                    <StatusBadge status={property.status} />
                  </div>
                </div>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-gold-500 scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header & Specs Card */}
            <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-8 space-y-6">
              {/* Title & Location Header */}
              <div className="border-b border-sand-200 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-gold-700 font-bold mb-2">
                      <MapPin className="w-4 h-4 text-gold-600" />
                      <span>
                        {district} • {city}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-3xl font-black text-navy-950 leading-snug">
                      {title}
                    </h1>
                    <p className="text-xs sm:text-sm text-navy-500 mt-2">
                      {property.location.address}
                    </p>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="self-start px-3.5 py-2 rounded-xl border border-sand-300 hover:border-gold-500 text-xs font-semibold text-navy-700 hover:text-gold-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? (language === 'ar' ? 'تم نسخ الرابط!' : 'Copied!') : (language === 'ar' ? 'مشاركة' : 'Share')}</span>
                  </button>
                </div>

                {/* Price Display */}
                <div className="mt-6 flex flex-wrap items-baseline gap-4 pt-4 border-t border-sand-100">
                  <div className="text-2xl sm:text-4xl font-black text-navy-950">
                    {formatPrice(property.price, language)}
                  </div>
                  {property.purpose === 'rent' && property.rentFrequency && (
                    <span className="text-sm font-semibold text-navy-500">
                      / {language === 'ar' ? 'شهرياً' : 'monthly'}
                    </span>
                  )}
                  {property.purpose === 'sale' && pricePerM2 > 0 && (
                    <span className="text-xs text-navy-500 bg-sand-100 px-3 py-1 rounded-full font-medium">
                      ~ {formatPrice(pricePerM2, language)} / {language === 'ar' ? 'متر مربع' : 'm²'}
                    </span>
                  )}
                </div>
              </div>

              {/* Key Specs Matrix */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-4">
                  {language === 'ar' ? 'المواصفات الأساسية' : 'Key Specifications'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80 text-center">
                    <Maximize2 className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <span className="text-[11px] text-navy-500 block mb-0.5">
                      {language === 'ar' ? 'المساحة' : 'Area'}
                    </span>
                    <strong className="text-sm font-bold text-navy-950">
                      {formatArea(property.area, language)}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80 text-center">
                    <Bed className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <span className="text-[11px] text-navy-500 block mb-0.5">
                      {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                    </span>
                    <strong className="text-sm font-bold text-navy-950">
                      {property.bedrooms} {language === 'ar' ? 'غرف' : 'Beds'}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80 text-center">
                    <Bath className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <span className="text-[11px] text-navy-500 block mb-0.5">
                      {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                    </span>
                    <strong className="text-sm font-bold text-navy-950">
                      {property.bathrooms} {language === 'ar' ? 'حمام' : 'Baths'}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200/80 text-center">
                    <Layers className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                    <span className="text-[11px] text-navy-500 block mb-0.5">
                      {language === 'ar' ? 'الدور' : 'Floor'}
                    </span>
                    <strong className="text-sm font-bold text-navy-950">
                      {property.floor !== undefined
                        ? property.floor === 0
                          ? language === 'ar'
                            ? 'أرضي'
                            : 'Ground'
                          : `${property.floor}`
                        : '-'}
                    </strong>
                  </div>
                </div>

                {/* Additional Spec Pills */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {property.finishingType && (
                    <span className="px-3 py-1.5 rounded-xl bg-sand-100 text-navy-800 font-medium">
                      {language === 'ar' ? 'التشطيب:' : 'Finishing:'} {property.finishingType}
                    </span>
                  )}
                  {property.yearBuilt && (
                    <span className="px-3 py-1.5 rounded-xl bg-sand-100 text-navy-800 font-medium">
                      {language === 'ar' ? 'سنة البناء:' : 'Year Built:'} {property.yearBuilt}
                    </span>
                  )}
                  <span className="px-3 py-1.5 rounded-xl bg-sand-100 text-navy-800 font-medium">
                    {language === 'ar' ? 'تاريخ الإدراج:' : 'Listed on:'} {formatDate(property.createdAt, language)}
                  </span>
                </div>
              </div>

              {/* Property Description */}
              <div className="border-t border-sand-200 pt-6">
                <h3 className="text-base font-bold text-navy-950 mb-3">
                  {language === 'ar' ? 'وصف العقار ومميزاته' : 'Property Description'}
                </h3>
                <p className="text-xs sm:text-sm text-navy-700 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Amenities & Features */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="border-t border-sand-200 pt-6">
                  <h3 className="text-base font-bold text-navy-950 mb-4">
                    {language === 'ar' ? 'المرافق والتجهيزات' : 'Amenities & Facilities'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-sand-50 border border-sand-200/70 text-xs sm:text-sm text-navy-800 font-medium"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Legal Safety Notice Card */}
            <div className="bg-sand-100/70 rounded-3xl border border-sand-200 p-6 flex items-start gap-4">
              <ShieldCheck className="w-7 h-7 text-gold-600 shrink-0 mt-1" />
              <div className="space-y-1 text-xs text-navy-700">
                <h4 className="font-bold text-navy-950 text-sm">
                  {language === 'ar' ? 'نصيحة دار إستيت للأمان العقاري' : 'DarEstate Real Estate Safety Advisory'}
                </h4>
                <p className="leading-relaxed">
                  {language === 'ar'
                    ? 'احرص دائماً على تدقيق تسلسل الملكية وفحص رخصة البناء والتأكد من مطابقة الوحدة للتراخيص قبل توقيع العقود النهائية. يمكنك الاستعانة بخدماتنا القانونية لمراجعة أوراق هذا العقار رسمياً.'
                    : 'Always verify chain of ownership and municipal building conformity before signing agreements. You can request our legal due diligence service directly.'}
                </p>
                <div className="pt-2">
                  <Link
                    to="/legal-services"
                    className="text-gold-700 hover:text-gold-800 font-bold underline inline-flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'طلب فحص أوراق هذا العقار' : 'Request document audit for this property'}</span>
                    <ArrowIcon className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Contact & Express Interest (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-white rounded-3xl border border-sand-200 shadow-card p-6 space-y-6">
              {/* Price summary pill */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-950 to-navy-900 text-white text-center">
                <span className="text-xs text-sand-300 block mb-1">
                  {language === 'ar' ? 'السعر الإجمالي المطلوب' : 'Total Asking Price'}
                </span>
                <div className="text-2xl font-black text-gold-300">
                  {formatPrice(property.price, language)}
                </div>
              </div>

              {/* Express Interest Primary CTA */}
              <div className="space-y-3">
                <button
                  onClick={() => setInquiryModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm shadow-lg shadow-gold-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {language === 'ar'
                      ? property.purpose === 'rent'
                        ? 'طلب استئجار ومعاينة'
                        : 'طلب شراء ومعاينة'
                      : 'Express Interest / Schedule Viewing'}
                  </span>
                </button>

                {/* WhatsApp Direct Chat */}
                <a
                  href={`https://wa.me/201001234567?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ar' ? 'محادثة عبر واتساب' : 'Chat via WhatsApp'}</span>
                </a>

                {/* Phone Call Button */}
                <a
                  href={`tel:${property.contactPhone}`}
                  className="w-full py-3 px-4 rounded-2xl border border-sand-300 hover:bg-sand-50 text-navy-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gold-600" />
                  <span dir="ltr">{property.contactPhone}</span>
                </a>
              </div>

              {/* Advertiser Info */}
              <div className="pt-6 border-t border-sand-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-navy-400 block mb-3">
                  {language === 'ar' ? 'معلومات المعلن والمستشار' : 'Advertiser Information'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-6 h-6 text-navy-700" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-navy-950 truncate">
                      {property.contactName}
                    </h4>
                    <p className="text-xs text-navy-500 truncate">{property.contactEmail}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                      {language === 'ar' ? 'معلن معتمد' : 'Verified Agent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-sand-200">
            <h2 className="text-xl sm:text-2xl font-black text-navy-950 mb-6">
              {language === 'ar' ? 'عقارات مشابهة قد تناسبك' : 'Similar Properties You May Like'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similar) => (
                <PropertyCard
                  key={similar.id}
                  property={similar}
                  onQuickInquiry={() => setInquiryModalOpen(true)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        property={property}
      />
    </div>
  );
};
