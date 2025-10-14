import { KVPair } from "@/api-client";

export type DoctorDtoRequest= {
    createdByList: Array<string>;
    modifiedByList:Array<string>;
    type: Array<number>;
    status:Array<number>;
    searchTerm: string;
    page: number;
    pageSize: number;
  } 
  export type DoctorResponse=
  {
      data: {
        items: Array<Doctor>
        metadata: {
          page: {
              currentPage: number,
              pageSize: number,
              totalPages: number
          }
      }
      }|null,
      isError: boolean,
      errorMessage: string| null,
      validationErrors: string|null,
      errorCode:string|null
    }
  
export type Doctor=
{
      doctorId:string;
      doctor:string;
      type:string;
      username:string;
      bMHCNo :string
      status:string
      createdBy:string
      createdOn:string 
      modifiedBy:string
      modifiedOn:string
}
export type DeleteDoctor={
    model: {
      id:Array<string>
    }
  }
export type Types={
    data: {
      items:Array<KVPair>;
    },
    isError: boolean;
    errorMessage: string|null;
    validationErrors: string|null;
    errorCode: string|null;
  }

  export type CommonResponse={
    data: {
      items:Array<KVPair>;
    },
    isError: boolean;
    errorMessage: string|null;
    validationErrors: string|null;
    errorCode: string|null;
  }

  export type CreatedBy={
    data: {
      items: Array<KVPair>;
    },
    isError: boolean;
    errorMessage: string|null;
    validationErrors: string|null;
    errorCode: string|null;
  }
  export type ModifiedbyUser=
  { data: 
    {
    items:Array<KVPair>;
  },
  isError: boolean;
  errorMessage: string|null;
  validationErrors: string|null;
  errorCode: string|null;
}

export type DoctorMasterContactSaveDTO=
{
  primaryNo: string,
  secondary_no: string,
  telephoneno: string
}
export type HospitalAfflicationAndRolesSaveDTO=
{
  id:string,
  afflication_Type: number,
  hospitalid: string,
  roles: Array<number>,
  departmentId: Array<string>,
  sub_Department: Array<string>,
  deactivate: boolean
}
export type DoctorMasterFollowUpRulesSaveDTO=
{
  numberOfFreeDays: number,
  numberOfFreeVisits: number,
  casePaperValidityDays: number,
  followupChargesType: number
}
export type DoctorMasterAttachmentSaveDTO=
{
  documentId: string|null,
  documentName: string,
  fileName: string,
  file_Path: string,
  filePath: string
}
export type DoctorMasterAddressDetailsSaveDTO=
{
  countryid?: string |null,
  stateid?: string |null,
  district?: string |null,
  cityid?: string |null,
  areaid?: string |null,
  pinCode?: string |null,
  address?: string |null
}
export type DoctorMasterOfficialDetailsSaveDTO=
{
  email: string,
  doctorCode: string,
  specialization: Array<string>,
  qualification: string,
  appoinmentSlots: number
}
export type DoctorSave=
{
  model: {
    id:string,
    prefix:number,
    firstname: string,
    middlename: string,
    lastname: string,
    bmhC_NO: string,
    gender: number,
    isPrescribeControlledMedicine: boolean,
    show_appointment: boolean,
    showOnRegistration: boolean,
    deactive: boolean,
    doctorMasterContactSaveDTO:DoctorMasterContactSaveDTO,
    hospitalAfflicationAndRolesSaveDTO: Array<HospitalAfflicationAndRolesSaveDTO>,
    DoctorMasterFollowUpRulesSaveDTO:DoctorMasterFollowUpRulesSaveDTO,
    doctorMasterAddressDetailsSaveDTO:DoctorMasterAddressDetailsSaveDTO
  doctorMasterOfficialDetailsSaveDTO:DoctorMasterOfficialDetailsSaveDTO,
    doctorMasterAttachmentSaveDTO:Array<DoctorMasterAttachmentSaveDTO>
  }
}

// Payload for Save operations
export type DoctorSavePayload = {
  model: {
    id: string;
    prefix: number;
    firstname: string;
    middlename: string;
    lastname: string;
    bmhC_NO: string;
    gender: number;
    isPrescribeControlledMedicine: boolean;
    show_appointment: boolean;
    showOnRegistration: boolean;
    deactive: boolean;
    doctorMasterContactSaveDTO: DoctorMasterContactSaveDTO;
    HospitalAffilliationAndRolesSaveDTO: Array<HospitalAfflicationAndRolesSaveDTO>;
    doctorMasterFollowUpRulesSaveDTO: DoctorMasterFollowUpRulesSaveDTO;
    doctorMasterAddressDetailsSaveDTO: DoctorMasterAddressDetailsSaveDTO;
    doctorMasterOfficialDetailsSaveDTO: DoctorMasterOfficialDetailsSaveDTO;
    doctorMasterAttachmentSaveDTO: Array<DoctorMasterAttachmentSaveDTO>;
  };
};

// Payload for Update operations
export type DoctorUpdatePayload = {
  model: {
    doctorId: string;
    prefix: number;
    firstname: string;
    middlename: string;
    lastname: string;
    bmhC_NO: string;
    gender: number;
    isPrescribeControlledMedicine: boolean;
    show_appointment: boolean;
    showOnRegistration: boolean;
    appointmentSlot: number;
    deactive: boolean;
    updateContacts: {
      primaryNo: string;
      secondary_no: string;
      telephoneno: string;
    };
    updateAddress: {
      countryid: string | null;
      stateid: string | null;
      district: string | null;
      cityid: string | null;
      areaid: string | null;
      pinCode: string | null;
      address: string;
    };
    doctorMasterFollowUpRulesUpdate: {
      numberOfFreeDays: number;
      numberOfFreeVisits: number;
      casePaperValidityDays: number;
      followupChargesType: number;
    };
    updateOfficialDetails: {
      email: string;
      doctorCode: string;
      specialization: Array<string>;
      qualification: string;
      appoinmentSlots: number;
    };
    updateAfflicationAndRolesDTO: Array<{
      hospDocTblId: string;
      afflication_Type: number;
      hospitalid: string;
      roles: Array<number>;
      departmentId: Array<string>;
      sub_Department: Array<string>;
      deactivate: boolean;
    }>;
    doctorMasterAttachmentSaveDTO: Array<{
      documentId: string;
      documentName: string;
      fileName: string;
      filePath: string;
    }>;
  };
};

export type DoctorByIdResponse = {
  data: {
    doctorId: string;
    prefix: number;
    firstname: string;
    middlename: string;
    lastname: string;
    bmhC_NO: string;
    gender: number;
    isPrescribeControlledMedicine: boolean;
    show_appointment: boolean;
    showOnRegistration: boolean;
    appointmentSlot: number;
    deactive: boolean;
    updateContacts: {
      primaryNo: string;
      secondary_no: string;
      telephoneno: string;
    };
    updateAddress: {
      countryid: string;
      stateid: string;
      district: string;
      cityid: string;
      areaid: string;
      pinCode: string;
      address: string;
    };
    doctorMasterFollowUpRulesUpdate: {
      numberOfFreeDays: number;
      numberOfFreeVisits: number;
      casePaperValidityDays: number;
      followupChargesType: number;
    };
    updateOfficialDetails: {
      email: string;
      doctorCode: string;
      specialization: Array<string>;
      qualification: string;
      appoinmentSlots: number;
    };
    updateAfflicationAndRolesDTO: Array<{
      hospDocTblId: string;
      afflication_Type: number;
      hospitalid: string;
      roles: Array<number>;
      departmentId: Array<string>;
      sub_Department: Array<string>;
      deactivate: boolean;
    }>;
    doctorMasterAttachmentSaveDTO: Array<{
      documentId: string;
      documentName: string;
      fileName: string;
      filePath: string;
    }>;
  };
  isError: boolean;
  errorMessage: string;
  validationErrors: Array<{
    field: string;
    message: string;
  }>;
  errorCode: string;
}