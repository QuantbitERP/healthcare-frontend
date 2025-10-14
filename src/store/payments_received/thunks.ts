import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentReceivedService } from '@/services/api-client/services/PaymentReceivedService';
import type { ConcessionGivenByDto } from '@/services/api-client/models/ConcessionGivenByDto';
import type { PaymentModeListDto } from '@/services/api-client/models/PaymentModeListDto';
import type { PaymentReceivedDto } from '@/services/api-client/models/PaymentReceivedDto';
import type { PaymentReceivedCountSummeryDto } from '@/services/api-client/models/PaymentReceivedCountSummeryDto';
import type { PaymentTypeListDto } from '@/services/api-client/models/PaymentTypeListDto';
import type { CompanyListDto } from '@/services/api-client/models/CompanyListDto';
import type { PatientListDto } from '@/services/api-client/models/PatientListDto';
import type { PaymentReceiptRequestDto } from '@/services/api-client/models/PaymentReceiptRequestDto';
import type { PaymentReceivedResponseDtoResultModel } from '@/services/api-client/models/PaymentReceivedResponseDtoResultModel';


// 1. getApiVPaymentReceivedConcessionGivenBy
export const fetchConcessionGivenBy = createAsyncThunk<ConcessionGivenByDto, { version: string; tenant?: string }>(
  'paymentReceived/fetchConcessionGivenBy',
  async ({ version, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedConcessionGivenBy(version, tenant);
  }
);

// 2. getApiVPaymentReceivedPaymentModes
export const fetchPaymentModes = createAsyncThunk<PaymentModeListDto, { version: string; tenant?: string }>(
  'paymentReceived/fetchPaymentModes',
  async ({ version, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedPaymentModes(version, tenant);
  }
);

// 3. postApiVPaymentReceivedSearchByName
export const searchPaymentReceivedByName = createAsyncThunk<PaymentReceivedDto, { version: string; searchText?: string; tenant?: string }>(
  'paymentReceived/searchByName',
  async ({ version, searchText, tenant }) => {
    return await PaymentReceivedService.postApiVPaymentReceivedSearchByName(version, searchText, tenant);
  }
);

// 4. getApiVPaymentReceivedCountSummary
export const fetchCountSummary = createAsyncThunk<PaymentReceivedCountSummeryDto, { version: string; startDate?: string; endDate?: string; tenant?: string }>(
  'paymentReceived/fetchCountSummary',
  async ({ version, startDate, endDate, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedCountSummary(version, startDate, endDate, tenant);
  }
);

// 5. getApiVPaymentReceivedPaymentReceipts
export const fetchPaymentReceipts = createAsyncThunk<any, { version: string; tenant?: string }>(
  'paymentReceived/fetchPaymentReceipts',
  async ({ version, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedPaymentReceipts(version, tenant);
  }
);

// 6. postApiVPaymentReceived
export const postPaymentReceived = createAsyncThunk<any, { version: string; tenant?: string; body?: PaymentReceiptRequestDto }>(
  'paymentReceived/postPaymentReceived',
  async ({ version, tenant, body }) => {
    return await PaymentReceivedService.postApiVPaymentReceived(version, tenant, body);
  }
);

// 7. deleteApiVPaymentReceived
export const deletePaymentReceived = createAsyncThunk<any, { version: string; tenant?: string; body?: Array<string> }>(
  'paymentReceived/deletePaymentReceived',
  async ({ version, tenant, body }) => {
    return await PaymentReceivedService.deleteApiVPaymentReceived(version, tenant, body);
  }
);

// 8. putApiVPaymentReceived
export const updatePaymentReceived = createAsyncThunk<any, { id: string; version: string; tenant?: string; body?: PaymentReceiptRequestDto }>(
  'paymentReceived/updatePaymentReceived',
  async ({ id, version, tenant, body }) => {
    return await PaymentReceivedService.putApiVPaymentReceived(id, version, tenant, body);
  }
);

// 9. getApiVPaymentReceivedPaymentTypes
export const fetchPaymentTypes = createAsyncThunk<PaymentTypeListDto[], { version: string; tenant?: string }>(
  'paymentReceived/fetchPaymentTypes',
  async ({ version, tenant }) => {
    const result = await PaymentReceivedService.getApiVPaymentReceivedPaymentTypes(version, tenant);
    return Array.isArray(result) ? result : [result];
  }
);

// 10. getApiVPaymentReceivedCompanyList
export const fetchCompanyList = createAsyncThunk<CompanyListDto, { version: string; tenant?: string }>(
  'paymentReceived/fetchCompanyList',
  async ({ version, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedCompanyList(version, tenant);
  }
);

// 11. getApiVPaymentReceivedPatientList
export const fetchPatientList = createAsyncThunk<PatientListDto, { version: string; tenant?: string }>(
  'paymentReceived/fetchPatientList',
  async ({ version, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedPatientList(version, tenant);
  }
);

// 12. getApiVPaymentReceivedPaymentReceivedId
export const fetchPaymentReceivedById = createAsyncThunk<PaymentReceivedResponseDtoResultModel, { id: string; version: string; tenant?: string }>(
  'paymentReceived/fetchPaymentReceivedById',
  async ({ id, version, tenant }) => {
    return await PaymentReceivedService.getApiVPaymentReceivedPaymentReceivedId(id, version, tenant);
  }
);

// 13. getApiVPaymentReceivedPaymentModes (for visit types)
export const fetchVisitTypes = createAsyncThunk<PaymentModeListDto[], { version: string; tenant?: string }>(
  'paymentReceived/fetchVisitTypes',
  async ({ version, tenant }) => {
    const result = await PaymentReceivedService.getApiVPaymentReceivedPaymentModes(version, tenant);
    return Array.isArray(result) ? result : [result];
  }
);

// 14. getApiVPaymentReceivedPaymentModes (for created by list)
export const fetchCreatedByList = createAsyncThunk<PaymentModeListDto[], { version: string; tenant?: string }>(
  'paymentReceived/fetchCreatedByList',
  async ({ version, tenant }) => {
    const result = await PaymentReceivedService.getApiVPaymentReceivedPaymentModes(version, tenant);
    return Array.isArray(result) ? result : [result];
  }
);
