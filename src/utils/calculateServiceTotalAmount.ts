export const calculateTotalAmount = (patientServicesTable: any[]) => {
    return patientServicesTable.reduce((total, row) => {
      const rate = parseFloat(row.rate) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const mouDiscount = parseFloat(row.mouDiscountAmount) || 0;
      const concessionPercentage = parseFloat(row.concessionPercent) || 0;

      const concessionAmount = (concessionPercentage / 100) * rate;

      const rowTotal = rate * quantity - mouDiscount - concessionAmount;

      return total + rowTotal;
    }, 0);
  };
