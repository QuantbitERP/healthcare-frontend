/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ApplyPackageRequestDto } from '../models/ApplyPackageRequestDto';
import type { ApplyPackageResponceDtoListResultModelResultModel } from '../models/ApplyPackageResponceDtoListResultModelResultModel';
import type { ApplyPackageSaveResponceDtoResultModel } from '../models/ApplyPackageSaveResponceDtoResultModel';
import type { CreateApplyPackageCommand } from '../models/CreateApplyPackageCommand';
import type { CreatePackageCommand } from '../models/CreatePackageCommand';
import type { DepartmentDto } from '../models/DepartmentDto';
import type { GetIPDPackageListRequestDto } from '../models/GetIPDPackageListRequestDto';
import type { GetIPDPackageTariffRequestDto } from '../models/GetIPDPackageTariffRequestDto';
import type { GetIPDPackageTariffResponseDtoResultModel } from '../models/GetIPDPackageTariffResponseDtoResultModel';
import type { GetPatientAppliedPackageListRequestDto } from '../models/GetPatientAppliedPackageListRequestDto';
import type { ItemCategoryDto } from '../models/ItemCategoryDto';
import type { ItemDto } from '../models/ItemDto';
import type { ItemKitDto } from '../models/ItemKitDto';
import type { KVPairListResultModelResultModel } from '../models/KVPairListResultModelResultModel';
import type { OpdBillPackageDetailsRequestDto } from '../models/OpdBillPackageDetailsRequestDto';
import type { OpdBillPackageDetailsResponseDtoListResultModelResultModel } from '../models/OpdBillPackageDetailsResponseDtoListResultModelResultModel';
import type { PackageBillingGetByIdResponseDtoResultModel } from '../models/PackageBillingGetByIdResponseDtoResultModel';
import type { PackageBillingGetByPatientDetailRequestDto } from '../models/PackageBillingGetByPatientDetailRequestDto';
import type { PackageBillingListRequestDto } from '../models/PackageBillingListRequestDto';
import type { PackageBillingListResponseDtoPagedResponseDtoResultModel } from '../models/PackageBillingListResponseDtoPagedResponseDtoResultModel';
import type { PackageCountResponseDtoResultModel } from '../models/PackageCountResponseDtoResultModel';
import type { PackageDeleteResponceDtoListResultModel } from '../models/PackageDeleteResponceDtoListResultModel';
import type { PackageNameListResponceDtoListResultModelResultModel } from '../models/PackageNameListResponceDtoListResultModelResultModel';
import type { PackageResponceDtoResultModel } from '../models/PackageResponceDtoResultModel';
import type { PatientCompanyDto } from '../models/PatientCompanyDto';
import type { ProfileDto } from '../models/ProfileDto';
import type { RemovePackageCommand } from '../models/RemovePackageCommand';
import type { RemovePackageResponseDtoResultModel } from '../models/RemovePackageResponseDtoResultModel';
import type { ServiceDto } from '../models/ServiceDto';
import type { ServiceGroupsDto } from '../models/ServiceGroupsDto';
import type { SubDepartmentDto } from '../models/SubDepartmentDto';
import type { UpdatePackageCommand } from '../models/UpdatePackageCommand';
import type { VisitTypeEnumDtoListResultModelResultModel } from '../models/VisitTypeEnumDtoListResultModelResultModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PackageBillingService {
    /**
     * @param version
     * @param tenant
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVPackageBillingPackageBillingPackageGender(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/PackageBilling/PackageGender',
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
     * @returns VisitTypeEnumDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static getApiVPackageBillingPackageBillingVisitType(
        version: string,
        tenant?: string,
    ): CancelablePromise<VisitTypeEnumDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/PackageBilling/visitType',
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
    public static getApiVPackageBillingPackageBillingGetPackageType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/PackageBilling/GetPackageType',
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
    public static getApiVPackageBillingPackageBillingPackageComponents(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/PackageBilling/PackageComponents',
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
    public static getApiVPackageBillingPackageBillingGetPackageInclude(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/PackageBilling/GetPackageInclude',
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
    public static getApiVPackageBillingPackageBillingGetLimitType(
        version: string,
        tenant?: string,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/PackageBilling/GetLimitType',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetServices(
        version: string,
        tenant?: string,
        requestBody?: ServiceDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getServices',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetDepartments(
        version: string,
        tenant?: string,
        requestBody?: DepartmentDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getDepartments',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetSubDepartments(
        version: string,
        tenant?: string,
        requestBody?: SubDepartmentDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getSubDepartments',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetServiceGroups(
        version: string,
        tenant?: string,
        requestBody?: ServiceGroupsDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getServiceGroups',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetProfile(
        version: string,
        tenant?: string,
        requestBody?: ProfileDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getProfile',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetItem(
        version: string,
        tenant?: string,
        requestBody?: ItemDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getItem',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetItemKits(
        version: string,
        tenant?: string,
        requestBody?: ItemKitDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getItemKits',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetItemCategory(
        version: string,
        tenant?: string,
        requestBody?: ItemCategoryDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getItemCategory',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetPatientCompanyFromPatientCatId(
        version: string,
        tenant?: string,
        requestBody?: PatientCompanyDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getPatientCompanyFromPatientCatId',
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
     * @returns PackageResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingSave(
        version: string,
        tenant?: string,
        requestBody?: CreatePackageCommand,
    ): CancelablePromise<PackageResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/Save',
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
     * @returns PackageResponceDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVPackageBilling(
        version: string,
        tenant?: string,
        requestBody?: UpdatePackageCommand,
    ): CancelablePromise<PackageResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PackageBilling',
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
     * @returns PackageDeleteResponceDtoListResultModel OK
     * @throws ApiError
     */
    public static deleteApiVPackageBilling(
        version: string,
        tenant?: string,
        requestBody?: Array<string>,
    ): CancelablePromise<PackageDeleteResponceDtoListResultModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v{version}/PackageBilling',
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
     * @returns PackageBillingListResponseDtoPagedResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingFilterWithSearch(
        version: string,
        tenant?: string,
        requestBody?: PackageBillingListRequestDto,
    ): CancelablePromise<PackageBillingListResponseDtoPagedResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/FilterWithSearch',
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
     * @returns PackageCountResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPackageBillingGetPackageCounts(
        version: string,
        tenant?: string,
    ): CancelablePromise<PackageCountResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/getPackageCounts',
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
     * @returns PackageBillingGetByIdResponseDtoResultModel OK
     * @throws ApiError
     */
    public static getApiVPackageBilling(
        id: string,
        version: string,
        tenant?: string,
    ): CancelablePromise<PackageBillingGetByIdResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/PackageBilling/{id}',
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
     * @returns OpdBillPackageDetailsResponseDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetOpdBillPackageDetails(
        version: string,
        tenant?: string,
        requestBody?: OpdBillPackageDetailsRequestDto,
    ): CancelablePromise<OpdBillPackageDetailsResponseDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getOpdBillPackageDetails',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetipdpackagelist(
        version: string,
        tenant?: string,
        requestBody?: GetIPDPackageListRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getipdpackagelist',
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
     * @returns GetIPDPackageTariffResponseDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetIpdPackageTariff(
        version: string,
        tenant?: string,
        requestBody?: GetIPDPackageTariffRequestDto,
    ): CancelablePromise<GetIPDPackageTariffResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getIpdPackageTariff',
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
     * @returns KVPairListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetpatientappliedpackagelist(
        version: string,
        tenant?: string,
        requestBody?: GetPatientAppliedPackageListRequestDto,
    ): CancelablePromise<KVPairListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/getpatientappliedpackagelist',
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
     * @returns PackageNameListResponceDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetpackageName(
        version: string,
        tenant?: string,
        requestBody?: PackageBillingGetByPatientDetailRequestDto,
    ): CancelablePromise<PackageNameListResponceDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/GetpackageName',
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
     * @returns RemovePackageResponseDtoResultModel OK
     * @throws ApiError
     */
    public static putApiVPackageBillingRemovepackage(
        version: string,
        tenant?: string,
        requestBody?: RemovePackageCommand,
    ): CancelablePromise<RemovePackageResponseDtoResultModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v{version}/PackageBilling/removepackage',
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
     * @returns ApplyPackageResponceDtoListResultModelResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingGetApplypackage(
        version: string,
        tenant?: string,
        requestBody?: ApplyPackageRequestDto,
    ): CancelablePromise<ApplyPackageResponceDtoListResultModelResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/GetApplypackage',
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
     * @returns ApplyPackageSaveResponceDtoResultModel OK
     * @throws ApiError
     */
    public static postApiVPackageBillingSaveApplyPackage(
        version: string,
        tenant?: string,
        requestBody?: CreateApplyPackageCommand,
    ): CancelablePromise<ApplyPackageSaveResponceDtoResultModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v{version}/PackageBilling/SaveApplyPackage',
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
