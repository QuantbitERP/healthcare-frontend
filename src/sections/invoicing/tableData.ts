export type TableDataType = {
  id?: string;
  invId?: string;
  priorAuthId?: string;
  billId: string;
  billNo: string;
  patient: string;
  authId: string;
  uhid: string;
  company: string;
  associateCompany: string;
  billType: "OPD" | "IPD";
  billStatus: "Pending" | "Submitted";
  claimSendNo: string;
  submittedBy: string;
  companyAmount: number;
  patientAmount: number;
  referralLetterNo: string;
  modifiedOn: string; 
  priorAuthDoneBy: string;
  billFinalizedBy: string;
  submitDate: string; 
  billAmount: number;
  billDateandTime?: string;
  preAuthNo?: string;
  companyId?: string;
};

// API Response Types
export type InvoicingApiResponse = {
  data: {
    items: InvoicingApiItem[];
    metadata: {
      page: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
      };
    };
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

export type InvoicingApiItem = {
  invId: string;
  priorAuthId: string;
  billNo: string;
  patientName: string;
  preAuthNo: string;
  uhid: string;
  company: string;
  billDateandTime: string | null;
  associateCompany: string;
  billType: string;
  status: string;
  claimSendNo: string;
  submittedBy: string;
  companyAmount: number;
  patientAmount: number;
  referralLetterNo: string | null;
  modifiedOn: string;
  priorAuthDoneBy: string;
  billFinalizedBy: string;
  submitDate: string;
  billAmount: number;
  companyId: string;
  billId: string;
};

export type InvoicingApiRequest = {
  startDate: string;
  endDate: string;
  searchTerm: string;
  companyList: string[];
  associateCompanyList: string[];
  billStatus: string[];
  billType: string[];
  iscCverLetterAvailable: boolean;
  pageNumber: number;
  pageSize: number;
};

// Filter API Types
export type FilterApiResponse<T> = {
  data: {
    items: T[];
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

export type FilterOption = {
  key: string;
  value: string;
};

export type BillStatusResponse = FilterApiResponse<FilterOption>;
export type BillTypeResponse = FilterApiResponse<FilterOption>;
export type CompanyResponse = FilterApiResponse<FilterOption>;
export type AssociateCompanyResponse = FilterApiResponse<FilterOption>;
export type GroupByResponse = FilterApiResponse<FilterOption>;

// Invoice Details API Types
export type InvoiceDetailsResponse = {
  data: {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    company: string;
    submissionReference: string | null;
    submissionDate: string;
    coverletter: string;
    remarks: string | null;
    coverLetterFormatResult: string;
    bills: InvoiceBill[];
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

export type InvoiceBill = {
  billId: string;
  billNo: string;
  billDate: string | null;
  iPno: string;
  claimNo: string;
  patientName: string;
  totalAmount: number;
  priorAuthId?: string;
};

// Cover Letter API Types
export type CoverLetterItem = {
  key: string;
  value: string;
};

export type CoverLetterResponse = {
  data: {
    items: CoverLetterItem[];
  };
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

// Cover Letter Content API Types
export type CoverLetterContent = {
  coverletterId: string;
  schemecompanyid: string;
  templateName: string;
  isMandatory: boolean;
  isApplicableAsCheckList: boolean;
  coverLetterFormatResult: string;
};

export type CoverLetterContentResponse = {
  data: CoverLetterContent;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

// Submit Bill API Types
export type SubmitBillRequest = {
  model: {
    invoiceDate: string;
    company: string;
    submissionRefNo: string;
    submissionDate: string;
    selectedBills: SelectedBill[];
    coverLetterId: string;
    coverLetterContents: string;
    remarks: string;
  };
};

export type SelectedBill = {
  billId: string;
  priorAuthId?: string;
  billNo: string;
};

export type SubmitBillResponse = {
  data: any; // Response structure not provided, using any for now
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

// Bill counts API types
export type BillCountItem = {
  visittype: string;
  completedcount: number;
  pendingcount: number;
};

export type BillCountsData = {
  items: BillCountItem[];
};

export type BillCountsResponse = {
  data: BillCountsData;
  isError: boolean;
  errorMessage: string | null;
  validationErrors: any;
  errorCode: string | null;
};

export type BillCountsRequest = {
  startdate: string;
  enddate: string;
};

// Mock data removed - now using real API data
export const TableData: TableDataType[] = [];
