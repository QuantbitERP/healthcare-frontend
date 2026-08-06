/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Alerts from "@/components/alerts/Alerts";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import RecordRefunds from "@/components/recordRefund/RecordPayments";
import Tags from "@/components/statusTags/Tags";
import TotalBreakdownSkeleton from "@/components/skeletons/TotalBreakdownSkeleton";
import SmallList from "@/components/checklistSmall/ChecklistSmall";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnDef,
  Table,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UtilDropDownButton from "../table-util-buttons/UtilDropDownButton";
import Image from "next/image";
import PatientCard from "@/components/patientCard/PatientCard";
import PatientRefundCard from "@/components/patientRefundCard/PatientCard";
import TotalBreakdownCard from "@/components/totalBreakdownCard/TotalBreakdownCard";
import TotalBreakdownRefundCard from "@/components/totalBreakdownRefundCard/TotalBreakdownCard";
import Concession from "@/components/concession/Concession";
import { useCancel } from "@/components/IndividualPatientBillingDetailPage/context/Context";
import {
  columnNames,
  columnNamesBills,
  refundData,
  refundColumn,
  ColumnData,
} from "@/components/IndividualPatientBillingDetailPage/tableData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ServiceTable } from "./ServiceTable";

import { Textarea } from "../ui/textarea";
import { GetBillDetailsDTO } from "@/services/api-client/models/GetBillDetailsDTO";
import {
  GetBillServices,
  GetDraftBillByIdResponseDTO,
  KVPair,
  OpdBillService,
} from "@/services/api-client";
import { fetchPackages, fetchServiceRate } from "@/store/opd_bills/thunks";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import Button from "../buttons/Button";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";



interface BodyProps {
  recordRefundClicked: boolean;
  setRecordRefundClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatient: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | null;
  setSelectedPatient: React.Dispatch<
    React.SetStateAction<GetBillDetailsDTO | GetDraftBillByIdResponseDTO | null>
  >;
  setRefundFooterButtons: React.Dispatch<React.SetStateAction<boolean>>;
  refundFooterButtons: boolean;
  billId: string | null;
  billData?: GetBillDetailsDTO | GetDraftBillByIdResponseDTO | undefined;
  loading: boolean;
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>;
  billStatus: string;
  showNoBillAlert: boolean;
  showErrorAlert: boolean;
  setShowNoBillAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setShowErrorAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const PatientBillingPanel: React.FC<BodyProps> = ({
  recordRefundClicked,
  setRecordRefundClicked,
  selectedPatient,
  setSelectedPatient,
  setRefundFooterButtons,
  billId,
  billData,
  loading,
  setIsAllSelected,
  billStatus,
  showNoBillAlert,
  showErrorAlert,
  setShowNoBillAlert,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: packages } = useSelector(
    (state: RootState) => state.packageSlice
  );
  const {
    patientServicesTable,
    setPatientServicesTable,
    billRemark,
    setBillRemark,
    setBillDataInRedux,
  } = useGlobalTables();

  const serviceSearchRef = useRef<HTMLDivElement>(null);
  const [showServiceResults, setShowServiceResults] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [pendingColumnVisibility, setPendingColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [showRefund, setShowRefund] = useState(false);
  const [openShowCols, setOpenShowCols] = useState(false);
  const [saveRecord, setSaveRecord] = useState(false);
  const [data, setData] = useState<
    (GetBillServices & { id: string | number })[]
  >(() =>
    (patientServicesTable ?? []).map((item, idx) => ({
      ...item,
      id: item.serviceid ?? idx,
    }))
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedPatientBill, setSelectedPatientBill] = useState<
    GetBillDetailsDTO | GetDraftBillByIdResponseDTO | null
  >(null);
  const [hospitalServicesData, setHospitalServicesData] = useState<KVPair[]>(
    []
  );
  const { cancelClicked } = useCancel();
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string | null>(null);

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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (alertState.show) {
      timeoutId = setTimeout(() => {
        setAlertState((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [alertState.show]);

  const isMounted = useRef(false);

  useEffect(() => {
    if (billData?.services) {
      setPatientServicesTable(billData?.services);
    }
  }, [billData?.services, setPatientServicesTable]);

  useEffect(() => {
    dispatch(fetchPackages({ version: "1", tenant: "" }));
  }, [dispatch]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    setData(
      (billData?.services ?? []).map((item, idx) => ({
        ...item,
        id: item.serviceid ?? idx,
      }))
    );
  }, [billData?.services]);

  useEffect(() => {
    if (billData) {
      // Use type assertion to handle the union type properly
      setBillDataInRedux({ data: billData } as any);

      const { id, ...rest } = billData;
      const patientData = {
        ...rest,
        id: id ?? undefined,
      } as any;

      setSelectedPatient(patientData);
      setSelectedPatientBill(patientData);
    } else {
      setSelectedPatient(null);
    }
  }, [billData]);
  const handleServiceSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const term = e.target.value;
    setServiceSearchTerm(term);
    setShowServiceResults(true);
  };

  const handleSearchFocus = () => setShowServiceResults(true);

  const table = useReactTable({
    columns: ColumnData(),
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting, columnVisibility },
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const refundTable = useReactTable({
    columns: refundColumn,
    data: refundData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  useEffect(() => {
    if (openShowCols) {
      const initialVisibilities: Record<string, boolean> = {};
      table
        .getAllColumns()
        .filter((col) => col.getCanHide() && col.id !== "serviceName")
        .forEach((col) => {
          initialVisibilities[col.id] = col.getIsVisible();
        });
      setPendingColumnVisibility(initialVisibilities);
    }
  }, [openShowCols, table]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceSearchRef.current &&
        !serviceSearchRef.current.contains(event.target as Node)
      ) {
        setShowServiceResults(false);
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
      hospitaldoctorid: "",
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

  const handleServiceSelect = async (serviceObj: KVPair) => {
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
  useEffect(() => {
    const fetchServices = async () => {
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

    fetchServices();
  }, [serviceSearchTerm, showServiceResults]);

  useEffect(() => {
    if (showErrorAlert) {
      showCustomAlert({
        heading: "Something went wrong!",
        content: `Please try again later.`,
        variant: "danger",
        disappear: true,
      });
    }
  }, [showErrorAlert]);
  useEffect(() => {
    if (showNoBillAlert) {
      showCustomAlert({
        heading: "No biils found!",
        content: `Please try again later.`,
        variant: "warning",
        disappear: true,
      });
    }
  }, [showNoBillAlert]);

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
      {showNoBillAlert && (
        <Alerts
          heading="No more bills found"
          content=""
          variant="warning"
          open
          showButton={false}
          onClick={() => setShowNoBillAlert(false)}
        />
      )}

      {/* {showErrorAlert && (
        <Alerts
          heading="Something went wrong"
          content="Please try again."
          variant="danger"
          open
          showButton={false}
          onClick={() => setShowErrorAlert(false)}
        />
      )} */}
      {cancelClicked && !recordRefundClicked && (
        <Alerts
          buttonText="Record a Refund"
          content=""
          heading="Bill Cancelled!"
          open
          showButton
          variant="danger"
          onClick={() => {
            setRecordRefundClicked(true);
            setRefundFooterButtons(true);
          }}
        />
      )}
      {recordRefundClicked && !saveRecord && (
        <Alerts
          buttonText="Record a Refund"
          content="₹9,500 is recorded as deposit."
          heading="Bill Cancelled!"
          open
          showButton
          variant="warning"
          onClick={() => {
            setShowRefund(true);
            setRefundFooterButtons(true);
          }}
        />
      )}
      {recordRefundClicked && saveRecord && (
        <Alerts
          buttonText="Print Voucher"
          content="Refund amount of ₹6,770 recorded."
          heading="Transaction Saved!"
          open
          showButton
          variant="success"
          onClick={() => { }}
        />
      )}
      {billData?.outstandingAmount !== null &&
        billData?.outstandingAmount !== undefined &&
        billData?.outstandingAmount >= 0 && (
          <Alerts
            buttonText="View"
            content="A pending concession may delay this bill."
            heading="Pending Approval!"
            open
            showButton
            variant="warning"
            onClick={() => {
              setDialogType("Concession");
              setOpen(true);
            }}
          />
        )}

      <Dialog
        open={showRefund}
        onOpenChange={(isOpen) => setShowRefund(isOpen)}
      >
        <DialogContent className="w-fit h-fit p-0 rounded-lg shadow-none border-none z-[10000] [&>button]:hidden">
          <RecordRefunds
            setOpen={setShowRefund}
            setSaveRecord={setSaveRecord}
          />
        </DialogContent>
      </Dialog>

      <div className="w-full h-fit flex flex-row gap-5">
        <div className="w-full h-fit flex flex-col gap-2">
          <div className="w-fit h-fit gap-4 flex flex-row">
            <span className="text-[#1C2024] text-xl font-semibold">
              {selectedPatient
                ? recordRefundClicked
                  ? "#RF10011006"
                  : billData?.billDocumentNumber
                : billId
                  ? `${billId}`
                  : ""}
            </span>
            {!cancelClicked && !recordRefundClicked && (
              <div className="flex flex-row gap-1 items-center">
                {!billData?.billDocumentNumber && (
                  <Tags tagText="Draft" type="secondary" border />
                )}
                {billData?.billDocumentNumber && (
                  <Tags tagText="Payment Pending" type="warning" border />
                )}
                {/* <Tags tagText="Requisition Pending" type="indigo" border /> */}
              </div>
            )}
            {cancelClicked && !recordRefundClicked && (
              <div className="flex flex-row gap-2 items-center">
                <Tags border tagText="Cancelled" type="danger" />
              </div>
            )}
            {recordRefundClicked && !saveRecord && (
              <div className="flex flex-row gap-2 items-center">
                <Tags border tagText="Pending Refund" type="warning" />
              </div>
            )}
            {recordRefundClicked && saveRecord && (
              <div className="flex flex-row gap-2 items-center">
                <Tags border tagText="Settled" type="primary" />
              </div>
            )}
          </div>
          <div className="flex flex-row gap-1">
            <span className="text-[#60646C] text-xs font-normal">
              {billStatus === "Draft" &&
                selectedPatientBill &&
                "createddate" in selectedPatientBill
                ? `Created on ${selectedPatientBill.createddate
                  ? format(
                    new Date(selectedPatientBill.createddate),
                    "dd/MM/yyyy hh:mm a"
                  )
                  : "—"
                }`
                : billStatus !== "Draft" &&
                  selectedPatientBill &&
                  "documentDate" in selectedPatientBill
                  ? `Created on ${selectedPatientBill.documentDate
                    ? format(
                      new Date(selectedPatientBill.documentDate),
                      "dd/MM/yyyy hh:mm a"
                    )
                    : "—"
                  }`
                  : "Created on —"}
            </span>
            <span className="text-[#0D74CE] text-xs font-normal">
              {billStatus === "Draft"
                ? (selectedPatientBill as any)?.createdBy ?? "--"
                : (selectedPatientBill as any)?.createdby ?? "--"}
            </span>
          </div>
        </div>
        {!recordRefundClicked && (
          <div
            className="flex flex-row items-center relative"
            ref={serviceSearchRef}
          >
            <Image
              src={"assets/icons/Search.svg"}
              alt="Search"
              width={24}
              height={24}
              className="absolute left-3 items-center"
            />
            {billStatus === "Draft" && (
              <input
                type="text"
                className="w-[304px] h-10 rounded-lg border border-[#CDCED6] bg-white flex items-center pr-3 py-2 pl-12 focus:outline-none focus:ring-1 focus:ring-[#0090FF]"
                placeholder="Search Services"
                value={serviceSearchTerm}
                onChange={handleServiceSearchChange}
                onFocus={handleSearchFocus}
              />
            )}
            {showServiceResults && (
              <div className="w-[304px] max-h-[300px] rounded-lg border border-[#CDCED6] bg-white pb-3 flex flex-col absolute top-14 overflow-y-auto z-50">
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
      <div
        style={{
          height:
            cancelClicked ||
              recordRefundClicked ||
              (billData?.outstandingAmount ?? 0) >= 0
              ? "calc(100vh - 294px)"
              : "calc(100vh - 220px)",
        }}
        className="w-full flex flex-row gap-4 overflow-y-auto no-scrollbar"
      >
        <div className="flex flex-col gap-4">
          {loading ? (
            <TotalBreakdownSkeleton />
          ) : cancelClicked || recordRefundClicked ? (
            <PatientRefundCard />
          ) : (
            <PatientCard
              patient={selectedPatient}
              focusOnClick={false}
              columns={ColumnData() as unknown as ColumnDef<GetBillServices>[]}
              initialData={billData?.services}
              table={table as unknown as Table<GetBillServices>}
              dataProps={{ data, setData }}
              setIsAllSelected={setIsAllSelected}
              showCustomAlert={showCustomAlert}
            />
          )}
          {selectedPatient ? (
            cancelClicked || recordRefundClicked ? (
              <TotalBreakdownRefundCard />
            ) : (
              <TotalBreakdownCard
                selectedPatientBill={selectedPatientBill}
                billData={billData}
                primaryButtonText="Record Payment"
                secondaryButtonText="View Payment Receipt"
                setRecordRefundClicked={setRecordRefundClicked}
                setRefundFooterButtons={setRefundFooterButtons}
              />
            )
          ) : (
            <TotalBreakdownSkeleton />
          )}
        </div>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <VisuallyHidden>
              <DialogTitle></DialogTitle>
            </VisuallyHidden>
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-0 rounded-lg shadow-none border-none z-[10000] [&>button]:hidden max-w-none">
              {dialogType === "Concession" && (
                <Concession
                  setOpen={setOpen}
                  selectedPatientBillConcession={undefined}
                  totalAmountforConcession={0}
                />
              )}
            </DialogContent>
          </Dialog>
        )}

        <div className="w-full h-fit flex flex-col gap-4">
          <div className="w-full h-fit flex flex-row justify-between ">
            {!recordRefundClicked && (
              <span className="text-[#1C2024] text-lg font-semibold flex items-center">
                Services · {table.getCoreRowModel().rows.length}
              </span>
            )}
            {recordRefundClicked && (
              <span className="text-[#1C2024] text-lg font-semibold flex items-center">
                Bills & Deposits{" "}
              </span>
            )}

            {!recordRefundClicked && (
              <DropdownMenu onOpenChange={setOpenShowCols} open={openShowCols}>
                <DropdownMenuTrigger asChild>
                  <UtilDropDownButton
                    leadingIcon={"assets/icons/columns.svg"}
                    label={"Show Columns"}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="px-0 py-2">
                  <span className="text-xs text-text-secondary m-sm">
                    Show/Hide Columns
                  </span>

                  {/* Body starts here: Only this part scrolls */}
                  <div className="max-h-[40vh] overflow-y-auto">
                    {/* Select All */}
                    <div
                      className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row rounded-none text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                      onClick={() => {
                        const columnsToToggle = table
                          .getAllColumns()
                          .filter(
                            (col) =>
                              col.id !== "serviceName" && col.getCanHide()
                          );

                        const allVisible = columnsToToggle.every(
                          (col) => pendingColumnVisibility[col.id]
                        );

                        const newState = !allVisible;
                        const newVisibilities = { ...pendingColumnVisibility };
                        columnsToToggle.forEach((col) => {
                          newVisibilities[col.id] = newState;
                        });
                        setPendingColumnVisibility(newVisibilities);
                      }}
                    >
                      <Checkbox
                        checked={table
                          .getAllColumns()
                          .filter(
                            (col) =>
                              col.id !== "serviceName" && col.getCanHide()
                          )
                          .every((col) => pendingColumnVisibility[col.id])}
                        onCheckedChange={(checked) => {
                          const columnsToToggle = table
                            .getAllColumns()
                            .filter(
                              (col) =>
                                col.id !== "serviceName" && col.getCanHide()
                            );

                          const newVisibilities = {
                            ...pendingColumnVisibility,
                          };
                          columnsToToggle.forEach((col) => {
                            newVisibilities[col.id] = !!checked;
                          });
                          setPendingColumnVisibility(newVisibilities);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label className="pl-2 pr-4 cursor-pointer">All</label>
                    </div>

                    {/* Individual checkboxes */}
                    {table
                      .getAllColumns()
                      .filter(
                        (column) =>
                          column.getCanHide() && column.id !== "serviceName"
                      )
                      .map((column) => (
                        <div
                          key={column.id}
                          className="cursor-pointer w-full h-fit px-4 py-2 flex flex-row text-[#1C2024] hover:text-[#0D74CE] hover:bg-[#E6F4FE] font-normal text-sm"
                          onClick={() => {
                            setPendingColumnVisibility((prev) => ({
                              ...prev,
                              [column.id]: !prev[column.id],
                            }));
                          }}
                        >
                          <Checkbox
                            checked={pendingColumnVisibility[column.id]}
                            onCheckedChange={(checked) => {
                              setPendingColumnVisibility((prev) => ({
                                ...prev,
                                [column.id]: !!checked,
                              }));
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <label className="pl-2 pr-4 cursor-pointer">
                            {columnNames[column.id]}
                          </label>
                        </div>
                      ))}
                  </div>
                  {/* End of scrollable body */}

                  <div className="p-sm">
                    <Button
                      size="button-small"
                      type="secondary-button"
                      variant="button"
                      onClick={() => {
                        setColumnVisibility(pendingColumnVisibility);
                        setOpenShowCols(false);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {recordRefundClicked && (
              <SmallList
                items={[
                  "Bill # / Deposit",
                  "Amount",
                  "Date/Time",
                  "Total Amount",
                ]}
                table={refundTable}
                columnNames={columnNamesBills}
              />
            )}
          </div>

          {!recordRefundClicked && (
            <div className="w-[920px] max-h-[60vh] overflow-hidden flex flex-col">
              {/* <DataTable
                columns={columns}
                initialData={initialData}
                table={table}
                dataProps={{ data, setData }}
              /> */}

              <ServiceTable
                columns={ColumnData()}
                initialData={(patientServicesTable ?? []).map((item, idx) => ({
                  ...item,
                  id: item.serviceid ?? idx,
                }))}
                table={table}
                dataProps={{
                  data,
                  setData,
                }}
                showCustomAlert={function (_config: {
                  heading: string;
                  content: string;
                  variant?:
                  | "success"
                  | "warning"
                  | "danger"
                  | "primary"
                  | "secondary";
                  buttonText?: string;
                  showButton?: boolean;
                  onClick?: () => void;
                  disappear?: boolean;
                }): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          )}
          {!data?.length && (
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
          {/* {recordRefundClicked && (
            <div className="w-[768px] max-h-[50vh] overflow-hidden flex flex-col">
              <DataTable
                columns={refundColumn}
                initialData={refundData}
                table={refundTable}
                dataProps={{ data, setData }}
                addButton={false}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default PatientBillingPanel;
