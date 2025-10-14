/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type {
  DepositConversionListRequestDto,
  DepositConversionListResponseDtoResultModel,
  DepositTypeListResponseDtoResultModel,
  TransferToEnumResponseDtoResultModel
} from '../models/DepositConversionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DepositConversionService {
  /**
   * Get deposit conversion list with filters
   * @param requestBody
   * @param version
   * @param tenant
   * @returns DepositConversionListResponseDtoResultModel OK
   * @throws ApiError
   */
  public static postApiVDepositConversionList(
    requestBody: DepositConversionListRequestDto,
    version: string,
    tenant?: string,
  ): CancelablePromise<DepositConversionListResponseDtoResultModel> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/v${version}/DepositConversion/list`,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain',
        'tenant': tenant,
      },
      body: requestBody,
    });
  }

  /**
   * Get deposit type list
   * @param requestBody
   * @param version
   * @param tenant
   * @returns DepositTypeListResponseDtoResultModel OK
   * @throws ApiError
   */
  public static postApiVDepositConversionGetDepositTypeList(
    requestBody: number[],
    version: string,
    tenant?: string,
  ): CancelablePromise<DepositTypeListResponseDtoResultModel> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/v${version}/DepositConversion/GetDepositTypeList`,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain',
        'tenant': tenant,
      },
      body: requestBody,
    });
  }

  /**
   * Get transfer to enum values
   * @param version
   * @param tenant
   * @returns TransferToEnumResponseDtoResultModel OK
   * @throws ApiError
   */
  public static getApiVDepositConversionTransferToEnum(
    version: string,
    tenant?: string,
  ): CancelablePromise<TransferToEnumResponseDtoResultModel> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/DepositConversion/TransferToEnum`,
      headers: {
        'accept': 'text/plain',
        'tenant': tenant,
      },
    });
  }

  /**
   * Get created by list
   * @param version
   * @param tenant
   * @returns DepositTypeListResponseDtoResultModel OK
   * @throws ApiError
   */
  public static getApiVDepositConversionGetCreatedByList(
    version: string,
    tenant?: string,
  ): CancelablePromise<DepositTypeListResponseDtoResultModel> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/DepositConversion/GetCreatedByList`,
      headers: {
        'accept': 'text/plain',
        'tenant': tenant,
      },
    });
  }

  /**
   * Get modified by list
   * @param version
   * @param tenant
   * @returns DepositTypeListResponseDtoResultModel OK
   * @throws ApiError
   */
  public static getApiVDepositConversionGetModifiedByList(
    version: string,
    tenant?: string,
  ): CancelablePromise<DepositTypeListResponseDtoResultModel> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/DepositConversion/GetModifiedByList`,
      headers: {
        'accept': 'text/plain',
        'tenant': tenant,
      },
    });
  }

  /**
   * Get receipt numbers for a patient
   * @param patientId
   * @param version
   * @param tenant
   * @returns KeyValuePairListResponseDtoResultModel OK
   * @throws ApiError
   */
  public static getApiVDepositConversionReceiptNoList(
    patientId: string,
    version: string,
    tenant?: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/DepositConversion/receiptNoList${patientId}`,
      headers: {
        'accept': 'text/plain',
        'tenant': tenant,
      },
    });
  }

  /**
   * Get receipt details by receipt ID
   * @param receiptId
   * @param version
   * @param tenant
   * @returns ReceiptDetailsResponseDtoResultModel OK
   * @throws ApiError
   */
  public static getApiVDepositConversionReceiptDetails(
    receiptId: string,
    version: string,
    tenant?: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/DepositConversion/receiptDetails/${receiptId}`,
      headers: {
        'accept': 'text/plain',
        'tenant': tenant,
      },
    });
  }

  /**
   * Save deposit conversion
   * @param requestBody
   * @param version
   * @param tenant
   * @returns any OK
   * @throws ApiError
   */
  public static postApiVDepositConversionSave(
    requestBody: any,
    version: string,
    tenant?: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/api/v${version}/DepositConversion/Save`,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain',
        'tenant': tenant,
      },
      body: requestBody,
    });
  }

  /**
   * Get deposit conversion by ID
   * @param id
   * @param version
   * @param tenant
   * @returns any OK
   * @throws ApiError
   */
  public static getApiVDepositConversionGetById(
    id: string,
    version: string,
    tenant?: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/api/v${version}/DepositConversion/GetById/${id}`,
      headers: {
        'accept': 'text/plain',
        'tenant': tenant,
      },
    });
  }
}
