import { createContext, useContext, useState, ReactNode } from "react";

// 1. Define the type for the context
type CancelContextType = {
  cancelClicked: boolean;
  setCancelClicked: (value: boolean) => void;
};

// 2. Create the context with a proper type
const CancelContext = createContext<CancelContextType | undefined>(undefined);

// 3. Define props for the provider
interface CancelProviderProps {
  children: ReactNode;
}

// 4. Create the provider with types
export const CancelProvider = ({ children }: CancelProviderProps) => {
  const [cancelClicked, setCancelClicked] = useState(false);

  return (
    <CancelContext.Provider value={{ cancelClicked, setCancelClicked }}>
      {children}
    </CancelContext.Provider>
  );
};

// 5. Custom Hook for Easy Access
export const useCancel = (): CancelContextType => {
  const context = useContext(CancelContext);
  if (!context) {
    throw new Error("useCancel must be used within a CancelProvider");
  }
  return context;
};
