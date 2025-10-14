// Shared interfaces

export interface Company {
    id: number;
    name: string;
    code: string;
    status: string;
  }
  
  export interface Concession {
    id: number;
    name: string;
    code: string;
    percentage: number;
    status: string;
    description: string;
  }
  
  export interface Payment {
    id: number;
    receipt_no?: number;
    patient_name?: string;
    patient_id?: number;
    company_id: number;
    company_name?: string;
    uhid?: string;
    payment_mode: string;
    visit_type?: string;
    visit_id?: number;
    date_of_received?: string;
    receivedamount?: string;
    discount_amount?: string;
    balance_amount?: string;
    excess_amount?: string;
    collected_from_id?: number;
    collected_from_name?: string;
    collected_from_type?: string;
    created_by: string;
    created_by_id: number;
    created_on: string;
    modified_by: string;
    modified_by_id: number;
    modified_on: string;
    amount_received?: string;
    payment_date?: string;
    reference_no?: string;
    concession_amount?: string;
    concession_percentage?: number;
    concession_given_by?: string | null;
    concession_remark?: string | null;
    tds?: string;
    processing_amount?: string;
    disallowed_amount?: string;
    write_off_amount?: string;
  }
  
  export interface PaymentMeta {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    sort_by: string;
    sort_order: string;
  }
  
  export interface PaymentStats {
    total_patient_amount: string;
    total_company_amount: string;
    total_amount: string;
    no_of_patient_receipts: string;
    no_of_company_receipts: string;
    total_receipts: string;
  }
  
  export interface PaymentResponse {
    payments: Payment[];
    meta: PaymentMeta;
  }
  
  export interface PaymentDetailResponse {
    payment: Payment;
  }
  export type ColumnConfig = {
    id: string;
    name: string;
    selected: boolean;
  };
  export interface ColumnConfigState {
    all_columns: ColumnConfig[];
    selected_columns: ColumnConfig[];
    unselected_columns: ColumnConfig[];
    loading: boolean;
    error: string | null;
  }

export interface Bill {
  id: number;
  hospital_id: number;
  patient_id: number;
  patient_name: string;
  referral_no: string;
  visit_no: string;
  bill_no: string;
  bill_datetime: string;
  claim_no: string;
  bill_amount: string;
  company_amount: string;
  balance_amount: string;
}

export interface BillsResponse {
  bills: Bill[];
  meta: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
    sort_by: string;
    sort_order: string;
  };
}


export interface FetchBillsParams {
  id: string;
  queryParams?: {
    hospital_id?: string;
    patient_id?: string;
    patient_name?: string;
    referral_no?: string;
    visit_no?: string;
    bill_no?: string;
    claim_no?: string;
    sort_by?: string;
    sort_order?: string;
    page?: number;
    per_page?: number;
  };
}
export type HospitalBillEntry = {
  id: string;
  hospital: string;
  patient: string;
  referralNo: string;
  visitNo: string;
  billNo: string;
  billDateTime: string; 
  claimNo: string;
  billAmount: number;
  companyAmount: number;
  balanceAmount: number;
  receivedAmount: number;
  concession: number; 
  tdsAmount: number;
  processingFees: number;
  disalAmount: number;
  disalRemark: string;
  totalAmount: number;
};
