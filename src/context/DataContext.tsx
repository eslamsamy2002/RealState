import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Property,
  Inquiry,
  LegalService,
  LegalRequest,
  InvestmentShare,
  InvestmentInquiry,
  UserProfile,
} from '../types';
import { INITIAL_LEGAL_SERVICES } from '../data/mockLegalServices';
import { INITIAL_INVESTMENTS } from '../data/mockInvestments';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured, testSupabaseConnection } from '../services/supabase';
import {
  fetchPublicApprovedPropertiesFromDb,
  fetchAllPropertiesFromDb,
  insertPropertySubmissionToDb,
  insertPropertyDirectlyToDb,
  updatePropertyStatusInDb,
  updatePropertyInDb,
  deletePropertyFromDb,
  insertInquiryToDb,
  fetchInquiriesFromDb,
  updateInquiryStatusInDb,
  deleteInquiryFromDb,
  insertLegalRequestToDb,
  fetchLegalRequestsFromDb,
  updateLegalRequestStatusInDb,
  insertInvestmentInquiryToDb,
  fetchInvestmentInquiriesFromDb,
  updateInvestmentInquiryStatusInDb,
} from '../services/databaseService';

interface CloudStatus {
  isConfigured: boolean;
  isConnected: boolean;
  message: string;
}

interface DataContextType {
  // Cloud Connection Status
  cloudStatus: CloudStatus;
  refreshCloudData: () => Promise<void>;

  // Properties
  properties: Property[];
  publicApprovedProperties: Property[];
  userProperties: Property[];
  pendingProperties: Property[];
  addPropertySubmission: (
    data: Omit<Property, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'isUserSubmission'>
  ) => Promise<Property>;
  addPropertyDirectly: (property: Property) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string, reason?: string) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;

  // Inquiries
  inquiries: Inquiry[];
  userInquiries: Inquiry[];
  createInquiry: (data: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'userId'>) => Promise<Inquiry>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Legal Services
  legalServices: LegalService[];
  activeLegalServices: LegalService[];
  addLegalService: (service: Omit<LegalService, 'id'>) => LegalService;
  updateLegalService: (service: LegalService) => void;
  deleteLegalService: (id: string) => void;

  // Legal Requests
  legalRequests: LegalRequest[];
  userLegalRequests: LegalRequest[];
  createLegalRequest: (data: Omit<LegalRequest, 'id' | 'createdAt' | 'status' | 'userId'>) => Promise<LegalRequest>;
  updateLegalRequestStatus: (id: string, status: LegalRequest['status']) => Promise<void>;

  // Investments
  investments: InvestmentShare[];
  investmentInquiries: InvestmentInquiry[];
  userInvestmentInquiries: InvestmentInquiry[];
  createInvestmentInquiry: (
    data: Omit<InvestmentInquiry, 'id' | 'createdAt' | 'status' | 'userId'>
  ) => Promise<InvestmentInquiry>;
  updateInvestmentInquiryStatus: (id: string, status: InvestmentInquiry['status']) => Promise<void>;

  // Current User Profile
  currentUser: UserProfile;
  updateCurrentUser: (profile: Partial<UserProfile>) => void;
}

const DEFAULT_BLANK_USER: UserProfile = {
  id: 'guest',
  name: '',
  phone: '',
  email: '',
  role: 'user',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser: authUser, isAdmin } = useAuth();

  // Cloud Status State
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>({
    isConfigured: isSupabaseConfigured(),
    isConnected: false,
    message: isSupabaseConfigured()
      ? 'جارٍ الاتصال بقاعدة بيانات Supabase...'
      : 'لم يتم ربط خدمة Supabase بعد. يرجى إضافة مفاتيح VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env.',
  });

  // Properties State (defaults to storage cache or empty)
  const [properties, setProperties] = useState<Property[]>(() => {
    return getFromStorage<Property[]>(STORAGE_KEYS.PROPERTIES, []);
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    return getFromStorage<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
  });

  // Legal Services State
  const [legalServices, setLegalServices] = useState<LegalService[]>(() => {
    return getFromStorage<LegalService[]>(STORAGE_KEYS.LEGAL_SERVICES, INITIAL_LEGAL_SERVICES);
  });

  // Legal Requests State
  const [legalRequests, setLegalRequests] = useState<LegalRequest[]>(() => {
    return getFromStorage<LegalRequest[]>(STORAGE_KEYS.LEGAL_REQUESTS, []);
  });

  // Investment Shares Concept State
  const [investments] = useState<InvestmentShare[]>(() => {
    return getFromStorage<InvestmentShare[]>(STORAGE_KEYS.INVESTMENTS, INITIAL_INVESTMENTS);
  });

  // Investment Inquiries State
  const [investmentInquiries, setInvestmentInquiries] = useState<InvestmentInquiry[]>(() => {
    return getFromStorage<InvestmentInquiry[]>(STORAGE_KEYS.INVESTMENT_INQUIRIES, []);
  });

  // User Profile State
  const [customProfile, setCustomProfile] = useState<UserProfile>(() => {
    return getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_BLANK_USER);
  });

  // Active Effective User
  const activeUser: UserProfile = authUser
    ? {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        phone: authUser.phone || customProfile.phone,
        role: authUser.role,
      }
    : customProfile;

  // Refresh Cloud Data Callback
  const refreshCloudData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setCloudStatus({
        isConfigured: false,
        isConnected: false,
        message: 'بانتظار ربط Supabase: يرجى إضافة مفاتيح VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.',
      });
      return;
    }

    const testRes = await testSupabaseConnection();
    setCloudStatus({
      isConfigured: true,
      isConnected: testRes.connected,
      message: testRes.message,
    });

    if (testRes.connected) {
      try {
        if (isAdmin) {
          // Admin sees all properties, inquiries, requests from database
          const [dbProps, dbInqs, dbLegal, dbInvest] = await Promise.all([
            fetchAllPropertiesFromDb(),
            fetchInquiriesFromDb(),
            fetchLegalRequestsFromDb(),
            fetchInvestmentInquiriesFromDb(),
          ]);

          setProperties(dbProps);
          setInquiries(dbInqs);
          setLegalRequests(dbLegal);
          setInvestmentInquiries(dbInvest);
          saveToStorage(STORAGE_KEYS.PROPERTIES, dbProps);
          saveToStorage(STORAGE_KEYS.INQUIRIES, dbInqs);
          saveToStorage(STORAGE_KEYS.LEGAL_REQUESTS, dbLegal);
          saveToStorage(STORAGE_KEYS.INVESTMENT_INQUIRIES, dbInvest);
        } else {
          // Public visitor only gets approved properties
          const publicProps = await fetchPublicApprovedPropertiesFromDb();
          setProperties(publicProps);
          saveToStorage(STORAGE_KEYS.PROPERTIES, publicProps);
        }
      } catch (err) {
        console.error('Error syncing with Supabase:', err);
      }
    }
  }, [isAdmin]);

  // Initial cloud sync on mount and when admin changes
  useEffect(() => {
    refreshCloudData();
  }, [refreshCloudData]);

  // Local storage cache persistence
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROPERTIES, properties);
  }, [properties]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INQUIRIES, inquiries);
  }, [inquiries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LEGAL_SERVICES, legalServices);
  }, [legalServices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LEGAL_REQUESTS, legalRequests);
  }, [legalRequests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INVESTMENT_INQUIRIES, investmentInquiries);
  }, [investmentInquiries]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, customProfile);
  }, [customProfile]);

  // Derived Collections
  const publicApprovedProperties = properties.filter((p) => p.status === 'approved');
  const userProperties = activeUser.id && activeUser.id !== 'guest'
    ? properties.filter((p) => p.submittedByUserId === activeUser.id)
    : [];
  const pendingProperties = properties.filter((p) => p.status === 'pending');
  const activeLegalServices = legalServices.filter((s) => s.isActive);
  const userInquiries = activeUser.id && activeUser.id !== 'guest'
    ? inquiries.filter((inq) => inq.userId === activeUser.id)
    : [];
  const userLegalRequests = activeUser.id && activeUser.id !== 'guest'
    ? legalRequests.filter((req) => req.userId === activeUser.id)
    : [];
  const userInvestmentInquiries = activeUser.id && activeUser.id !== 'guest'
    ? investmentInquiries.filter((inv) => inv.userId === activeUser.id)
    : [];

  // ==========================================
  // Property Actions
  // ==========================================

  const addPropertySubmission = async (
    data: Omit<Property, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'isUserSubmission'>
  ): Promise<Property> => {
    const uniqueNum = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newProperty: Property = {
      ...data,
      id: `PROP-PS-${Date.now().toString(36).toUpperCase()}-${uniqueNum}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isUserSubmission: true,
      submittedByUserId: activeUser.id !== 'guest' ? activeUser.id : undefined,
    };

    setProperties((prev) => [newProperty, ...prev]);

    if (cloudStatus.isConnected) {
      await insertPropertySubmissionToDb(newProperty);
    }

    return newProperty;
  };

  const addPropertyDirectly = async (property: Property) => {
    setProperties((prev) => [property, ...prev]);

    if (cloudStatus.isConnected) {
      await insertPropertyDirectlyToDb(property);
    }
  };

  const updateProperty = async (updated: Property) => {
    setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    if (cloudStatus.isConnected) {
      await updatePropertyInDb(updated);
    }
  };

  const approveProperty = async (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved', rejectionReason: undefined } : p))
    );

    if (cloudStatus.isConnected) {
      await updatePropertyStatusInDb(id, 'approved');
    }
  };

  const rejectProperty = async (id: string, reason?: string) => {
    const cleanReason = reason || 'لم يستوفِ الشروط والضوابط المعتمدة في بورسعيد';
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected', rejectionReason: cleanReason } : p))
    );

    if (cloudStatus.isConnected) {
      await updatePropertyStatusInDb(id, 'rejected', cleanReason);
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));

    if (cloudStatus.isConnected) {
      await deletePropertyFromDb(id);
    }
  };

  const getPropertyById = (id: string): Property | undefined => {
    return properties.find((p) => p.id === id);
  };

  // ==========================================
  // Inquiry Actions
  // ==========================================

  const createInquiry = async (
    data: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'userId'>
  ): Promise<Inquiry> => {
    const newInquiry: Inquiry = {
      ...data,
      id: `INQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      userId: activeUser.id !== 'guest' ? activeUser.id : undefined,
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    if (cloudStatus.isConnected) {
      await insertInquiryToDb(newInquiry);
    }

    return newInquiry;
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));

    if (cloudStatus.isConnected) {
      await updateInquiryStatusInDb(id, status);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));

    if (cloudStatus.isConnected) {
      await deleteInquiryFromDb(id);
    }
  };

  // ==========================================
  // Legal Services Actions
  // ==========================================

  const addLegalService = (serviceData: Omit<LegalService, 'id'>): LegalService => {
    const newService: LegalService = {
      ...serviceData,
      id: `legal-${Date.now()}`,
    };
    setLegalServices((prev) => [...prev, newService]);
    return newService;
  };

  const updateLegalService = (updated: LegalService) => {
    setLegalServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteLegalService = (id: string) => {
    setLegalServices((prev) => prev.filter((s) => s.id !== id));
  };

  // ==========================================
  // Legal Request Actions
  // ==========================================

  const createLegalRequest = async (
    data: Omit<LegalRequest, 'id' | 'createdAt' | 'status' | 'userId'>
  ): Promise<LegalRequest> => {
    const newRequest: LegalRequest = {
      ...data,
      id: `LEG-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      userId: activeUser.id !== 'guest' ? activeUser.id : undefined,
    };

    setLegalRequests((prev) => [newRequest, ...prev]);

    if (cloudStatus.isConnected) {
      await insertLegalRequestToDb(newRequest);
    }

    return newRequest;
  };

  const updateLegalRequestStatus = async (id: string, status: LegalRequest['status']) => {
    setLegalRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));

    if (cloudStatus.isConnected) {
      await updateLegalRequestStatusInDb(id, status);
    }
  };

  // ==========================================
  // Investment Inquiries Actions
  // ==========================================

  const createInvestmentInquiry = async (
    data: Omit<InvestmentInquiry, 'id' | 'createdAt' | 'status' | 'userId'>
  ): Promise<InvestmentInquiry> => {
    const newInquiry: InvestmentInquiry = {
      ...data,
      id: `INV-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      userId: activeUser.id !== 'guest' ? activeUser.id : undefined,
    };

    setInvestmentInquiries((prev) => [newInquiry, ...prev]);

    if (cloudStatus.isConnected) {
      await insertInvestmentInquiryToDb(newInquiry);
    }

    return newInquiry;
  };

  const updateInvestmentInquiryStatus = async (
    id: string,
    status: InvestmentInquiry['status']
  ) => {
    setInvestmentInquiries((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );

    if (cloudStatus.isConnected) {
      await updateInvestmentInquiryStatusInDb(id, status);
    }
  };

  const updateCurrentUser = (profile: Partial<UserProfile>) => {
    setCustomProfile((prev) => ({ ...prev, ...profile }));
  };

  return (
    <DataContext.Provider
      value={{
        cloudStatus,
        refreshCloudData,

        properties,
        publicApprovedProperties,
        userProperties,
        pendingProperties,
        addPropertySubmission,
        addPropertyDirectly,
        updateProperty,
        approveProperty,
        rejectProperty,
        deleteProperty,
        getPropertyById,

        inquiries,
        userInquiries,
        createInquiry,
        updateInquiryStatus,
        deleteInquiry,

        legalServices,
        activeLegalServices,
        addLegalService,
        updateLegalService,
        deleteLegalService,

        legalRequests,
        userLegalRequests,
        createLegalRequest,
        updateLegalRequestStatus,

        investments,
        investmentInquiries,
        userInvestmentInquiries,
        createInvestmentInquiry,
        updateInvestmentInquiryStatus,

        currentUser: activeUser,
        updateCurrentUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
