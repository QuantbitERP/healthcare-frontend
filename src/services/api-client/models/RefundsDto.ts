export interface RefundScoreDto {
  totalRefundRequests: number;
  approvedRefunds: number;
  pendingRefunds: number;
  totalRefundAmount: number;
}
export interface RefundsListDto
{
  id: string,
  refundNumber:string,
  status: string,
  requestedBy:string,
  requestedOn:string,
  patient: string,
  uhid:string,
  refundType: string,
  approvedBy: string,
  approvedRejectedOn: string
}
export interface RefundsListResponseDto {
  items: RefundsListDto[];
  totalCount: number;
}
export type RefundsListRequestDto = {
  searchText: string;
  status: string[];
  approvedBy: string[];
  refundType: string[];
  refundScope: string[];
  cancelledBills: boolean;
  meMode:string;
  page: number;
  fromDate:string,
  toDate:string,
  pageSize: number;
}
export type  RefundType ={
  refundTypeId : string,
  refundTypeName: string,
}
export type RefundStatus={
  statusId: string,
  statusName:string,
}
export type  ApprovedBy={
  approvedById:string
  approvedByName: string
}
export type RefundScope=
  {
    refundScopeId: string,
    refundScopeName: string
}
export type BillAndDepositDto = {
  id: string;
  billDepositNumber: string;
  dateTime: number;
  amount: number;
  approvedAmount: number;
  totalAmount: number;
};
export type RecordRefundDto = {
  id:number|string
  paidAmount: number;
  paymentDate: string;
  paymentMode: string;
  transactionNo: string;
  chequeCard: string;
  bankName: string;
  branchName: string;
  tagText:string
};
export type RefundsDto=
{
  refundId:string,
  documentDate:string,
  refundstatus:string
  approvedBy:string
  billDocumentNumber: string,
  billTime:string,
  visitType: number,
  patientId:string,
  patientMrn:string,
  patientName:string,
  patientGender: string,
  patientAgeYears:number,
  patientAgeMonths: number,
  patientAgeDays: number,
  patientMobileNo: number,
  patientAddress:string,
  patientRegistrationDate: number,
  hospitalId:string,
  referralDoctorId: string,
  doctorName:string,
  schemeCompanyId:string,
  schemeCompanyTypeId: string,
  schemeCompanyName:string,
  schemeCompanyTypeName: string,
  remark:string,
  amountPaid: number,
  deposits:number,
  disountper:number,
  abhaId:string
  billAndDeposits: BillAndDepositDto[],
  BillAndDeposits: BillAndDepositDto[],
  recordRefunds: RecordRefundDto[]
  amounttoRefund:number,
  visitTypeName:string
}
export type ServiceDetail=
{  
  id:string|number   
  service: string,  
  department:string,     
  quantity: number, 
  type:string,
  totalAmount:number  
}
  




