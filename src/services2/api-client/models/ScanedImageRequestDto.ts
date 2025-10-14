/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { ScannedImageDetails } from './ScannedImageDetails';
export type ScanedImageRequestDto = {
    hospitalId?: string;
    patientvisitId?: string;
    departmentId?: string | null;
    scanDateTime?: string;
    scannedImageDetails?: Array<ScannedImageDetails> | null;
};

