import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth, DEFAULT_ADMIN, DEFAULT_DEMO_USER } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, isAuthenticated, isAdmin, currentUser, logout } = useAuth();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get('redirect') || '';
  const messageParam = searchParams.get('message') || '';

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status & Feedback
  const [error, setError] = useState(messageParam);
  const [success, setSuccess] = useState('');

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setError(res.error || 'فشل تسجيل الدخول.');
      return;
    }

    setSuccess(language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
    setTimeout(() => {
      // Determine redirection based on role or param
      if (loginEmail.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase()) {
        navigate(redirectPath || '/admin');
      } else {
        navigate(redirectPath && !redirectPath.includes('/admin') ? redirectPath : '/account');
      }
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = register(regName, regEmail, regPhone, regPassword);
    if (!res.success) {
      setError(res.error || 'فشل إنشاء الحساب.');
      return;
    }

    setSuccess(language === 'ar' ? 'تم إنشاء الحساب وتسجيل الدخول بنجاح!' : 'Account registered successfully!');
    setTimeout(() => {
      navigate('/account');
    }, 600);
  };

  // Quick fill demo administrator account
  const handleQuickFillAdmin = () => {
    setMode('login');
    setLoginEmail(DEFAULT_ADMIN.email);
    setLoginPassword(DEFAULT_ADMIN.password || '');
    setError('');
  };

  // Quick fill demo regular user account
  const handleQuickFillDemoUser = () => {
    setMode('login');
    setLoginEmail(DEFAULT_DEMO_USER.email);
    setLoginPassword(DEFAULT_DEMO_USER.password || '');
    setError('');
  };

  return (
    <div className="min-h-screen bg-sand-50 py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group mb-4">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gold-500 shadow-xl group-hover:scale-105 transition-transform bg-navy-950">
              <img
                src="/logo.jpg"
                alt="الحمد للتسويق والاستثمار العقاري والقانوني - بورسعيد"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // graceful fallback
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-navy-950">
            {language === 'ar' ? 'الحمد للتسويق والاستثمار العقاري' : 'El-Hamd Real Estate'}
          </h1>
          <p className="text-xs text-gold-700 font-bold mt-1">
            {language === 'ar' ? 'بورسعيد • بورفؤاد' : 'Port Said • Port Fouad'}
          </p>
        </div>

        {/* If already authenticated, show status card */}
        {isAuthenticated && currentUser ? (
          <div className="bg-white rounded-3xl border border-sand-200 p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-navy-950">
              {language === 'ar' ? `مرحباً بك، ${currentUser.name}` : `Welcome, ${currentUser.name}`}
            </h2>
            <p className="text-xs text-navy-600">
              {currentUser.role === 'admin'
                ? language === 'ar'
                  ? 'أنت مسجل حالياً بصلاحية مدير النظام (Administrator).'
                  : 'You are signed in as an Administrator.'
                : language === 'ar'
                ? 'أنت مسجل حالياً بحساب مستخدم عادي.'
                : 'You are signed in as a regular user.'}
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-sm transition-all"
                >
                  {language === 'ar' ? 'الانتقال إلى لوحة الإدارة' : 'Go to Admin Portal'}
                </Link>
              )}
              <Link
                to="/account"
                className="w-full py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs transition-all"
              >
                {language === 'ar' ? 'الانتقال إلى حسابي' : 'Go to My Account'}
              </Link>
              <button
                onClick={logout}
                className="w-full py-2 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-card space-y-6">
            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-sand-100/80 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-navy-950 text-white shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-navy-950 text-white shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                {language === 'ar' ? 'حساب جديد' : 'Register'}
              </button>
            </div>

            {/* Error & Success Feedback Alerts */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@darestate.local"
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'كلمة المرور *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs sm:text-sm shadow-md shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{language === 'ar' ? 'دخول' : 'Sign In'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="مثال: محمد السيد البورسعيدي"
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                    <User className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1.5">
                    {language === 'ar' ? 'كلمة المرور *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-navy-400 absolute start-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs sm:text-sm shadow-md shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{language === 'ar' ? 'إنشاء حساب وتسجيل الدخول' : 'Register & Sign In'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Test Box */}
            <div className="pt-4 border-t border-sand-200 space-y-2.5">
              <span className="text-[11px] font-bold text-navy-500 block uppercase tracking-wider text-center">
                {language === 'ar' ? 'بيانات الحسابات التجريبية السريعة (للفحص)' : 'Quick Demo Credentials for Testing'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Admin Quick Fill */}
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  className="p-2.5 rounded-xl border border-gold-400/60 bg-gold-50/70 hover:bg-gold-100 text-start transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-navy-950 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                    <span>{language === 'ar' ? 'حساب المسؤول (Admin)' : 'Admin Demo'}</span>
                  </div>
                  <p className="text-[10px] text-navy-600 font-mono truncate" dir="ltr">
                    admin@darestate.local
                  </p>
                  <span className="text-[10px] text-gold-800 font-mono block">
                    Pass: Admin123!Temp
                  </span>
                </button>

                {/* User Quick Fill */}
                <button
                  type="button"
                  onClick={handleQuickFillDemoUser}
                  className="p-2.5 rounded-xl border border-sand-300 bg-sand-50 hover:bg-sand-100 text-start transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-navy-950 mb-0.5">
                    <User className="w-3.5 h-3.5 text-navy-600" />
                    <span>{language === 'ar' ? 'حساب مستخدم عادي' : 'User Demo'}</span>
                  </div>
                  <p className="text-[10px] text-navy-600 font-mono truncate" dir="ltr">
                    ahmed@elhamd.local
                  </p>
                  <span className="text-[10px] text-navy-500 font-mono block">
                    Pass: User123!Temp
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
