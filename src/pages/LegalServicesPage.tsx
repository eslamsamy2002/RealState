import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  FileCheck,
  FileText,
  Scale,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  User,
  Mail,
  HelpCircle,
} from 'lucide-react';

export const LegalServicesPage: React.FC = () => {
  const { activeLegalServices, createLegalRequest, currentUser } = useData();
  const { language } = useLanguage();

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState(
    activeLegalServices[0]?.id || ''
  );
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [propertyLocation, setPropertyLocation] = useState('التجمع الخامس، القاهرة');
  const [details, setDetails] = useState('');
  const [preferredTime, setPreferredTime] = useState('مساءً (4 - 8 مساءً)');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const getIcon = (name: string) => {
    switch (name) {
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-gold-600" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-gold-600" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-gold-600" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-gold-600" />;
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    // Smooth scroll down to consultation form
    const formElement = document.getElementById('consultation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال اسمك، رقم هاتفك، وشرح مختصر لاحتياجاتك القانونية.'
          : 'Please enter your name, phone, and brief description of your request.'
      );
      return;
    }

    const selectedService = activeLegalServices.find((s) => s.id === selectedServiceId);
    const serviceTitle = selectedService
      ? language === 'ar'
        ? selectedService.title
        : selectedService.titleEn
      : 'استشارة قانونية عامة';

    createLegalRequest({
      serviceId: selectedServiceId,
      serviceTitle,
      userName: name.trim(),
      userPhone: phone.trim(),
      userEmail: email.trim(),
      propertyLocation: propertyLocation.trim(),
      details: details.trim(),
      preferredTime,
    });

    setSubmitted(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
            <span>{language === 'ar' ? 'الخدمات والاستشارات القانونية العقارية' : 'Real Estate Legal Services'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy-950 mb-3">
            {language === 'ar'
              ? 'حماية قانونية متكاملة لمعاملاتك العقارية في بورسعيد'
              : 'Complete Legal Protection for Real Estate Transactions in Port Said'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            {language === 'ar'
              ? 'نوفر لك ولعائلتك راحة البال التامة عبر تدقيق سندات الملكية، وصياغة ومراجعة عقود البيع والشراء والإيجار، وتوجيهك خطوة بخطوة في إجراءات الشهر العقاري والتسجيل والتصالح بأحياء بورسعيد.'
              : 'Comprehensive due diligence, contract auditing, and registry guidance to ensure seamless and safe transactions in Port Said.'}
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <p className="font-bold mb-0.5">
              {language === 'ar' ? 'إخلاء مسؤولية وتنويه قانوني هام:' : 'Important Legal Notice & Advisory:'}
            </p>
            <p>
              {language === 'ar'
                ? 'جميع الخدمات والاستشارات المذكورة على هذه المنصة تهدف إلى توجيه وإرشاد المتعاملين وفحص المستندات العقارية، وتخضع للإجراءات والتوثيق الرسمي أمام الجهات القضائية ومكاتب الشهر العقاري المختصة بمحافظة بورسعيد.'
                : 'All services listed provide guidance and document verification for real estate buyers and sellers, subject to official notarial procedures in Port Said.'}
            </p>
          </div>
        </div>

        {/* Dynamic Legal Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeLegalServices.map((service) => (
            <div
              key={service.id}
              className={`p-6 rounded-3xl bg-white border transition-all shadow-card flex flex-col justify-between ${
                selectedServiceId === service.id
                  ? 'border-gold-500 ring-2 ring-gold-400/20'
                  : 'border-sand-200 hover:border-gold-300'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center mb-4">
                  {getIcon(service.iconName)}
                </div>

                <h3 className="text-base font-bold text-navy-950 mb-2">
                  {language === 'ar' ? service.title : service.titleEn}
                </h3>

                <p className="text-xs text-navy-600 leading-relaxed mb-4">
                  {language === 'ar' ? service.description : service.descriptionEn}
                </p>

                <ul className="space-y-2 mb-6">
                  {(language === 'ar' ? service.features : service.featuresEn).map(
                    (feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-navy-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="pt-4 border-t border-sand-200">
                <div className="flex items-center justify-between text-xs mb-3 text-navy-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {service.estimatedDuration}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectService(service.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    selectedServiceId === service.id
                      ? 'bg-gold-500 text-navy-950 shadow-sm'
                      : 'bg-navy-900 text-white hover:bg-navy-800'
                  }`}
                >
                  {language === 'ar' ? 'اختيار هذه الخدمة' : 'Select Service'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Request Form Card */}
        <div id="consultation-form" className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-sand-200 shadow-card p-6 sm:p-10">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-navy-950">
                  {language === 'ar' ? 'تم استلام طلب الاستشارة بنجاح!' : 'Consultation Request Received!'}
                </h3>
                <p className="text-xs sm:text-sm text-navy-600 max-w-md mx-auto leading-relaxed">
                  {language === 'ar'
                    ? 'شكراً لثقتكم. تم تسجيل طلبك وتوجيهه إلى المستشار القانوني المختص بدار إستيت. سيتم التواصل معك هاتفياً في التوقيت المفضل لمناقشة أوراق العقار.'
                    : 'Your legal inquiry has been dispatched to our advisory desk. We will contact you at your preferred time.'}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setDetails('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
                  >
                    {language === 'ar' ? 'تقديم استفسار قانوني آخر' : 'Submit Another Request'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-navy-950 mb-1">
                    {language === 'ar' ? 'طلب استشارة قانونية مخصصة' : 'Request Legal Consultation'}
                  </h3>
                  <p className="text-xs text-navy-500">
                    {language === 'ar'
                      ? 'املأ النموذج التالي وسيقوم المستشار العقاري بمراجعة تفاصيل طلبك والتواصل معك.'
                      : 'Fill out the form below to receive dedicated real estate legal guidance.'}
                  </p>
                </div>

                {/* Service Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'نوع الخدمة القانونية المطلوبة *' : 'Selected Legal Service *'}
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                  >
                    {activeLegalServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {language === 'ar' ? s.title : s.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: أحمد عبد الله' : 'e.g. Ahmed Abdullah'}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Location & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'موقع العقار محل الاستشارة' : 'Property Location'}
                    </label>
                    <input
                      type="text"
                      value={propertyLocation}
                      onChange={(e) => setPropertyLocation(e.target.value)}
                      placeholder="مثال: الشيخ زايد، كمبوند الياسمين"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1.5">
                      {language === 'ar' ? 'التوقيت المفضل للتواصل' : 'Preferred Contact Window'}
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                    >
                      <option value="صباحاً (10 ص - 1 ظ)">{language === 'ar' ? 'صباحاً (10 ص - 1 ظ)' : 'Morning (10am - 1pm)'}</option>
                      <option value="ظهراً (1 ظ - 4 م)">{language === 'ar' ? 'ظهراً (1 ظ - 4 م)' : 'Afternoon (1pm - 4pm)'}</option>
                      <option value="مساءً (4 م - 8 م)">{language === 'ar' ? 'مساءً (4 م - 8 م)' : 'Evening (4pm - 8pm)'}</option>
                    </select>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'تفاصيل الاستفسار أو الأوراق المطلوب فحصها *' : 'Inquiry Details / Documents *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'اشرح بإيجاز نوع العقد أو المشكلة القانونية أو الاستفسار عن صحة ونفاذ أو تسجيل بالشهر العقاري...'
                        : 'Explain your contract query or registration guidance requirements...'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {error}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm shadow-lg shadow-gold-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إرسال طلب الاستشارة القانونية' : 'Submit Consultation Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
