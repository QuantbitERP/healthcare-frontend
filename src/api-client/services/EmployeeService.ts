/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { EmployeeCatagoryListDTO } from '../models/EmployeeCatagoryListDTO';
import type { EmployeeDetailsDto } from '../models/EmployeeDetailsDto';
import type { EmployeeNVListDto } from '../models/EmployeeNVListDto';
import type { EmployeeSubCatagoryListDTO } from '../models/EmployeeSubCatagoryListDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeeService {
    /**
     * @param version
     * @param tenant
     * @returns EmployeeNVListDto OK
     * @throws ApiError
     */
    public static getApiVEmployeeEmployeeNvList(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeNVListDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Employee/employeeNVList',
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
     * @param id
     * @param tenant
     * @returns EmployeeDetailsDto OK
     * @throws ApiError
     */
    public static getApiVEmployeeEmployeeDetails(
        version: string,
        id?: string,
        tenant?: string,
    ): CancelablePromise<EmployeeDetailsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Employee/employeeDetails',
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
     * @returns EmployeeCatagoryListDTO OK
     * @throws ApiError
     */
    public static getApiVEmployeeEmployeeCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeCatagoryListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Employee/employeeCategories',
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
     * @returns EmployeeSubCatagoryListDTO OK
     * @throws ApiError
     */
    public static getApiVEmployeeEmployeeSubCategories(
        version: string,
        tenant?: string,
    ): CancelablePromise<Array<EmployeeSubCatagoryListDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Employee/employeeSubCategories',
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
     * @returns EmployeeDetailsDto OK
     * @throws ApiError
     */
    public static getApiVEmployeeEmployeePolicyCount(
        version: string,
        tenant?: string,
    ): CancelablePromise<EmployeeDetailsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v{version}/Employee/employeePolicyCount',
            path: {
                'version': version,
            },
            headers: {
                'tenant': tenant,
            },
        });
    }
}
