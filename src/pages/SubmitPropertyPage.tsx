import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { PropertyType, PropertyPurpose } from '../types';
import { PORT_SAID_DISTRICTS } from '../data/portSaidLocations';
import { uploadPropertyImage } from '../services/storageService';
import {
  PlusCircle,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const SubmitPropertyPage: React.FC = () => {
  const { addPropertySubmission } = useData();
  const { language, isRTL } = useLanguage();
  const { currentUser: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('apartment');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [price, setPrice] = useState<number | ''>('');
  const [rentFrequency, setRentFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [area, setArea] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [city] = useState('بورسعيد');
  const [district, setDistrict] = useState('حي الشرق');
  const [address, setAddress] = useState('');
  const [finishingType, setFinishingType] = useState('سوبر لوكس');

  // Images state (file uploads & previews)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const confirmationRef = useRef<HTMLDivElement | null>(null);

  // Contact Info
  const [contactName, setContactName] = useState(authUser?.name || '');
  const [contactPhone, setContactPhone] = useState(authUser?.phone || '');
  const [contactEmail, setContactEmail] = useState(authUser?.email || '');

  // Amenities checklist
  const [amenities, setAmenities] = useState<string[]>([
    'مصعد كهربائي',
    'أمن وحراسة 24/7',
  ]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPropertyId, setSubmittedPropertyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [error, setError] = useState('');

  // Automatically scroll smoothly to top / confirmation section upon successful submission
  useEffect(() => {
    if (submittedPropertyId) {
      const scrollToTop = () => {
        if (confirmationRef.current) {
          confirmationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      };

      // Trigger scroll on next animation frame after DOM is updated
      const frameId = requestAnimationFrame(() => {
        scrollToTop();
      });

      // Backup timeout for mobile browsers where DOM layout reflow takes a moment
      const timer = setTimeout(scrollToTop, 80);

      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timer);
      };
    }
  }, [submittedPropertyId]);

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Handle local file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    setIsUploadingImage(true);

    const newUploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadPropertyImage(file);
      if (res.success && res.url) {
        newUploadedUrls.push(res.url);
      } else {
        setUploadError(res.error || 'فشل رفع إحدى الصور. يرجى التأكد من الحجم والصيغة.');
      }
    }

    if (newUploadedUrls.length > 0) {
      setUploadedImages((prev) => [...prev, ...newUploadedUrls]);
    }

    setIsUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    const clean = imageUrlInput.trim();
    if (!clean) return;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      setUploadError(
        language === 'ar'
          ? 'يرجى إدخال رابط صورة صحيح يبدأ بـ https://'
          : 'Please enter a valid image URL starting with https://'
      );
      return;
    }
    setUploadedImages((prev) => [...prev, clean]);
    setImageUrlInput('');
    setUploadError('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCopyId = () => {
    if (!submittedPropertyId) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(submittedPropertyId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !price || !area || !address.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى استكمال الحقول الإلزامية المطلوبة (العنوان، الوصف، السعر، المساحة، العنوان التفصيلي).'
          : 'Please fill in all required fields (title, description, price, area, address).'
      );
      return;
    }

    if (!contactName.trim() || !contactPhone.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال بيانات التواصل (الاسم ورقم الهاتف / واتساب).'
          : 'Please enter your contact details (name and phone).'
      );
      return;
    }

    const defaultFallbackImage =
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const finalImages = uploadedImages.length > 0 ? uploadedImages : [defaultFallbackImage];
    const primaryImage = finalImages[0];

    setIsSubmitting(true);
    try {
      const created = await addPropertySubmission({
        title: title.trim(),
        titleEn: title.trim(),
        description: description.trim(),
        descriptionEn: description.trim(),
        type,
        purpose,
        price: Number(price),
        rentFrequency: purpose === 'rent' ? rentFrequency : undefined,
        area: Number(area),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        location: {
          city,
          cityEn: 'Port Said',
          district,
          districtEn: district,
          address: address.trim(),
        },
        featured: false,
        primaryImage,
        images: finalImages,
        amenities,
        finishingType,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
      });

      setSubmittedPropertyId(created.id);
    } catch (err: any) {
      setError(
        err?.message ||
          (language === 'ar'
            ? 'حدث خطأ أثناء حفظ طلب إضافة العقار. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while submitting your property.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setArea('');
    setAddress('');
    setUploadedImages([]);
    setSubmittedPropertyId(null);
    setError('');
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* If successfully submitted: Confirmation Screen */}
        {submittedPropertyId ? (
          <div
            ref={confirmationRef}
            id="submission-confirmation"
            className="scroll-mt-24 bg-white rounded-3xl border border-sand-200 p-8 sm:p-12 text-center shadow-card space-y-6 animate-in zoom-in-95 duration-300"
          >
            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold inline-block">
                {language === 'ar' ? 'الحالة: قيد المراجعة الإدارية' : 'Status: Pending Administrator Review'}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
                {language === 'ar' ? 'تم استلام عقارك بنجاح!' : 'Listing Submitted Successfully!'}
              </h1>

              <p className="text-sm text-navy-600 max-w-lg mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'تم حفظ بيانات عقارك في النظام وتعيين حالته إلى "قيد المراجعة". لن يظهر العقار في القوائم العامة إلا بعد مراجعته واعتماده من قبل الإدارة لضمان جودة ومصداقية الإعلانات المعروضة في بورسعيد.'
                  : 'Your property has been saved with "Pending Review" status. It will become publicly visible once approved by an administrator to maintain high listing quality in Port Said.'}
              </p>
            </div>

            {/* Assigned Tracking ID Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-sand-100/80 border border-sand-200 flex items-center justify-between gap-3">
              <div className="text-right">
                <span className="text-[11px] font-bold text-navy-500 block">
                  {language === 'ar' ? 'الرقم المرجعي للعقار:' : 'Property Tracking ID:'}
                </span>
                <span className="text-base font-black text-navy-950 font-mono" dir="ltr">
                  {submittedPropertyId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="px-3 py-2 rounded-xl bg-white hover:bg-gold-50 text-navy-900 border border-sand-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copiedId ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-navy-600" />
                    <span>{language === 'ar' ? 'نسخ الكود' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/properties"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 transition-colors shadow-md"
              >
                {language === 'ar' ? 'تصفح العقارات المعتمدة' : 'Browse Verified Listings'}
              </Link>

              {isAuthenticated && (
                <Link
                  to="/account"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-sand-300 bg-white text-navy-900 font-bold text-sm hover:bg-sand-50 transition-colors"
                >
                  {language === 'ar' ? 'متابعة عقاراتي في حسابي' : 'Track in My Account'}
                </Link>
              )}

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gold-500/50 bg-gold-50 text-navy-950 font-bold text-sm hover:bg-gold-100 transition-colors"
              >
                {language === 'ar' ? 'إضافة عقار آخر' : 'Submit Another Property'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Page Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-3">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة عقار جديد' : 'Submit Property Listing'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-navy-950">
                {language === 'ar' ? 'اعرض عقارك في بورسعيد للبيع أو الإيجار' : 'List Your Port Said Property for Sale or Rent'}
              </h1>
              <p className="text-xs sm:text-sm text-navy-600 mt-2 max-w-2xl">
                {language === 'ar'
                  ? 'أدخل بيانات عقارك بدقة للوصول إلى المشترين والمستأجرين المهتمين. لا يُشترط إنشاء حساب لإضافة العقار.'
                  : 'Submit your property details to reach active buyers and tenants. Registration is completely optional.'}
              </p>
            </div>

            {/* Approval Notice */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5 shadow-sm">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-0.5">
                  {language === 'ar' ? 'تنويه هام بشأن نشر العقارات:' : 'Notice Regarding Listing Publication:'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'يتم إدراج جميع العقارات الجديدة بحالة "قيد المراجعة" لحماية المشترين والتأكد من مطابقة الأسعار والبيانات. تظهر العقارات فور قيام إدارة المنصة بمراجعتها واعتمادها.'
                    : 'All submitted listings are placed in "Pending Approval" status. They are published to the public website once vetted by platform administrators.'}
                </p>
              </div>
            </div>

            {/* Submission Form Card */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-10 space-y-8">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '1. البيانات الأساسية ونوع المعاملة' : '1. Basic Information'}</span>
                </h3>

                {/* Purpose Selector (Sale vs Rent) */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-navy-700 mb-2">
                    {language === 'ar' ? 'نوع المعاملة *' : 'Transaction Purpose *'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => setPurpose('sale')}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        purpose === 'sale'
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-sand-50 text-navy-700 border-sand-300 hover:bg-sand-100'
                      }`}
                    >
                      {language === 'ar' ? 'عقار للبيع (Sale)' : 'For Sale'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurpose('rent')}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        purpose === 'rent'
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-sand-50 text-navy-700 border-sand-300 hover:bg-sand-100'
                      }`}
                    >
                      {language === 'ar' ? 'عقار للإيجار (Rent)' : 'For Rent'}
                    </button>
                  </div>
                </div>

                {/* Property Title */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'عنوان الإعلان *' : 'Property Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'مثال: شقة للبيع بتشطيب فاخر وإطلالة مباشرة على القناة بحي الشرق'
                        : 'e.g. Luxury Apartment for Sale with Canal View in El Shark'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                {/* Property Type & Price Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'نوع العقار *' : 'Property Type *'}
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PropertyType)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                    >
                      <option value="apartment">{language === 'ar' ? 'شقة سكنية' : 'Apartment'}</option>
                      <option value="villa">{language === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                      <option value="duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                      <option value="commercial_shop">{language === 'ar' ? 'محل تجاري' : 'Commercial Shop'}</option>
                      <option value="office">{language === 'ar' ? 'مكتب إداري' : 'Administrative Office'}</option>
                      <option value="clinic">{language === 'ar' ? 'عيادة طبية' : 'Medical Clinic'}</option>
                      <option value="chalet">{language === 'ar' ? 'شاليه سياحي' : 'Chalet'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'السعر بالجنيه المصري (EGP) *' : 'Price in EGP *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="مثال: 4500000"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'وصف العقار التفصيلي *' : 'Detailed Description *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'اذكر تفاصيل العقار، التقسيم الداخلي، الإطلالة، شروط السداد، المزايا الإضافية...'
                        : 'Describe property features, layout, payment terms, views, etc.'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>

              {/* Section 2: Specifications & Dimensions */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '2. المواصفات والمساحة' : '2. Specifications & Dimensions'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'المساحة بالمتر المربع (م²) *' : 'Area in m² *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={area}
                      onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                      placeholder="مثال: 185"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'عدد غرف النوم' : 'Bedrooms'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'عدد الحمامات' : 'Bathrooms'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'نوع التشطيب' : 'Finishing Type'}
                    </label>
                    <select
                      value={finishingType}
                      onChange={(e) => setFinishingType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                    >
                      <option value="ألترا سوبر لوكس">{language === 'ar' ? 'ألترا سوبر لوكس' : 'Ultra Super Lux'}</option>
                      <option value="سوبر لوكس">{language === 'ar' ? 'سوبر لوكس' : 'Super Lux'}</option>
                      <option value="لوكس">{language === 'ar' ? 'لوكس' : 'Lux'}</option>
                      <option value="نصف تشطيب">{language === 'ar' ? 'نصف تشطيب (محارة وحلوق)' : 'Semi-Finished'}</option>
                      <option value="بدون تشطيب">{language === 'ar' ? 'على الطوب الأحمر' : 'Core & Shell'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Port Said District & Address */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '3. الموقع والحي في محافظة بورسعيد' : '3. Location in Port Said'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'المحافظة *' : 'Governorate *'}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={language === 'ar' ? 'محافظة بورسعيد' : 'Port Said Governorate'}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 bg-sand-100/70 font-semibold cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'الحي / المنطقة في بورسعيد *' : 'Port Said District *'}
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                      required
                    >
                      {PORT_SAID_DISTRICTS.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {language === 'ar' ? dist.nameAr : dist.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'العنوان التفصيلي واسم الشارع أو المعلم *' : 'Street / Landmark Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={
                      district === 'حي الشرق'
                        ? 'مثال: شارع عاطف السادات (طرح البحر)، بجوار ممشى ديليسبس'
                        : district === 'حي العرب'
                        ? 'مثال: شارع الثلاثيني، تقاطع محمد علي'
                        : district === 'بورفؤاد'
                        ? 'مثال: حي الفلل، بالقرب من نادي الصيد'
                        : 'مثال: الشارع الرئيسي، بالقرب من الخدمات'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>

              {/* Section 4: Property Images (Persistent File Upload) */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '4. صور العقار' : '4. Property Images'}</span>
                </h3>

                {/* File Upload Zone */}
                <div className="mb-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-sand-300 hover:border-gold-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-sand-50/50 hover:bg-gold-50/20 transition-all space-y-3"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-950">
                        {language === 'ar'
                          ? 'اضغط هنا لرفع صور العقار من جهازك'
                          : 'Click to upload property images from your device'}
                      </p>
                      <p className="text-xs text-navy-500 mt-1">
                        {language === 'ar'
                          ? 'الصيغ المدعومة: JPG، PNG، WEBP (الحد الأقصى 5 ميجابايت لكل صورة)'
                          : 'Supported: JPG, PNG, WEBP (Max 5MB per file)'}
                      </p>
                    </div>
                    {isUploadingImage && (
                      <div className="text-xs text-gold-700 font-bold animate-pulse">
                        {language === 'ar' ? 'جارٍ رفع الصورة وتأمينها...' : 'Uploading & securing image...'}
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="mt-2 text-xs text-rose-600 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {/* Uploaded Images Gallery Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <label className="block text-xs font-bold text-navy-700">
                      {language === 'ar'
                        ? `الصور المرفوعة (${uploadedImages.length}):`
                        : `Uploaded Images (${uploadedImages.length}):`}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-xl overflow-hidden aspect-[16/10] border border-sand-200 group bg-sand-100"
                        >
                          <img
                            src={imgUrl}
                            alt={`Uploaded ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1.5 start-1.5 px-2 py-0.5 rounded-md bg-navy-950/80 text-gold-300 text-[10px] font-bold">
                              {language === 'ar' ? 'الرئيسية' : 'Primary'}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 end-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
                            title={language === 'ar' ? 'حذف الصورة' : 'Remove Image'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional URL input as alternative */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-navy-600 mb-1.5">
                    {language === 'ar' ? 'أو يمكنك إضافة صورة عبر الرابط المباشر:' : 'Or add via image URL:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
                    >
                      {language === 'ar' ? 'إضافة الرابط' : 'Add URL'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 5: Contact Information */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '5. بيانات التواصل مع المعلن' : '5. Contact Details'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'اسم المعلن / المالك *' : 'Contact Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-navy-500">
                  {language === 'ar'
                    ? 'بالضغط على إرسال، فإنك توافق على مراجعة الإدارة واعتماد النشر.'
                    : 'By submitting, you agree to review and publication standards.'}
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm shadow-lg shadow-gold-500/25 transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || isUploadingImage ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {isSubmitting
                      ? language === 'ar'
                        ? 'جارٍ حفظ وإرسال العقار...'
                        : 'Submitting listing...'
                      : language === 'ar'
                      ? 'إرسال العقار للمراجعة والاعتماد'
                      : 'Submit Listing for Approval'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
