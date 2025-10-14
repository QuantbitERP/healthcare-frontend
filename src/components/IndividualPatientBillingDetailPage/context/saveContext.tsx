"use client"
import { createContext, useContext, useState, ReactNode } from "react";

type SaveContextType = {
  saveSuccess: boolean;
  setSaveSuccess: (value: boolean) => void;
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
  isSavingDraft: boolean;
  setIsSavingDraft: (value: boolean) => void;
};

const SaveContext = createContext<SaveContextType | undefined>(undefined);

interface SaveProviderProps {
  children: ReactNode;
}

export const SaveProvider = ({ children }: SaveProviderProps) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  return (
    <SaveContext.Provider
      value={{
        saveSuccess,
        setSaveSuccess,
        isSaving,
        setIsSaving,
        isSavingDraft,
        setIsSavingDraft,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export const useSave = (): SaveContextType => {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error("useSave must be used within a SaveProvider");
  }
  return context;
};
