export interface TransferEmployeeRecord {
    employee: string;
    employeeCode: string;
    category: string;
    designation: string;
    referredDoctor: string;
    modifiedOn: string;
    modifiedBy: string;
    createdOn: string;
    createdBy: string;
}

export interface TransferEmployeeRecordState {
    data: any;
    loading: boolean;
    error: string | null;
  }
  
export interface FundTransferRecord {
    employee: string;
    transactionDate: string;
    transferAmount: string;
    transferBy: string;
    transferFrom: string;
    transferTo: string;
    collectedFrom: string;
}
export interface FundTransferRecordState {
    data: any;
    loading: boolean;
    error: string | null;
}
  
export interface CategoryChangeBillingRecord {
    billType: string;
    category: string;
    subcategory: string;
    allocatedBalance: string;
    utilizedAmount: string;
    orgEmpCode: string;
    visitDate: string;
}
export interface CategoryChangeBillingRecordState {
    data: any;
    loading: boolean;
    error: string | null;
}
export type FilterOption = {
    label: string;
    value: string;
};

export interface FilterOptions {
    category: FilterOption[];
    designation: FilterOption[];
    referredDoctor: FilterOption[];
    createdBy: FilterOption[];
    modifiedBy: FilterOption[];
}
  
export interface FilterState {
    options: any;
    loading: boolean;
    error: string | null;
}
  