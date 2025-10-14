export type ScoreDataItem = {
    label: string;
    value: number;
};
export type ScoreState = {
    data: any;
    loading: boolean;
    error: string | null;
};
export type PolicyState = {
    data: any;
    policyData: any;
    loading: boolean;
    error: string | null;
};
export type PolicyEntry = {
    employeeCategory: string;
    subCategory: string;
    opdLimit: string;
    ipdLimit: string;
    validFrom: string;
    validTill: string;
    status: "Active" | "Expired" | "-";
    modifiedOn: string;
    modifiedBy: string;
    createdBy: string;
    createdOn: string;
};
  
export type FilterOption = {
    label: string;
    value: string;
  };
  
  export type FilterData = {
    category: never[];
    employeeCategories: FilterOption[];
    subCategories: FilterOption[];
    years: FilterOption[];
    createdBy: FilterOption[];
    modifiedBy: FilterOption[];
  };
  
  export type FiltersState = {
    data: FilterData;
    loading: boolean;
    prefix: any[];
    dependentRelations: any[];
    error: string | null;
  };
