
// import FullBodyCheckup from "@/components/fullBodyCheckup/Card";
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    noneditable?: boolean;
  }
  interface TableMeta<TData> {
    updateRow: (rowIndex: number, updatedRow: TData) => void;
    updateData: (rowIndex: number, columnId: string, value: any) => void;
  }
}


export type RowType = {
  id: string | number;
  tagText?: string;
  type?: string;
  variant?: string;
};





const columnNames = {
  service: "Service",
  hospitaldoctorid: "Doctor",
  rate: "Rate",
  quantity: "Quantity",
  requisitionDateTime: "Requisition Date/Time",
  "Is Emergency": "Is Emergency",
  concessionPercent: "Concession (%)",
  concessionAmount: "Concession Amt.",
  apportionConcession: "Custom Concession",
  mouDiscountAmount: "Mou Discount",
  transDiscount: "Trans. Discount",
  totalServiceDiscount: "Total Service Discount",
  totalamt: "Total Amount",
  includeInPackage: "Include In Package",
  outOfPackage: "Out Of Package",
  editableServiceName: "Editable Service Name",
  cancelRemark: "Cancel Remark",
  concessionRemark: "Concession Remark",
};

export {  columnNames };
