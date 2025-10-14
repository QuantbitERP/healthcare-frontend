/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { DoctorMasterAddressDetailsSaveRequestDTO } from './DoctorMasterAddressDetailsSaveRequestDTO';
import type { DoctorMasterContactSaveRequestDTO } from './DoctorMasterContactSaveRequestDTO';
import type { DoctorMasterFollowUpRulesSaveRequestDTO } from './DoctorMasterFollowUpRulesSaveRequestDTO';
import type { DoctorMasterOfficialDetailsSaveDTO } from './DoctorMasterOfficialDetailsSaveDTO';
import type { UpdateAfflicationAndRolesRequestDTO } from './UpdateAfflicationAndRolesRequestDTO';
import type { UpdateAttachmentMasterDTO } from './UpdateAttachmentMasterDTO';
export type DoctorMasterUpdateRequestDTO = {
    doctorId?: string;
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
    updateContacts?: DoctorMasterContactSaveRequestDTO;
    updateAddress?: DoctorMasterAddressDetailsSaveRequestDTO;
    doctorMasterFollowUpRulesUpdate?: DoctorMasterFollowUpRulesSaveRequestDTO;
    updateOfficialDetails?: DoctorMasterOfficialDetailsSaveDTO;
    updateAfflicationAndRolesDTO?: Array<UpdateAfflicationAndRolesRequestDTO> | null;
    doctorMasterAttachmentSaveDTO?: Array<UpdateAttachmentMasterDTO> | null;
};

