import { useMemo } from "react";

type ServiceCalculation = {
  rate: number;
  gstPercentage: number;
  concessionPercent: number;
  mouDiscountAmt: number;
};

export const useServiceTotals = (
  services: Record<string, ServiceCalculation>
) => {
  return useMemo(() => {
    let totalRate = 0;
    let totalNetRate = 0;
    let totalConcessionAmount = 0;
    let totalMouDiscountAmount = 0;
    let totalDiscountAmount = 0;
    let totalGSTAmount = 0;
    let totalCGSTAmount = 0;
    let totalSGSTAmount = 0;
    let weightedGST = 0;

    Object.values(services ?? {}).forEach(
      ({ rate, gstPercentage, concessionPercent, mouDiscountAmt }) => {
        // Apply MOU discount first, then calculate concession on net rate
        const netRate = rate - mouDiscountAmt;
        const concessionAmount = (concessionPercent / 100) * netRate;
        const finalAmount = netRate - concessionAmount;

        // Calculate GST on final amount (after all discounts)
        const gstAmount = (finalAmount * gstPercentage) / 100;
        const cgstAmount = gstAmount / 2;
        const sgstAmount = gstAmount / 2;

        totalRate += rate;
        totalNetRate += finalAmount;
        totalConcessionAmount += concessionAmount;
        totalMouDiscountAmount += mouDiscountAmt;
        totalDiscountAmount += concessionAmount + mouDiscountAmt;

        totalGSTAmount += gstAmount;
        totalCGSTAmount += cgstAmount;
        totalSGSTAmount += sgstAmount;

        weightedGST += rate * gstPercentage;
      }
    );

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
    };
  }, [services]);
};
