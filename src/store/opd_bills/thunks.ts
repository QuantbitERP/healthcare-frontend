import { createAsyncThunk } from "@reduxjs/toolkit";
import { OpdBillService } from "@/services/api-client/services/OpdBillService";
import { IpdService } from "@/services/api-client/services/IpdService";
import { GenderService } from "@/services/api-client/services/GenderService";
import { ChargesEstimationService } from "@/services/api-client/services/ChargesEstimationService";
import type { TodaysBillGrossDTO } from "@/services/api-client/models/TodaysBillGrossDTO";
import type { GetBillsDto } from "@/services/api-client/models/GetBillsDto";
import type { GetBillsResponseDtoListResultModelResultModel } from "@/services/api-client/models/GetBillsResponseDtoListResultModelResultModel";
import type { ScoreItem, CommonParams, PackagesParams } from "./types";
import type { GetSchemeCompaniesDto } from "@/services/api-client/models/GetSchemeCompaniesDto";
import type { CancelBillReasonDTO } from "@/services/api-client/models/CancelBillReasonDTO";
import type { CancelBillReasonDTOListResultModelResultModel } from "@/services/api-client/models/CancelBillReasonDTOListResultModelResultModel";
import type { KVPairListResultModelResultModel } from "@/services/api-client/models/KVPairListResultModelResultModel";
import type { CancelBillCommand } from "@/services/api-client/models/CancelBillCommand";
import type { CancelBillResponseDtoListResultModelResultModel } from "@/services/api-client/models/CancelBillResponseDtoListResultModelResultModel";
import type { CancelDraftBillCommand } from "@/services/api-client/models/CancelDraftBillCommand";
import type { CancelDraftBillResponseDtoResultModel } from "@/services/api-client/models/CancelDraftBillResponseDtoResultModel";
import type { GetBillDetailsDTOResultModel } from "@/services/api-client/models/GetBillDetailsDTOResultModel";
import { VisitTypeEnumDtoListResultModelResultModel } from "@/services/api-client/models/VisitTypeEnumDtoListResultModelResultModel";
import { saveAs } from "file-saver";
import { GetServiceRateRequest } from "@/services/api-client/models/GetServiceRateRequest";
import { ServiceRateAndMediclaimResponseResultModel } from "@/services/api-client/models/ServiceRateAndMediclaimResponseResultModel";
import type { GetDraftBillByIdResponseDTOResultModel } from "@/services/api-client/models/GetDraftBillByIdResponseDTOResultModel";
import { KVPairResultModel } from "@/services/api-client";
// import axios from "axios";
import type { CancelServiceCommand } from "@/services/api-client/models/CancelServiceCommand";
//  Fetch Score Card
export const fetchScoreCard = createAsyncThunk<
  ScoreItem[],
  { version: string; startDate?: string; endDate?: string; tenant?: string }
>(
  "scoreCard/fetch",
  async ({ version, startDate, endDate, tenant }, { rejectWithValue }) => {
    try {
      const resultModel = await OpdBillService.getApiVOpdBillOpdbillsGross(
        version,
        startDate,
        endDate,
        tenant
      );
      const result: TodaysBillGrossDTO = resultModel.data!;
      return [
        { label: "Total Bills", count: result.totalBills || 0 },
        { label: "Gross Amount", count: result.totalGrossAmount || 0 },
        { label: "Total Concession", count: result.totalConcessionAmount || 0 },
        { label: "Net Amount", count: result.totalNetAmount || 0 },
        { label: "Received Amount", count: result.totalReceivedAmount || 0 },
      ];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch score card");
    }
  }
);

//  Fetch Bills
export const fetchBills = createAsyncThunk<
  GetBillsResponseDtoListResultModelResultModel,
  { version: string; tenant?: string; requestBody?: GetBillsDto }
>(
  "opdBills/fetchBills",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      return await OpdBillService.postApiVOpdBillOpdbills(
        version,
        tenant,
        requestBody
      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch bills");
    }
  }
);
export const fetchDraftOpdBill = createAsyncThunk<
  GetDraftBillByIdResponseDTOResultModel,
  { version: string; tempDocumentNo?: string; tenant?: string }
>(
  "opdDraftBill/fetchDraftOpdBill",
  async ({ version, tempDocumentNo, tenant }, thunkAPI) => {
    try {
      const res = await OpdBillService.getApiVOpdBillOpdbillsDraft(
        version,
        tempDocumentNo,
        tenant
      );
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchOpdBillingClass = createAsyncThunk<
  KVPairResultModel, // Return type
  { version: string; patientHospitalId?: string; tenant?: string }, // Argument type
  { rejectValue: any } // Optional reject value type
>(
  "opd/fetchBillingClass",
  async ({ version, patientHospitalId, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await OpdBillService.getApiVOpdBillOpdbillsOpdBillingClass(
          version,
          patientHospitalId,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

//  Fetch All Filters
export const fetchAllOpdFilters = createAsyncThunk<
  {
    statusList: KVPairListResultModelResultModel | null;
    createdByList: KVPairListResultModelResultModel | null;
    patientCategories: KVPairListResultModelResultModel | null;
    schemeCompanies: KVPairListResultModelResultModel | null;
    visitTypes: VisitTypeEnumDtoListResultModelResultModel | null;
    referredDoctors: KVPairListResultModelResultModel | null;
    paymentModes: KVPairListResultModelResultModel | null;
    billingClass: KVPairListResultModelResultModel | null;
  },
  {
    version: string;
    tenant?: string;
    hospitalId?: string;
    schemeCompaniesBody?: GetSchemeCompaniesDto;
    category?: string;
  },
  { rejectValue: string }
>(
  "opdFilters/fetchAll",
  async (
    { version, tenant, hospitalId, schemeCompaniesBody },
    { rejectWithValue }
  ) => {
    try {
      const results = await Promise.allSettled([
        OpdBillService.getApiVOpdBillOpdbillsStatus(version, tenant),
        OpdBillService.getApiVOpdBillOpdbillsCreatedby(
          version,
          hospitalId,
          tenant
        ),
        OpdBillService.getApiVOpdBillOpdbillsPatientCategories(version, tenant),
        OpdBillService.postApiVOpdBillOpdbillsSchemeCompanies(
          version,
          tenant,
          schemeCompaniesBody
        ),
        OpdBillService.getApiVOpdBillOpdbillsPatientVisitType(version, tenant),
        OpdBillService.getApiVOpdBillOpdbillsDoctors(
          version,
          tenant,
          hospitalId
        ),
        OpdBillService.getApiVOpdBillOpdbillsPaymentsMode(version, tenant),
        OpdBillService.getApiVOpdBillOpdbillsOpdBillingClass(
          version,
          hospitalId,
          tenant
        ),
      ]);

      const [
        statusList,
        createdByList,
        patientCategories,
        schemeCompanies,
        visitTypes,
        referredDoctors,
        paymentModes,
        billingClass,
      ] = results.map(getValue);

      return {
        statusList,
        createdByList,
        patientCategories,
        schemeCompanies,
        visitTypes,
        referredDoctors,
        paymentModes,
        billingClass,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch filters");
    }
  }
);

function getValue(result: PromiseSettledResult<any>) {
  return result.status === "fulfilled" ? result.value : null;
}

//  Fetch Cancel Reasons
export const fetchCancelReasons = createAsyncThunk<
  CancelBillReasonDTO[],
  { version: string; tenant?: string }
>(
  "opdFilters/fetchCancelReasons",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response: CancelBillReasonDTOListResultModelResultModel =
        await OpdBillService.getApiVOpdBillOpdbillsCancelReasons(
          version,
          tenant
        );
      return response?.data?.items || [];
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch cancel reasons"
      );
    }
  }
);

// Delete Non-Draft Bills

export const cancelOpdBill = createAsyncThunk<
  CancelBillResponseDtoListResultModelResultModel,
  { version: string; tenant?: string; requestBody: CancelBillCommand },
  { rejectValue: any }
>(
  "opdBills/cancelOpdBill",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.deleteApiVOpdBillOpdbills(
        version,
        tenant,
        requestBody
      );
      if (response.isError) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body ?? error);
    }
  }
);

export const cancelDraftOpdBill = createAsyncThunk<
  CancelDraftBillResponseDtoResultModel,
  { version: string; tenant?: string; requestBody: CancelDraftBillCommand },
  { rejectValue: any }
>(
  "opdBills/cancelDraftOpdBill",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.deleteApiVOpdBillOpdbillsDraft(
        version,
        tenant,
        requestBody
      );
      if (response.isError) {
        return rejectWithValue(
          response.errorMessage ?? "An unknown error occurred"
        );
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body ?? error);
    }
  }
);

export const exportOpdBillsWord = createAsyncThunk<
  Blob,
  { version: string; tenant?: string; requestBody: string[] },
  { rejectValue: string }
>(
  "opdBills/exportOpdBillsWord",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.postApiVOpdBillOpdbillsWord(
        version,
        tenant,
        requestBody
      );
      console.log("Thunk response", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to export bills");
    }
  }
);

export const fetchBillDetailsById = createAsyncThunk<
  GetBillDetailsDTOResultModel,
  { billId: string; version: string; tenant?: string }
>(
  "opdBillDetails/fetchBillDetails",
  async ({ billId, version, tenant }, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.getApiVOpdBillOpdbills(
        billId,
        version,
        tenant
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 🩺 Patient dues details
export const fetchPatientDuesDetails = createAsyncThunk(
  "patientBilling/fetchPatientDuesDetails",
  async ({ version, patientId, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      const response =
        await OpdBillService.getApiVOpdBillOpdbillsPatientduesdetails(
          version,
          patientId,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

//  Case papers PDF
export const downloadCasePaperPdf = createAsyncThunk(
  "patientBilling/downloadCasePaperPdf",
  async ({ version, billId, tenant }: CommonParams, { rejectWithValue }) => {
    try {
      const blob = await OpdBillService.postApiVOpdBillOpdbillsCasepaperpdf(
        version,
        billId,
        tenant
      );
      saveAs(blob, "CasePaper.pdf");
      return true;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Export to Word
export const exportToWord = createAsyncThunk(
  "patientBilling/exportToWord",
  async (
    { version, tenant, requestBody }: CommonParams,
    { rejectWithValue }
  ) => {
    try {
      const blob = await OpdBillService.postApiVOpdBillOpdbillsWord(
        version,
        tenant,
        requestBody
      );
      saveAs(blob, "BillDetails.docx");
      return true;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

//  Get packages
export const fetchPackages = createAsyncThunk(
  "patientBilling/fetchPackages",
  async ({ version, tenant }: PackagesParams, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.getApiVOpdBillOpdbillsPackages(
        version,
        tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchServiceRate = createAsyncThunk<
  ServiceRateAndMediclaimResponseResultModel,
  {
    version: string;
    tenant?: string;
    requestBody: GetServiceRateRequest;
  }
>(
  "opd/fetchServiceRate",
  async ({ version, tenant, requestBody }, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.postApiVOpdBillOpdbillsServiceRate(
        version,
        tenant,
        requestBody
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Cancel & Refund (service-level)
export interface CancelServiceDetailInput {
  serviceId: string;
  billRequisitionDetailId: string;
  cancelServiceAmount: number;
}

export interface ReceiptPaymentInput {
  billReceiptPaymentDetailId: string | null;
  amount: number;
  receiptDate: string; // ISO
  paymentMode: string | null;
  transactionnumber: string | null;
  bankname: string | null;
  chequeno: string | null;
  chequedate: string | null; // ISO
  branchname: string | null;
  approvalNumber: string | null;
}

export interface CancelAndRefundModel {
  cancelServiceDetails: CancelServiceDetailInput[];
  cancelReason: string;
  cancelRemark: string;
  recordRefund: number; // 0 | 1
  receiptPayments: ReceiptPaymentInput[];
  billId: string;
  hospitalId: string;
  user: string;
}

export const cancelAndRefund = createAsyncThunk<
  any,
  { version: string; tenant?: string; model: CancelAndRefundModel },
  { rejectValue: any }
>(
  "opdBills/cancelAndRefund",
  async ({ version, tenant, model }, { rejectWithValue }) => {
    try {
      const requestBody: CancelServiceCommand = { model } as unknown as CancelServiceCommand;
      const response = await OpdBillService.postApiVOpdBillOpdbillsServiceCancelAndRefund(
        version,
        tenant,
        requestBody
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.body ?? error);
    }
  }
);

// Fetch Patient Category List
export const fetchPatientCategoryList = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "opdFilters/fetchPatientCategoryList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response = await IpdService.getApiVIpdGetPatientCategoryList(
        version,
        tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch patient category list"
      );
    }
  }
);

// Fetch Patient Companies by Category
export const fetchPatientCompaniesByCategory = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string; schemeCompanyTypeIds: string[] },
  { rejectValue: string }
>(
  "opdFilters/fetchPatientCompaniesByCategory",
  async ({ version, tenant, schemeCompanyTypeIds }, { rejectWithValue }) => {
    try {
      const response =
        await IpdService.postApiVIpdGetPatientCompaniesbycategory(
          version,
          tenant,
          { schemeCompanyTypeIds }
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch patient companies"
      );
    }
  }
);

// Fetch Visit Type List
export const fetchVisitTypeList = createAsyncThunk<
  VisitTypeEnumDtoListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "opdFilters/fetchVisitTypeList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response =
        await OpdBillService.getApiVOpdBillOpdbillsPatientVisitType(
          version,
          tenant
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch visit type list"
      );
    }
  }
);

// Fetch Consultant Doctors
export const fetchConsultantDoctors = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string; hospitalServiceId?: string },
  { rejectValue: string }
>(
  "opdFilters/fetchConsultantDoctors",
  async ({ version, tenant, hospitalServiceId }, { rejectWithValue }) => {
    try {
      const response = await OpdBillService.getApiVOpdBillOpdbillsDoctors(
        version,
        hospitalServiceId,
        tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch consultant doctors"
      );
    }
  }
);

// Fetch Billing Class List
export const fetchBillingClassList = createAsyncThunk<
  Array<{ key: string; value: string }>,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "opdFilters/fetchBillingClassList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response: Array<{ key: string; value: string }> =
        (await IpdService.getApiVIpdBillingClassList(version, tenant)).map(
          (item) => ({
            key: item.key ?? "",
            value: item.value ?? "",
          })
        );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch billing class list"
      );
    }
  }
);

// Fetch Estimation Types
export const fetchEstimationTypes = createAsyncThunk<
  KVPairListResultModelResultModel,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "opdFilters/fetchEstimationTypes",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response = await ChargesEstimationService.getApiVChargesEstimationEstimationTypeenum(
        version,
        tenant
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch estimation types"
      );
    }
  }
);

// Fetch Gender List
export const fetchGenderList = createAsyncThunk<
  Array<{ genderId: number; genderName: string }>,
  { version: string; tenant?: string },
  { rejectValue: string }
>(
  "opdFilters/fetchGenderList",
  async ({ version, tenant }, { rejectWithValue }) => {
    try {
      const response = await GenderService.getApiVGenderList(version, tenant);
      return response.map((g) => ({
        genderId: g.genderId ?? 0,
        genderName: g.genderName ?? "",
      }));
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch gender list");
    }
  }
);
