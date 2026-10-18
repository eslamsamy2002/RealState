export const STORAGE_KEYS = {
  PROPERTIES: 'elhamd_properties_v2',
  INQUIRIES: 'elhamd_inquiries_v2',
  LEGAL_SERVICES: 'elhamd_legal_services_v2',
  LEGAL_REQUESTS: 'elhamd_legal_requests_v2',
  INVESTMENTS: 'elhamd_investments_v2',
  INVESTMENT_INQUIRIES: 'elhamd_investment_inquiries_v2',
  USER_PROFILE: 'elhamd_user_profile_v2',
  LANGUAGE: 'elhamd_language_v2',
  AUTH_SESSION: 'elhamd_auth_session_v2',
  REGISTERED_USERS: 'elhamd_registered_users_v2',
};

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}
