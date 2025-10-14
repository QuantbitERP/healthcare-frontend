import { OperationCategoryDto } from "@/services/api-client";
import { OperationCategoryListDto } from "@/services/api-client";
import { OperationCategoryPageListDto } from "@/services/api-client";
import { OperationCategoryListRequestDto } from "@/services/api-client";
import { KVPair } from "@/api-client";

// State interfaces
export interface OperationCategoryList 
{
  data?:{
    items: Array<OperationCategoryPageListDto>
    metadata:
    {
      page?:{
        currentPage:number
        pageSize:number;
        totalPages:number
      }
    }
}
}
export interface OperationCategoryState {
   list:OperationCategoryList
  loading: boolean;
  error: string | null;
}
export interface OperationCategoryListState {
  operationCategories: OperationCategoryListDto[];
  loading: boolean;
  error: string | null;
}

export interface OperationCategoryByIdState {
  data: OperationCategoryDto | null;
  loading: boolean;
  error: string | null;
}

export interface OperationCategoryCreateState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface OperationCategoryUpdateState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface OperationCategoryDeleteState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface OperationCategoryDropdownState {
  status: KVPair[];
  createdBy: KVPair[];
  modifiedBy: KVPair[];
  loading: boolean;
  error: string | null;
}

// Request types
export interface OperationCategoryListRequest extends OperationCategoryListRequestDto {
  page: number;
}

// Response types
export interface OperationCategoryListResponse {
  data: {
    items: OperationCategoryPageListDto[];
    metadata?: {
      page: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
      };
    };
  };
  meta?: {
    page: {
      currentPage: number;
      totalPages: number;
      pageSize: number;
    };
  };
}
