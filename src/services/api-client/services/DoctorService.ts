
import { DoctorDtoRequest ,DoctorResponse,ModifiedbyUser,CreatedBy,Types, DoctorSave, CommonResponse, } from '../models/DoctorDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DoctorService {

    public static getApiVHospitalHospitals(version: string, tenant: string | undefined): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Hospital/hospitals',
            path: {
                'version': version,
            },  
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }

    public static getApiVHospitalsubDepartment(hospitalId: string,departmentId: string,version: string, tenant: string | undefined): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Hospital/hospitals/subDepartment/{hospitalId}/{departmentId}',
            path: {
                'version': version,
                'hospitalId': hospitalId,
                'departmentId': departmentId,
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
      public static postApiVDoctor(
         version: string,
          tenant?: string,
          requestBody?: DoctorSave,
      ): CancelablePromise<any> {
          return __request(OpenAPI, {
              method: 'POST',
             url: '/api/v{version}/DoctorMaster/Save',
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
      public static putApiVDoctor(
         id: string,
         version: string,
         tenant?: string,
         requestBody?: DoctorSave,
     ): CancelablePromise<any> {
         return __request(OpenAPI, {
             method: 'PUT',
             url: '/api/v{version}/DoctorMaster/Update',
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
 
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns ServiceGroupDto OK
     * @throws ApiError
     */
    public static postApiVDoctorList(
        version: string,
        tenant?: string,
        requestBody?: DoctorDtoRequest,
    ): CancelablePromise<DoctorResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/DoctorMaster/list',

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
            url: '/api/v{version}/DoctorMaster/getCreatedBy',
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
            url: '/api/v{version}/DoctorMaster/getModifiedbyUser',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
         
            mediaType: 'application/json',
        });
    }
    public static GetDoctorTypes(
        version: string,
        tenant?: string,
    ): CancelablePromise<Types> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/doctorAffiliationType',
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
    ): CancelablePromise<Types> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Common/status',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },   
            mediaType: 'application/json',
        });
    }
    public static getDoctorPrefix(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/DoctorPrefix',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }
    public static getfollowupChargesType(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/followupChargesType',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }
    public static getSpecialization(
        version: string,
        tenant?: string,
    ): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/specialization',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }
    public static getDoctorAffiliationType(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/doctorAffiliationType',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }
    public static getDoctorRole(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/DoctorRole',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }
    public static getDepartmentKVlist(
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Departments/departmentKVlist',
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
     * @param hospitalId
     * @param tenant
     * @returns CommonResponse OK
     * @throws ApiError
     */
    public static getApiVHospitalWiseDepartments(
        version: string,
        hospitalId:Array<string>,
        tenant?: string,
    ): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/Hospitalwisedepartments',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: {
                hospitalId: hospitalId,
            },
            mediaType: 'application/json',
        });
    }
    /**
     * @param version
     * @param hospitalId
     * @param departmentIds
     * @param tenant
     * @returns CommonResponse OK
     * @throws ApiError
     */
    public static getApiVHospitalSubDepartments(
        version: string,
        hospitalId: Array<string>,
        departmentIds: Array<string>,
        tenant?: string,
    ): CancelablePromise<CommonResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/Hospital/SubDepartments',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            body: {
                hospitalId: hospitalId,
                departmentid: departmentIds,
            },
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns any OK
     * @throws ApiError
     */
    public static getApiVDoctorById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/DoctorMaster/{id}',
            path: {
                'version': version,
                'id': id,
            },
            headers: {
                'tenant': tenant,
            },
            mediaType: 'application/json',
        });
    }
}
