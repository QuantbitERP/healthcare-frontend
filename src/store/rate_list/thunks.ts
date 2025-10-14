import { createAsyncThunk } from '@reduxjs/toolkit';
import { RateListService } from '@/services/api-client';
import { RateListRequestDto, RateListSaveDto } from '@/services/api-client';
import { saveAs } from 'file-saver';

interface CommonParams {
  version: string;
  tenant?: string;
}

interface GetByIdParams extends CommonParams {
  id: string;
}

interface PostListParams extends CommonParams {
  requestBody: RateListRequestDto;
}

interface SaveOrUpdateParams extends CommonParams {
    requestBody: RateListSaveDto;
  }
  
  interface UpdateParams extends SaveOrUpdateParams {
    id: string;
  }
  
  interface DeleteParams extends CommonParams {
    requestBody: string[];
  }
  
  interface UploadParams extends CommonParams {
    formData: { file?: Blob };
  }


export const fetchRateTypes = createAsyncThunk(
  'rateList/fetchRateTypes',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return (await RateListService.getApiVRateListGetRateType(version, tenant)).data?.items;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRateNames = createAsyncThunk(
  'rateList/fetchRateNames',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateListGetRateName(version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchApplicableFrom = createAsyncThunk(
  'rateList/fetchApplicableFrom',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateListGetApplicableFrom(version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchBillingClasses = createAsyncThunk(
  'rateList/fetchBillingClasses',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateListGetBillingClass(version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRateListStatus = createAsyncThunk(
  'rateList/fetchRateListStatus',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateListGetRateListStatus(version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchServiceGroups = createAsyncThunk(
  'rateList/fetchServiceGroups',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateListGetRateListServiceGroup(version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchHospitals = createAsyncThunk(
  'rateList/fetchHospitals',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return (await RateListService.getApiVRateListGetHospital(version, tenant)).data?.items;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  'rateList/fetchDepartments',
  async ({ version, tenant, hospitalId }: { version: string; tenant?: string; hospitalId: string[] }, { rejectWithValue }) => {
    try {
      return (await RateListService.getApiVRateListGetDepartment(version, tenant, { hospitalId })).data?.items;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRateListSummary = createAsyncThunk(
  'rateList/fetchRateListSummary',
  async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateListSummary(version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRateListById = createAsyncThunk(
  'rateList/fetchRateListById',
  async ({ id, version, tenant }: GetByIdParams, { rejectWithValue }) => {
    try {
      return await RateListService.getApiVRateList(id, version, tenant);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRateList = createAsyncThunk(
  'rateList/fetchRateList',
  async ({ version, tenant, requestBody }: PostListParams, { rejectWithValue }) => {
    try {
      return await RateListService.postApiVRateListList(version, tenant, requestBody);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const saveRateList = createAsyncThunk(
    'rateList/saveRateList',
    async ({ version, tenant, requestBody }: SaveOrUpdateParams, { rejectWithValue }) => {
      try {
        return await RateListService.postApiVRateListSave(version, tenant, requestBody);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );
  
  // Update Rate List
  export const updateRateList = createAsyncThunk(
    'rateList/updateRateList',
    async ({ id, version, tenant, requestBody }: UpdateParams, { rejectWithValue }) => {
      try {
        return await RateListService.putApiVRateList(id, version, tenant, requestBody);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );
  
  //  Delete Rate List
  export const deleteRateList = createAsyncThunk(
    'rateList/deleteRateList',
    async ({ version, tenant, requestBody }: DeleteParams, { rejectWithValue }) => {
      try {
        return await RateListService.deleteApiVRateList(version, tenant, requestBody);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );
  
  // Upload Excel
  export const uploadRateListExcel = createAsyncThunk(
    'rateList/uploadRateListExcel',
    async ({ version, tenant, formData }: UploadParams, { rejectWithValue }) => {
      try {
        return await RateListService.postApiVRateListUploadExcel(version, tenant, formData);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );
  
  //  Download Rate List PDF
  export const downloadRateListPdf = createAsyncThunk(
    'rateList/downloadRateListPdf',
    async ({ version, tenant }: CommonParams, { rejectWithValue }) => {
      try {
        const blob = await RateListService.getApiVRateListDownloadRateList(version, tenant);
        saveAs(blob, 'RateList.pdf');
        return true;
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );