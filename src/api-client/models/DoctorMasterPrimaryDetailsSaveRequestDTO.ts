/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
import type { DoctorMasterAddressDetailsSaveRequestDTO } from './DoctorMasterAddressDetailsSaveRequestDTO';
import type { DoctorMasterAttachmentSaveRequestDTO } from './DoctorMasterAttachmentSaveRequestDTO';
import type { DoctorMasterContactSaveRequestDTO } from './DoctorMasterContactSaveRequestDTO';
import type { DoctorMasterFollowUpRulesSaveRequestDTO } from './DoctorMasterFollowUpRulesSaveRequestDTO';
import type { DoctorMasterHospitalAfflicationAndRolesSaveRequestDTO } from './DoctorMasterHospitalAfflicationAndRolesSaveRequestDTO';
import type { DoctorMasterOfficialDetailsSaveDTO } from './DoctorMasterOfficialDetailsSaveDTO';
export type DoctorMasterPrimaryDetailsSaveRequestDTO = {
    prefix?: number;
    firstname?: string | null;
    middlename?: string | null;
    lastname?: string | null;
    bmhC_NO?: string | null;
    gender?: number;
    isControledMedicine?: boolean | null;
    showAppoinment?: boolean;
    showOnRegistration?: boolean;
    doctorMasterContactSaveDTO?: DoctorMasterContactSaveRequestDTO;
    hospitalAfflicationAndRolesSaveDTO?: Array<DoctorMasterHospitalAfflicationAndRolesSaveRequestDTO> | null;
    doctorMasterFollowUpRulesSaveDTO?: DoctorMasterFollowUpRulesSaveRequestDTO;
    doctorMasterAddressDetailsSaveDTO?: DoctorMasterAddressDetailsSaveRequestDTO;
    doctorMasterOfficialDetailsSaveDTO?: DoctorMasterOfficialDetailsSaveDTO;
    doctorMasterAttachmentSaveDTO?: Array<DoctorMasterAttachmentSaveRequestDTO> | null;
};

