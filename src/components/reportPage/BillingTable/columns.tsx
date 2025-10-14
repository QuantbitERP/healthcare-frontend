"use client";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import SortableHeaderButton from "@/components/table-util-buttons/SortableHeaderButton";
export const reportColumns = (sortedColumn, setSortedColumn) => {
  const defaultCell = ({ row, column }) => {
    const value = row.original[column.id];
    return value !== undefined && value !== null ? value.toString() : "";
  };

  return [
    {
      accessorKey: "srNo",
      label: "Sr Number",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Sr Number" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "hospitalName",
      label: "Hospital Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Hospital Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "uhid",
      label: "UHID",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="UHID" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "visitType",
      label: "Visit Type",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Visit Type" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "visitNo",
      label: "Visit Number",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Visit Number" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "visitDate",
      label: "Visit Date",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Visit Date" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => row.original.visitDate ? new Date(row.original.visitDate).toLocaleString("en-IN") : "",
    },
    {
      accessorKey: "billType",
      label: "Bill Type",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Bill Type" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "billNo",
      label: "Bill Number",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Bill Number" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "billDate",
      label: "Bill Date",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Bill Date" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => row.original.billDate ? new Date(row.original.billDate).toLocaleString("en-IN") : "",
    },
    {
      accessorKey: "timeOfBill",
      label: "Time of Bill",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Time of Bill" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => row.original.timeOfBill ? new Date(row.original.timeOfBill).toLocaleString("en-IN") : "",
    },
    {
      accessorKey: "dischargeDate",
      label: "Discharge Date",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Discharge Date" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => row.original.dischargeDate ? new Date(row.original.dischargeDate).toLocaleString("en-IN") : "",
    },
    {
      accessorKey: "patientName",
      label: "Patient Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Patient Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "patientAmount",
      label: "Patient Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Patient Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.patientAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "companyAmount",
      label: "Company Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Company Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.companyAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "billAmount",
      label: "Total Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Total Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.billAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "status",
      label: "Status",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Status" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => (
        <StatusBadge
          variant={row.original.isBillCancelled ? "danger" : "success"}
          text={row.original.isBillCancelled ? "Cancelled" : "Finalized"}
        />
      ),
    },
    {
      accessorKey: "requisitionNo",
      label: "Requisition No",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Requisition No" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceGroup",
      label: "Service Group",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Group" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceDepartment",
      label: "Service Dept",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Dept" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceCode",
      label: "Service Code",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Code" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceName",
      label: "Service Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "rate",
      label: "Rate",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Rate" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.rate?.toLocaleString()}</span>,
    },
    {
      accessorKey: "quantity",
      label: "Qty",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Qty" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceAmount",
      label: "Service Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.serviceAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "serviceMouConcession",
      label: "MOU Concession",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="MOU Concession" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.serviceMouConcession?.toLocaleString()}</span>,
    },
    {
      accessorKey: "serviceConcession",
      label: "Service Concession",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Concession" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.serviceConcession?.toLocaleString()}</span>,
    },
    {
      accessorKey: "netServiceAmount",
      label: "Net Service Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Net Service Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.netServiceAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "consultingDoctor",
      label: "Consulting Doctor",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Consulting Doctor" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "companyType",
      label: "Company Type",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Company Type" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "companyName",
      label: "Company Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Company Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "associateCompany",
      label: "Associate Company",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Associate Company" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "wardName",
      label: "Ward Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Ward Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "bedNo",
      label: "Bed No",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Bed No" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "billingClass",
      label: "Billing Class",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Billing Class" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "dischargedBedNo",
      label: "Discharged Bed No",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Discharged Bed No" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "billConcession",
      label: "Bill Concession",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Bill Concession" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.billConcession?.toLocaleString()}</span>,
    },
    {
      accessorKey: "billDiscountGivenBy",
      label: "Discount By",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Discount By" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "billDiscountType",
      label: "Discount Type",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Discount Type" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "grossBillAmount",
      label: "Gross Bill Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Gross Bill Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.grossBillAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "editableServiceName",
      label: "Editable Service Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Editable Service Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "parentServiceCode",
      label: "Parent Service Code",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Parent Service Code" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "parentServiceName",
      label: "Parent Service Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Parent Service Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "profileName",
      label: "Profile Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Profile Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "packageName",
      label: "Package Name",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Package Name" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceSubDeptName",
      label: "Service SubDept",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service SubDept" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "apportionConcession",
      label: "Apportion Concession",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Apportion Concession" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.apportionConcession?.toLocaleString()}</span>,
    },
    {
      accessorKey: "serviceCancelAmount",
      label: "Service Cancel Amt",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service Cancel Amt" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.serviceCancelAmount?.toLocaleString()}</span>,
    },
    {
      accessorKey: "serviceCancelReason",
      label: "Cancel Reason",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Cancel Reason" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceCancelRemark",
      label: "Cancel Remark",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Cancel Remark" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "serviceGivenByUser",
      label: "Service By User",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Service By User" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "patientBalance",
      label: "Patient Balance",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Patient Balance" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.patientBalance?.toLocaleString()}</span>,
    },
    {
      accessorKey: "companyBalance",
      label: "Company Balance",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Company Balance" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.companyBalance?.toLocaleString()}</span>,
    },
    {
      accessorKey: "balanceReceivable",
      label: "Balance Receivable",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Balance Receivable" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => <span>₹{row.original.balanceReceivable?.toLocaleString()}</span>,
    },
    {
      accessorKey: "financialYear",
      label: "Financial Year",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Financial Year" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "financePostingVoucherNo",
      label: "Finance Voucher No",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Finance Voucher No" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "referenceBillNo",
      label: "Ref Bill No",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Ref Bill No" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: defaultCell,
    },
    {
      accessorKey: "referenceBillDateTime",
      label: "Ref Bill DateTime",
      header: ({ column }) => (
        <SortableHeaderButton column={column} label="Ref Bill DateTime" sortedProps={{ sortedColumn, setSortedColumn }} />
      ),
      cell: ({ row }) => row.original.referenceBillDateTime ? new Date(row.original.referenceBillDateTime).toLocaleString("en-IN") : "",
    },
  ];
};
