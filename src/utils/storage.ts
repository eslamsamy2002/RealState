export const STORAGE_KEYS = {
  PROPERTIES: 'darestate_properties_v1',
  INQUIRIES: 'darestate_inquiries_v1',
  LEGAL_SERVICES: 'darestate_legal_services_v1',
  LEGAL_REQUESTS: 'darestate_legal_requests_v1',
  INVESTMENTS: 'darestate_investments_v1',
  INVESTMENT_INQUIRIES: 'darestate_investment_inquiries_v1',
  USER_PROFILE: 'darestate_user_profile_v1',
  LANGUAGE: 'darestate_language_v1',
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
