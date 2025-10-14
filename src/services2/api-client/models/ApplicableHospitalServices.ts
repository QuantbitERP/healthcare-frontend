/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

export type ApplicableHospitalServices = {
    hospitalName?: string | null;
    hospitalId?: string | null;
    rateApplicable?: boolean;
    dailyAutoCharges?: boolean;
    dailyAutoChargesBillingClass?: string | null;
    isDoctorMandatory?: boolean;
    consentRequired?: boolean;
    approvalRequired?: boolean;
    applyChargeForPeriod?: boolean;
    cultureReportSettings?: boolean;
    gstIn?: boolean;
    gstPercent?: number;
    isConsultation?: boolean;
    isOneTimeCharge?: boolean;
    serviceApplicableForVisit?: string | null;
    gstAtBillLevel?: boolean | null;
    selectOneTimeChargesForVisit?: string | null;
    serviceNameEditable?: boolean | null;
    quantityEditable?: boolean | null;
};

