import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Menu,
  X,
  Languages,
  ShieldCheck,
  TrendingUp,
  User,
  LayoutDashboard,
  Home,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { pendingProperties } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/properties', label: t('nav.properties'), icon: Layers },
    { to: '/legal-services', label: t('nav.legalServices'), icon: ShieldCheck },
    { to: '/investment-shares', label: t('nav.investmentShares'), icon: TrendingUp },
    { to: '/account', label: t('nav.account'), icon: User },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-navy-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-gold-300 transition-colors">
                {language === 'ar' ? 'دار إستيت' : 'DarEstate'}
              </span>
              <span className="text-[10px] sm:text-xs text-gold-400/80 font-medium tracking-wide">
                {language === 'ar' ? 'العقارات والاستثمار في مصر' : 'Egypt Real Estate & Investment'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-300 font-bold border border-gold-500/30'
                        : 'text-sand-200 hover:text-white hover:bg-navy-900/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            {/* Admin Link with Pending Count Badge */}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-sm'
                    : 'text-gold-400/90 border-gold-500/30 hover:bg-gold-500/10'
                }`
              }
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t('nav.admin')}</span>
              {pendingProperties.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {pendingProperties.length}
                </span>
              )}
            </NavLink>
          </nav>

          {/* Action Area: Submit Property CTA + Language Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-sand-200 hover:text-white hover:bg-navy-900 border border-navy-800 transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Languages className="w-4 h-4 text-gold-400" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Submit Property Button */}
            <Link
              to="/submit-property"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 shadow-md shadow-gold-500/20 hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>{t('nav.submitProperty')}</span>
            </Link>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-xl text-sand-200 hover:text-white hover:bg-navy-900 border border-navy-800 text-xs font-bold"
              aria-label="Toggle Language"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-navy-900 text-sand-200 hover:text-white hover:bg-navy-800 border border-navy-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-navy-800 bg-navy-950/98 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-300 font-bold border border-gold-500/30'
                      : 'text-sand-200 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gold-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              to="/admin"
              onClick={closeMenu}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-gold-300 bg-navy-900 border border-gold-500/20"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5 text-gold-400" />
                <span>{t('nav.admin')}</span>
              </div>
              {pendingProperties.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                  {pendingProperties.length} {language === 'ar' ? 'معلق' : 'pending'}
                </span>
              )}
            </Link>
          </div>

          <div className="pt-3 border-t border-navy-800">
            <Link
              to="/submit-property"
              onClick={closeMenu}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-md shadow-gold-500/20"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('nav.submitProperty')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
