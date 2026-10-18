import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { SubmitPropertyPage } from './pages/SubmitPropertyPage';
import { LegalServicesPage } from './pages/LegalServicesPage';
import { InvestmentSharesPage } from './pages/InvestmentSharesPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-navy-900 font-sans selection:bg-gold-500 selection:text-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/submit-property" element={<SubmitPropertyPage />} />
          <Route path="/legal-services" element={<LegalServicesPage />} />
          <Route path="/investment-shares" element={<InvestmentSharesPage />} />
          <Route path="/account" element={<UserAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Admin Protected Route Guard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
