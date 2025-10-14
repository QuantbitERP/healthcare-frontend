export type TableDataType = {
  id?: string;
  billId: string;
  patient: string;
  authId: string;
  uhid: string;
  company: string;
  associateCompany: string;
  billType: "OPD" | "IPD";
  billStatus: "Pending" | "Submitted";
  claimSendNo: string;
  submittedBy: string;
  companyAmount: string;
  patientAmount: string;
  referralLetterNo: string;
  modifiedOn: string; 
  priorAuthDoneBy: string;
  billFinalizedBy: string;
  submitDate: string; 
  billAmount: string ;
};

export const TableData: TableDataType[] = [
];
