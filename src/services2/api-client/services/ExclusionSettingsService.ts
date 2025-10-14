/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelExclusionSettingsCategoryResponseDtoListResultModel } from '../models/CancelExclusionSettingsCategoryResponseDtoListResultModel';
import type { CancelPatientTypeByBillTypeResponseDtoListResultModel } from '../models/CancelPatientTypeByBillTypeResponseDtoListResultModel';
import type { CreateDoctorTypeByDepartmentCommand } from '../models/CreateDoctorTypeByDepartmentCommand';
import type { CreateDoctortypeServiceexclusionCommand } from '../models/CreateDoctortypeServiceexclusionCommand';
import type { CreateExclusionSettingsForCategoryCommand } from '../models/CreateExclusionSettingsForCategoryCommand';
import type { CreatePatientTypeByBillTypeCommand } from '../models/CreatePatientTypeByBillTypeCommand';
import type { DeleteDoctorTypeByDepartmentCommand } from '../models/DeleteDoctorTypeByDepartmentCommand';
import type { DeleteDoctorTypeByDepartmentRequestDTOResultModel } from '../models/DeleteDoctorTypeByDepartmentRequestDTOResultModel';
import type { DeleteExclusionSettingsForCategoryCommand } from '../models/DeleteExclusionSettingsForCategoryCommand';
import type { DeletePatientTypeByBillTypeCommand } from '../models/DeletePatientTypeByBillTypeCommand';
import type { DoctorTypeByDepartmentSaveResponseDTOResultModel } from '../models/DoctorTypeByDepartmentSaveResponseDTOResultModel';
import type { DoctorTypeDepartmentSearchFilterRequestDTO } from '../models/DoctorTypeDepartmentSearchFilterRequestDTO';
import type { DoctorTypeDepartmentSearchFilterResponseDTOPagedResponseDtoResultModel } from '../models/DoctorTypeDepartmentSearchFilterResponseDTOPagedResponseDtoResultModel';
import type { DoctortypeServiceexclusionDelete } from '../models/DoctortypeServiceexclusionDelete';
import type { DoctortypeServiceexclusionDeleteResponseDtoListResultModel } from '../models/DoctortypeServiceexclusionDeleteResponseDtoListResultModel';
import type { DoctorTypeServiceGetByIdResponseDtoListResultModel } from '../models/DoctorTypeServiceGetByIdResponseDtoListResultModel';
import type { DoctorTypeServiceGetByIdResponseDtoResultModel } from '../models/DoctorTypeServiceGetByIdResponseDtoResultModel';
import type { ExclusionSetting_CategoryByDoctorTypeSearchFilterRequestDto } from '../models/ExclusionSetting_CategoryByDoctorTypeSearchFilterRequestDto';
import type { ExclusionSetting_CategoryByDoctorTypeSearchFilterResponseDtoPagedResponseDtoResultModel } from '../models/ExclusionSetting_CategoryByDoctorTypeSearchFilterResponseDtoPagedResponseDtoResultModel';
import type { ExclusionSettingsRequestDto } from '../models/ExclusionSettingsRequestDto';
import type { ExclusionSettingsResponseDtoPagedResponseDtoResultModel } from '../models/ExclusionSettingsResponseDtoPagedResponseDtoResultModel';
import type { GetByIdForCategoryByDoctorTypeResponseDtoListResultModel } from '../models/GetByIdForCategoryByDoctorTypeResponseDtoListResultModel';
import type { GetByIdForCategoryByDoctorTypeResponseDtoResultModel } from '../models/GetByIdForCategoryByDoctorTypeResponseDtoResultModel';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { KVPairResultModel } from '../models/KVPairResultModel';
import type { PatientTypeByBillTypeGetByIdResponseDtoResultModel } from '../models/PatientTypeByBillTypeGetByIdResponseDtoResultModel';
import type { PatientTypeByBillTypeSaveResponseDtoListResultModel } from '../models/PatientTypeByBillTypeSaveResponseDtoListResultModel';
import type { PatientTypeByBillTypeSearchFilterRequestDto } from '../models/PatientTypeByBillTypeSearchFilterRequestDto';
import type { PatientTypeByBillTypeSearchFilterResponseDtoPagedResponseDtoResultModel } from '../models/PatientTypeByBillTypeSearchFilterResponseDtoPagedResponseDtoResultModel';
import type { PatientTypeByServiceDelete } from '../models/PatientTypeByServiceDelete';
import type { PatientTypeByServiceDeleteResponseDtoListResultModel } from '../models/PatientTypeByServiceDeleteResponseDtoListResultModel';
import type { PatientTypeByServiceGetByIdDtoResultModel } from '../models/PatientTypeByServiceGetByIdDtoResultModel';
import type { PatientTypeByServiceListRequestDto } from '../models/PatientTypeByServiceListRequestDto';
import type { PatientTypeByServiceListResponseDtoPagedResponseDtoResultModel } from '../models/PatientTypeByServiceListResponseDtoPagedResponseDtoResultModel';
import type { PatientTypeByServiceSave } from '../models/PatientTypeByServiceSave';
import type { PatientTypeByServiceSaveResponseDtoListResultModel } from '../models/PatientTypeByServiceSaveResponseDtoListResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExclusionSettingsService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsCategoryByDoctorTypeGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/CategoryByDoctorTypeGetCreatedBy',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsCategoryByDoctorTypeGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/CategoryByDoctorTypeGetModifiedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns GetByIdForCategoryByDoctorTypeResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsCategoryByDoctorTypeGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<GetByIdForCategoryByDoctorTypeResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/CategoryByDoctorTypeGetById{id}',
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
     * @returns ExclusionSetting_CategoryByDoctorTypeSearchFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsCategoryByDoctorTypelist(
        version: string,
        tenant?: string,
        requestBody?: ExclusionSetting_CategoryByDoctorTypeSearchFilterRequestDto,
    ): CancelablePromise<ExclusionSetting_CategoryByDoctorTypeSearchFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/CategoryByDoctorTypelist',
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
     * @returns GetByIdForCategoryByDoctorTypeResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsCategoryByDoctorTypeSave(
        version: string,
        tenant?: string,
        requestBody?: CreateExclusionSettingsForCategoryCommand,
    ): CancelablePromise<GetByIdForCategoryByDoctorTypeResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/CategoryByDoctorTypeSave',
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
     * @returns CancelExclusionSettingsCategoryResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVExclusionSettingsCategoryByDoctorTypeDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteExclusionSettingsForCategoryCommand,
    ): CancelablePromise<CancelExclusionSettingsCategoryResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExclusionSettings/CategoryByDoctorTypeDelete',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsDoctorTypeByServiceExclusionGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByServiceExclusionGetCreatedBy',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsDoctorTypeByServiceExclusionGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByServiceExclusionGetModifiedBy',
            path: {
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
     * @returns ExclusionSettingsResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsDoctorTypeByServiceExclusionList(
        version: string,
        tenant?: string,
        requestBody?: ExclusionSettingsRequestDto,
    ): CancelablePromise<ExclusionSettingsResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByServiceExclusionList',
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
     * @returns DoctorTypeServiceGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsDoctorTypeByServiceExclusionGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<DoctorTypeServiceGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByServiceExclusionGetById{id}',
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
     * @returns DoctorTypeServiceGetByIdResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsDoctorTypeByServiceExclusionSave(
        version: string,
        tenant?: string,
        requestBody?: CreateDoctortypeServiceexclusionCommand,
    ): CancelablePromise<DoctorTypeServiceGetByIdResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByServiceExclusionSave',
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
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsDoctorTypeByDepartmentGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByDepartmentGetCreatedBy',
            path: {
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
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsDoctorTypeByDepartmentGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByDepartmentGetModifiedBy',
            path: {
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
     * @returns DoctorTypeByDepartmentSaveResponseDTOResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsDoctorTypeByDepartmentSave(
        version: string,
        tenant?: string,
        requestBody?: CreateDoctorTypeByDepartmentCommand,
    ): CancelablePromise<DoctorTypeByDepartmentSaveResponseDTOResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByDepartmentSave',
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
     * @returns DeleteDoctorTypeByDepartmentRequestDTOResultModel OK
     * @throws ApiError
     */
    public static deleteApiVExclusionSettingsDoctorTypeByDepartmentDelete(
        version: string,
        tenant?: string,
        requestBody?: DeleteDoctorTypeByDepartmentCommand,
    ): CancelablePromise<DeleteDoctorTypeByDepartmentRequestDTOResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByDepartmentDelete',
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
     * @param id
     * @param tenant
     * @returns KVPairResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsDoctorTypeByDepartmentGetById(
        version: string,
        id?: string,
        tenant?: string,
    ): CancelablePromise<KVPairResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByDepartmentGetById',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
            query: {
                'id': id,
            },
        });
    }
    /**
     * @param version
     * @param tenant
     * @param requestBody
     * @returns DoctorTypeDepartmentSearchFilterResponseDTOPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsDoctorTypeByDepartmentlist(
        version: string,
        tenant?: string,
        requestBody?: DoctorTypeDepartmentSearchFilterRequestDTO,
    ): CancelablePromise<DoctorTypeDepartmentSearchFilterResponseDTOPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByDepartmentlist',
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
     * @returns DoctortypeServiceexclusionDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVExclusionSettingsDoctorTypeByServiceExclusionDelete(
        version: string,
        tenant?: string,
        requestBody?: DoctortypeServiceexclusionDelete,
    ): CancelablePromise<DoctortypeServiceexclusionDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExclusionSettings/DoctorTypeByServiceExclusionDelete',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsPatientTypeByServiceGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByServiceGetCreatedBy',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsPatientTypeByServiceGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByServiceGetModifiedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns PatientTypeByServiceGetByIdDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsPatientTypeByServiceGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PatientTypeByServiceGetByIdDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByServiceGetById{id}',
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
     * @returns PatientTypeByServiceListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsPatientTypeByServiceList(
        version: string,
        tenant?: string,
        requestBody?: PatientTypeByServiceListRequestDto,
    ): CancelablePromise<PatientTypeByServiceListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByServiceList',
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
     * @returns PatientTypeByServiceSaveResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsPatientTypeByServiceSave(
        version: string,
        tenant?: string,
        requestBody?: PatientTypeByServiceSave,
    ): CancelablePromise<PatientTypeByServiceSaveResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByServiceSave',
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
     * @returns PatientTypeByServiceDeleteResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVExclusionSettingsPatientTypeByServiceDelete(
        version: string,
        tenant?: string,
        requestBody?: PatientTypeByServiceDelete,
    ): CancelablePromise<PatientTypeByServiceDeleteResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByServiceDelete',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsPatientTypeByBillTypeGetCreatedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByBillTypeGetCreatedBy',
            path: {
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsPatientTypeByBillTypeGetModifiedBy(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByBillTypeGetModifiedBy',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
    /**
     * @param id
     * @param version
     * @param tenant
     * @returns PatientTypeByBillTypeGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVExclusionSettingsPatientTypeByBillTypeGetById(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PatientTypeByBillTypeGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByBillTypeGetById{id}',
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
     * @returns PatientTypeByBillTypeSearchFilterResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsPatientTypeByBillTypelist(
        version: string,
        tenant?: string,
        requestBody?: PatientTypeByBillTypeSearchFilterRequestDto,
    ): CancelablePromise<PatientTypeByBillTypeSearchFilterResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByBillTypelist',
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
     * @returns PatientTypeByBillTypeSaveResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static postApiVExclusionSettingsPatientTypeByBillTypeSave(
        version: string,
        tenant?: string,
        requestBody?: CreatePatientTypeByBillTypeCommand,
    ): CancelablePromise<PatientTypeByBillTypeSaveResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByBillTypeSave',
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
     * @returns CancelPatientTypeByBillTypeResponseDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVExclusionSettingsPatientTypeByBillTypeDelete(
        version: string,
        tenant?: string,
        requestBody?: DeletePatientTypeByBillTypeCommand,
    ): CancelablePromise<CancelPatientTypeByBillTypeResponseDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/ExclusionSettings/PatientTypeByBillTypeDelete',
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
