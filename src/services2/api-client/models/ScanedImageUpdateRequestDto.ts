/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ScanImageDetails } from './ScanImageDetails';
export type ScanedImageUpdateRequestDto = {
    documentUploadId?: string;
    hospitalId?: string;
    patientvisitId?: string;
    departmentId?: string | null;
    scanDateTime?: string;
    scanImageDetails?: Array<ScanImageDetails> | null;
};

