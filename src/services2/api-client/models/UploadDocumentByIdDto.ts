/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { UploadDocumentDetails } from './UploadDocumentDetails';
export type UploadDocumentByIdDto = {
    hospitalId?: string;
    patientvisitId?: string;
    departmentId?: string | null;
    scanDateTime?: string;
    uploadDocumentDetails?: Array<UploadDocumentDetails> | null;
};

