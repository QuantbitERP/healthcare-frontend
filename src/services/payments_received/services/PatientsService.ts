/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientsService {
    /**
     * Retrieves a list of patients for dropdown
     * @param search Search term for patient name, mobile, email, or UHID
     * @param hospitalId Filter by hospital ID
     * @returns any patients filtered by hospital
     * @throws ApiError
     */
    public static getApiMnPatients(
        search?: string,
        hospitalId?: number,
    ): CancelablePromise<{
        patients: Array<{
            id: number;
            hospital_id: number;
            name: string;
            mobile: string;
            email: string;
            uhid: string;
            age: number;
            gender: 'Male' | 'Female' | 'Other';
            status: 'Active' | 'Inactive';
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mn/patients',
            query: {
                'search': search,
                'hospital_id': hospitalId,
            },
        });
    }
}
