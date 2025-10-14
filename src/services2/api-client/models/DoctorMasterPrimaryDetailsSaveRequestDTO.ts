/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorMasterAddressDetailsSaveRequestDTO } from './DoctorMasterAddressDetailsSaveRequestDTO';
import type { DoctorMasterAttachmentSaveRequestDTO } from './DoctorMasterAttachmentSaveRequestDTO';
import type { DoctorMasterContactSaveRequestDTO } from './DoctorMasterContactSaveRequestDTO';
import type { DoctorMasterFollowUpRulesSaveRequestDTO } from './DoctorMasterFollowUpRulesSaveRequestDTO';
import type { DoctorMasterHospitalAffilliationAndRolesSaveRequestDTO } from './DoctorMasterHospitalAffilliationAndRolesSaveRequestDTO';
import type { DoctorMasterOfficialDetailsSaveDTO } from './DoctorMasterOfficialDetailsSaveDTO';
export type DoctorMasterPrimaryDetailsSaveRequestDTO = {
    prefix?: number | null;
    firstname?: string | null;
    middlename?: string | null;
    lastname?: string | null;
    bmhC_NO?: string | null;
    gender?: number;
    isPrescribeControlledMedicine?: boolean | null;
    show_appointment?: boolean;
    showOnRegistration?: boolean;
    deactive?: boolean;
    doctorMasterContactSaveDTO?: DoctorMasterContactSaveRequestDTO;
    hospitalAffilliationAndRolesSaveDTO?: Array<DoctorMasterHospitalAffilliationAndRolesSaveRequestDTO> | null;
    doctorMasterFollowUpRulesSaveDTO?: DoctorMasterFollowUpRulesSaveRequestDTO;
    doctorMasterAddressDetailsSaveDTO?: DoctorMasterAddressDetailsSaveRequestDTO;
    doctorMasterOfficialDetailsSaveDTO?: DoctorMasterOfficialDetailsSaveDTO;
    doctorMasterAttachmentSaveDTO?: Array<DoctorMasterAttachmentSaveRequestDTO> | null;
};

