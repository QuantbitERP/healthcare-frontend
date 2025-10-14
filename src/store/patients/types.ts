import {PatientListDto} from "@/services/api-client/models/PatientListDto";
export interface Patient extends PatientListDto {
    patientid: string;
    patientMrn: string;
    patientAliasName: string | null;
    patientPassportNumber: string | null;
    patientVisaNumber: string | null;
    patientBarcode: string | null;
    patientMobileNo: string;
    patientName: string;
    patientAdress: string;
    patientGender: string;
    patientBirthDate: string | null;
    patientAge: number;
    hospitalid: string;
    createdon: string | null;
    status: string | null;
    payment: string | null;
}
  export interface PatientState {
    patients: Patient[];
    loading: boolean;
    error: string | null;
}
    
