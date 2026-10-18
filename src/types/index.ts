export type PropertyType = 
  | 'apartment' 
  | 'villa' 
  | 'duplex' 
  | 'commercial_shop' 
  | 'office' 
  | 'clinic' 
  | 'chalet';

export type PropertyPurpose = 'sale' | 'rent';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export type PortSaidDistrict = 
  | 'حي الشرق'
  | 'حي العرب'
  | 'حي المناخ'
  | 'حي الضواحي'
  | 'حي الزهور'
  | 'حي الجنوب'
  | 'حي غرب'
  | 'بورفؤاد';

export interface PropertyLocation {
  city: string;
  cityEn?: string;
  district: string; // Port Said District
  districtEn?: string;
  address: string; // Specific street or landmark (demo)
}

export interface Property {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number; // in EGP
  rentFrequency?: 'monthly' | 'yearly';
  area: number; // in m2
  bedrooms: number;
  bathrooms: number;
  location: PropertyLocation;
  featured?: boolean;
  images: string[];
  primaryImage: string;
  status: ListingStatus;
  rejectionReason?: string;
  amenities: string[];
  finishingType?: string;
  floor?: number;
  yearBuilt?: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
  isUserSubmission?: boolean;
  submittedByUserId?: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  inquiryType: 'buy' | 'rent' | 'general';
  userName: string;
  userPhone: string;
  userEmail: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
  userId?: string;
}

export interface LegalService {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  iconName: string;
  features: string[];
  featuresEn: string[];
  estimatedDuration: string;
  isActive: boolean;
}

export interface LegalRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  propertyLocation: string;
  details: string;
  preferredTime: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'resolved';
  userId?: string;
}

export interface InvestmentShare {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  location: string;
  locationEn: string;
  propertyType: string;
  propertyTypeEn: string;
  totalValue: number; // EGP
  sharePrice: number; // EGP
  totalShares: number;
  availableShares: number;
  minimumShares: number;
  expectedRoi: string;
  expectedRoiEn: string;
  payoutSchedule: string;
  payoutScheduleEn: string;
  tenantInfo: string;
  tenantInfoEn: string;
}

export interface InvestmentInquiry {
  id: string;
  investmentId: string;
  investmentTitle: string;
  sharePrice: number;
  sharesRequested: number;
  totalAmount: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified';
  userId?: string;
}

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface StoredUser extends AuthUser {
  password?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role?: UserRole;
}

export interface FilterState {
  purpose: 'all' | 'sale' | 'rent';
  type: string;
  location: string; // Port Said District filter
  minPrice: number | '';
  maxPrice: number | '';
  bedrooms: string;
  searchQuery: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'area_desc';
}
