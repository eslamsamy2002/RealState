import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatPrice, formatDate, getPropertyTypeLabel, getPurposeLabel } from '../utils/formatters';
import {
  User,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  Edit2,
  RotateCcw,
  ExternalLink,
  Layers,
  Phone,
  Mail,
  AlertCircle,
  LogOut,
  LogIn,
  KeyRound,
} from 'lucide-react';

export const UserAccountPage: React.FC = () => {
  const {
    currentUser,
    updateCurrentUser,
    userProperties,
    userInquiries,
    userLegalRequests,
    userInvestmentInquiries,
    resetDemoData,
  } = useData();

  const { language } = useLanguage();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get('error');

  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries' | 'legal' | 'investments'>(
    'properties'
  );

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, phone, email });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Error / Unauthorized Banner if any */}
        {errorParam && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-3 shadow-sm animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorParam}</span>
          </div>
        )}

        {/* Top Profile Header Card */}
        <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-400 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                <User className="w-8 h-8" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-navy-950">
                    {currentUser.name}
                  </h1>
                  {isAdmin ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-300 text-xs font-bold">
                      {language === 'ar' ? 'مدير المنصة (Admin)' : 'Administrator'}
                    </span>
                  ) : isAuthenticated ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                      {language === 'ar' ? 'مستخدم مسجل' : 'Registered User'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-navy-600 text-xs font-semibold">
                      {language === 'ar' ? 'مستخدم تجريبي محلي' : 'Demo Account'}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-navy-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gold-600" />
                    <span dir="ltr">{currentUser.phone}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gold-600" />
                    <span>{currentUser.email}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-2 rounded-xl border border-sand-300 hover:border-gold-500 text-navy-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
                </Link>
              )}

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      language === 'ar'
                        ? 'هل تريد استعادة البيانات الافتراضية لمنصة بورسعيد ومسح التعديلات المحلية؟'
                        : 'Reset demo data to default Port Said seeded properties?'
                    )
                  ) {
                    resetDemoData();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-navy-600 hover:bg-sand-100 border border-sand-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Reset demo data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استعادة البيانات' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Inline Profile Edit Form */}
          {isEditingProfile && (
            <form
              onSubmit={handleSaveProfile}
              className="mt-6 pt-6 border-t border-sand-200 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200"
            >
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'الاسم' : 'Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  dir="ltr"
                  required
                />
              </div>
              <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-sand-300 text-xs font-bold text-navy-700"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold"
                >
                  {language === 'ar' ? 'حفظ البيانات' : 'Save'}
                </button>
              </div>
            </form>
          )}

          {/* Notice about localStorage */}
          <div className="mt-6 pt-4 border-t border-sand-100 flex items-center gap-2 text-xs text-navy-500">
            <AlertCircle className="w-4 h-4 text-gold-600 shrink-0" />
            <span>
              {language === 'ar'
                ? 'ملاحظة: يتم تخزين بيانات الحساب والإعلانات محلياً على متصفحك (localStorage) لأغراض العرض والتجربة فقط.'
                : 'Note: Profile and submission state are saved locally in browser localStorage for MVP demo purposes.'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-sand-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'properties'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'عقاراتي المعروضة' : 'My Listings'}</span>
            <span className="px-2 py-0.5 rounded-full bg-sand-200 text-navy-950 text-xs">
              {userProperties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'استفسارات الشراء والإيجار' : 'Property Inquiries'}</span>
            <span className="px-2 py-0.5 rounded-full bg-sand-200 text-navy-950 text-xs">
              {userInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'legal'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'الاستشارات القانونية' : 'Legal Requests'}</span>
            <span className="px-2 py-0.5 rounded-full bg-sand-200 text-navy-950 text-xs">
              {userLegalRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('investments')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeTab === 'investments'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'طلبات حصص الاستثمار' : 'Investment Inquiries'}</span>
            <span className="px-2 py-0.5 rounded-full bg-sand-200 text-navy-950 text-xs">
              {userInvestmentInquiries.length}
            </span>
          </button>
        </div>

        {/* Tab 1: User's Submitted Properties */}
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-950">
                {language === 'ar' ? 'قائمة العقارات التي قمت بطلب إدراجها' : 'Your Property Submissions'}
              </h2>
              <Link
                to="/submit-property"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة عقار جديد' : 'Submit Another Property'}</span>
              </Link>
            </div>

            {userProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-sand-100">
                        <img
                          src={prop.primaryImage}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-navy-900 text-white">
                            {getPurposeLabel(prop.purpose, language)}
                          </span>
                          <StatusBadge status={prop.status} size="sm" />
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-navy-500">
                          <span>{getPropertyTypeLabel(prop.type, language)}</span>
                          <span>{formatDate(prop.createdAt, language)}</span>
                        </div>

                        <h3 className="font-bold text-navy-950 text-base line-clamp-2">
                          {prop.title}
                        </h3>

                        <div className="text-lg font-black text-navy-900">
                          {formatPrice(prop.price, language)}
                        </div>

                        {/* Status Description Box */}
                        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            {prop.status === 'approved' && (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {language === 'ar' ? 'العقار معتمد ومنشور للعامة' : 'Live & Publicly Visible'}
                              </span>
                            )}
                            {prop.status === 'pending' && (
                              <span className="text-amber-700 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {language === 'ar' ? 'العقار قيد المراجعة الإدارية' : 'Pending Admin Verification'}
                              </span>
                            )}
                            {prop.status === 'rejected' && (
                              <span className="text-rose-700 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" />
                                {language === 'ar' ? 'تم رفض العقار من الإدارة' : 'Listing Rejected by Admin'}
                              </span>
                            )}
                          </div>
                          {prop.rejectionReason && (
                            <p className="text-rose-600 text-[11px] font-medium">
                              {language === 'ar' ? 'السبب:' : 'Reason:'} {prop.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-2">
                      <Link
                        to={`/properties/${prop.id}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-navy-900 text-white font-bold text-xs text-center hover:bg-navy-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'عرض الصفحة' : 'View Page'}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-md mx-auto">
                <Building2 className="w-12 h-12 text-navy-300 mx-auto mb-3" />
                <h3 className="font-bold text-navy-950 mb-1">
                  {language === 'ar' ? 'لم تقم بإضافة أي عقارات بعد' : 'No Properties Submitted Yet'}
                </h3>
                <p className="text-xs text-navy-500 mb-6">
                  {language === 'ar'
                    ? 'يمكنك عرض شقتك أو فيلتك أو محلك التجاري للبيع أو الإيجار بكل سهولة.'
                    : 'List your apartment, villa, or commercial shop in minutes.'}
                </p>
                <Link
                  to="/submit-property"
                  className="px-6 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إضافة أول عقار الآن' : 'Submit First Property'}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy-950">
              {language === 'ar' ? 'استفساراتك وطلبات المعاينة للعقارات' : 'Your Property Inquiries & Leads'}
            </h2>

            {userInquiries.length > 0 ? (
              <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card">
                <div className="divide-y divide-sand-200">
                  {userInquiries.map((inq) => (
                    <div key={inq.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-gold-700">
                            {inq.inquiryType === 'buy'
                              ? language === 'ar'
                                ? 'طلب شراء'
                                : 'Purchase Inquiry'
                              : inq.inquiryType === 'rent'
                              ? language === 'ar'
                                ? 'طلب إيجار'
                                : 'Rental Inquiry'
                              : language === 'ar'
                              ? 'استفسار عام'
                              : 'General Inquiry'}
                          </span>
                          <span className="text-navy-400">•</span>
                          <span className="text-navy-500">{formatDate(inq.createdAt, language)}</span>
                        </div>
                        <h3 className="font-bold text-navy-950 text-base">{inq.propertyTitle}</h3>
                        <p className="text-xs text-navy-600 bg-sand-50 p-2.5 rounded-xl border border-sand-200/80">
                          "{inq.message}"
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                        <span className="text-sm font-black text-navy-900">
                          {formatPrice(inq.propertyPrice, language)}
                        </span>
                        <Link
                          to={`/properties/${inq.propertyId}`}
                          className="px-3.5 py-1.5 rounded-xl border border-sand-300 hover:border-gold-500 text-xs font-bold text-navy-800 flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'تفاصيل العقار' : 'View Property'}</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-md mx-auto">
                <MessageSquare className="w-12 h-12 text-navy-300 mx-auto mb-3" />
                <h3 className="font-bold text-navy-950 mb-1">
                  {language === 'ar' ? 'لا توجد استفسارات شراء أو إيجار مسجلة' : 'No Inquiries Yet'}
                </h3>
                <p className="text-xs text-navy-500 mb-6">
                  {language === 'ar'
                    ? 'عند تصفحك للعقارات والضغط على زر "إبداء اهتمام"، ستظهر طلباتك هنا.'
                    : 'When you express interest in listings, they will appear here.'}
                </p>
                <Link
                  to="/properties"
                  className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs inline-flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تصفح العقارات الآن' : 'Browse Properties'}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Legal Requests */}
        {activeTab === 'legal' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy-950">
              {language === 'ar' ? 'طلبات الاستشارات والتدقيق القانوني' : 'Your Legal Consultation Requests'}
            </h2>

            {userLegalRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userLegalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-sand-200 p-6 shadow-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-navy-950 text-sm">{req.serviceTitle}</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                        {language === 'ar' ? 'قيد المتابعة' : 'Pending Follow-up'}
                      </span>
                    </div>

                    <div className="p-3 bg-sand-50 rounded-xl text-xs text-navy-700 space-y-1">
                      <p className="font-semibold text-navy-900">{req.propertyLocation}</p>
                      <p className="text-navy-600">"{req.details}"</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-navy-500 pt-2 border-t border-sand-100">
                      <span>{language === 'ar' ? 'التوقيت المفضل:' : 'Preferred Window:'} {req.preferredTime}</span>
                      <span>{formatDate(req.createdAt, language)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-md mx-auto">
                <ShieldCheck className="w-12 h-12 text-navy-300 mx-auto mb-3" />
                <h3 className="font-bold text-navy-950 mb-1">
                  {language === 'ar' ? 'لا توجد طلبات استشارات قانونية' : 'No Legal Requests'}
                </h3>
                <p className="text-xs text-navy-500 mb-6">
                  {language === 'ar'
                    ? 'اطلب فحص سند الملكية أو صياغة العقود لضمان سلامة صفقتك.'
                    : 'Request title deed verification or contract reviews.'}
                </p>
                <Link
                  to="/legal-services"
                  className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs inline-flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                  <span>{language === 'ar' ? 'طلب استشارة قانونية' : 'Explore Legal Services'}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Investment Inquiries */}
        {activeTab === 'investments' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy-950">
              {language === 'ar' ? 'طلبات حجز حصص الاستثمار العقاري الجزئي' : 'Your Fractional Investment Requests'}
            </h2>

            {userInvestmentInquiries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userInvestmentInquiries.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-3xl border border-sand-200 p-6 shadow-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-navy-950 text-sm">{inv.investmentTitle}</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        {language === 'ar' ? 'طلب مؤكد' : 'Confirmed Lead'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-sand-50 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-[10px] text-navy-400 block">{language === 'ar' ? 'سعر الحصة' : 'Share Price'}</span>
                        <strong className="text-navy-950 font-bold">{formatPrice(inv.sharePrice, language)}</strong>
                      </div>
                      <div className="border-x border-sand-200">
                        <span className="text-[10px] text-navy-400 block">{language === 'ar' ? 'الحصص المطلوبة' : 'Shares'}</span>
                        <strong className="text-navy-950 font-bold">{inv.sharesRequested}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-navy-400 block">{language === 'ar' ? 'إجمالي القيمة' : 'Total'}</span>
                        <strong className="text-gold-700 font-black">{formatPrice(inv.totalAmount, language)}</strong>
                      </div>
                    </div>

                    {inv.notes && (
                      <p className="text-xs text-navy-600 bg-white p-2 rounded-lg border border-sand-200">
                        "{inv.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-navy-500 pt-2 border-t border-sand-100">
                      <span>{formatDate(inv.createdAt, language)}</span>
                      <span className="text-gold-700 font-semibold">{language === 'ar' ? 'نموذج تجريبي' : 'Prototype Demo'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-sand-200 p-12 text-center max-w-md mx-auto">
                <TrendingUp className="w-12 h-12 text-navy-300 mx-auto mb-3" />
                <h3 className="font-bold text-navy-950 mb-1">
                  {language === 'ar' ? 'لا توجد طلبات استثمار جزئي مسجلة' : 'No Investment Inquiries'}
                </h3>
                <p className="text-xs text-navy-500 mb-6">
                  {language === 'ar'
                    ? 'استكشف الفرص الاستثمارية في المجمعات التجارية والمقرات الإدارية.'
                    : 'Explore commercial & office fractional opportunities.'}
                </p>
                <Link
                  to="/investment-shares"
                  className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs inline-flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-gold-400" />
                  <span>{language === 'ar' ? 'استكشف حصص الاستثمار' : 'View Investment Shares'}</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
