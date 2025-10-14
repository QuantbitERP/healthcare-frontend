import { en } from './en';

// Type for the language object
export type Language = typeof en;

// Available languages
export const languages = {
  en,
  // Add more languages here as needed
  // hi: hindi,
  // es: spanish,
} as const;

// Default language
export const defaultLanguage: keyof typeof languages = 'en';

// Current language (can be made dynamic based on user preference)
let currentLanguage: keyof typeof languages = defaultLanguage;

// Function to set the current language
export function setLanguage(lang: keyof typeof languages) {
  currentLanguage = lang;
}

// Function to get the current language
export function getCurrentLanguage() {
  return currentLanguage;
}

// Function to get a translation
export function t(key: string, params?: Record<string, string | number>): string {
  const lang = languages[currentLanguage];
  
  // Split the key by dots to navigate the object
  const keys = key.split('.');
  let value: any = lang;
  
  // Navigate through the object
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Return the key if translation not found
      return key;
    }
  }
  
  // If value is a string, process it
  if (typeof value === 'string') {
    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramName) => {
        return params[paramName]?.toString() || match;
      });
    }
    return value;
  }
  
  // Return the key if value is not a string
  return key;
}

// Utility function to get nested translations
export function getTranslation(path: string) {
  return t(path);
}

// Export the current language object for direct access
export const currentLang = languages[currentLanguage];

// Export individual language objects
export { en };
