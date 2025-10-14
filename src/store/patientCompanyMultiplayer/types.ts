export interface PatientCompanyItem {
  key: string;
  value: string;
}

export interface PatientCompanyApiResponse {
  data: {
    items: PatientCompanyItem[];
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
}

export interface PatientCompanyData {
  id: string;
  companyName?: string;
  associatedCompanyName?: string;
  insurancePolicyNumber?: string;
  preAuthorizationNumber?: string;
  amount?: number;
  status?: string;
  createdOn?: string;
  createdBy?: string;
  modifiedOn?: string;
  modifiedBy?: string;
  // API response fields
  ipdBillPatientCompanyDetailId?: string;
  insurancePolicyNo?: string;
  claimId?: string;
  amountlist?: Array<{
    detailId?: string;
    amount?: number;
    status?: string;
    approvalDate?: string;
  }>;
}

export interface PatientCompanyDropdownState {
  companies: PatientCompanyItem[];
  associateCompanies: PatientCompanyItem[];
  loading: boolean;
  error: string | null;
}

export interface PatientCompanyTableState {
  data: PatientCompanyData[];
  selectedRows: string[];
  loading: boolean;
  error: string | null;
}

export interface PatientCompanyMultiplayerState {
  dropdown: PatientCompanyDropdownState;
  table: PatientCompanyTableState;
}
