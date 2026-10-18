import React, { useState, useEffect } from 'react';
import { Property, Inquiry } from '../../types';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { formatPrice } from '../../utils/formatters';
import { Building2, Send, CheckCircle2, Phone, Mail, User } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSuccess?: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  property,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const { createInquiry, currentUser } = useData();

  const [inquiryType, setInquiryType] = useState<'buy' | 'rent' | 'general'>('buy');
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (property) {
      setInquiryType(property.purpose === 'rent' ? 'rent' : 'buy');
      setMessage(
        language === 'ar'
          ? `مرحباً، أود الاستفسار عن تفاصيل "${property.title}" وتحديد موعد للمعاينة.`
          : `Hello, I would like to inquire about "${property.titleEn || property.title}" and schedule a viewing.`
      );
      setIsSubmitted(false);
      setError('');
    }
  }, [property, language]);

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال الاسم ورقم الهاتف على الأقل للتواصل.'
          : 'Please provide at least your name and phone number.'
      );
      return;
    }

    createInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyPrice: property.price,
      inquiryType,
      userName: name.trim(),
      userPhone: phone.trim(),
      userEmail: email.trim(),
      message: message.trim(),
    });

    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'ar' ? 'طلب معاينة أو إبداء اهتمام' : 'Express Interest / Schedule Viewing'}
      subtitle={property.title}
    >
      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-navy-950">
            {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Inquiry Submitted Successfully!'}
          </h4>
          <p className="text-sm text-navy-600 max-w-md mx-auto leading-relaxed">
            {language === 'ar'
              ? 'تم تسجيل اهتمامك بهذا العقار وحفظه في ملفك الشخصي. سيقوم مستشار دار إستيت بالتواصل معك هاتفياً أو عبر واتساب لمراجعة كافة التفاصيل وتحديد موعد المعاينة.'
              : 'Your inquiry has been recorded and saved to your account. A DarEstate advisor will reach out to schedule a private viewing and answer questions.'}
          </p>
          <div className="pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 transition-colors"
            >
              {language === 'ar' ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Summary Pill */}
          <div className="p-3 bg-sand-100/70 rounded-xl border border-sand-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-600 shrink-0" />
              <span className="text-xs text-navy-700 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                {property.location.district}
              </span>
            </div>
            <span className="text-sm font-black text-navy-950">
              {formatPrice(property.price, language)}
            </span>
          </div>

          {/* Inquiry Type Radio */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1.5">
              {language === 'ar' ? 'نوع الاهتمام' : 'Inquiry Intent'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'buy', label: language === 'ar' ? 'شراء' : 'Purchase' },
                { id: 'rent', label: language === 'ar' ? 'استئجار' : 'Rent' },
                { id: 'general', label: language === 'ar' ? 'استفسار عام' : 'General' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setInquiryType(opt.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    inquiryType === opt.id
                      ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                      : 'bg-white text-navy-700 border-sand-300 hover:bg-sand-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm text-navy-900"
                  placeholder={language === 'ar' ? 'مثال: محمد علي' : 'e.g. John Doe'}
                />
                <User className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 mb-1">
                {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm text-navy-900"
                  placeholder={language === 'ar' ? '010XXXXXXXX' : '+20 100 ...'}
                  dir="ltr"
                />
                <Phone className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">
              {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm text-navy-900"
                placeholder="name@example.com"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-navy-700 mb-1">
              {language === 'ar' ? 'الرسالة أو الأسئلة' : 'Message or Inquiries'}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm text-navy-900"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-sand-300 text-navy-700 text-xs font-bold hover:bg-sand-100 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-gold-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ar' ? 'إرسال طلب الاهتمام' : 'Send Inquiry'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
