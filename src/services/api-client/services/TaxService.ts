
import type { ModifiedbyUser,TaxResponse,CreatedBy,TaxDtoRequest,TaxTypes, TaxByIdResponse, TaxSave} from '../models/TaxDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaxService {
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
     public static postApiVTax(
         version: string,
         tenant?: string,
         requestBody?: TaxSave,
     ): CancelablePromise<any> {
         return __request(OpenAPI, {
             method: 'POST',
             url: '/api/v{version}/TaxMaster/Save',
             path: {
                 'version': version,
             },
             headers: {
                 'tenant': tenant,
            },
            body: requestBody,
             mediaType: 'application/json',
         });
     }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVServiceGroup(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ServiceGroup',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
     public static putApiVTax(
        id: string,
        version: string,
        tenant?: string,
        requestBody?: TaxSave,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/TaxMaster',
            path: {
                'id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns ServiceGroupDto OK
     * @throws ApiError
     */
    public static getApiVTaxById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<TaxByIdResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/GetTaxMasterById/{id}',
            path: {
                'id': id,
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }  
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ServiceGroupDto OK
     * @throws ApiError
     */
    public static postApiVTaxList(
        version: string,
        tenant?: string,
        requestBody?: TaxDtoRequest,
    ): CancelablePromise<TaxResponse> {
        return __request(OpenAPI, {
            method: 'POST',
           // url: '/api/v{version}/TaxMaster/TaxMasterByFilterWithSearch',
            url: '/api/v{version}/TaxMaster/list',

            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    public static GetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<CreatedBy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/getCreatedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
         
            mediaType: 'application/json',
        });
    }
    public static GetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<ModifiedbyUser> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/getModifiedbyUser',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
         
            mediaType: 'application/json',
        });
    }
    public static GetTaxTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<TaxTypes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/TaxMaster/TaxTypes',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },   
            mediaType: 'application/json',
        });
    }
    public static GetStatus(
        version: string,
        tenant?: string,
    ): CancelablePromise<TaxTypes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/AssociateSchemeCompany/GetStatusList',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },   
            mediaType: 'application/json',
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiVTax(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/TaxMaster',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
