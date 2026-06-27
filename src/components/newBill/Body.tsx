/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Alerts from "@/components/alerts/Alerts";
import Tags from "@/components/statusTags/Tags";
import PatientCardSkeleton from "@/components/skeletons/PatientCardSkeleton";
import TotalBreakdownSkeleton from "@/components/skeletons/TotalBreakdownSkeleton";
import SmallList from "@/components/checklistSmall/ChecklistSmall";
import PatientCard from "@/components/patientCard/PatientCard";
import TotalBreakdownCard from "@/components/totalBreakdownCard/TotalBreakdownCard";
import Image from "next/image";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePatientSearch } from "./context/Context";
import { AppDispatch, RootState } from "@/store";
import { ServiceTable } from "../IndividualPatientBillingDetailPage/ServiceTable";
import { GetDraftBillByIdResponseDTO } from "@/services/api-client/models/GetDraftBillByIdResponseDTO";
import { GetBillsResponseDto } from "@/services/api-client/models/GetBillsResponseDto";
import Footer from "./Footer";

import { Textarea } from "../ui/textarea";
import { OpdBillService } from "@/services/api-client/services/OpdBillService";
import { KVPair } from "@/services/api-client/models/KVPair";
import { PatientSearchDto } from "@/services/api-client/models/PatientSearchDto";
import { GetBillServices } from "@/services/api-client/models/GetBillServices";
import { fetchServiceRate } from "@/store/opd_bills/thunks";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import { v4 as uuidv4 } from "uuid";


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
  const [validationerror, setValidationError] = useState<string>("");
  const [serviceCalculations, setServiceCalculations] = useState<
    Record<string, { rate: number; gstPercentage: number, concessionPercent: number, mouDiscountAmt: number }>
  >({});
  const [isAddingService, setIsAddingService] = useState<boolean>(false);

  // Simple placeholder rotation - only when completely idle
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Only rotate when input is completely idle
    const shouldRotate =
      serviceSearchTerm.length === 0 &&
      !showServiceResults &&
      !isAddingService &&
      document.activeElement !== document.querySelector('input[type="text"]');

    if (shouldRotate) {
      intervalId = setInterval(() => {
        // Check if any dialogs are open before rotating
        const hasOpenDialogs = document.querySelector('[data-state="open"]');

        if (!hasOpenDialogs &&
          serviceSearchTerm.length === 0 &&
          !showServiceResults &&
          !isAddingService) {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderValues.length);
        }
      }, 10000); // Rotate every 10 seconds when idle
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [serviceSearchTerm, showServiceResults, isAddingService, placeholderValues.length]);

  const addingServiceRef = useRef<boolean>(false);
  const { referredDoctors, loading } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );

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
  }, [patientInputRef, setFilteredPatients, setSearchTerm]);

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
  }, [filteredPatients, handlePatientClick, selectedIndex, setSelectedIndex]);

  const table = useReactTable({
    columns: ColumnData(dispatch, referredDoctors),
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
      updateCell: (rowIndex: number, columnId: string, value: any) => {
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

    // Show dropdown if there's a search term
    if (serviceSearchTerm.length >= 3) {
      setShowServiceResults(true);
    }
  };

  const handleSearchBlur = () => {
    // This prevents premature closing when clicking on dropdown items
  };

  // Proper click outside handler - only active when dropdown is open
  useEffect(() => {
    if (!showServiceResults) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceSearchRef.current &&
        !serviceSearchRef.current.contains(event.target as Node)
      ) {
        setShowServiceResults(false);
        setServiceSearchTerm("");
      }
    };

    // Add event listener with a small delay to prevent immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showServiceResults]);

  // Handle keyboard events for dropdown
  useEffect(() => {
    if (!showServiceResults) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowServiceResults(false);
        setServiceSearchTerm("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showServiceResults]);

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

  const handlePackageSelect = async (packageObj: any) => {
    // Prevent multiple rapid clicks
    if (addingServiceRef.current || isAddingService) {
      return;
    }

    // Set loading state to prevent multiple clicks
    setIsAddingService(true);
    addingServiceRef.current = true;

    try {
      setData((prev) => [
        ...prev,
        {
          ...createServiceDataItem({
            serviceName: packageObj.packageName ?? "",
            editableServiceName: packageObj.packageName ?? "",
            serviceid: packageObj.packageId ?? "",
            rate: 0,
            quantity: 1,
            hospitaldoctorid: "",
            remark: "",
            billRequisitionDocumentDate: new Date()
              .toISOString()
              .split("T")[0],
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
          id: packageObj.packageId ?? prev.length,
        },
      ]);

      // Close dropdown and clear search
      setServiceSearchTerm("");
      setShowServiceResults(false);
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => {
        setIsAddingService(false);
        addingServiceRef.current = false;
      }, 500);
    }
  };

  const handleServiceSelect = async (serviceObj: KVPair) => {
    // Prevent multiple rapid clicks
    if (addingServiceRef.current || isAddingService) {
      return;
    }

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

    // Set loading state to prevent multiple clicks
    setIsAddingService(true);
    addingServiceRef.current = true;

    // Fetch service rate from API
    let rate = 0;
    let serviceGstId = "";
    let gstPercentage = 0;
    let mouDiscountPercentage = 0;
    let mouDiscountAmount = 0;
    try {
      const res = await dispatch(
        fetchServiceRate({
          version: "1",
          tenant: "",
          requestBody: {
            hospitalDoctorId: null,
            companyId: "ab3c3680-9a69-4785-8fe7-4bbbbc1848bc",
            serviceId: serviceObj.key,
            hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
            patientId: "7740fb19-a64a-4cc4-862c-be40665d0f4b",
          },
        })
      );
      if (fetchServiceRate.fulfilled.match(res)) {
        rate = res.payload?.data?.serviceRate ?? 0;
        serviceGstId = res.payload?.data?.gstId ?? "";
        gstPercentage = res.payload?.data?.gstPercentage ?? 0;
        mouDiscountPercentage = res.payload?.data?.mouDiscountPercentage ?? 0;
        mouDiscountAmount = (rate * mouDiscountPercentage) / 100;

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
          mouDiscountAmount: mouDiscountAmount,
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

    setServiceCalculations((prev) => ({
      ...prev,
      [serviceObj.key ?? ""]: {
        rate: rate,
        gstPercentage,
        mouDiscountAmt: mouDiscountAmount,
        concessionPercent: 0,
      },
    }));


    // Close dropdown and clear search
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

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsAddingService(false);
      addingServiceRef.current = false;
    }, 500);
  };

  useEffect(() => {
    setServiceCalculations((prev) => {
      const updated = { ...prev };

      // Get current service IDs from patientServicesTable
      const currentServiceIds = new Set(
        patientServicesTable
          .map(service => service.serviceid)
          .filter(Boolean)
      );

      // Remove entries for services that no longer exist
      Object.keys(updated).forEach(serviceId => {
        if (!currentServiceIds.has(serviceId)) {
          delete updated[serviceId];
        }
      });

      // Update or add entries for current services
      patientServicesTable.forEach((service) => {
        if (!service.serviceid) return;

        updated[service.serviceid] = {
          rate: service.rate ?? 0,
          concessionPercent: service.concessionPercent ?? 0,
          gstPercentage: updated[service.serviceid]?.gstPercentage ?? 0,
          mouDiscountAmt: service.mouDiscountAmount ?? 0,
        };
      });

      return updated;
    });
  }, [patientServicesTable]);





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
    <div className="w-[1200px] h-fit flex items-center justify-center gap-4 flex-col">
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

      <div className="w-full h-fit flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <div className="w-fit h-fit gap-4 flex flex-row">
            <span className="text-[#1C2024] text-2xl font-semibold">
              {selectedPatient ? "" : "#BI19736729"}
            </span>
            <div className="flex flex-row gap-2 items-center">
              <Tags variant="tag" tagText="Draft" type="secondary" border />
              {/* <Tags
                variant="tag"
                tagText="Payment Pending"
                type="warning"
                border
              /> */}
            </div>
          </div>
          <span className="text-[#60646C] text-xs font-normal">
            {currentDate}
          </span>
        </div>

        <div className="flex flex-row items-center relative">
          {!isPateintSelected ? (
            <div className="w-[304px] h-10 rounded-lg border border-[#CDCED6] bg-[#F9F9FB] flex items-center px-3 py-2 text-[#60646C] text-sm">
              Please select a patient first
            </div>
          ) : (
            <div className="search-component relative" ref={serviceSearchRef}>
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
                onBlur={handleSearchBlur}
              />
              {showServiceResults && (
                <div
                  className={`w-[304px] h-fit max-h-[300px] rounded-lg z-50 border border-[#CDCED6] bg-white pb-3 flex flex-col absolute top-14 overflow-y-auto ${isAddingService ? 'pointer-events-none opacity-75' : ''
                    }`}
                  onMouseEnter={() => setShowServiceResults(true)}
                // Remove onMouseLeave to prevent auto-closing when hovering over items
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
                          {isAddingService && (
                            <div className="w-full px-4 py-2 text-sm text-[#0D74CE] flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0D74CE]"></div>
                              Adding service...
                            </div>
                          )}
                          {hospitalServicesData.map((service) => (
                            <CommandItem
                              key={service.key}
                              value={service.value ?? ""}
                              onSelect={() => {
                                // Prevent multiple clicks during service addition
                                if (addingServiceRef.current || isAddingService) {
                                  return;
                                }
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
                  ${isAddingService ? 'opacity-50 cursor-not-allowed' : ''}
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
                                // Prevent multiple clicks during package addition
                                if (addingServiceRef.current || isAddingService) {
                                  return;
                                }
                                handlePackageSelect(service);
                              }}
                              className={`
                  flex w-full px-4 py-2
                  hover:bg-[#E6F4FE] cursor-pointer
                  text-sm font-normal text-[#1C2024]
                  hover:text-[#0D74CE]
                  data-[selected=true]:bg-[#E6F4FE]
                  data-[selected=true]:text-[#0D74CE]
                  break-words
                  ${isAddingService ? 'opacity-50 cursor-not-allowed' : ''}
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
        className="w-full flex flex-row gap-4 overflow-y-auto no-scrollbar"
      >
        <div className="flex flex-col gap-4">
          {selectedPatient ? (
            <PatientCard
              patient={selectedPatient}
              columns={ColumnData(dispatch, []) as unknown as ColumnDef<GetBillServices>[]}
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
            <TotalBreakdownCard
              selectedPatientBill={null}
              billData={selectedPatientBill}
              serviceCalculations={serviceCalculations}
            />
          ) : (
            <TotalBreakdownSkeleton />
          )}
        </div>

        <div className="w-full h-fit flex flex-col gap-4">
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
              columns={ColumnData(dispatch, [])}
              initialData={[]}
              dataProps={{ data, setData }}
              showCustomAlert={showCustomAlert}
            />
          </div>

          {!data.length && (
            <div className="w-full h-fit rounded-lg flex flex-col gap-1 p-4 items-center">
              <Image
                src={"assets/icons/Frame.svg"}
                width={48}
                height={48}
                alt="Icon"
              />
              <span className="text-[#1C2024] text-base font-semibold">
                Start by Searching a Service
              </span>
              <span className="text-[#60646C] text-sm font-normal">
                Eg. MRI Scan
              </span>
            </div>
          )}
          <div className="w-full  max-w-5xl shadow-xs rounded-xl space-y-3">
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
        setValidationError={setValidationError}
      />
    </div>
  );
}

export default Body;
