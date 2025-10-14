import { createAsyncThunk } from '@reduxjs/toolkit';
    import { 
      OperationCategoryService,
      OperationCategoryDto,
      OperationCategoryRequestDto,
      OperationCategoryListRequestDto,
      OperationCategoryListDto
    } from '@/services/api-client';
import { AxiosError } from 'axios';
import { 
  OperationCategoryList,
} from './types';
import { CommonResponseDto } from '@/api-client/models/DepartmentListDto';

// Constants
const VERSION = '1';
const TENANT = process.env.NEXT_PUBLIC_TENANT || '';

// Fetch Operation Category List with filters
export const fetchOperationCategoryList = createAsyncThunk<
OperationCategoryList,
  OperationCategoryListRequestDto,
  { rejectValue: string }
>(
  'operationCategory/fetchList',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.postApiVOperationCategoryList(
        VERSION,
        TENANT,
        requestData
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to fetch operation category list'
      );
    }
  }
);

// Fetch Operation Category by ID
export const fetchOperationCategoryById = createAsyncThunk<
  OperationCategoryDto,
  string,
  { rejectValue: string }
>(
  'operationCategory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.getApiVOperationCategory(
        id,
        VERSION,
        TENANT
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to fetch operation category'
      );
    }
  }
);

// Create Operation Category
export const createOperationCategory = createAsyncThunk<
  any,
  OperationCategoryRequestDto,
  { rejectValue: string }
>(
  'operationCategory/create',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.postApiVOperationCategory(
        VERSION,
        TENANT,
        requestData
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to create operation category'
      );
    }
  }
);

// Update Operation Category
export const updateOperationCategory = createAsyncThunk<
  any,
  { data: OperationCategoryRequestDto },
  { rejectValue: string }
>(
  'operationCategory/update',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.putApiVOperationCategory(
        VERSION,
        TENANT,
        data
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to update operation category'
      );
    }
  }
);

// Delete Operation Category
export const deleteOperationCategory = createAsyncThunk<
  any,
  string[],
  { rejectValue: string }
>(
  'operationCategory/delete',
  async (ids, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.deleteApiVOperationCategory(
        VERSION,
        TENANT,
        ids
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to delete operation category'
      );
    }
  }
);

// Fetch Operation Categories (for dropdown)
export const fetchOperationCategories = createAsyncThunk<
  OperationCategoryListDto[],
  void,
  { rejectValue: string }
>(
  'operationCategory/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.getApiVOperationCategoryOperationCategories(
        VERSION,
        TENANT
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to fetch operation categories'
      );
    }
  }
);

// Fetch Status Dropdown
export const fetchOperationCategoryStatus = createAsyncThunk<
  CommonResponseDto,
  void,
  { rejectValue: string }
>(
  'operationCategory/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.GetStatus("1");
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to fetch status list'
      );
    }
  }
);

// Fetch Created By Dropdown
export const fetchOperationCategoryCreatedBy = createAsyncThunk<
  CommonResponseDto,
  void,
  { rejectValue: string }
>(
  'operationCategory/fetchCreatedBy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.getApiV1OperationCategoryGetCreatedByList();
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to fetch created by list'
      );
    }
  }
);

// Fetch Modified By Dropdown
export const fetchOperationCategoryModifiedBy = createAsyncThunk<
  CommonResponseDto,
  void,
  { rejectValue: string }
>(
  'operationCategory/fetchModifiedBy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await OperationCategoryService.getApiV1OperationCategoryGetModifiedBy();
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        (axiosError.response?.data as any)?.message || 'Failed to fetch modified by list'
      );
    }
  }
);
