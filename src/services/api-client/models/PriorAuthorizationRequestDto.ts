/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import { ValidationError } from "./ValidationError"


export type PriorAuthorizationRequestDto = {
        id: string,
        patientName: string,
        uhid: string,
        visitNo: string,
        visitType: string,
        patientCategory: string,
        visit: string,
        patientCompany: string,
        associateCompanyName: string,
        insuranceDetail: string,
        insurancePolicyNumber: string,
        preAuthNoCode: string,
        sumInsuranceAmount: 0,
        modifiedOn: string,
        modifiedby: string,
        createdOn: string,
        createdBy: string,
        patientVisitId:string|null,
        patientId:string|null
        amounts: Array<Amount>
    }
export type Amount={
    approvedAmount: 0,
    approvalDate: string,
    status: string,
    remark: string
}
export type PriorAuthorizationRequestListDto = {
    data: {
    items: Array<PriorAuthorizationRequestDto>,
    metadata:{ page:{
        currentPage: number,
        pageSize: number,
        totalCount: number,
        totalPages: number
    }
}|null
isError: boolean,
        errorMessage: string | null,
        validationErrors: Array<ValidationError> | null,
        errorCode: string | null
    }
}

export type PriorAuthorizationModelDto = {
    createPriorAuthorizationCommand: any,
    Model: {
        patientVisitId: string,
        insuranceName: string,
        schemeCompanyID: string,
        insurancepolicyNumber: string,
        claimId: string,
        sumAssured: number,
        approvalDateTime: string,
        isApproved: boolean,
        amountList: Array<number>,
        remarks: string
    }
}
export type PriorAuthorizationRequest = {
    patientVisitId: string,
    insuranceName: string,
    schemeCompanyID: string,
    insurancepolicyNumber: string,
    claimId: string,
    sumAssured: number,
    approvalDateTime: string,
    isApproved: boolean,
}
export type amountDto= {
    patientpriorauthdetailid: string,
    approvedAmount: number,
    approvaldateTime: string,
    isApproved: boolean,
    remark: string
  }
export type priorAuthDto= {
          id: string,
          patientVisitId: string,
          insuranceName: string,
          insurancePolicyNumber: string,
          preAuthNo: string,
          sumAssuredAmount: 0,
          amounts: Array<amountDto>
    }
export type priorAuthDtoResponse= {
    data: priorAuthDto,
    isError: boolean,
    errorMessage: string | null,
    validationErrors: Array<ValidationError> | null,
    errorCode: string | null
}
       
        