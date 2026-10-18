import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-navy-950 text-sand-200 border-t border-navy-800">
      {/* Upper Footer: Value propositions */}
      <div className="border-b border-navy-900 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-start">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'أمان قانوني متكامل' : 'Comprehensive Legal Security'}
                </h4>
                <p className="text-xs text-navy-400 mt-0.5">
                  {language === 'ar' ? 'فحص سندات الملكية ومراجعة العقود بدقة' : 'Title deed audit and contract review'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'فرص استثمار عقاري واعدة' : 'Promising Real Estate Investments'}
                </h4>
                <p className="text-xs text-navy-400 mt-0.5">
                  {language === 'ar' ? 'استثمار جزئي في عقارات تجارية مدرّة للدخل' : 'Fractional investment in commercial real estate'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'خدمة عملاء ومستشارون معتمدون' : 'Certified Real Estate Advisors'}
                </h4>
                <p className="text-xs text-navy-400 mt-0.5">
                  {language === 'ar' ? 'استشارات مجانية لمعاينة أفضل العروض' : 'Free consultation for top property picks'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info with Current Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-400/80 bg-navy-900 shrink-0 shadow-md">
                <img
                  src="/logo.jpg"
                  alt="الحمد للتسويق والاستثمار العقاري"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black text-white">
                {language === 'ar' ? 'الحمد' : 'El-Hamd'}
              </span>
            </Link>
            <p className="text-sm text-navy-300 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="pt-2 text-xs text-gold-400/90 bg-gold-500/10 border border-gold-500/20 p-3 rounded-xl">
              <p className="font-semibold">{t('disclaimer.prototype')}</p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-300 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-gold-300 transition-colors">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link to="/submit-property" className="hover:text-gold-300 transition-colors">
                  {t('nav.submitProperty')}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-gold-300 transition-colors">
                  {t('nav.account')}
                </Link>
              </li>
              {/* Admin Link ONLY for Administrators */}
              {isAdmin && (
                <li>
                  <Link to="/admin" className="hover:text-gold-300 transition-colors flex items-center gap-1">
                    <span>{t('nav.admin')}</span>
                    <ArrowUpRight className="w-3 h-3 text-gold-400" />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Specialized Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/legal-services" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'فحص سندات الملكية' : 'Title Deed Audit'}
                </Link>
              </li>
              <li>
                <Link to="/legal-services" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'صياغة ومراجعة العقود' : 'Contract Drafting'}
                </Link>
              </li>
              <li>
                <Link to="/legal-services" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'إجراءات الشهر العقاري' : 'Notary Registration'}
                </Link>
              </li>
              <li>
                <Link to="/investment-shares" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'حصص الاستثمار التجاري' : 'Commercial Shares'}
                </Link>
              </li>
              <li>
                <Link to="/investment-shares" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'استثمار المجمعات الطبية' : 'Medical Hub Shares'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-3 text-xs text-navy-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span dir="ltr">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers Banner */}
        <div className="mt-12 pt-8 border-t border-navy-900 text-xs text-navy-400 space-y-2 leading-relaxed">
          <p>
            <strong className="text-navy-300">{language === 'ar' ? 'تنويه قانوني واستثماري:' : 'Legal & Investment Notice:'}</strong>{' '}
            {t('disclaimer.legal')} {t('disclaimer.investment')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-400">
          <p>{t('footer.rights')} 2025.</p>
          <div className="flex items-center gap-6">
            <span>حي الشرق • حي العرب • حي المناخ • حي الضواحي • حي الزهور • حي الجنوب • حي غرب • بورفؤاد</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
