import type { InsertOpdBillService } from "@/services/api-client/models/InsertOpdBillService";
import type { InsertNewOpdBill } from "@/services/api-client/models/InsertNewOpdBill";
import type { InsertBillConcession } from "@/services/api-client/models/InsertBillConcession";
import type { InsertReceiptPayment } from "@/services/api-client/models/InsertReceiptPayment";

// Clean services
function cleanServices(services: any[]): InsertOpdBillService[] {
  return services?.map((item) => ({
    visitId: item.visitId ?? null,
    billRequisitionDetailId: item.billRequisiionDetailId ?? null,
    hospitalServiceId: item.serviceid,
    hospitaldoctorid: item.hospitaldoctorid,
    rate: item.rate,
    quantity: item.quantity,
    concessionPercent: item.concessionPercent,
    concessionAmount: item.concessionAmount,
    mouDiscountAmount: item.mouDiscountAmount,
    mouDiscountPercent: item.mouDiscountPercent,
    apportionConcession: item.apportionConcession,
    concessionRemark: item.concessionRemark ?? null,
    serviceGstId: item.serviceGstId ?? null,
    serviceGstAmount: item.serviceGstAmount,
    editableServiceName: item.editableServiceName ?? null,
    isEmergency: item.isEmergency,
    isBillLevelGSTApplicable: item.isBillLevelGSTApplicable,
    concessionCategory: item.concessionCategory ?? null,
    concessionGivenBy: item.concessionGivenBy ?? null,
    cancelRemark: item.cancelRemark ?? null,
    serviceRemark: item.serviceRemark ?? null,
    serviceBillingClass: item.serviceBillingClass ?? null,
  }));
}

function cleanBillConcessions(concessions: any[]): InsertBillConcession[] {
  return concessions?.map((item) => ({
    concessioncategoryid: item.concessioncategoryid,
    applicationuserid: item.applicationuserid,
    concessionamount: item.concessionamount,
    concessionPercent: item.concessionPercent,
    concessionremark: item.concessionremark,
  }));
}
function cleanReceiptPayments(payments: any[]): InsertReceiptPayment[] {
  return payments?.map((item) => ({
    billReceiptPaymentDetailId: item.billReceiptPaymentDetailId,
    amount: item.amount,
    receiptDate: item.receiptDate,
    paymentMode: item.modeOfPaymentId,
    transactionnumber: item.transactionnumber,
    bankname: item.bankname,
    chequeno: item.chequeno,
    chequedate: item.chequedate ?? null,
    branchname: item.branchname,
    approvalNumber: item.approvalNumber,
    paymentModeId: item.modeOfPaymentId,
  }));
}

export function buildOpdBillPayload(params: {
  existingDraftBillNo?: string | null;
  existingBillId?: string | null;
  visittype?: number| null;
  patientid: string;
  hospitalid: string;
  refferaldoctorid?: string | null;
  billcompanyid: string | null;
  services?: any[];
  billConcession?: any[];
  receiptPayments?: any[];
  billDiscountPercent?: number;
  billDiscountAmount?: number;
  billGstId?: string | null;
  billGstAmount?: number;
  billRemark?: string | null;
  paidBy?: number | undefined;
  paidByName?: string | null;
  sponsoredbyName?: string | null;
}): { model: InsertNewOpdBill } {
  const cleanedServices = cleanServices(params.services ?? []);
  const cleanedConcessions = cleanBillConcessions(params.billConcession ?? []);
  const cleanedPayments = cleanReceiptPayments(params.receiptPayments ?? []);

  const payload: InsertNewOpdBill = {
    existingDraftBillNo: params.existingDraftBillNo ?? null,
    existingBillId: params.existingBillId ?? null,
    visittype: params.visittype ?? 0,
    patientid: params.patientid,
    hospitalid: params.hospitalid,
    refferaldoctorid: params.refferaldoctorid ?? null,
    billcompanyid: params.billcompanyid,
    services: cleanedServices,
    billConcession: cleanedConcessions,
    receiptPayments: cleanedPayments,
    billDiscountPercent: params.billDiscountPercent ?? 0,
    billDiscountAmount: params.billDiscountAmount ?? 0,
    billGstId: params.billGstId ?? null,
    billGstAmount: params.billGstAmount ?? 0,
    billRemark: params.billRemark ?? null,
    paidBy: params.paidBy ?? 0,
    paidByName: params.paidByName ?? null,
    sponsoredbyName: params.sponsoredbyName ?? null,
  };

  return { model: payload };
}
