import { supabase, isSupabaseConfigured } from './supabase';
import { Property, Inquiry, LegalRequest, InvestmentInquiry } from '../types';

// Convert DB row to Property
export const mapDbRowToProperty = (row: any): Property => {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en || undefined,
    description: row.description,
    descriptionEn: row.description_en || undefined,
    type: row.type,
    purpose: row.purpose,
    price: Number(row.price),
    rentFrequency: row.rent_frequency || undefined,
    area: Number(row.area),
    bedrooms: Number(row.bedrooms || 0),
    bathrooms: Number(row.bathrooms || 0),
    location: {
      city: row.city || 'بورسعيد',
      cityEn: row.city_en || 'Port Said',
      district: row.district,
      districtEn: row.district_en || undefined,
      address: row.address,
    },
    featured: Boolean(row.featured),
    images: Array.isArray(row.images) ? row.images : row.primary_image ? [row.primary_image] : [],
    primaryImage: row.primary_image,
    status: row.status,
    rejectionReason: row.rejection_reason || undefined,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    finishingType: row.finishing_type || undefined,
    floor: row.floor !== null && row.floor !== undefined ? Number(row.floor) : undefined,
    yearBuilt: row.year_built !== null && row.year_built !== undefined ? Number(row.year_built) : undefined,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    contactEmail: row.contact_email || '',
    createdAt: row.created_at,
    isUserSubmission: Boolean(row.is_user_submission),
    submittedByUserId: row.submitted_by_user_id || undefined,
  };
};

// Convert Property to DB row
export const mapPropertyToDbRow = (prop: Property): Record<string, any> => {
  return {
    id: prop.id,
    title: prop.title,
    title_en: prop.titleEn || null,
    description: prop.description,
    description_en: prop.descriptionEn || null,
    type: prop.type,
    purpose: prop.purpose,
    price: prop.price,
    rent_frequency: prop.rentFrequency || null,
    area: prop.area,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    city: prop.location.city,
    city_en: prop.location.cityEn || null,
    district: prop.location.district,
    district_en: prop.location.districtEn || null,
    address: prop.location.address,
    featured: Boolean(prop.featured),
    primary_image: prop.primaryImage,
    images: prop.images,
    status: prop.status,
    rejection_reason: prop.rejectionReason || null,
    amenities: prop.amenities,
    finishing_type: prop.finishingType || null,
    floor: prop.floor ?? null,
    year_built: prop.yearBuilt ?? null,
    contact_name: prop.contactName,
    contact_phone: prop.contactPhone,
    contact_email: prop.contactEmail || null,
    created_at: prop.createdAt,
    is_user_submission: Boolean(prop.isUserSubmission),
    submitted_by_user_id: prop.submittedByUserId || null,
  };
};

// ==========================================
// Properties Service
// ==========================================

export const fetchPublicApprovedPropertiesFromDb = async (): Promise<Property[]> => {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approved properties:', error);
    return [];
  }

  return (data || []).map(mapDbRowToProperty);
};

export const fetchAllPropertiesFromDb = async (): Promise<Property[]> => {
  if (!isSupabaseConfigured() || !supabase) return [];

  // Ensure any cached session is active and token attached
  try {
    await supabase.auth.getSession();
  } catch (_) {}

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin properties:', error);
    return [];
  }

  return (data || []).map(mapDbRowToProperty);
};

export const insertPropertySubmissionToDb = async (property: Property): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const row = mapPropertyToDbRow(property);
  row.status = 'pending'; // Enforce pending status strictly

  const { error } = await supabase.from('properties').insert([row]);
  if (error) {
    console.error('Error submitting property to database:', error);
    return false;
  }
  return true;
};

export const insertPropertyDirectlyToDb = async (property: Property): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const row = mapPropertyToDbRow(property);
  const { error } = await supabase.from('properties').insert([row]);
  if (error) {
    console.error('Error inserting property directly to database:', error);
    return false;
  }
  return true;
};

export const updatePropertyStatusInDb = async (
  id: string,
  status: Property['status'],
  rejectionReason?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const updates: Record<string, any> = {
    status,
    rejection_reason: status === 'rejected' ? rejectionReason || null : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('properties').update(updates).eq('id', id);
  if (error) {
    console.error('Error updating property status:', error);
    return false;
  }
  return true;
};

export const updatePropertyInDb = async (property: Property): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const row = mapPropertyToDbRow(property);
  const { error } = await supabase.from('properties').update(row).eq('id', property.id);
  if (error) {
    console.error('Error updating property:', error);
    return false;
  }
  return true;
};

export const deletePropertyFromDb = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) {
    console.error('Error deleting property:', error);
    return false;
  }
  return true;
};

// ==========================================
// Inquiries Service
// ==========================================

export const insertInquiryToDb = async (inquiry: Inquiry): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('inquiries').insert([
    {
      id: inquiry.id,
      property_id: inquiry.propertyId,
      property_title: inquiry.propertyTitle,
      property_price: inquiry.propertyPrice,
      inquiry_type: inquiry.inquiryType,
      user_name: inquiry.userName,
      user_phone: inquiry.userPhone,
      user_email: inquiry.userEmail,
      message: inquiry.message,
      created_at: inquiry.createdAt,
      status: inquiry.status,
      user_id: inquiry.userId || null,
    },
  ]);

  if (error) {
    console.error('Error inserting inquiry:', error);
    return false;
  }
  return true;
};

export const fetchInquiriesFromDb = async (): Promise<Inquiry[]> => {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: row.property_title,
    propertyPrice: Number(row.property_price),
    inquiryType: row.inquiry_type,
    userName: row.user_name,
    userPhone: row.user_phone,
    userEmail: row.user_email || '',
    message: row.message,
    createdAt: row.created_at,
    status: row.status,
    userId: row.user_id,
  }));
};

export const updateInquiryStatusInDb = async (
  id: string,
  status: Inquiry['status']
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  return !error;
};

export const deleteInquiryFromDb = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  return !error;
};

// ==========================================
// Legal Requests Service
// ==========================================

export const insertLegalRequestToDb = async (request: LegalRequest): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('legal_requests').insert([
    {
      id: request.id,
      service_id: request.serviceId,
      service_title: request.serviceTitle,
      user_name: request.userName,
      user_phone: request.userPhone,
      user_email: request.userEmail,
      property_location: request.propertyLocation,
      details: request.details,
      preferred_time: request.preferredTime,
      created_at: request.createdAt,
      status: request.status,
      user_id: request.userId || null,
    },
  ]);

  return !error;
};

export const fetchLegalRequestsFromDb = async (): Promise<LegalRequest[]> => {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data, error } = await supabase
    .from('legal_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching legal requests:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    serviceId: row.service_id,
    serviceTitle: row.service_title,
    userName: row.user_name,
    userPhone: row.user_phone,
    userEmail: row.user_email || '',
    propertyLocation: row.property_location,
    details: row.details,
    preferredTime: row.preferred_time,
    createdAt: row.created_at,
    status: row.status,
    userId: row.user_id,
  }));
};

export const updateLegalRequestStatusInDb = async (
  id: string,
  status: LegalRequest['status']
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('legal_requests').update({ status }).eq('id', id);
  return !error;
};

// ==========================================
// Investment Inquiries Service
// ==========================================

export const insertInvestmentInquiryToDb = async (
  inquiry: InvestmentInquiry
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('investment_inquiries').insert([
    {
      id: inquiry.id,
      investment_id: inquiry.investmentId,
      investment_title: inquiry.investmentTitle,
      share_price: inquiry.sharePrice,
      shares_requested: inquiry.sharesRequested,
      total_amount: inquiry.totalAmount,
      user_name: inquiry.userName,
      user_phone: inquiry.userPhone,
      user_email: inquiry.userEmail,
      notes: inquiry.notes || null,
      created_at: inquiry.createdAt,
      status: inquiry.status,
      user_id: inquiry.userId || null,
    },
  ]);

  return !error;
};

export const fetchInvestmentInquiriesFromDb = async (): Promise<InvestmentInquiry[]> => {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data, error } = await supabase
    .from('investment_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching investment inquiries:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    investmentId: row.investment_id,
    investmentTitle: row.investment_title,
    sharePrice: Number(row.share_price),
    sharesRequested: Number(row.shares_requested),
    totalAmount: Number(row.total_amount),
    userName: row.user_name,
    userPhone: row.user_phone,
    userEmail: row.user_email || '',
    notes: row.notes,
    createdAt: row.created_at,
    status: row.status,
    userId: row.user_id,
  }));
};

export const updateInvestmentInquiryStatusInDb = async (
  id: string,
  status: InvestmentInquiry['status']
): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase
    .from('investment_inquiries')
    .update({ status })
    .eq('id', id);
  return !error;
};
