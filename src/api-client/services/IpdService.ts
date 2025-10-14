/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { BillingStatusCountDto } from "../models/BillingStatusCountDto";
import type { DischargeStatusCountDto } from "../models/DischargeStatusCountDto";
import type { KVPair } from "../models/KVPair";
import type { WardStatusCountDto } from "../models/WardStatusCountDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { IpdBillDetailsResponse } from "@/store/ipd_bill_details/types";
export class IpdService {
  /**
   * @param version
   * @param tenant
   * @returns DischargeStatusCountDto OK
   * @throws ApiError
   */
  public static getApiVIpdDischargeStatus(
    version: string,
    tenant?: string
  ): CancelablePromise<DischargeStatusCountDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/IPD/dischargeStatus",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
    });
  }
  /**
   * @param version
   * @param tenant
   * @returns KVPair OK
   * @throws ApiError
   */
  public static getApiVIpdBillingClassList(
    version: string,
    tenant?: string
  ): CancelablePromise<Array<KVPair>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/IPD/billingClassList",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
    });
  }
  /**
   * @param version
   * @param tenant
   * @returns BillingStatusCountDto OK
   * @throws ApiError
   */
  public static getApiVIpdTodayCount(
    version: string,
    tenant?: string
  ): CancelablePromise<BillingStatusCountDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/IPD/todayCount",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
    });
  }
  /**
   * @param version
   * @param tenant
   * @returns WardStatusCountDto OK
   * @throws ApiError
   */
  public static getApiVIpdWardStatus(
    version: string,
    tenant?: string
  ): CancelablePromise<WardStatusCountDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/IPD/wardStatus",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
    });
  }
  /**
   * @param version
   * @param tenant
   * @returns any OK
   * @throws ApiError
   */
  public static getApiVIpdPaidStatus(
    version: string,
    tenant?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/IPD/paidStatus",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
    });
  }
  /**
   * @param version
   * @param tenant
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static postApiVIpdBillId(
    version: string,
    tenant?: string,
    requestBody?: {
      billId: string;
    }
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/IPD/billId",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
      body: requestBody,
    });
  }
  /**
   * @param version
   * @param tenant
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static postApiVIpdSearchServiceslist(
    version: string,
    tenant?: string,
    requestBody?: {
      hospitalId: string;
      searchterm: string;
      page: number;
      pageSize: number;
    }
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/IPD/SearchServiceslist",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
      body: requestBody,
    });
  }
  /**
   * @param version
   * @param tenant
   * @param requestBody
   * @returns any OK
   * @throws ApiError
   */
  public static postApiVIpdIpdBillsSaveFinal(
    version: string,
    tenant?: string,
    requestBody?: {
      model: any;
    }
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/IPD/ipdbills/savefinal",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
      body: requestBody,
    });
  }

  public static postApiVIpdIpdBillsSaveDraft(
    version: string,
    tenant?: string,
    requestBody?: {
      model: any;
    }
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/IPD/ipdbills/savedraft",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
      body: requestBody,
    });
  }

  public static getApiVIpdVisitDetails(
    version: string,
    patientId: string,
    visitId?: string,
    tenant?: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v{version}/IPD/visitdetails",
      path: {
        version: version,
      },
      query: {
        Patientid: patientId,
        PatientVisitID: visitId,
      },
      headers: {
        tenant: tenant,
      },
    });
  }
  public static postApiVIpdGetIpdDraftBillDetailsByBillId(
    version: string,
    tenant?: string,
    requestBody?: {
      billId: string;
    }
  ): CancelablePromise<IpdBillDetailsResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v{version}/IPD/getIpdDraftBillDetailsByBillId",
      path: {
        version: version,
      },
      headers: {
        tenant: tenant,
      },
      body: requestBody,
    });
  }
}
