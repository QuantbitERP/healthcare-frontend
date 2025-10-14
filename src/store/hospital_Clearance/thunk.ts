import { createAsyncThunk } from '@reduxjs/toolkit';
import {DepartmentClearanceItem, DepartmentClearanceRequest, HospitalClearanceService } from '@/services/api-client/services/HospitalClearanceService';

export const fetchDepartmentClearanceList = createAsyncThunk(
  'hospitalClearance/fetchDepartmentClearanceList',
  async (request: DepartmentClearanceRequest, { rejectWithValue }) => {
    try {
      const response = await HospitalClearanceService.getDepartmentClearanceList("1", request);
      if (response.isError) {
        return rejectWithValue(response.errorMessage || 'Unknown error');
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
export const fetchHospitalList = createAsyncThunk(
  'hospitalClearance/fetchHospitalList',
  async (request: {version: string, tenant: string}, { rejectWithValue }) => {
    try {
      const response = await HospitalClearanceService.gethospitallist(request.version, request.tenant);
      console.log(response);
      if (response.isError) {
        return rejectWithValue(response.errorMessage || 'Unknown error');
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
export const DepartmentClearanceUpdate= createAsyncThunk(
  'hospitalClearance/update',
  async (request: DepartmentClearanceItem[], { rejectWithValue }) => {
       try {
      const response = await HospitalClearanceService.PutDepartmentClearanceResponse("1", "",{model: request})
      // Cast response to expected type before accessing properties
      const typedResponse = response as { isError: boolean; errorMessage?: string };
      if (typedResponse.isError) {
        return rejectWithValue(typedResponse.errorMessage || 'Unknown error');
      } 
      return response;
    } 
    catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
}  
)

