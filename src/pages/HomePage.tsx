import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Property } from '../types';
import { HeroSearch } from '../components/home/HeroSearch';
import { CategoryPills } from '../components/home/CategoryPills';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { InvestmentTeaser } from '../components/home/InvestmentTeaser';
import { LegalServicesTeaser } from '../components/home/LegalServicesTeaser';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { InquiryModal } from '../components/property/InquiryModal';

export const HomePage: React.FC = () => {
  const { publicApprovedProperties } = useData();
  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero with Search Bar */}
      <HeroSearch />

      {/* Property Categories Quick Browse */}
      <CategoryPills />

      {/* Featured Properties Section */}
      <FeaturedSection
        properties={publicApprovedProperties}
        onQuickInquiry={(prop) => setSelectedPropertyForInquiry(prop)}
      />

      {/* Fractional Real Estate Investment Shares Teaser */}
      <InvestmentTeaser />

      {/* Comprehensive Legal Services Teaser */}
      <LegalServicesTeaser />

      {/* Why Choose Us & Seller Call To Action */}
      <WhyChooseUs />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={!!selectedPropertyForInquiry}
        onClose={() => setSelectedPropertyForInquiry(null)}
        property={selectedPropertyForInquiry}
      />
    </div>
  );
};
