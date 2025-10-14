import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetBillServices } from '@/services/api-client/models/GetBillServices';

export interface PatientFormData {
  // Patient Information
  name: string;
  age: string;
  gender: string | null;
  contactNo: string;
  abhaId: string;
  
  // Medical Information
  patientCategory: string | null;
  patientCompany: string | null;
  visitType: string | null;
  consultantDoctor: string | null;
  billingClass: string | null;
  
  // Services Data
  services: GetBillServices[];
  
  // Bill Information
  billRemark: string;
  
  // Metadata
  lastUpdated: string;
  isFromCreatePatient: boolean;
  hasUnsavedChanges: boolean;
}

interface PatientFormState {
  data: PatientFormData | null;
  isLoading: boolean;
  error: string | null;
  navigationSource: 'create-patient' | 'direct' | null;
}

const initialState: PatientFormState = {
  data: null,
  isLoading: false,
  error: null,
  navigationSource: null,
};

const patientFormSlice = createSlice({
  name: 'patientForm',
  initialState,
  reducers: {
    // Save complete form data
    savePatientFormData: (state, action: PayloadAction<Partial<PatientFormData>>) => {
      const now = new Date().toISOString();
      const payload = action.payload;
      
      state.data = {
        name: payload.name || '',
        age: payload.age || '',
        gender: payload.gender || null,
        contactNo: payload.contactNo || '',
        abhaId: payload.abhaId || '',
        patientCategory: payload.patientCategory || null,
        patientCompany: payload.patientCompany || null,
        visitType: payload.visitType || null,
        consultantDoctor: payload.consultantDoctor || null,
        billingClass: payload.billingClass || null,
        services: payload.services || [],
        billRemark: payload.billRemark || '',
        lastUpdated: now,
        isFromCreatePatient: payload.isFromCreatePatient || false,
        hasUnsavedChanges: true
      };
      state.error = null;
    },

    // Update specific field
    updatePatientFormField: (
      state, 
      action: PayloadAction<{ field: keyof PatientFormData; value: any }>
    ) => {
      if (state.data) {
        const { field, value } = action.payload;
        state.data = {
          ...state.data,
          [field]: value,
          lastUpdated: new Date().toISOString(),
          hasUnsavedChanges: true,
        };
      }
    },

    // Load existing form data
    loadPatientFormData: (state, action: PayloadAction<PatientFormData>) => {
      state.data = action.payload;
      state.error = null;
    },

    // Clear all form data
    clearPatientFormData: (state) => {
      state.data = null;
      state.error = null;
      state.navigationSource = null;
    },

    // Set navigation source
    setNavigationSource: (state, action: PayloadAction<'create-patient' | 'direct' | null>) => {
      state.navigationSource = action.payload;
    },

    // Mark as saved (clear unsaved changes flag)
    markAsSaved: (state) => {
      if (state.data) {
        state.data.hasUnsavedChanges = false;
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset to initial state
    resetPatientForm: () => initialState,
  },
});

export const {
  savePatientFormData,
  updatePatientFormField,
  loadPatientFormData,
  clearPatientFormData,
  setNavigationSource,
  markAsSaved,
  setLoading,
  setError,
  resetPatientForm,
} = patientFormSlice.actions;

// Selectors
export const selectPatientFormData = (state: { patientForm: PatientFormState }) => state.patientForm.data;
export const selectPatientFormLoading = (state: { patientForm: PatientFormState }) => state.patientForm.isLoading;
export const selectPatientFormError = (state: { patientForm: PatientFormState }) => state.patientForm.error;
export const selectNavigationSource = (state: { patientForm: PatientFormState }) => state.patientForm.navigationSource;
export const selectHasUnsavedChanges = (state: { patientForm: PatientFormState }) => state.patientForm.data?.hasUnsavedChanges || false;

export default patientFormSlice.reducer;