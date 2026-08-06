/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Alerts from "@/components/alerts/Alerts";
import PatientCardSkeleton from "@/components/skeletons/PatientCardSkeleton";
import TotalBreakdownSkeleton from "@/components/skeletons/TotalBreakdownSkeleton";
import SmallList from "@/components/checklistSmall/ChecklistSmall";
import PatientCard from "./PatientCard";
import TotalBreakdownCard from "./TotalBreakdownCard";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { columnNames, RowType } from "./TableData";
import { ColumnData } from "./TableData";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
  Table,
} from "@tanstack/react-table";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { usePatientSearch } from "@/components/newBill/context/Context";
import { AppDispatch, RootState } from "@/store";
import { ServiceTable } from "../IndividualPatientBillingDetailPage/ServiceTable";
import { GetDraftBillByIdResponseDTO } from "@/services/api-client/models/GetDraftBillByIdResponseDTO";
import { GetBillsResponseDto } from "@/services/api-client/models/GetBillsResponseDto";
import Footer from "./Footer";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { OpdBillService } from "@/services/api-client/services/OpdBillService";
import { KVPair } from "@/services/api-client/models/KVPair";
import { PatientSearchDto } from "@/services/api-client/models/PatientSearchDto";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { fetchServiceRate } from "@/store/opd_bills/thunks";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import PatientDetailsSkeleton from "./PatientDetailsSkeleton";

// Helper function to format date
const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `Created on ${day}/${month}/${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

interface BodyProps {
  isAllSelected: boolean;
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  billData?: GetBillsResponseDto[];
}

function Body({ isAllSelected, setIsAllSelected, billData }: BodyProps) {
  const { patientInputRef } = usePatientSearch();
  const dispatch = useDispatch<AppDispatch>();
  const {
    patientServicesTable,
    setPatientServicesTable,
    billRemark,
    setBillRemark,
    setBillDataInRedux,
  } = useGlobalTables();

  const { data: packages } = useSelector(
    (state: RootState) => state.packageSlice
  );
  const {
    schemeCompanies: patientCompanies,
  } = useSelector((state: RootState) => state.opdFiltersOptions);
  const [hospitalServicesData, setHospitalServicesData] = useState<KVPair[]>(
    []
  );
  const [isPateintSelected, setIsPateintSelected] = useState<boolean>(false);

  const [selectedPatient, setSelectedPatient] =
    useState<PatientSearchDto | null>(null);
  const [showIncompleteBillAlert, setShowIncompleteBillAlert] =
    useState<boolean>(true);
  const [lockCategoryAndCompany, setLockCategoryAndCompany] =
    useState<boolean>(false);

  const placeholderValues = ["Package", "Services", "Profile"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState<string>(() =>
    formatDate(new Date())
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [insuranceCompany, setInsuranceCompany] = useState(
    ""
  );

  const [message, setMessage] = useState<string>(
    "Please select a patient first"
  );
  // Update date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(formatDate(new Date()));
    }, 30000); // Update every 30 seconds (1 minute)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderValues.length);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [placeholderIndex, placeholderValues.length]);

  const placeHolderText = placeholderValues[placeholderIndex];

  // Alert state
  const [alertState, setAlertState] = useState<{
    show: boolean;
    heading: string;
    content: string;
    variant: "success" | "warning" | "danger" | "primary" | "secondary";
    buttonText?: string;
    showButton?: boolean;
    onClick?: () => void;
    disappear?: boolean;
  }>({
    show: false,
    heading: "",
    content: "",
    variant: "warning",
    disappear: true,
  });

  const [, setSearchTerm] = useState<string>("");
  const [, setShowChangePatientDilogue] = useState<boolean>(false);
  const [, setShowAvatar] = useState<boolean>(false);
  const [filteredPatients, setFilteredPatients] = useState<
    GetBillsResponseDto[]
  >([]);
  const [data, setData] = useState<RowType[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [, setNewPatient] = useState<GetDraftBillByIdResponseDTO | null>(null);
  const [selectedPatientBill, setSelectedPatientBill] =
    useState<GetDraftBillByIdResponseDTO | null>(null);
  const [showServiceResults, setShowServiceResults] = useState<boolean>(false);
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>("");
  const serviceSearchRef = useRef<HTMLDivElement>(null);
  const [paymentDate, setPaymentDate] = useState(new Date());

  useEffect(() => {
    if (isPateintSelected) {
      const servicesLists = async () => {
        try {
          if (serviceSearchTerm.length >= 3 && showServiceResults) {
            const response =
              await OpdBillService.postApiVOpdBillOpdbillsHospitalServices(
                "1",
                "",
                {
                  hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
                  searchTerm: serviceSearchTerm,
                  pageNumber: 1,
                  pageSize: 10,
                }
              );

            const servicesList = response?.data?.items;

            if (!Array.isArray(servicesList)) {
              console.error(
                "Expected services list to be an array, got:",
                response
              );
              return;
            }

            setHospitalServicesData(servicesList);
          }
        } catch (error) {
          console.error("Error fetching hospital services:", error);
        }
      };

      servicesLists();
    }
  }, [isPateintSelected, serviceSearchTerm, showServiceResults]);
  const handleAssignPatientClick = () => {
    if (patientInputRef.current) {
      patientInputRef.current.focus();
    }
  };

  const handlePatientClick = useCallback(
    (patient) => {
      if (selectedPatient && selectedPatient.patientId !== patient.id) {
        setNewPatient(patient);
        setShowChangePatientDilogue(true);
        setIsPateintSelected(true);
      } else {
        setIsPateintSelected(true);
        setBillDataInRedux(patient);
        setSelectedPatient(patient);
        setShowAvatar(true);
        setSearchTerm("");
        setFilteredPatients([]);
      }
    },
    [selectedPatient, setBillDataInRedux]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      setTimeout(() => {
        if (
          patientInputRef.current &&
          !patientInputRef.current.contains(event.target as Node)
        ) {
          setFilteredPatients([]);
          setSearchTerm("");
        }
      }, 100);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [patientInputRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!filteredPatients.length) return;

      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredPatients.length - 1)
        );
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "Enter" && selectedIndex >= 0) {
        handlePatientClick(filteredPatients[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredPatients, handlePatientClick, selectedIndex]);

  const table = useReactTable({
    columns: ColumnData(),
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    meta: {
      updateRow: (rowIndex: number, updatedRow: RowType) => {
        setData((old) => {
          const copy = [...old];
          copy[rowIndex] = updatedRow;
          return copy;
        });
      },
      updateData: (rowIndex: number, columnId: string, value: any) => {
        setData((old) => {
          const copy = [...old];
          copy[rowIndex] = { ...copy[rowIndex], [columnId]: value };
          return copy;
        });
      },
      updateCell(rowIndex, columnId, value) {
        setData((old) => {
          const copy = [...old];
          copy[rowIndex] = { ...copy[rowIndex], [columnId]: value };
          return copy;
        });
      },
    },
  });

  const handleServiceSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Check if company is selected
    if (!selectedCompanyId) {
      showCustomAlert({
        heading: "Company Not Selected",
        content: "Please select a company before searching for services.",
        variant: "warning",
        disappear: true,
      });
      setServiceSearchTerm("");
      setShowServiceResults(false);
      return;
    }

    const term = e.target.value;
    setServiceSearchTerm(term);
    if (term.length > 0) {
      setShowServiceResults(true);
    }
  };

  const handleSearchFocus = () => {
    // Check if company is selected when focusing on search
    if (!selectedPatient) {
      showCustomAlert({
        heading: "Company Not Selected",
        content: "Please select a company before searching for services.",
        variant: "warning",
        disappear: true,
      });
      setServiceSearchTerm("");
      setShowServiceResults(false);
      return;
    }

    if (serviceSearchTerm.length > 0) {
      setShowServiceResults(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceSearchRef.current &&
        !serviceSearchRef.current.contains(event.target as Node)
      ) {
        setShowServiceResults(false);
        setServiceSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function createServiceDataItem(
    overrides: Partial<GetBillServices> = {}
  ): GetBillServices {
    return {
      patientVisitid: null,
      billRequisitionDocumentDate: new Date().toISOString().split("T")[0],
      billRequisitionTime: new Date().toISOString(),
      serviceid: "",
      internationalcode: null,
      serviceName: "",
      hospitaldoctorid: null,
      rate: 0,
      quantity: 1,
      concessionPercent: 0,
      concessionAmount: 0,
      netamount: 0,
      remark: "",
      mouDiscountAmount: 0,
      apportionConcession: 0,
      totalServiceDiscount: 0,
      concessionRemark: "",
      serviceGstId: null,
      serviceGstAmount: 0,
      editableServiceName: "",
      isEmergency: false,
      isBillLevelGSTApplicable: false,
      allocatedReceiptAmount: 0,
      isprocessed: false,
      conessionCategoryId: null,
      applicationuserid: null,
      includeInPackage: 0,
      outOfPackage: 0,
      cancelRemark: "",
      ...overrides,
    };
  }

  useEffect(() => {
    if (data.length > 0) {
      setLockCategoryAndCompany(true);
    } else {
      setLockCategoryAndCompany(false);
    }

    if (data) {
      setSelectedPatientBill((pre) => ({
        ...pre,
        billTotalAmount: data?.reduce(
          (acc, item) => acc + (item as any).totalamt,
          0
        ),
      }));
    }
  }, [data]);
  const handleSave = () => {
    // Here you can use the data state
    // Add your save logic here
  };

  const showCustomAlert = (config: {
    heading: string;
    content: string;
    variant?: "success" | "warning" | "danger" | "primary" | "secondary";
    buttonText?: string;
    showButton?: boolean;
    onClick?: () => void;
    disappear?: boolean;
  }) => {
    setAlertState({
      show: true,
      heading: config.heading,
      content: config.content,
      variant: config.variant || "warning",
      buttonText: config.buttonText,
      showButton: config.showButton,
      onClick: config.onClick,
      disappear: config.disappear,
    });
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (alertState.show) {
      timeoutId = setTimeout(() => {
        setAlertState((prev) => ({ ...prev, show: false }));
      }, 10000); // 10 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [alertState.show]);

  const handleServiceSelect = async (serviceObj: KVPair) => {
    if (!selectedCompanyId) {
      showCustomAlert({
        heading: "Company Not Selected",
        content: "Please select a company before adding services.",
        variant: "warning",
        disappear: true,
      });
      return;
    }

    // Check for duplicate service
    const existingService = data.find(
      (item) =>
        item.serviceid === serviceObj.key &&
        (!item.billRequisiionDetailId ||
          item.billRequisiionDetailId.trim() === "")
    );
    if (existingService) {
      showCustomAlert({
        heading: "Duplicate Service!",
        content: `${serviceObj.value} has already been added to the bill.`,
        variant: "warning",
        disappear: true,
      });
      setServiceSearchTerm("");
      setShowServiceResults(false);
      return;
    }

    // Fetch service rate from API
    let rate = 0;
    let serviceGstId = "";
    try {
      const res = await dispatch(
        fetchServiceRate({
          version: "1",
          tenant: "",
          requestBody: {
            hospitalDoctorId: null,
            companyId: "c1ed5c8f-0811-4033-8c81-e5819e6e3f72",
            serviceId: serviceObj.key,
            hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
            patientId: "7740fb19-a64a-4cc4-862c-be40665d0f4b",
          },
        })
      );
      if (fetchServiceRate.fulfilled.match(res)) {
        rate = res.payload?.data?.serviceRate ?? 0;
        serviceGstId = res.payload?.data?.gstId ?? "";
      } else {
        console.log("Failed to fetch rate, action not fulfilled", res);
      }
    } catch (error) {
      console.log("Failed to fetch rate", error);
    }

    // Add to data
    setData((prev) => [
      ...prev,
      {
        ...createServiceDataItem({
          serviceName: serviceObj.value ?? "",
          editableServiceName: serviceObj.value ?? "",
          serviceid: serviceObj.key ?? "",
          serviceGstId: serviceGstId,
          rate: rate,
          quantity: 1,
          hospitaldoctorid: "",
          remark: "",
          billRequisitionDocumentDate: new Date().toISOString().split("T")[0],
          billRequisitionTime: new Date().toISOString(),
          netamount: 0,
          concessionPercent: 0,
          concessionAmount: 0,
          mouDiscountAmount: 0,
          apportionConcession: 0,
          totalServiceDiscount: 0,
          isEmergency: false,
          isBillLevelGSTApplicable: false,
          includeInPackage: 0,
          outOfPackage: 0,
        }),
        id: (prev.length + 1).toString(),
      },
    ]);

    setServiceSearchTerm("");
    setShowServiceResults(false);

    // Optionally update bill total
    if (setSelectedPatientBill && data) {
      setSelectedPatientBill((pre) => ({
        ...pre,
        billTotalAmount: data?.reduce(
          (acc, item) => acc + (item as any).totalamt,
          0
        ),
      }));
    }
  };

  // Show alert when patient is not selected
  useEffect(() => {
    if (!isPateintSelected) {
      showCustomAlert({
        heading: "No Patient Selected!",
        content: "Please select a patient before searching for services.",
        variant: "warning",
        disappear: true,
      });
    }
  }, [isPateintSelected]);

  return (
    <div className="w-full h-fit flex items-center justify-center gap-4 flex-col">
      {alertState.show && (
        <Alerts
          open={alertState.show}
          heading={alertState.heading}
          content={alertState.content}
          variant={alertState.variant}
          buttonText={alertState.buttonText}
          showButton={alertState.showButton}
          onClick={alertState.onClick}
          disappear={alertState.disappear}
        />
      )}

      <div className="w-full px-4 h-fit flex flex-row justify-between">
        <div className="flex px-4 flex-col gap-2">
          <div className="w-fit h-fit gap-4 flex flex-row">
            <span className="text-[#1C2024] text-2xl font-semibold">
              {selectedPatient ? "" : "#CEST19736729"}
            </span>
          </div>
          <span className="text-[#60646C] text-xs font-normal">
            {currentDate}
          </span>
        </div>

        <div className="flex px-4 flex-row items-center relative">
          {!isPateintSelected ? (
            <div className="w-[304px] h-10 rounded-lg border border-[#CDCED6] bg-[#F9F9FB] flex items-center px-3 py-2 text-[#60646C] text-sm">
              Please select a patient first
            </div>
          ) : (
            <div className="search-component relative">
              <Image
                src={"assets/icons/Search.svg"}
                alt="Search"
                width={24}
                height={24}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                className="w-[304px] h-10 rounded-lg border border-[#CDCED6] bg-white flex items-center pr-3 py-2 pl-12 focus:outline-none focus:ring-1 focus:ring-[#0090FF]"
                placeholder={`Search by ${placeHolderText}`}
                value={serviceSearchTerm}
                onChange={handleServiceSearchChange}
                onFocus={handleSearchFocus}
              />
              {showServiceResults && (
                <div
                  className="w-[304px] h-fit max-h-[300px] rounded-lg z-50 border border-[#CDCED6] bg-white pb-3 flex flex-col absolute top-14 overflow-y-auto"
                  onMouseEnter={() => setShowServiceResults(true)}
                  onMouseLeave={() => setShowServiceResults(false)}
                >
                  <Command className="border-none">
                    <CommandList className="p-0">
                      {/* Show "Please enter at least 3 letters" if term is short */}
                      {serviceSearchTerm.length < 3 ? (
                        <div className="w-full px-4 py-2 text-sm text-[#6B7280]">
                          Please enter at least 3 letters to search services or
                          packages.
                        </div>
                      ) : hospitalServicesData.length === 0 ? (
                        /* Show "No Service Found" if term >= 3 and no results */
                        <CommandEmpty className="w-full h-[144px] px-4 py-2 flex flex-col gap-2 items-center justify-center">
                          <Image
                            src={"assets/icons/Emoji.svg"}
                            alt="Sad"
                            width={32}
                            height={32}
                          />
                          <span className="text-[#1C2024] text-base font-semibold">
                            No Service Found!
                          </span>
                        </CommandEmpty>
                      ) : (
                        /* Show list of services */
                        <CommandGroup heading="Services" className="p-0">
                          {hospitalServicesData.map((service) => (
                            <CommandItem
                              key={service.key}
                              value={service.value ?? ""}
                              onSelect={() => {
                                handleServiceSelect({
                                  key: service.key,
                                  value: service.value,
                                });
                              }}
                              className={`
                  flex w-full px-4 py-2
                  hover:bg-[#E6F4FE] cursor-pointer
                  text-sm font-normal text-[#1C2024]
                  hover:text-[#0D74CE]
                  data-[selected=true]:bg-[#E6F4FE]
                  data-[selected=true]:text-[#0D74CE]
                  break-words
                `}
                            >
                              <span className="w-full break-words whitespace-pre-wrap text-left">
                                {service.value}
                              </span>
                            </CommandItem>
                          ))}
                          {packages?.map((service) => (
                            <CommandItem
                              key={service.packageId}
                              value={service.packageName ?? ""}
                              onSelect={() => {
                                setData((prev) => [
                                  ...prev,
                                  {
                                    ...createServiceDataItem({
                                      serviceName: service.packageName ?? "",
                                      editableServiceName:
                                        service.packageName ?? "",
                                      serviceid: service.packageId ?? "",
                                      rate: 0,
                                      quantity: 1,
                                      hospitaldoctorid: "",
                                      remark: "",
                                      billRequisitionDocumentDate: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                      billRequisitionTime:
                                        new Date().toISOString(),
                                      netamount: 0,
                                      concessionPercent: 0,
                                      concessionAmount: 0,
                                      mouDiscountAmount: 0,
                                      apportionConcession: 0,
                                      totalServiceDiscount: 0,
                                      isEmergency: false,
                                      isBillLevelGSTApplicable: false,
                                      includeInPackage: 0,
                                      outOfPackage: 0,
                                    }),
                                    id: service.packageId ?? prev.length,
                                  },
                                ]);

                                setServiceSearchTerm("");
                                setShowServiceResults(false);
                              }}
                              className={`
                  flex w-full px-4 py-2
                  hover:bg-[#E6F4FE] cursor-pointer
                  text-sm font-normal text-[#1C2024]
                  hover:text-[#0D74CE]
                  data-[selected=true]:bg-[#E6F4FE]
                  data-[selected=true]:text-[#0D74CE]
                  break-words
                `}
                            >
                              <span className="w-full break-words whitespace-pre-wrap text-left">
                                {service.packageName}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          height: selectedPatient
            ? "calc(100vh - 216px)"
            : "calc(100vh - 296px)",
        }}
        className="w-full flex flex-row gap-4  overflow-y-auto no-scrollbar"
      >
        <div className="flex flex-col px-4 gap-4">
          {selectedPatient ? (
            <PatientCard
              patient={selectedPatient}
              columns={ColumnData() as unknown as ColumnDef<GetBillServices>[]}
              initialData={[]}
              table={table as unknown as Table<GetBillServices>}
              dataProps={{ data, setData }}
              setIsAllSelected={setIsAllSelected}
              onCompanyChange={setSelectedCompanyId}
            />
          ) : (
            <PatientCardSkeleton
              onPatientSelect={handlePatientClick}
              handleAssignPatientClick={handleAssignPatientClick}
              focusOnClick={!selectedPatient && showIncompleteBillAlert}
            />
          )}
          {selectedPatient ? (
            <TotalBreakdownCard selectedPatientBill={selectedPatientBill} />
          ) : (
            <TotalBreakdownSkeleton />
          )}
        </div>

        <div className="w-full h-fit flex pr-12 flex-col gap-4">
          <div className="w-full h-fit flex flex-row justify-between">
            <span className="text-[#1C2024] text-lg font-semibold flex items-center">
              Services · {table.getCoreRowModel().rows.length}
            </span>
            <SmallList
              items={[
                "Doctor",
                "Is Emergency",
                "Rate",
                "Days/Quantity",
                "Concession",
                "Concession Amount",
                "Total Amount",
              ]}
              title="Show/Hide Columns"
              table={table}
              columnNames={columnNames}
            />
          </div>

          <div className="w-[920px] max-h-[60vh] overflow-hidden flex flex-col">
            <ServiceTable
              table={table}
              columns={ColumnData()}
              initialData={[]}
              dataProps={{ data, setData }}
              showCustomAlert={showCustomAlert}
            />
          </div>
          {selectedPatient ? (<div className="w-full flex flex-col h-fit gap-3 p-4  border border-[#D9D9E0]  shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]  max-w-5xl  rounded-xl space-y-3">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Patient Details</h2>
              </div>
              <div className="">
                <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                  <div className="flex  flex-col space-y-3">
                    <Label>Admission Date</Label>
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
                  <div className="flex  flex-col space-y-3">
                    <Label>Tentative Discharge</Label>
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
                  <div className="flex  flex-col space-y-3">
                    <Label>Approx. Stay</Label>
                    <span>8</span>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <Label>Company</Label>
                    <Select
                      onValueChange={(value) => setInsuranceCompany(value)}
                      value={insuranceCompany}
                    >
                      <SelectTrigger className="w-full h-9.5">
                        <SelectValue placeholder="Company">
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
                              {patientCompanies?.data?.items?.map((company) => (
                                <CommandItem
                                  key={company.key}
                                  onSelect={() =>
                                    setInsuranceCompany(company.value ?? "")
                                  }
                                  className="flex items-center px-4 py-2 text-sm text-[#1C2024] hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] cursor-pointer"
                                >
                                  {company.value ?? ""}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <h2 className="text-lg font-semibold">Diagnosis</h2>
                </div>
                <div>
                  <Textarea
                    className="h-18"
                    placeholder="Enter diagnosis details"
                    value={billRemark}
                    onChange={(e) => setBillRemark(e.target.value)}
                  ></Textarea>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <h2 className="text-lg font-semibold">Remark</h2>
                </div>
                <div>
                  <Textarea
                    className="h-18"
                    placeholder="Enter bill remark"
                    value={billRemark}
                    onChange={(e) => setBillRemark(e.target.value)}
                  ></Textarea>
                </div>
              </div>
            </div>
          </div>) : (
            <PatientDetailsSkeleton />
          )}
        </div>

        <Footer
          billData={billData}
          data={data}
          setData={setData}
          onSave={handleSave}
          isAllSelected={isAllSelected}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          showCustomAlert={showCustomAlert}
          setIsPateintSelected={setIsPateintSelected}
        />
      </div>
    </div>
  );
}

export default Body;
