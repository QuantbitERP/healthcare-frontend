import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/statusTags/Tags";
// import FullBodyCheckup from "@/components/fullBodyCheckup/Card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Avatar from "react-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipProvider,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
import Service from "@/components/fullBodyCheckup_service/Service";
// import { Skeleton } from "../ui/skeleton";

const DoctorCell = ({
  getValue,
}: {
  getValue: () => string;
  serviceId?: string;
  onDoctorSelect?: (doctorId: string) => void;
}) => {
  const doctorOptions = [
    "Dr. Sangram Chougale",
    "Dr. Ashish Shinde",
    "Dr. Sahil Chougale",
    "Dr. Vaibhav Gavas",
    "Dr. Priya Iyer",
    "Dr. Rajesh Sharma",
    "Dr. Arvind Mehta",
  ];

  const [selectedDoctor, setSelectedDoctor] = useState(getValue());

  return (
    <Select
      value={selectedDoctor}
      onValueChange={(value) => {
        setSelectedDoctor(value);
        // Handle doctor change logic here
      }}
    >
      <SelectTrigger className="w-full border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0 shadow-none">
        <SelectValue placeholder="Select a Doctor" className="pl-2" />
      </SelectTrigger>
      <SelectContent
        className="!m-0 border-[#D9D9E0] !p-0 [&>div]:!px-0 [&>div]:!py-2"
        align="center"
      >
        {doctorOptions.map((option, index) => (
          <SelectItem
            key={index}
            value={option}
            className="data-[highlighted]:bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE] rounded-none"
          >
            <div className="flex flex-row items-center gap-1">
              <Avatar
                name={
                  (option.split(" ")[1] || option.split(" ")[0])?.charAt(
                    0
                  ) || ""
                }
                size="24"
                round={true}
                textSizeRatio={2}
              />
              <span>{option}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export const useColumns = () => {
  const [open, setOpen] = useState(false);
  return [
    {
      accessorKey: "service",
      header: ({ table, column }) => {
        return (
          <div className="flex flex-row  items-center w-full h-10">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold ml-3"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Service
              {column.getIsSorted() ? (
                column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                )
              ) : null}
            </Button>
          </div>
        );
      },
      cell: ({ row, getValue }) => {
        const isCancelled = row?.original?.tagText === "Cancelled";

        // Get the selected service from the row
        const selectedService = getValue();

        // Determine the appropriate tag dynamically
        const selectedTag = (() => {
          if (isCancelled) {
            return { tagText: "Cancelled", type: "danger", variant: "tag" }; // Override with pink tag
          } else if (selectedService === "General Consultation") {
            return { tagText: "Follow Up", type: "primary", variant: "tag" };
            // <Tags tagText="Lable" type="primary" variant="tag" />;
          } else if (
            ["Full Body Checkup", "Blood Test"].includes(selectedService)
          ) {
            return { tagText: "Package", type: "warning", variant: "tag" };
          } else if (
            ["Sleep Test", "Physiotherapy Session"].includes(selectedService)
          ) {
            return { tagText: "Follow Up", type: "primary", variant: "tag" };
          }
          return row?.original; // Keep existing tags if no condition matches
        })();

        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex flex-row items-center justify-between pr-3  h-10">
              <div
                className={`flex flex-row items-center ${
                  isCancelled ? "line-through text-[#1C2024]" : ""
                }`}
              >
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
                <DialogTrigger asChild>
                  <button onClick={() => setOpen(true)}>
                    <span className="mr-2 ml-3">{selectedService}</span>
                  </button>
                </DialogTrigger>
              </div>
              {selectedTag?.tagText && (
                <StatusBadge
                  tagText={selectedTag.tagText}
                  type={selectedTag.type}
                  variant={selectedTag.variant}
                />
              )}
            </div>
            <DialogTitle></DialogTitle>
            <DialogContent
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-full max-w-none mt-0 h-[100%] flex flex-col p-0 bg-white border-none shadow-none"
            >
              {open && <Service onClose={() => setOpen(false)} size="large" />}
            </DialogContent>
          </Dialog>
        );
      },
      enableSorting: true,
      // isCommand: true,
    },
    {
      accessorKey: "package",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Package
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "requisitionNo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requisition No
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "requisitionDateTime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requisition Date/Time
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "serviceDepartment",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service Department
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "chargeBillingClass",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Charge Billing Class
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "rate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rate
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => {
        let value = getValue();

        // Convert string numbers to actual numbers (if necessary)
        if (typeof value === "string") {
          value = parseFloat(value);
        }

        // Ensure it's a valid number greater than 0
        if (!value || isNaN(value) || value <= 0) {
          return null; // Don't display anything if invalid
        }

        return (
          <span
            className={`text-right w-full block  ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{value}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => {
        let value = getValue();
        if (typeof value === "string") {
          value = parseInt(value, 10);
        }
        if (!Number.isInteger(value) || value <= 0) {
          return null;
        }
        return (
          <span
            className={`text-right w-full block ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            {value}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "patientAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient Amount
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => {
        let value = getValue();

        // Convert string numbers to actual numbers (if necessary)
        if (typeof value === "string") {
          value = parseFloat(value);
        }

        // Ensure it's a valid number greater than 0
        if (!value || isNaN(value) || value <= 0) {
          return null; // Don't display anything if invalid
        }

        return (
          <span
            className={`text-right w-full block  ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{value}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "companyAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold text-right  w-full flex flex-row"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company Amount
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => {
        let value = getValue();

        // Convert string numbers to actual numbers (if necessary)
        if (typeof value === "string") {
          value = parseFloat(value);
        }

        // Ensure it's a valid number greater than 0
        if (!value || isNaN(value) || value <= 0) {
          return null; // Don't display anything if invalid
        }

        return (
          <span
            className={`text-right w-full block  ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{value}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "concession",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "gst",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          GST
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "doctor",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doctor
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ getValue }) => {
        <DoctorCell  getValue={getValue}/>
      },
      enableSorting: true,
    },
    {
      accessorKey: "concessionGivenBy",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession Given by
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ getValue }) => {
        <DoctorCell getValue={getValue} />
      },
      enableSorting: true,
    },
    {
      header: "Is Urgent",
      cell: ({table}) => (
        <div className="flex justify-center items-center">
          <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
        </div>
      ),
    },
    {
      header: "Is Sample Collected",
      cell: ({table}) => (
        <div className="flex justify-center items-center">
          <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
        </div>
      ),
    },
    {
      accessorKey: "serviceRemark",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service Remark
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "concessionRemark",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Concession Remark
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ row, getValue }) => (
        <span
          className={`text-left w-full block ${
            row?.original?.tagText === "Cancelled" ? "line-through" : ""
          }`}
        >
          {getValue()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "modifiedby",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modified by
          {column.getIsSorted() &&
            (column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      ),
      cell: ({ getValue }) => {
        <DoctorCell getValue={getValue} />
      },
      enableSorting: true,
    },
    {
      header: "Rate Lock",
      cell: ({table}) => (
        <div className="flex justify-center items-center">
          <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
        </div>
      ),
      
    },
    {
      accessorKey: "totalamt",
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="hover:bg-transparent h-10 p-0 text-[#60646C] text-xs font-semibold pl-3 border-l border-[#D9D9E0] rounded-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Amount
            {column.getIsSorted() &&
              (column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              ))}
          </Button>
        </div>
      ),
      cell: ({ row, getValue }) => {
        let value = getValue();

        // Convert string numbers to actual numbers (if necessary)
        if (typeof value === "string") {
          value = parseFloat(value);
        }

        // Ensure it's a valid number greater than 0
        if (!value || isNaN(value) || value <= 0) {
          return null; // Don't display anything if invalid
        }

        return (
          <span
            className={`text-right w-full block pl-3 h-10 py-3 border-l border-[#D9D9E0]  ${
              row?.original?.tagText === "Cancelled" ? "line-through" : ""
            }`}
          >
            ₹{value}
          </span>
        );
      },
      enableSorting: true,
    },
  ];
};
const initialData = [
  {
    id: "1",
    service: "Bed Charges (General Ward)",
    package: "Package 1",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "Procedures",
    chargeBillingClass: "General",
    rate: 2000,
    quantity: 1,
    patientAmount: 1500,
    companyAmount: 500,
    concession: "",
    gst: "₹100 (5%)",
    doctor: "Dr. Priya Iyer",
    concessionGivenBy: "",
    serviceRemark: "Auto-added on admission",
    concessionRemark: "",
    modifiedby: "Dr. Priya Iyer",
    totalamt: 2100,
  },
  {
    id: "2",
    service: "Nursing Charges",
    package: "Package 1",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "Procedures",
    chargeBillingClass: "General",
    rate: 800,
    quantity: 1,
    patientAmount: 400,
    companyAmount: 400,
    concession: "",
    gst: "₹40 (5%)",
    doctor: "Dr. Rajesh Sharma",
    concessionGivenBy: "",
    serviceRemark: "Auto-added on admission",
    concessionRemark: "",
    modifiedby: "Dr. Rajesh Sharma",
    totalamt: 840,
  },
  {
    id: "3",
    service: "Admission Charges	",
    package: "Package 1",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "Procedures",
    chargeBillingClass: "General",
    rate: 800,
    quantity: 1,
    patientAmount: 300,
    companyAmount: 400,
    concession: "",
    gst: "₹25	(5%)",
    doctor: "Dr. Arvind Mehta",
    concessionGivenBy: "",
    serviceRemark: "Auto-added on admission",
    concessionRemark: "",
    modifiedby: "Dr. Arvind Mehta",
    totalamt: 525,
  },

  {
    id: "4",
    service: "Kidney Function Test",
    package: "Package 2",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "Nephrology",
    chargeBillingClass: "Corporate",
    rate: 1500,
    quantity: 1,
    patientAmount: 1000,
    companyAmount: 500,
    concession: "₹150 (10%)",
    gst: "₹75 (5%)",
    doctor: "Dr. Rajesh Sharma",
    concessionGivenBy: "Dr. Priya Iyer",
    serviceRemark: "Routine Kidney Check",
    concessionRemark: "Applied for Employee",
    modifiedby: "Dr. Rajesh Sharma",
    totalamt: 1425,
  },

  {
    id: "5",
    service: "Knee Replacement Surgery",
    package: "Package 3",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "Orthopedics",
    chargeBillingClass: "Corporate",
    rate: 120000,
    quantity: 1,
    patientAmount: 100000,
    companyAmount: 20000,
    concession: "₹12000 (10%)",
    gst: "₹6000 (5%)",
    doctor: "Dr. Sahil Chougale",
    concessionGivenBy: "Dr. Sneha Kapoor",
    serviceRemark: "Planned Surgery",
    concessionRemark: "Insurance Covered",
    modifiedby: "Dr. Sahil Chougale",
    totalamt: 114000,
  },

  {
    id: "6",
    service: "OT Usage Charges",
    package: "Package 4",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "OT",
    chargeBillingClass: "Corporate",
    rate: 3000,
    quantity: 1,
    patientAmount: 2000,
    companyAmount: 1000,
    concession: "₹200 (10%)",
    gst: "₹600 (5%)",
    doctor: "Dr. Priya Iyer",
    concessionGivenBy: "Dr. Sneha Kapoor",
    serviceRemark: "Planned Surgery",
    concessionRemark: "Insurance Covered",
    modifiedby: "Dr. Priya Iyer",
    totalamt: 3000,
  },
  {
    id: "7",
    service: "Surgeon Fees",
    package: "Package 4",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "OT",
    chargeBillingClass: "General",
    rate: 3000,
    quantity: 1,
    patientAmount: 2000,
    companyAmount: 1000,
    concession: "₹200 (10%)",
    gst: "₹600 (5%)",
    doctor: "Dr. Ashish Shinde",
    concessionGivenBy: "Dr. Priya Iyer",
    serviceRemark: "Post-Surgery Rehab",
    concessionRemark: "Employee Discount",
    modifiedby: "Dr. Ashish Shinde",
    totalamt: 2500,
  },
  {
    id: "8",
    service: "Anesthesia Charges",
    package: "Package 4",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "OT",
    chargeBillingClass: "General",
    rate: 3000,
    quantity: 1,
    patientAmount: 2000,
    companyAmount: 1000,
    concession: "₹200 (10%)",
    gst: "₹600 (5%)",
    doctor: "Dr. Priya Iyer",
    concessionGivenBy: "Dr. Sneha Kapoor",
    serviceRemark: "Post-Surgery Rehab",
    concessionRemark: "Employee Discount",
    modifiedby: "Dr. Priya Iyer",
    totalamt: 5000,
  },

  {
    id: "9",
    service: "Coronary Angiography",
    package: "Package 5",
    requisitionNo: "REQ12345",
    requisitionDateTime: "26-Mar-2025 08:00 AM",
    serviceDepartment: "Cardiology",
    chargeBillingClass: "Corporate",
    rate: 12000,
    quantity: 1,
    patientAmount: 12000,
    companyAmount: 12000,
    concession: "₹200 (10%)",
    gst: "₹600 (5%)",
    doctor: "Dr. Priya Iyer",
    concessionGivenBy: "Dr. Sneha Kapoor",
    serviceRemark: "Post-Surgery Rehab",
    concessionRemark: "Employee Discount",
    modifiedby: "Dr. Priya Iyer",
    totalamt: 12000,
  },
];
const columnNames = {
  service: "Service",
  package: "Package",
  requisitionNo: "Requisition No",
  requisitionDateTime: "Requisition Date/Time",
  serviceDepartment: "Service Department",
  chargeBillingClass: "Charge Billing Class",
  rate: "Rate",
  quantity: "Quantity",
  patientAmount: "Patient Amount",
  companyAmount: "Company Amount",
  concession: "Concession",
  gst: "GST",
  doctor: "Doctor",
  concessionGivenBy: "Concession Given By",
  "Is Urgent": "Is Urgent",
  "Is Sample Collected": "Is Sample Collected",
  serviceRemark: "Service Remark",
  concessionRemark: "Concession Remark",
  modifiedby: "Modified by",
  "Rate Lock": "Rate Lock",
  totalamt: "Total Amount",
};
const allServices = [
  {
    id: "1",
    service: "Bed Charges (General Ward)",
    serviceDepartment: "Procedures",
    serviceNumber: "000012",
    isPackage: true,
  },
  {
    id: "2",
    service: "Nursing Charges",
    serviceDepartment: "Procedures",
    serviceNumber: "000011",
    isPackage: false,
  },
  {
    id: "3",
    service: "Admission Charges",
    serviceDepartment: "Procedures",
    serviceNumber: "000013",
    isPackage: false,
  },
  {
    id: "4",
    service: "Dialysis Session",
    serviceDepartment: "Nephrology",
    serviceNumber: "000015",
    isPackage: false,
  },

  {
    id: "5",
    service: "Kidney Function Test",
    serviceDepartment: "Nephrology",
    serviceNumber: "000018",
    isPackage: false,
  },
  {
    id: "6",
    service: "Knee Replacement Surgery",
    serviceDepartment: "Orthopedics",
    serviceNumber: "000010",
    isPackage: false,
  },
  {
    id: "7",
    service: "Physiotherapy (10 Sessions)",
    serviceDepartment: "Orthopedics",
    serviceNumber: "000019",
    isPackage: false,
  },
];

export { initialData, columnNames, allServices };
