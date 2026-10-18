import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Property, ListingStatus, LegalService } from '../types';
import { PORT_SAID_DISTRICTS } from '../data/portSaidLocations';
import { formatPrice, formatDate, getPropertyTypeLabel, getPurposeLabel } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit,
  PlusCircle,
  Building2,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  Eye,
  Filter,
  Check,
  Phone,
  Mail,
  User,
  Plus,
  LogOut,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    properties,
    approveProperty,
    rejectProperty,
    deleteProperty,
    updateProperty,
    addPropertyDirectly,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    legalRequests,
    updateLegalRequestStatus,
    investmentInquiries,
    updateInvestmentInquiryStatus,
    legalServices,
    addLegalService,
    updateLegalService,
    deleteLegalService,
    resetDemoData,
  } = useData();

  const { language } = useLanguage();
  const { currentUser, logout } = useAuth();

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<
    'submissions' | 'add-property' | 'inquiries' | 'legal-requests' | 'investments' | 'legal-content'
  >('submissions');

  // Filter for submissions
  const [submissionFilter, setSubmissionFilter] = useState<'all' | ListingStatus>('all');

  // Rejection Modal State
  const [rejectingPropertyId, setRejectingPropertyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('المستندات غير مكتملة أو السعر غير مطابق للواقع ببورسعيد');

  // Edit Property Modal State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Edit Legal Service Modal State
  const [editingLegalService, setEditingLegalService] = useState<LegalService | null>(null);
  const [isNewLegalService, setIsNewLegalService] = useState(false);

  // Add Direct Property Form State
  const [directTitle, setDirectTitle] = useState('');
  const [directType, setDirectType] = useState<Property['type']>('apartment');
  const [directPurpose, setDirectPurpose] = useState<Property['purpose']>('sale');
  const [directPrice, setDirectPrice] = useState<number | ''>('');
  const [directArea, setDirectArea] = useState<number | ''>('');
  const [directBeds, setDirectBeds] = useState(3);
  const [directBaths, setDirectBaths] = useState(2);
  const [directDistrict, setDirectDistrict] = useState('حي الشرق');
  const [directAddress, setDirectAddress] = useState('شارع عاطف السادات (طرح البحر)');
  const [directImage, setDirectImage] = useState(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  );
  const [directDescription, setDirectDescription] = useState('عقار استثماري متميز بتشطيب راقٍ وموقع استراتيجي.');
  const [directAddedFeedback, setDirectAddedFeedback] = useState(false);

  // Statistics KPIs
  const totalProps = properties.length;
  const pendingCount = properties.filter((p) => p.status === 'pending').length;
  const approvedCount = properties.filter((p) => p.status === 'approved').length;
  const totalInquiries = inquiries.length;
  const totalLegalRequests = legalRequests.length;
  const totalInvestLeads = investmentInquiries.length;

  // Filtered Submissions
  const filteredProperties = properties.filter((p) => {
    if (submissionFilter === 'all') return true;
    return p.status === submissionFilter;
  });

  const handleConfirmReject = () => {
    if (rejectingPropertyId) {
      rejectProperty(rejectingPropertyId, rejectionReason);
      setRejectingPropertyId(null);
    }
  };

  const handleSaveEditProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      updateProperty(editingProperty);
      setEditingProperty(null);
    }
  };

  const handleAddDirectProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directTitle.trim() || !directPrice || !directArea) return;

    const newProp: Property = {
      id: `prop-admin-${Date.now()}`,
      title: directTitle.trim(),
      titleEn: directTitle.trim(),
      description: directDescription.trim(),
      descriptionEn: directDescription.trim(),
      type: directType,
      purpose: directPurpose,
      price: Number(directPrice),
      area: Number(directArea),
      bedrooms: Number(directBeds),
      bathrooms: Number(directBaths),
      location: {
        city: 'بورسعيد',
        district: directDistrict,
        address: directAddress,
      },
      featured: true,
      primaryImage: directImage,
      images: [directImage],
      status: 'approved', // Direct admin entry is approved immediately
      amenities: ['أمن 24 ساعة', 'مصعد', 'جراج خاص', 'موقع استراتيجي ببورسعيد'],
      finishingType: 'سوبر لوكس',
      contactName: 'إدارة الحمد للعقارات',
      contactPhone: '+20 100 123 4567',
      contactEmail: 'admin@elhamd.local',
      createdAt: new Date().toISOString(),
    };

    addPropertyDirectly(newProp);
    setDirectAddedFeedback(true);
    setTimeout(() => setDirectAddedFeedback(false), 3000);
    // Reset form
    setDirectTitle('');
    setDirectPrice('');
    setDirectArea('');
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Prototype Header & Disclaimer Banner */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'لوحة تحكم المشرف (إصدار بورسعيد MVP)' : 'Admin Portal (Port Said MVP)'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {language === 'ar'
                  ? 'إدارة منصة الحمد للتسويق والاستثمار العقاري والقانوني - بورسعيد'
                  : 'El-Hamd Real Estate & Legal Admin Portal - Port Said'}
              </h1>
              <p className="text-xs sm:text-sm text-sand-300 max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'لوحة إدارة عقارات واستشارات محافظة بورسعيد وبورفؤاد: مراجعة واعتماد عقارات المستخدمين، إدارة طلبات المعاينة، الاستشارات القانونية، وحصص الاستثمار.'
                  : 'Demonstration console to test full real estate workflows: reviewing and approving listings, managing client inquiries, and legal services in Port Said.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {currentUser && (
                <button
                  onClick={logout}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      language === 'ar'
                        ? 'هل تريد إعادة ضبط جميع البيانات إلى النسخة الافتراضية لبورسعيد؟'
                        : 'Reset demo data to initial Port Said defaults?'
                    )
                  ) {
                    resetDemoData();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-gold-500 hover:text-navy-950 border border-navy-700 text-sand-300 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'ar' ? 'استعادة البيانات الافتراضية' : 'Reset Demo Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm text-center">
            <Building2 className="w-5 h-5 text-navy-600 mx-auto mb-1" />
            <span className="text-[11px] text-navy-500 block mb-0.5">
              {language === 'ar' ? 'إجمالي العقارات' : 'Total Properties'}
            </span>
            <strong className="text-xl font-black text-navy-950">{totalProps}</strong>
          </div>

          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              pendingCount > 0
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-white border-sand-200'
            }`}
          >
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <span className="text-[11px] text-amber-800 font-bold block mb-0.5">
              {language === 'ar' ? 'قيد المراجعة' : 'Pending Review'}
            </span>
            <strong className="text-xl font-black text-amber-700">{pendingCount}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-[11px] text-navy-500 block mb-0.5">
              {language === 'ar' ? 'العقارات المنشورة' : 'Approved & Live'}
            </span>
            <strong className="text-xl font-black text-emerald-700">{approvedCount}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm text-center">
            <MessageSquare className="w-5 h-5 text-gold-600 mx-auto mb-1" />
            <span className="text-[11px] text-navy-500 block mb-0.5">
              {language === 'ar' ? 'استفسارات العقارات' : 'Total Inquiries'}
            </span>
            <strong className="text-xl font-black text-navy-950">{totalInquiries}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm text-center">
            <ShieldCheck className="w-5 h-5 text-gold-600 mx-auto mb-1" />
            <span className="text-[11px] text-navy-500 block mb-0.5">
              {language === 'ar' ? 'طلبات قانونية' : 'Legal Requests'}
            </span>
            <strong className="text-xl font-black text-navy-950">{totalLegalRequests}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-sm text-center">
            <TrendingUp className="w-5 h-5 text-gold-600 mx-auto mb-1" />
            <span className="text-[11px] text-navy-500 block mb-0.5">
              {language === 'ar' ? 'طلبات الاستثمار' : 'Investment Leads'}
            </span>
            <strong className="text-xl font-black text-navy-950">{totalInvestLeads}</strong>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-sand-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'مراجعة وتعديل العقارات' : 'Listings & Moderation'}</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-amber-500 text-navy-950 text-xs font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('add-property')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'add-property'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'إضافة عقار مباشر (معتمد فوراً)' : 'Add Listing Directly'}</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'استفسارات المشترين والمستأجرين' : 'Property Leads'}</span>
            <span className="px-2 py-0.2 rounded-full bg-sand-200 text-navy-950 text-xs">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('legal-requests')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'legal-requests'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'الاستشارات القانونية' : 'Legal Inquiries'}</span>
            <span className="px-2 py-0.2 rounded-full bg-sand-200 text-navy-950 text-xs">
              {legalRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('investments')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'investments'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'طلبات حصص الاستثمار' : 'Investment Leads'}</span>
            <span className="px-2 py-0.2 rounded-full bg-sand-200 text-navy-950 text-xs">
              {investmentInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('legal-content')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'legal-content'
                ? 'bg-navy-950 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            <Edit className="w-4 h-4 text-gold-400" />
            <span>{language === 'ar' ? 'إدارة خدمات القانونية' : 'Legal Content'}</span>
          </button>
        </div>

        {/* Tab 1: Submissions Moderation & List */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Filter by Status Sub-bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sand-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-navy-500" />
                <span className="text-xs font-bold text-navy-700">
                  {language === 'ar' ? 'تصفية حسب الحالة:' : 'Filter by Status:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
                    { id: 'pending', label: language === 'ar' ? 'قيد المراجعة' : 'Pending' },
                    { id: 'approved', label: language === 'ar' ? 'معتمد ومنشور' : 'Approved' },
                    { id: 'rejected', label: language === 'ar' ? 'مرفوض' : 'Rejected' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSubmissionFilter(f.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        submissionFilter === f.id
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'bg-sand-100 text-navy-700 hover:bg-sand-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-navy-500">
                {language === 'ar' ? `المعروض: ${filteredProperties.length} عقار` : `Showing: ${filteredProperties.length}`}
              </span>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl border border-sand-200 p-5 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={prop.primaryImage}
                      alt={prop.title}
                      className="w-24 h-24 sm:w-32 sm:h-28 rounded-2xl object-cover shrink-0 bg-sand-100"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-navy-900 text-white">
                          {getPurposeLabel(prop.purpose, language)}
                        </span>
                        <span className="text-xs text-navy-500 font-medium">
                          {getPropertyTypeLabel(prop.type, language)} • {prop.area} م²
                        </span>
                        <StatusBadge status={prop.status} size="sm" />
                      </div>

                      <h3 className="font-bold text-navy-950 text-base leading-snug">
                        {prop.title}
                      </h3>

                      <div className="text-sm font-black text-navy-900">
                        {formatPrice(prop.price, language)}
                      </div>

                      <div className="text-xs text-navy-500">
                        {prop.location.district} • {prop.location.city} •{' '}
                        {language === 'ar' ? 'المعلن:' : 'Submitter:'} <strong>{prop.contactName}</strong> ({prop.contactPhone})
                      </div>

                      {prop.rejectionReason && (
                        <p className="text-xs text-rose-600 font-medium">
                          {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'} {prop.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Moderation Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center flex-wrap">
                    {/* Approve Action */}
                    {prop.status !== 'approved' && (
                      <button
                        onClick={() => approveProperty(prop.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        title="Approve Listing"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'ar' ? 'اعتماد ونشر للعامة' : 'Approve & Publish'}</span>
                      </button>
                    )}

                    {/* Reject Action */}
                    {prop.status !== 'rejected' && (
                      <button
                        onClick={() => setRejectingPropertyId(prop.id)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        title="Reject Listing"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{language === 'ar' ? 'رفض' : 'Reject'}</span>
                      </button>
                    )}

                    {/* Edit Action */}
                    <button
                      onClick={() => setEditingProperty(prop)}
                      className="p-2 rounded-xl border border-sand-300 text-navy-700 hover:bg-sand-100 transition-colors"
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete Action */}
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            language === 'ar'
                              ? 'هل أنت متأكد من حذف هذا العقار نهائياً؟'
                              : 'Permanently delete this property?'
                          )
                        ) {
                          deleteProperty(prop.id);
                        }
                      }}
                      className="p-2 rounded-xl border border-sand-300 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Add Direct Property (Admin) */}
        {activeTab === 'add-property' && (
          <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-10 shadow-card max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-black text-navy-950 mb-1">
                {language === 'ar' ? 'إضافة عقار مباشر كإدارة (معتمد ونشط فوراً)' : 'Add Direct Property (Immediately Published)'}
              </h2>
              <p className="text-xs text-navy-500">
                {language === 'ar'
                  ? 'يتم نشر هذا العقار مباشرة للجمهور دون الحاجة لمراجعة إضافية.'
                  : 'Direct admin listings are marked approved and visible immediately.'}
              </p>
            </div>

            {directAddedFeedback && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ar' ? 'تم إضافة العقار بنجاح وأصبح متاحاً في الموقع العام!' : 'Listing published directly!'}</span>
              </div>
            )}

            <form onSubmit={handleAddDirectProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'عنوان العقار *' : 'Property Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={directTitle}
                  onChange={(e) => setDirectTitle(e.target.value)}
                  placeholder="مثال: بنتهاوس فاخر بحمام سباحة خاص في الشيخ زايد"
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </label>
                  <select
                    value={directType}
                    onChange={(e) => setDirectType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 bg-white"
                  >
                    <option value="apartment">شقة سكنية</option>
                    <option value="villa">فيلا مستقلة</option>
                    <option value="duplex">دوبلكس</option>
                    <option value="commercial_shop">محل تجاري</option>
                    <option value="office">مكتب إداري</option>
                    <option value="chalet">شاليه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'المعاملة' : 'Purpose'}
                  </label>
                  <select
                    value={directPurpose}
                    onChange={(e) => setDirectPurpose(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 bg-white"
                  >
                    <option value="sale">للبيع (Sale)</option>
                    <option value="rent">للإيجار (Rent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'السعر (ج.م) *' : 'Price (EGP) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={directPrice}
                    onChange={(e) => setDirectPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'المساحة (م²) *' : 'Area (m²) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={directArea}
                    onChange={(e) => setDirectArea(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                  </label>
                  <input
                    type="number"
                    value={directBeds}
                    onChange={(e) => setDirectBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                  </label>
                  <input
                    type="number"
                    value={directBaths}
                    onChange={(e) => setDirectBaths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'الحي / المنطقة ببورسعيد *' : 'Port Said District *'}
                  </label>
                  <select
                    value={directDistrict}
                    onChange={(e) => setDirectDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900 bg-white"
                  >
                    {PORT_SAID_DISTRICTS.map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {language === 'ar' ? dist.nameAr : dist.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">
                    {language === 'ar' ? 'العنوان' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={directAddress}
                    onChange={(e) => setDirectAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={directImage}
                  onChange={(e) => setDirectImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs shadow-md flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إضافة العقار ونشره فوراً' : 'Publish Property Directly'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Buyer & Renter Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card">
            <div className="p-5 border-b border-sand-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-950">
                {language === 'ar' ? 'استفسارات وطلبات المشترين والمستأجرين' : 'Property Inquiries'}
              </h2>
              <span className="text-xs text-navy-500">{inquiries.length} {language === 'ar' ? 'طلب' : 'inquiries'}</span>
            </div>

            {inquiries.length > 0 ? (
              <div className="divide-y divide-sand-200">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-gold-700">{inq.inquiryType.toUpperCase()}</span>
                        <span className="text-navy-400">•</span>
                        <span className="text-navy-500">{formatDate(inq.createdAt, language)}</span>
                      </div>
                      <h3 className="font-bold text-navy-950 text-base">{inq.propertyTitle}</h3>
                      <p className="text-xs text-navy-700 bg-sand-50 p-2.5 rounded-xl border border-sand-200">
                        "{inq.message}"
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-navy-600 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-navy-400" />
                          <strong>{inq.userName}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-navy-400" />
                          <span dir="ltr">{inq.userPhone}</span>
                        </span>
                        {inq.userEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-navy-400" />
                            <span>{inq.userEmail}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                          inq.status === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : inq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="new">{language === 'ar' ? 'جديد (New)' : 'New'}</option>
                        <option value="contacted">{language === 'ar' ? 'تم التواصل (Contacted)' : 'Contacted'}</option>
                        <option value="closed">{language === 'ar' ? 'مكتمل (Closed)' : 'Closed'}</option>
                      </select>

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-1.5 rounded-lg border border-sand-300 text-rose-600 hover:bg-rose-50"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-navy-500">
                {language === 'ar' ? 'لا توجد استفسارات شراء أو إيجار حتى الآن.' : 'No property inquiries yet.'}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Legal Service Requests */}
        {activeTab === 'legal-requests' && (
          <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card">
            <div className="p-5 border-b border-sand-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-950">
                {language === 'ar' ? 'طلبات الاستشارات القانونية وتدقيق العقود' : 'Legal Service Requests'}
              </h2>
              <span className="text-xs text-navy-500">{legalRequests.length} {language === 'ar' ? 'طلب' : 'requests'}</span>
            </div>

            {legalRequests.length > 0 ? (
              <div className="divide-y divide-sand-200">
                {legalRequests.map((req) => (
                  <div key={req.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <span className="text-xs font-bold text-gold-700">{req.serviceTitle}</span>
                      <p className="text-xs text-navy-600 bg-sand-50 p-2.5 rounded-xl border border-sand-200">
                        "{req.details}"
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-navy-600">
                        <span><strong>{req.userName}</strong> ({req.userPhone})</span>
                        <span>{req.propertyLocation}</span>
                        <span>{language === 'ar' ? 'التوقيت المفضل:' : 'Preferred:'} {req.preferredTime}</span>
                        <span>{formatDate(req.createdAt, language)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <select
                        value={req.status}
                        onChange={(e) => updateLegalRequestStatus(req.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white"
                      >
                        <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                        <option value="contacted">{language === 'ar' ? 'تم التواصل' : 'Contacted'}</option>
                        <option value="resolved">{language === 'ar' ? 'تمت الإفادة والرد' : 'Resolved'}</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-navy-500">
                {language === 'ar' ? 'لا توجد طلبات استشارات قانونية حتى الآن.' : 'No legal requests yet.'}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Investment Shares Inquiries */}
        {activeTab === 'investments' && (
          <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card">
            <div className="p-5 border-b border-sand-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-950">
                {language === 'ar' ? 'طلبات المهتمين بحصص الاستثمار العقاري الجزئي' : 'Fractional Investment Leads'}
              </h2>
              <span className="text-xs text-navy-500">{investmentInquiries.length} {language === 'ar' ? 'مستثمر' : 'leads'}</span>
            </div>

            {investmentInquiries.length > 0 ? (
              <div className="divide-y divide-sand-200">
                {investmentInquiries.map((inv) => (
                  <div key={inv.id} className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <h3 className="font-bold text-navy-950 text-base">{inv.investmentTitle}</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="bg-sand-100 px-2.5 py-1 rounded-md font-bold text-navy-900">
                          {inv.sharesRequested} {language === 'ar' ? 'حصص' : 'shares'}
                        </span>
                        <strong className="text-gold-700 font-black">
                          {formatPrice(inv.totalAmount, language)}
                        </strong>
                      </div>
                      {inv.notes && (
                        <p className="text-xs text-navy-600 bg-sand-50 p-2 rounded-lg border border-sand-200">
                          "{inv.notes}"
                        </p>
                      )}
                      <div className="text-xs text-navy-500">
                        {inv.userName} • <span dir="ltr">{inv.userPhone}</span> • {formatDate(inv.createdAt, language)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                      <select
                        value={inv.status}
                        onChange={(e) => updateInvestmentInquiryStatus(inv.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white"
                      >
                        <option value="new">جديد (New)</option>
                        <option value="contacted">تم التواصل (Contacted)</option>
                        <option value="qualified">مؤهل للشراء (Qualified)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-navy-500">
                {language === 'ar' ? 'لا توجد طلبات استثمار حتى الآن.' : 'No investment leads yet.'}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Legal Services Content Manager */}
        {activeTab === 'legal-content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-sand-200">
              <div>
                <h2 className="text-base font-bold text-navy-950">
                  {language === 'ar' ? 'الخدمات القانونية المعروضة في الموقع' : 'Legal Services Catalogue'}
                </h2>
                <p className="text-xs text-navy-500">
                  {language === 'ar' ? 'يمكنك إضافة خدمات قانونية جديدة، تعديل نصوصها أو حذفها' : 'Add, edit, or remove legal services'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingLegalService({
                    id: '',
                    title: '',
                    titleEn: '',
                    description: '',
                    descriptionEn: '',
                    iconName: 'ShieldCheck',
                    features: ['فحص المستندات', 'إصدار تقرير سلامة'],
                    featuresEn: ['Document Audit', 'Safety Report'],
                    estimatedDuration: '24 ساعة',
                    isActive: true,
                  });
                  setIsNewLegalService(true);
                }}
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة خدمة قانونية جديدة' : 'Add New Service'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {legalServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-sand-200 p-6 shadow-card space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sand-100 text-navy-700">
                        {service.estimatedDuration}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          service.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {service.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </div>

                    <h3 className="font-bold text-navy-950 text-base">{service.title}</h3>
                    <p className="text-xs text-navy-600 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="pt-3 border-t border-sand-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingLegalService(service);
                        setIsNewLegalService(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-sand-300 text-navy-800 hover:bg-sand-100 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            language === 'ar'
                              ? 'هل أنت متأكد من حذف هذه الخدمة القانونية؟'
                              : 'Delete this legal service?'
                          )
                        ) {
                          deleteLegalService(service.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Rejection Reason */}
      <Modal
        isOpen={!!rejectingPropertyId}
        onClose={() => setRejectingPropertyId(null)}
        title={language === 'ar' ? 'تأكيد رفض العقار' : 'Reject Property Listing'}
      >
        <div className="space-y-4">
          <p className="text-xs text-navy-600 leading-relaxed">
            {language === 'ar'
              ? 'يرجى تحديد سبب الرفض ليظهر للمعلن في حسابه الشخصي لمعالجة النقص.'
              : 'Specify the rejection reason to inform the user in their account portal.'}
          </p>

          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">
              {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRejectingPropertyId(null)}
              className="px-4 py-2 rounded-xl border border-sand-300 text-xs font-bold text-navy-700"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
            >
              {language === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Edit Property */}
      {editingProperty && (
        <Modal
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          title={language === 'ar' ? 'تعديل بيانات العقار' : 'Edit Property Listing'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveEditProperty} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'عنوان الإعلان' : 'Title'}
              </label>
              <input
                type="text"
                value={editingProperty.title}
                onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)'}
                </label>
                <input
                  type="number"
                  value={editingProperty.price}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 mb-1">
                  {language === 'ar' ? 'المساحة (م²)' : 'Area (m²)'}
                </label>
                <input
                  type="number"
                  value={editingProperty.area}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, area: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                rows={3}
                value={editingProperty.description}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="feat-chk"
                checked={!!editingProperty.featured}
                onChange={(e) =>
                  setEditingProperty({ ...editingProperty, featured: e.target.checked })
                }
                className="w-4 h-4 rounded text-gold-600"
              />
              <label htmlFor="feat-chk" className="text-xs font-bold text-navy-800">
                {language === 'ar' ? 'تمييز العقار في الصفحة الرئيسية (Featured)' : 'Featured on Home'}
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 rounded-xl border border-sand-300 text-xs font-bold text-navy-700"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800"
              >
                {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Edit Legal Service */}
      {editingLegalService && (
        <Modal
          isOpen={!!editingLegalService}
          onClose={() => setEditingLegalService(null)}
          title={isNewLegalService ? 'إضافة خدمة قانونية' : 'تعديل الخدمة القانونية'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'اسم الخدمة (عربي)' : 'Title (AR)'}
              </label>
              <input
                type="text"
                value={editingLegalService.title}
                onChange={(e) =>
                  setEditingLegalService({ ...editingLegalService, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'اسم الخدمة (إنجليزي)' : 'Title (EN)'}
              </label>
              <input
                type="text"
                value={editingLegalService.titleEn}
                onChange={(e) =>
                  setEditingLegalService({ ...editingLegalService, titleEn: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                rows={3}
                value={editingLegalService.description}
                onChange={(e) =>
                  setEditingLegalService({ ...editingLegalService, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'المدة التقديرية' : 'Estimated Turnaround'}
              </label>
              <input
                type="text"
                value={editingLegalService.estimatedDuration}
                onChange={(e) =>
                  setEditingLegalService({
                    ...editingLegalService,
                    estimatedDuration: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs text-navy-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingLegalService(null)}
                className="px-4 py-2 rounded-xl border border-sand-300 text-xs font-bold text-navy-700"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isNewLegalService) {
                    addLegalService(editingLegalService);
                  } else {
                    updateLegalService(editingLegalService);
                  }
                  setEditingLegalService(null);
                }}
                className="px-5 py-2 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold"
              >
                {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
