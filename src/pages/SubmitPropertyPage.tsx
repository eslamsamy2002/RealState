import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { PropertyType, PropertyPurpose } from '../types';
import {
  PlusCircle,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const SAMPLE_IMAGES = [
  {
    labelAr: 'شقة فاخرة / ريسبشن واسع',
    labelEn: 'Luxury Apartment Living Room',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    labelAr: 'فيلا مستقلة مودرن بحمام سباحة',
    labelEn: 'Modern Villa with Pool',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
  {
    labelAr: 'محل تجاري / واجهة تسوق',
    labelEn: 'Commercial Storefront',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    labelAr: 'مكتب إداري مجهز',
    labelEn: 'Executive Modern Office',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SubmitPropertyPage: React.FC = () => {
  const { addPropertySubmission, currentUser } = useData();
  const { language, isRTL } = useLanguage();
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
  const [city, setCity] = useState('القاهرة');
  const [district, setDistrict] = useState('التجمع الخامس - القاهرة الجديدة');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [finishingType, setFinishingType] = useState('سوبر لوكس');
  const [contactName, setContactName] = useState(currentUser.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [contactEmail, setContactEmail] = useState(currentUser.email || '');

  // Amenities checklist
  const [amenities, setAmenities] = useState<string[]>([
    'مصعد كهربائي',
    'أمن وحراسة 24/7',
  ]);

  const [submittedPropertyId, setSubmittedPropertyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          ? 'يرجى إدخال بيانات الاتصال (الاسم ورقم الهاتف).'
          : 'Please enter your contact details (name and phone).'
      );
      return;
    }

    const created = addPropertySubmission({
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
        cityEn: city,
        district,
        districtEn: district,
        address: address.trim(),
      },
      featured: false,
      primaryImage: imageUrl.trim() || SAMPLE_IMAGES[0].url,
      images: [imageUrl.trim() || SAMPLE_IMAGES[0].url],
      amenities,
      finishingType,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
    });

    setSubmittedPropertyId(created.id);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* If successfully submitted: Confirmation Screen */}
        {submittedPropertyId ? (
          <div className="bg-white rounded-3xl border border-sand-200 p-8 sm:p-12 text-center shadow-card space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold inline-block">
                {language === 'ar' ? 'الحالة: قيد المراجعة والاعتماد' : 'Status: Pending Review'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-navy-950">
                {language === 'ar' ? 'تم استلام طلب إضافة العقار بنجاح!' : 'Listing Submitted Successfully!'}
              </h1>
              <p className="text-sm text-navy-600 max-w-lg mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'تم حفظ العقار بنجاح في النظام وتعيين حالته إلى "قيد المراجعة". لن يظهر العقار في القوائم العامة للزوار إلا بعد مراجعته واعتماده من قبل الإدارة لضمان جودة ومصداقية الإعلانات.'
                  : 'Your property has been submitted and marked as "Pending Review". It will become publicly visible once approved by an administrator to maintain high listing quality.'}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/account"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 transition-colors shadow-md"
              >
                {language === 'ar' ? 'متابعة حالة العقار في حسابي' : 'Track Status in My Account'}
              </Link>
              <Link
                to="/admin"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gold-500/50 bg-gold-50 text-navy-900 font-bold text-sm hover:bg-gold-100 transition-colors"
              >
                {language === 'ar' ? 'الانتقال للوحة الإدارة لمراجعته فوراً (تجريبي)' : 'Go to Admin Portal to Review Now'}
              </Link>
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
                {language === 'ar' ? 'اعرض عقارك للبيع أو الإيجار' : 'List Your Property for Sale or Rent'}
              </h1>
              <p className="text-xs sm:text-sm text-navy-600 mt-2 max-w-2xl">
                {language === 'ar'
                  ? 'أدخل بيانات عقارك بدقة للوصول إلى آلاف المشترين والمستأجرين المهتمين في مصر.'
                  : 'Provide accurate property details to connect with thousands of active buyers and tenants.'}
              </p>
            </div>

            {/* Prominent Admin Approval Disclaimer Notice */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5 shadow-sm">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-0.5">
                  {language === 'ar' ? 'تنويه هام بشأن اعتماد الإعلانات:' : 'Important Notice Regarding Listing Approvals:'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'يتم إدراج جميع العقارات الجديدة بحالة "قيد المراجعة (Pending Approval)" ولا تصبح مرئية للجمهور في صفحة العقارات إلا بعد قيام مسؤول المنصة بمراجعة البيانات واعتمادها. يمكنك اختبار هذه الدورة الكاملة مباشرة عبر لوحة الإدارة.'
                    : 'All submitted listings are saved with "Pending Approval" status and remain invisible to the public until approved by an administrator in the admin portal.'}
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
                        ? 'مثال: شقة للبيع بتشطيب فاخر وفيو مميز بالتجمع الخامس'
                        : 'e.g. Luxury Apartment for Sale with Garden View in New Cairo'
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

              {/* Section 3: Location */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '3. الموقع والعنوان في مصر' : '3. Location in Egypt'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'المدينة / المحافظة *' : 'City / Governorate *'}
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                    >
                      <option value="القاهرة">القاهرة (Cairo)</option>
                      <option value="الجيزة">الجيزة (Giza)</option>
                      <option value="العاصمة الإدارية">العاصمة الإدارية الجديدة (New Capital)</option>
                      <option value="الساحل الشمالي">الساحل الشمالي (North Coast)</option>
                      <option value="الإسكندرية">الإسكندرية (Alexandria)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'الحي / المنطقة *' : 'District *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="مثال: التجمع الخامس، المربع الذهبي"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'العنوان التفصيلي واسم الكمبوند أو الشارع *' : 'Detailed Address / Street *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: عمارة 14، شارع التسعين الجنوبي، بجوار مجمع المستشفيات"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
              </div>

              {/* Section 4: Property Image */}
              <div>
                <h3 className="text-base font-bold text-navy-950 border-b border-sand-200 pb-3 mb-5 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gold-600" />
                  <span>{language === 'ar' ? '4. صورة العقار' : '4. Property Photo'}</span>
                </h3>

                {/* Quick preset selector */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-navy-700 mb-2">
                    {language === 'ar' ? 'اختر صورة جاهزة عالية الجودة، أو ضع رابط صورتك أدناه:' : 'Quick sample image selection:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SAMPLE_IMAGES.map((sample, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImageUrl(sample.url)}
                        className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all group ${
                          imageUrl === sample.url
                            ? 'border-gold-500 ring-2 ring-gold-400/40 scale-102'
                            : 'border-sand-200 hover:border-gold-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={sample.url} alt={sample.labelAr} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-navy-950/80 text-[10px] text-white p-1 text-center truncate">
                          {language === 'ar' ? sample.labelAr : sample.labelEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'رابط الصورة (Image URL) *' : 'Image URL *'}
                  </label>
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
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
                    ? 'بالضغط على إرسال، فإنك توافق على شروط النشر والمراجعة الإدارية.'
                    : 'By submitting, you agree to review and publication standards.'}
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm shadow-lg shadow-gold-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                  <span>{language === 'ar' ? 'إرسال العقار للمراجعة والاعتماد' : 'Submit Listing for Approval'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
