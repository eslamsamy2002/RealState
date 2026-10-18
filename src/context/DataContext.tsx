import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  Inquiry,
  LegalService,
  LegalRequest,
  InvestmentShare,
  InvestmentInquiry,
  UserProfile,
} from '../types';
import { INITIAL_PROPERTIES } from '../data/mockProperties';
import { INITIAL_LEGAL_SERVICES } from '../data/mockLegalServices';
import { INITIAL_INVESTMENTS } from '../data/mockInvestments';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Properties
  properties: Property[];
  publicApprovedProperties: Property[];
  userProperties: Property[];
  pendingProperties: Property[];
  addPropertySubmission: (data: Omit<Property, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'isUserSubmission'>) => Property;
  addPropertyDirectly: (property: Property) => void;
  updateProperty: (property: Property) => void;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string, reason?: string) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;

  // Inquiries
  inquiries: Inquiry[];
  userInquiries: Inquiry[];
  createInquiry: (data: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'userId'>) => Inquiry;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  // Legal Services
  legalServices: LegalService[];
  activeLegalServices: LegalService[];
  addLegalService: (service: Omit<LegalService, 'id'>) => LegalService;
  updateLegalService: (service: LegalService) => void;
  deleteLegalService: (id: string) => void;

  // Legal Requests
  legalRequests: LegalRequest[];
  userLegalRequests: LegalRequest[];
  createLegalRequest: (data: Omit<LegalRequest, 'id' | 'createdAt' | 'status' | 'userId'>) => LegalRequest;
  updateLegalRequestStatus: (id: string, status: LegalRequest['status']) => void;

  // Investments
  investments: InvestmentShare[];
  investmentInquiries: InvestmentInquiry[];
  userInvestmentInquiries: InvestmentInquiry[];
  createInvestmentInquiry: (data: Omit<InvestmentInquiry, 'id' | 'createdAt' | 'status' | 'userId'>) => InvestmentInquiry;
  updateInvestmentInquiryStatus: (id: string, status: InvestmentInquiry['status']) => void;

  // Current User
  currentUser: UserProfile;
  updateCurrentUser: (profile: Partial<UserProfile>) => void;

  // Reset
  resetDemoData: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-demo-1',
  name: 'أحمد مصطفى (بورسعيد)',
  phone: '+20 109 888 7777',
  email: 'ahmed@elhamd.local',
  role: 'user',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser: authUser } = useAuth();

  // Properties State
  const [properties, setProperties] = useState<Property[]>(() => {
    return getFromStorage<Property[]>(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    return getFromStorage<Inquiry[]>(STORAGE_KEYS.INQUIRIES, [
      {
        id: 'inq-seed-1',
        propertyId: 'prop-ps-1',
        propertyTitle: 'شقة فاخرة بإطلالة مباشرة بانورامية على مجرى قناة السويس بحي الشرق',
        propertyPrice: 5200000,
        inquiryType: 'buy',
        userName: 'أحمد مصطفى (بورسعيد)',
        userPhone: '+20 109 888 7777',
        userEmail: 'ahmed@elhamd.local',
        message: 'أرغب في حجز موعد لمعاينة الشقة المطلة على القناة بحي الشرق والاستفسار عن طرق السداد المتاحة.',
        createdAt: '2025-02-19T14:30:00Z',
        status: 'new',
        userId: 'user-demo-1',
      }
    ]);
  });

  // Legal Services State
  const [legalServices, setLegalServices] = useState<LegalService[]>(() => {
    return getFromStorage<LegalService[]>(STORAGE_KEYS.LEGAL_SERVICES, INITIAL_LEGAL_SERVICES);
  });

  // Legal Requests State
  const [legalRequests, setLegalRequests] = useState<LegalRequest[]>(() => {
    return getFromStorage<LegalRequest[]>(STORAGE_KEYS.LEGAL_REQUESTS, [
      {
        id: 'leg-seed-1',
        serviceId: 'legal-1',
        serviceTitle: 'فحص سند الملكية والتسلسل القانوني',
        userName: 'أحمد مصطفى (بورسعيد)',
        userPhone: '+20 109 888 7777',
        userEmail: 'ahmed@elhamd.local',
        propertyLocation: 'بورسعيد - حي الشرق / بورفؤاد',
        details: 'أريد تدقيق عقد بيع ابتدائي ومستندات ملكية فيلا في بورفؤاد قبل التوقيع وسداد الدفعة الأولى.',
        preferredTime: 'مساءً بعد الساعة 5',
        createdAt: '2025-02-18T11:20:00Z',
        status: 'pending',
        userId: 'user-demo-1',
      }
    ]);
  });

  // Investment Shares State
  const [investments] = useState<InvestmentShare[]>(() => {
    return getFromStorage<InvestmentShare[]>(STORAGE_KEYS.INVESTMENTS, INITIAL_INVESTMENTS);
  });

  // Investment Inquiries State
  const [investmentInquiries, setInvestmentInquiries] = useState<InvestmentInquiry[]>(() => {
    return getFromStorage<InvestmentInquiry[]>(STORAGE_KEYS.INVESTMENT_INQUIRIES, [
      {
        id: 'inv-inq-seed-1',
        investmentId: 'inv-ps-1',
        investmentTitle: 'مجمع تجاري ومقرات بنوك - تقاطع الثلاثيني مع محمد علي، حي العرب، بورسعيد',
        sharePrice: 40000,
        sharesRequested: 3,
        totalAmount: 120000,
        userName: 'أحمد مصطفى (بورسعيد)',
        userPhone: '+20 109 888 7777',
        userEmail: 'ahmed@elhamd.local',
        notes: 'مهتم بتفاصيل توزيع العوائد الإيجارية ربع السنوية للمجمع التجاري بحي العرب.',
        createdAt: '2025-02-17T09:15:00Z',
        status: 'new',
        userId: 'user-demo-1',
      }
    ]);
  });

  // User Profile State
  const [customProfile, setCustomProfile] = useState<UserProfile>(() => {
    return getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER);
  });

  // Active Effective User (if authenticated, use authUser)
  const activeUser: UserProfile = authUser
    ? {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        phone: authUser.phone || customProfile.phone,
        role: authUser.role,
      }
    : customProfile;

  // Save to storage on changes
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

  // Derived collections
  const publicApprovedProperties = properties.filter((p) => p.status === 'approved');
  const userProperties = properties.filter((p) => p.submittedByUserId === activeUser.id);
  const pendingProperties = properties.filter((p) => p.status === 'pending');
  const activeLegalServices = legalServices.filter((s) => s.isActive);
  const userInquiries = inquiries.filter((inq) => inq.userId === activeUser.id);
  const userLegalRequests = legalRequests.filter((req) => req.userId === activeUser.id);
  const userInvestmentInquiries = investmentInquiries.filter((inv) => inv.userId === activeUser.id);

  // Property Actions
  const addPropertySubmission = (
    data: Omit<Property, 'id' | 'createdAt' | 'status' | 'submittedByUserId' | 'isUserSubmission'>
  ): Property => {
    const newProperty: Property = {
      ...data,
      id: `prop-ps-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isUserSubmission: true,
      submittedByUserId: activeUser.id,
    };
    setProperties((prev) => [newProperty, ...prev]);
    return newProperty;
  };

  const addPropertyDirectly = (property: Property) => {
    setProperties((prev) => [property, ...prev]);
  };

  const updateProperty = (updated: Property) => {
    setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const approveProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved', rejectionReason: undefined } : p))
    );
  };

  const rejectProperty = (id: string, reason?: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: 'rejected', rejectionReason: reason || 'لم يستوفِ الشروط والضوابط المعتمدة ببورسعيد' }
          : p
      )
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const getPropertyById = (id: string): Property | undefined => {
    return properties.find((p) => p.id === id);
  };

  // Inquiry Actions
  const createInquiry = (
    data: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'userId'>
  ): Inquiry => {
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      userId: activeUser.id,
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  // Legal Services Actions
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

  // Legal Request Actions
  const createLegalRequest = (
    data: Omit<LegalRequest, 'id' | 'createdAt' | 'status' | 'userId'>
  ): LegalRequest => {
    const newRequest: LegalRequest = {
      ...data,
      id: `leg-req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      userId: activeUser.id,
    };
    setLegalRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateLegalRequestStatus = (id: string, status: LegalRequest['status']) => {
    setLegalRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
  };

  // Investment Inquiries Actions
  const createInvestmentInquiry = (
    data: Omit<InvestmentInquiry, 'id' | 'createdAt' | 'status' | 'userId'>
  ): InvestmentInquiry => {
    const newInquiry: InvestmentInquiry = {
      ...data,
      id: `inv-inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      userId: activeUser.id,
    };
    setInvestmentInquiries((prev) => [newInquiry, ...prev]);
    return newInquiry;
  };

  const updateInvestmentInquiryStatus = (id: string, status: InvestmentInquiry['status']) => {
    setInvestmentInquiries((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  };

  // Current User Action
  const updateCurrentUser = (profile: Partial<UserProfile>) => {
    setCustomProfile((prev) => ({ ...prev, ...profile }));
  };

  // Reset demo data to defaults
  const resetDemoData = () => {
    setProperties(INITIAL_PROPERTIES);
    setLegalServices(INITIAL_LEGAL_SERVICES);
    saveToStorage(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    saveToStorage(STORAGE_KEYS.LEGAL_SERVICES, INITIAL_LEGAL_SERVICES);
    saveToStorage(STORAGE_KEYS.INVESTMENTS, INITIAL_INVESTMENTS);
    setInquiries([]);
    setLegalRequests([]);
    setInvestmentInquiries([]);
    saveToStorage(STORAGE_KEYS.INQUIRIES, []);
    saveToStorage(STORAGE_KEYS.LEGAL_REQUESTS, []);
    saveToStorage(STORAGE_KEYS.INVESTMENT_INQUIRIES, []);
    setCustomProfile(DEFAULT_USER);
    saveToStorage(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER);
  };

  return (
    <DataContext.Provider
      value={{
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

        resetDemoData,
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
