import React, { createContext, useContext, useRef, ReactNode } from 'react';

// Define types for the context
interface PatientSearchContextType {
  patientInputRef: React.RefObject<HTMLInputElement | null>;
}

// Create the context with a default value (null initially)
const PatientSearchContext = createContext<PatientSearchContextType | undefined>(undefined);

interface PatientSearchProviderProps {
  children: ReactNode;
}

export function PatientSearchProvider({ children }: PatientSearchProviderProps) {
  // Create a ref for the patient input field
  const patientInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <PatientSearchContext.Provider value={{ patientInputRef }}>
      {children}
    </PatientSearchContext.Provider>
  );
}

export function usePatientSearch() {
  const context = useContext(PatientSearchContext);

  if (!context) {
    throw new Error('usePatientSearch must be used within a PatientSearchProvider');
  }

  return context;
}
