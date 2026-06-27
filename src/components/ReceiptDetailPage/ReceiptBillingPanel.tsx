import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DistributeDataTable } from "./DistributeAmountTable";
import { columns } from "./tableData";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { HospitalBillEntry } from "@/store/payments_received/types";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import RecordPayments from "../recordPayments/RecordPayments";
import { hospitalBillEntries } from "../new_receipt/TableData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
// import { fetchConcessions } from "@/store/payments_received/slice";
import { fetchAllOpdFilters } from "@/store/opd_bills/thunks";

interface BodyProps {
  receiptId: string | null;
  active: "company" | "patient";
  setActive: (value: "company" | "patient") => void;
  isRecordPaymentDialogOpen: boolean;
  setIsRecordPaymentDialogOpen: (val: boolean) => void;
}

interface LabelValue {
  label: string;
  value: string;
}

const paymentModes: LabelValue[] = [
  { label: "Cheque", value: "Cheque" },
  { label: "Demand Draft", value: "Demand Draft" },
  { label: "Online Transfer", value: "Online Transfer" },
];
const patients: LabelValue[] = [
  { label: "Nirmal Magar", value: "HSHOP250024681" },
  { label: "Samir Butala", value: "HSHOP250024682" },
  { label: "Valini Agrawal", value: "HSHOP250024683" },
  { label: "Samarth Bansal", value: "HSHOP250024684" },
  { label: "Naisha Sehgal", value: "HSHOP250024685" },
];

const ReceiptDetailPanel: React.FC<BodyProps> = ({
  active,
  setActive,
  isRecordPaymentDialogOpen,
  setIsRecordPaymentDialogOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { referredDoctors = [] } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );
  const { companies, concessions } = useSelector(
    (state: RootState) => state.paymentMetadata
  );
  const [filteredData, setFilteredData] =
    useState<HospitalBillEntry[]>(hospitalBillEntries);
  const [isConcession, setIsConcession] = useState(true);
  const [isTDS, setIsTDS] = useState(true);
  const [paymentMode, setPaymentMode] = useState("Demand Draft");
  const [insuranceCompany, setInsuranceCompany] = useState(
    "HDFC ERGO Health Insurance"
  );
  const [concessionDoctor, setConcessionDoctor] = useState(
    referredDoctors?.[0]?.value || ""
  );
  const [concessionCategory, setConcessionCategory] = useState(
    concessions[0]?.name || ""
  );
  const [percentage, setPercentage] = useState<number>(0);

  const [patient, setPatient] = useState({
    label: "Valini Agrawal",
    value: "HSHOP250024682",
  });
  useEffect(() => {
    // dispatch(fetchConcessions());
    dispatch(fetchAllOpdFilters({ version: "1", tenant: "", hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477" }));
  }, [dispatch]);
  useEffect(() => {
    if (concessions.length > 0) {
      const current =
        concessions.find((c) => c.name === concessionCategory) ||
        concessions[0];
      setPercentage(current.percentage);
    }
  }, [concessions, concessionCategory]);
  useEffect(() => {
    if (concessions.length > 0) {
      setConcessionCategory(concessions[0]?.name);
    }
    // if (Array.isArray(referredDoctors) && referredDoctors.length > 0) {
    //   setConcessionDoctor(referredDoctors?.[0]?.value);
    // }
  }, [concessions, referredDoctors]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });

  const [paymentDate, setPaymentDate] = useState(new Date());

  const memoizedSetFilteredData = useCallback(
    (
      data:
        | HospitalBillEntry[]
        | ((prev: HospitalBillEntry[]) => HospitalBillEntry[])
    ) => {
      setFilteredData(data);
    },
    []
  );

  return (
    <div className="space-y-6  flex flex-col  max-w-5xl mx-auto pb-10 ">
      <div className="w-full  max-w-3xl p-6 bg-white shadow-md rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Record Payment</h2>
          <p className="text-sm text-gray-500">
            Please proceed to record your payment, ensuring all details are
            accurate to avoid any delays.
          </p>
        </div>

        {/* Toggle between Company & Patient */}
        <div className="flex bg-[#F9F9FB] my-10 rounded-md max-w-[372px] min-h-[32px] border border-[#D9D9E0]  flex-row items-center gap-4 px-2 py-1">
          {["company", "patient"].map((type) => (
            <div
              key={type}
              onClick={() => setActive(type as "company" | "patient")}
              className={`w-1/2 text-center py-2 text-xs font-medium cursor-pointer transition-all duration-200 rounded-md ${active === type
                  ? "bg-white shadow-md"
                  : "bg-[#F9F9FB] text-[#6B7280]"
                }`}
            >
              {type === "company" ? "Company" : "Patient"}
            </div>
          ))}
        </div>

        {active === "company" ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col space-y-3">
                <Label>Company</Label>
                <Select
                  onValueChange={(value) => setInsuranceCompany(value)}
                  value={insuranceCompany}
                >
                  <TooltipProvider>
                    <Tooltip key={patient.value}>
                      <TooltipTrigger asChild>
                        <SelectTrigger className="w-full h-9.5">
                          <SelectValue placeholder="Payment Mode">
                            {insuranceCompany}
                          </SelectValue>
                          <Image
                            src="assets/icons/CaretDownDark.svg"
                            height={16}
                            width={16}
                            alt="dropdown"
                          />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent className="text-white text-xs font-small bg-[#0090FF]">
                        <p>{insuranceCompany}</p>
                        <TooltipArrow className="fill-[#0090FF]" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <SelectContent className="border  border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                    <Command>
                      <CommandInput placeholder="Search" />
                      <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup className=" px-0 py-0">
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              onSelect={() => setInsuranceCompany(company.name)}
                              className="flex items-center px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] cursor-pointer"
                            >
                              {company.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </SelectContent>
                </Select>
                <span className="text-[#60646C] text-sm">
                  {"Meera Arcade,MG Road, Indiranagar, Bangalore"}
                </span>
              </div>
              <div className="flex flex-col space-y-3">
                <Label>Company Category</Label>
                <Select
                  onValueChange={(value) => setInsuranceCompany(value)}
                  value={insuranceCompany}
                >
                  <SelectTrigger className="w-full h-9.5">
                    <SelectValue placeholder="Payment Mode">
                      {insuranceCompany}
                    </SelectValue>
                    <Image
                      src="assets/icons/CaretDownDark.svg"
                      height={16}
                      width={16}
                      alt="dropdown"
                    />
                  </SelectTrigger>

                  <SelectContent className="border  border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                    <Command>
                      <CommandInput placeholder="Search" />
                      <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup className=" px-0 py-0">
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              onSelect={() => setInsuranceCompany(company.name)}
                              className="flex items-center px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] cursor-pointer"
                            >
                              {company.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-3">
                <Label>Amount Received</Label>
                <Input
                  type="text"
                  className="min-w-55 h-9.5 py-4"
                  placeholder="₹1,20,000"
                  defaultValue="₹1,20,000"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col space-y-3">
                <Label>Patient</Label>
                <Select
                  onValueChange={(value) => {
                    const selected = patients.find((p) => p.value === value);
                    if (selected) setPatient(selected);
                  }}
                  value={patient.value}
                >
                  <TooltipProvider>
                    <Tooltip key={patient.value}>
                      <TooltipTrigger asChild>
                        <SelectTrigger className="w-full h-9.5">
                          <SelectValue placeholder="Payment Mode">
                            {patient.label} ({patient.value})
                          </SelectValue>
                          <Image
                            src="assets/icons/CaretDownDark.svg"
                            height={16}
                            width={16}
                            alt="dropdown"
                          />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent className="text-white text-xs font-small bg-[#0090FF]">
                        <p>{patient.value}</p>
                        <TooltipArrow className="fill-[#0090FF]" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <SelectContent className="border border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                    <Command className="px-0">
                      <CommandInput placeholder="Search" />
                      <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                        <CommandEmpty>Not found.</CommandEmpty>
                        <CommandGroup className=" px-0 py-0">
                          {patients.map((pname) => (
                            <CommandItem
                              key={pname.value}
                              onSelect={() => setPatient(pname)}
                              className="flex items-center justify-between px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] cursor-pointer"
                            >
                              <span>{pname.label}</span>
                              <span className="text-muted-foreground">
                                {pname.value}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-3">
                <Label>Amount Received</Label>
                <Input
                  type="text"
                  className="min-w-55 h-9.5 py-4"
                  placeholder="₹1,20,000"
                  defaultValue="₹1,20,000"
                />
              </div>

              <div className="flex flex-row mt-5 items-center gap-3">
                <Checkbox />
                <span>Record as Deposit</span>
              </div>
            </div>
          </>
        )}
        {active === "company" ? (
          <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
            <div className="flex  flex-col space-y-3">
              <Label>Payment Date</Label>
              <div className="flex relative flex-row items-center">
                <Input
                  type="text"
                  className="min-w-55 h-9.5 py-4"
                  readOnly
                  value={format(paymentDate, "MM/dd/yyyy")}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                      <CalendarIcon className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={(newDate) => {
                        if (newDate) setPaymentDate(newDate);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col space-y-3 w-full">
              <Label>Reference No.</Label>
              <Input
                type="text"
                className="min-w-55 h-9.5 py-4"
                placeholder="#RN2451636"
                defaultValue="#RN2451636"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <Label>Payment Mode</Label>
              <Select
                onValueChange={(value) => setPaymentMode(value)}
                value={paymentMode}
              >
                <SelectTrigger className="w-full h-10 min-w-55">
                  <SelectValue placeholder="Payment Mode">
                    {paymentMode}
                  </SelectValue>
                  <Image
                    src="assets/icons/CaretDownDark.svg"
                    height={16}
                    width={16}
                    alt="dropdown"
                  />
                </SelectTrigger>

                <SelectContent className="border  border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className=" px-0 py-0">
                        {paymentModes.map((mode) => (
                          <CommandItem
                            key={mode.value}
                            onSelect={() => setPaymentMode(mode.label)}
                            className="flex items-center px-0
                                       py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            {mode.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-3">
                <Label>Employee Balance Amount</Label>
                <Input placeholder="₹5,000" defaultValue="₹5,000" />
              </div>
              <div className="flex flex-col space-y-3">
                <Label>Utilized Employee Balance Amount</Label>
                <Input placeholder="₹8,000" defaultValue="₹8,000" />
              </div>
              <div className="flex flex-col space-y-3">
                <Label>Utilized Deposit Amount</Label>
                <Input placeholder="₹4,000" defaultValue="₹4,000" />
              </div>
            </div>
          </>
        )}

        {active === "company" && paymentMode === "Cheque" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-3">
              <Label>Cheque No</Label>
              <Input placeholder="CHEQ15747" defaultValue="CHEQ15747" />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Bank Name</Label>
              <Input placeholder="ICICI" defaultValue="ICICI" />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Branch Name</Label>
              <Input placeholder="Panvel" defaultValue="Panvel" />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Approval No</Label>
              <Input placeholder="5264624" defaultValue="5264624" />
            </div>
          </div>
        )}

        {/* Concession */}
        <div className="flex items-center justify-between">
          <Label className="text-md font-semibold">Concession</Label>
          <Switch checked={isConcession} onCheckedChange={setIsConcession} />
        </div>

        {isConcession && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col space-y-3">
              <Label>Concession Category</Label>
              <Select
                onValueChange={(value) => setConcessionCategory(value)}
                value={concessionCategory}
              >
                <SelectTrigger className="w-full h-9.5">
                  <SelectValue placeholder="Concession Category">
                    {concessionCategory}
                  </SelectValue>
                  <Image
                    src="assets/icons/CaretDownDark.svg"
                    height={16}
                    width={16}
                    alt="dropdown"
                  />
                </SelectTrigger>

                <SelectContent className="border  border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className=" px-0 py-0">
                        {concessions.map((concess) => (
                          <CommandItem
                            key={concess.id}
                            onSelect={() => setConcessionCategory(concess.name)}
                            className="flex items-center px-0
                              py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                          >
                            {concess.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Concession Amount</Label>
              <Input
                type="text"
                className="h-9.5"
                placeholder="₹1,20,000"
                defaultValue="₹1,20,000"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Concession %</Label>
              <Input
                type="text"
                className="h-9.5"
                placeholder="30"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Concession Given by</Label>
              <Select
                onValueChange={(value) => setConcessionDoctor(value)}
                value={concessionDoctor}
              >
                <SelectTrigger className="w-full h-9.5">
                  <SelectValue placeholder="Concession Given By">
                    {concessionDoctor}
                  </SelectValue>
                  <Image
                    src="assets/icons/CaretDownDark.svg"
                    height={16}
                    width={16}
                    alt="dropdown"
                  />
                </SelectTrigger>

                <SelectContent className="border  border-[#D9D9E0] [&>div]:!px-0 [&>div]:!py-0">
                  <Command>
                    <CommandInput placeholder="Search" />
                    <CommandList className="[&>div]:!px-0 [&>div]:!mx-0 [&>div]:!pb-2 ">
                      <CommandEmpty>Not found.</CommandEmpty>
                      <CommandGroup className=" px-0 py-0">
                        {/* {Array.isArray(referredDoctors) &&
                          referredDoctors.map((doctor) => (
                            <CommandItem
                              key={doctor.value}
                              onSelect={() => setConcessionDoctor(doctor.value)}
                              className="flex items-center 
                                px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE]"
                            >
                              {doctor.label || doctor.value}
                            </CommandItem>
                          ))} */}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 flex flex-col space-y-3">
              <Label>Concession Remark</Label>
              <Input
                type="text"
                className="h-9.5"
                placeholder="-"
                defaultValue="-"
              />
            </div>
          </div>
        )}

        {/* TDS / Processing Fee / Others */}
        <div className="flex items-center justify-between">
          <Label className="text-md font-semibold">
            TDS / Processing Fee / Others
          </Label>
          <Switch checked={isTDS} onCheckedChange={setIsTDS} />
        </div>

        {isTDS && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-3">
              <Label>TDS</Label>
              <Input placeholder="₹1,20,000" defaultValue="₹1,20,000" />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Processing Amount</Label>
              <Input placeholder="₹20,000" defaultValue="₹20,000" />
            </div>
            <div className="flex flex-col space-y-3">
              <Label>Disallowed Amount</Label>
              <Input placeholder="₹2,000" defaultValue="₹2,000" />
            </div>
            <div className="md:col-span-1 flex flex-col space-y-3 text-sm">
              <Label>Write-off Amount</Label>
              <Input placeholder="₹20,000" defaultValue="₹20,000" />
            </div>
          </div>
        )}
      </div>
      <div className="w-full  max-w-3xl p-6 bg-white shadow-md rounded-xl space-y-6">
        <Dialog
          open={isRecordPaymentDialogOpen}
          onOpenChange={setIsRecordPaymentDialogOpen}
        >
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden max-w-none">
            <RecordPayments setOpen={setIsRecordPaymentDialogOpen} />
          </DialogContent>
        </Dialog>
        <DistributeDataTable
          columns={columns}
          data={filteredData}
          setFilteredData={memoizedSetFilteredData}
          dateProps={{ date, setDate }}
        />
      </div>
      <div className="w-full  max-w-3xl p-6 bg-white shadow-md rounded-xl space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Remarks</h2>
        </div>
        <div>
          <Textarea className="h-18" placeholder="Input Text"></Textarea>
        </div>
      </div>
    </div>
  );
};
export default ReceiptDetailPanel;
