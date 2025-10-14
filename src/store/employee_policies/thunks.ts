import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ActivePolicyCountResponseDTOResultModel,
  CreateEmployeePolicyCommand,
  DeleteEmployeePolicyCommand,
  DeleteEmployeePolicyResponseDtoListResultModel,
  EmployeePolicySaveResponseDTOResultModel,
  EmployeePolicySearchFilterRequestDto,
  EmployeePolicyService,
  GetEmployeePolicyByIdResponseDtoResultModel,
  KVPairListResultModelResultModel,
  UpdateEmployeePolicyCommand,
  UpdateEmployeePolicyResponseDTOResultModel,
} from "@/services2/api-client";

// export const fetchScores = createAsyncThunk("score/fetchScores", async () => {

//   const response: EmployeePolicySearchFilterResponseDtoPagedResponseDto =
//     await EmployeePolicyService.getApiVEmployeePolicyActivePolicyCount(
//       version,
//       tenant,
//       date
//     );
//   return response;
//   return new Promise<ScoreDataItem[]>((resolve) =>
//     setTimeout(() => resolve(data), 500)
//   );
// });

export const fetchScores = createAsyncThunk(
  "employeePolicy/fetchScores",
  async ({
    version,
    tenant,
    date,
  }: {
    version: string;
    tenant?: string;
    date?: string;
  }): Promise<any> => {
    const response: ActivePolicyCountResponseDTOResultModel =
      await EmployeePolicyService.getApiVEmployeePolicyActivePolicyCount(
        version,
        tenant,
        date
      );
    return response.data;
  }
);

export const fetchDependentRelations = createAsyncThunk(
  "employeePolicy/fetchDependentRelations",
  async ({ version, tenant }: { version: string; tenant?: string }) => {
    const response: KVPairListResultModelResultModel =
      await EmployeePolicyService.getApiVEmployeePolicyGetDependantList(
        version,
        tenant
      );
    return response.data;
  }
);

export const fetchPrefix = createAsyncThunk(
  "employeePolicy/fetchPrefix",
  async ({ version, tenant }: { version: string; tenant?: string }) => {
    const response: KVPairListResultModelResultModel =
    await EmployeePolicyService.getApiVEmployeePolicyGetPrefixList(
      version,
      tenant
    );
    return response.data;
  }
);

// export const fetchPolicyTableData = createAsyncThunk(
//   "policyTable/fetch",
//   async () => {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     return dummyPolicyData;
//   }
// );

export const fetchPolicyTableData = createAsyncThunk(
  "employeePolicy/fetchList",
  async ({
    version,
    tenant,
    requestBody,
  }: {
    version: string;
    tenant?: string;
    requestBody?: EmployeePolicySearchFilterRequestDto;
  }) => {
    const response = await EmployeePolicyService.postApiVEmployeePolicyList(
      version,
      tenant,
      requestBody
    );
    return response;
  }
);

export const createPolicyTableData = createAsyncThunk(
  "employeePolicy/createPolicyTableData",
  async (
    {
      version,
      tenant,
      requestBody,
    }: {
      version: string;
      tenant?: string;
      requestBody?: CreateEmployeePolicyCommand;
    },
    { rejectWithValue }
  ) => {
    try {
      const response: EmployeePolicySaveResponseDTOResultModel =
        await EmployeePolicyService.postApiVEmployeePolicy(
          version,
          tenant,
          requestBody
        );
      return response;
    } catch (err: any) {

      // Pass the complete error response data instead of just the message
      return rejectWithValue(err?.response?.data || err);
    }
  }
);

// export const fetchFilterOptions = createAsyncThunk(
//   "filters/fetch",
//   async () => {
//     await new Promise((resolve) => setTimeout(resolve, 200));
//     return dummyFilterData;
//   }
// );

// ✅ Fetch all filter options (CreatedBy, Category, Year, ModifiedBy, etc.)
export const fetchFilterOptions = createAsyncThunk(
  "employeePolicy/fetchFilters",
  async ({
    version,
    tenant,
  }: {
    version: string;
    tenant?: string;
  }): Promise<any> => {
    const [createdBy, category, year, modifiedBy] = await Promise.all([
      EmployeePolicyService.getApiVEmployeePolicyGetCreatedby(version, tenant),
      EmployeePolicyService.getApiVEmployeePolicyCategory(version, tenant),
      EmployeePolicyService.getApiVEmployeePolicyYear(version, tenant),
      EmployeePolicyService.getApiVEmployeePolicyGetModifiedby(version, tenant),
    ]);

    return {
      createdBy: createdBy.data?.items as KVPairListResultModelResultModel,
      category: category.data?.items as KVPairListResultModelResultModel,
      year: year.data?.items as KVPairListResultModelResultModel,
      modifiedBy: modifiedBy.data?.items as KVPairListResultModelResultModel,
    };
  }
);

export const fetchEmployeePolicySubCategories = createAsyncThunk(
  "employeePolicy/fetchSubCategories",
  async ({
    version,
    categoryId,
    tenant,
  }: {
    version: string;
    categoryId: string;
    tenant?: string;
  }): Promise<any> => {
    const response: KVPairListResultModelResultModel =
      await EmployeePolicyService.getApiVEmployeePolicySubCategory(
        version,
        categoryId,
        tenant
      );

    return response?.data?.items;
  }
);

export const deleteEmployeePolicy = createAsyncThunk(
  "employeePolicy/deleteEmployeePolicy",
  async ({
    version,
    tenant,
    requestBody,
  }: {
    version: string;
    tenant?: string;
    requestBody: DeleteEmployeePolicyCommand;
  }): Promise<DeleteEmployeePolicyResponseDtoListResultModel> => {
    const response: DeleteEmployeePolicyResponseDtoListResultModel =
      await EmployeePolicyService.deleteApiVEmployeePolicyDelete(
        version,
        tenant,
        requestBody
      );

    return response;
  }
);

export const fetchEmployeePolicyById = createAsyncThunk(
  "employeePolicy/fetchById",
  async ({
    id,
    version,
    tenant,
  }: {
    id: string;
    version: string;
    tenant?: string;
  }): Promise<GetEmployeePolicyByIdResponseDtoResultModel> => {
    const response: GetEmployeePolicyByIdResponseDtoResultModel =
      await EmployeePolicyService.getApiVEmployeePolicy(id, version, tenant);

    return response;
  }
);

export const updateEmployeePolicy = createAsyncThunk<
  UpdateEmployeePolicyResponseDTOResultModel,
  { version: string; tenant?: string; body: UpdateEmployeePolicyCommand },
  { rejectValue: any } // ✅ error type
>(
  "employeePolicy/update",
  async ({ version, tenant, body }, { rejectWithValue }) => {
    try {
      const response = await EmployeePolicyService.putApiVEmployeePolicy(
        version,
        tenant,
        body
      );
      return response;
    } catch (error: any) {

      // Pass the complete error response data instead of just the message
      return rejectWithValue(error?.response?.data || error);
    }
  }
);
