import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  FileCheck,
  FileText,
  Scale,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const LegalServicesTeaser: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { activeLegalServices } = useData();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const topServices = activeLegalServices.slice(0, 3);

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

  return (
    <section className="py-16 bg-white border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
            <span>{language === 'ar' ? 'منظومة الأمان والتوثيق' : 'Safety & Legal Due Diligence'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mb-3">
            {t('heading.legalServicesTeaser')}
          </h2>
          <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
            {t('heading.legalServicesSubtitle')}
          </p>
        </div>

        {/* 3 Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {topServices.map((service) => (
            <div
              key={service.id}
              className="p-6 rounded-2xl bg-sand-50/60 border border-sand-200 hover:border-gold-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-sand-200 flex items-center justify-center mb-4 shadow-sm">
                  {getIcon(service.iconName)}
                </div>

                <h3 className="text-base font-bold text-navy-900 mb-2">
                  {language === 'ar' ? service.title : service.titleEn}
                </h3>

                <p className="text-xs text-navy-600 leading-relaxed mb-4">
                  {language === 'ar' ? service.description : service.descriptionEn}
                </p>

                <ul className="space-y-2 mb-6">
                  {(language === 'ar' ? service.features : service.featuresEn)
                    .slice(0, 3)
                    .map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-navy-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs">
                <span className="text-navy-500 font-medium">{service.estimatedDuration}</span>
                <Link
                  to="/legal-services"
                  className="font-bold text-gold-600 hover:text-gold-700 inline-flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'طلب استشارة' : 'Request Advice'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar for Legal Services */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-950 to-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-1">
              {language === 'ar'
                ? 'هل تحتاج إلى تدقيق عقد أو استشارة قانونية مخصصة؟'
                : 'Need custom contract review or notarization advice?'}
            </h3>
            <p className="text-xs sm:text-sm text-sand-300">
              {language === 'ar'
                ? 'فريق من الخبراء القانونيين في العقارات والشهر العقاري في انتظار استفسارك.'
                : 'Real estate legal professionals are available to review your documents.'}
            </p>
          </div>

          <Link
            to="/legal-services"
            className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm shrink-0 shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'حجز استشارة قانونية' : 'Book Legal Consultation'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
