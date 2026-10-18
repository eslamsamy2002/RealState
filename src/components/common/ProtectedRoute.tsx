import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, currentUser } = useAuth();
  const location = useLocation();
  const { language } = useLanguage();

  // If not logged in at all
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}&message=${encodeURIComponent(
          requireAdmin
            ? 'يرجى تسجيل الدخول بحساب المسؤول للوصول إلى لوحة الإدارة.'
            : 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة.'
        )}`}
        replace
      />
    );
  }

  // If requires admin role, but logged in user is a regular user
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to={`/account?error=${encodeURIComponent(
          language === 'ar'
            ? 'عذراً! حسابك الحالي كمستخدم لا يمتلك صلاحيات مدير النظام للوصول إلى لوحة الإدارة.'
            : 'Unauthorized: Your current account does not have administrator privileges.'
        )}`}
        replace
      />
    );
  }

  return <>{children}</>;
};
