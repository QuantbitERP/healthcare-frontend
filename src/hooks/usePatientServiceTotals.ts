import { useMemo } from "react";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";

export const usePatientServiceTotals = (
  patientServicesTable: GetBillServices[]
) => {
  return useMemo(() => {
    // Handle empty or undefined array
    if (!patientServicesTable || patientServicesTable.length === 0) {
      return {
        totalRate: 0,
        totalNetRate: 0,
        totalConcessionAmount: 0,
        totalMouDiscountAmount: 0,
        totalDiscountAmount: 0,
        totalGSTAmount: 0,
        totalCGSTAmount: 0,
        totalSGSTAmount: 0,
        totalGSTPercentage: 0,
        totalCGSTPercentage: 0,
        totalSGSTPercentage: 0,
        grandTotal: 0,
        totalQuantity: 0,
      };
    }

    let totalRate = 0;
    let totalNetRate = 0;
    let totalConcessionAmount = 0;
    let totalMouDiscountAmount = 0;
    let totalDiscountAmount = 0;
    let totalGSTAmount = 0;
    let totalCGSTAmount = 0;
    let totalSGSTAmount = 0;
    let weightedGST = 0;
    let totalQuantity = 0;

    patientServicesTable.forEach((service) => {
      const rate = parseFloat(service.rate?.toString() || "0");
      const quantity = parseFloat(service.quantity?.toString() || "1");
      const mouDiscount = parseFloat(service.mouDiscountAmount?.toString() || "0");
      const concessionPercentage = parseFloat(service.concessionPercent?.toString() || "0");
      const gstAmount = parseFloat(service.serviceGstAmount?.toString() || "0");
      const gstPercentage = rate > 0 ? (gstAmount / rate) * 100 : 0;

      // Apply MOU discount first, then calculate concession on net rate
      const netRate = rate - mouDiscount;
      const concessionAmount = (concessionPercentage / 100) * netRate;
      const finalAmount = netRate - concessionAmount;
      
      // Use actual GST amount from service, or calculate if not available
      const serviceGstAmount = gstAmount > 0 ? gstAmount : (finalAmount * gstPercentage) / 100;
      const cgstAmount = serviceGstAmount / 2;
      const sgstAmount = serviceGstAmount / 2;

      // Apply quantity to all calculations
      const serviceTotalRate = rate * quantity;
      const serviceTotalNetRate = finalAmount * quantity;
      const serviceTotalConcessionAmount = concessionAmount * quantity;
      const serviceTotalMouDiscountAmount = mouDiscount * quantity;
      const serviceTotalGstAmount = serviceGstAmount * quantity;
      const serviceTotalCgstAmount = cgstAmount * quantity;
      const serviceTotalSgstAmount = sgstAmount * quantity;

      totalRate += serviceTotalRate;
      totalNetRate += serviceTotalNetRate;
      totalConcessionAmount += serviceTotalConcessionAmount;
      totalMouDiscountAmount += serviceTotalMouDiscountAmount;
      totalDiscountAmount += serviceTotalConcessionAmount + serviceTotalMouDiscountAmount;

      totalGSTAmount += serviceTotalGstAmount;
      totalCGSTAmount += serviceTotalCgstAmount;
      totalSGSTAmount += serviceTotalSgstAmount;

      weightedGST += serviceTotalRate * gstPercentage;
      totalQuantity += quantity;
    });

    const grandTotal = totalNetRate + totalGSTAmount;

    const totalGSTPercentage = totalRate > 0 ? weightedGST / totalRate : 0;
    const totalCGSTPercentage = totalGSTPercentage / 2;
    const totalSGSTPercentage = totalGSTPercentage / 2;

    return {
      totalRate,
      totalNetRate,
      totalConcessionAmount,
      totalMouDiscountAmount,
      totalDiscountAmount,
      totalGSTAmount,
      totalCGSTAmount,
      totalSGSTAmount,
      totalGSTPercentage,
      totalCGSTPercentage,
      totalSGSTPercentage,
      grandTotal,
      totalQuantity,
    };
  }, [patientServicesTable]);
};
