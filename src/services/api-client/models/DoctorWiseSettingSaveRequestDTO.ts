/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorWiseSettingDetailsSaveRequestDTO } from './DoctorWiseSettingDetailsSaveRequestDTO';
export type DoctorWiseSettingSaveRequestDTO = {
    doctorId?: string;
    applicableDate?: string;
    deactivate?: boolean;
    doctorWiseSettingDetails?: Array<DoctorWiseSettingDetailsSaveRequestDTO> | null;
};

