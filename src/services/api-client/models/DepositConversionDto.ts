/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type DepositConversionDto = {
  id?: string;
  patientName?: string | null;
  uhid?: string | null;
  transferedTo?: string | null;
  depositeType?: string | null;
  recieptNo?: string | null;
  recieptDateandTime?: string | null;
  securityDepositeAmount?: number;
  transferedPayAmount?: number;
  transactedDate?: string | null;
  transactedBy?: string | null;
  createdBy?: string | null;
  createdOn?: string | null;
};

export type DepositConversionListRequestDto = {
  startDate: string;
  endDate: string;
  searchTerm?: string | null;
  transferedToList?: Array<number> | null;
  depositeTypeList?: Array<string> | null;
  createdByList?: Array<string> | null;
  modifiedByList?: Array<string> | null;
  pageNumber: number;
  pageSize: number;
};

export type DepositConversionListResponseDtoResultModel = {
  data?: {
    items?: Array<DepositConversionDto> | null;
    metadata?: {
      page?: {
        currentPage?: number;
        pageSize?: number;
        totalPages?: number;
      };
    };
  } | null;
  isError?: boolean;
  errorMessage?: string | null;
  validationErrors?: Array<any> | null;
  errorCode?: string | null;
};

export type KeyValuePair = {
  key: string;
  value: string;
};

export type DepositTypeListResponseDtoResultModel = {
  data?: {
    items?: Array<KeyValuePair> | null;
  } | null;
  isError?: boolean;
  errorMessage?: string | null;
  validationErrors?: Array<any> | null;
  errorCode?: string | null;
};

export type TransferToEnumResponseDtoResultModel = {
  data?: {
    items?: Array<KeyValuePair> | null;
  } | null;
  isError?: boolean;
  errorMessage?: string | null;
  validationErrors?: Array<any> | null;
  errorCode?: string | null;
};
