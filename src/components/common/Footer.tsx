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

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

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
                  {language === 'ar' ? 'أمان قانوني متخصص ببورسعيد' : 'Legal Security in Port Said'}
                </h4>
                <p className="text-xs text-navy-400 mt-0.5">
                  {language === 'ar' ? 'فحص سندات الملكية وتسجيل الشهر العقاري' : 'Title deed audit and notary registration'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'استثمار عقاري وتجاري وملاحي' : 'Commercial & Maritime Investments'}
                </h4>
                <p className="text-xs text-navy-400 mt-0.5">
                  {language === 'ar' ? 'حصص استثمارية في كبرى المراكز التجارية' : 'Fractional shares in prime commercial assets'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {language === 'ar' ? 'خبرة عميقة بأسواق بورسعيد' : 'Deep Port Said Market Expertise'}
                </h4>
                <p className="text-xs text-navy-400 mt-0.5">
                  {language === 'ar' ? 'استشارات ومعاينات فورية في كافة الأحياء' : 'Advisory across all 8 districts of Port Said'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info with Port Said Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400/70 bg-navy-900 shrink-0 shadow-lg">
                <img
                  src="/logo.jpg"
                  alt="الحمد للتسويق والاستثمار العقاري والقانوني - بورسعيد"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white block">
                  {language === 'ar' ? 'الحمد' : 'El-Hamd'}
                </span>
                <span className="text-xs text-gold-400 font-semibold block">
                  {language === 'ar'
                    ? 'للتسويق والاستثمار العقاري والقانوني'
                    : 'Real Estate, Investment & Legal Services'}
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-navy-300 leading-relaxed max-w-sm">
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
              <li>
                <Link to="/admin" className="hover:text-gold-300 transition-colors flex items-center gap-1">
                  <span>{t('nav.admin')}</span>
                  <ArrowUpRight className="w-3 h-3 text-gold-400" />
                </Link>
              </li>
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
                  {language === 'ar' ? 'فحص سندات الملكية ببورسعيد' : 'Title Deed Audit'}
                </Link>
              </li>
              <li>
                <Link to="/legal-services" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'صياغة عقود البيع والإيجار' : 'Contract Drafting'}
                </Link>
              </li>
              <li>
                <Link to="/legal-services" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'الشهر العقاري والتراخيص' : 'Notary Registration'}
                </Link>
              </li>
              <li>
                <Link to="/investment-shares" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'حصص المراكز التجارية' : 'Commercial Shares'}
                </Link>
              </li>
              <li>
                <Link to="/investment-shares" className="hover:text-gold-300 transition-colors">
                  {language === 'ar' ? 'استثمار المقرات الملاحية' : 'Maritime Office Shares'}
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
            <strong className="text-navy-300">
              {language === 'ar' ? 'تنويه قانوني واستثماري:' : 'Legal & Investment Notice:'}
            </strong>{' '}
            {t('disclaimer.legal')} {t('disclaimer.investment')}
          </p>
        </div>

        {/* Bottom Bar: Port Said Districts */}
        <div className="mt-6 pt-6 border-t border-navy-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-navy-400">
          <p>{t('footer.rights')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sand-300/80 text-[11px]">
            <span>حي الشرق</span>
            <span>•</span>
            <span>حي العرب</span>
            <span>•</span>
            <span>حي المناخ</span>
            <span>•</span>
            <span>حي الضواحي</span>
            <span>•</span>
            <span>حي الزهور</span>
            <span>•</span>
            <span>حي الجنوب</span>
            <span>•</span>
            <span>حي غرب</span>
            <span>•</span>
            <span>بورفؤاد</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
