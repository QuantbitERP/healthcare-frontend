"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import DataTable from "@/components/reportPage/BillingTable/DataTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Printer } from "lucide-react";
import Image from "next/image";
import BillingTableFilters from "./BillingTableFilters";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicewiseReport } from "@/store/slices/reportListSlice";
import { reportColumns } from "./columns";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { RootState } from "@/store";
import Alerts from "@/components/alerts/Alerts";
import { t } from "@/utils/languages";

export default function BillingTable() {
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);
  const [showAlert] = useState(true);
  const [serviceGroup, setServiceGroup] = useState<string[]>([]);
  const [department, setDepartment] = useState<string[]>([]);
  const [service, setService] = useState<string[]>([]);
  const [billingClass, setBillingClass] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });
  const [sortedColumn, setSortedColumn] = useState("srNo");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [filters] = useState<Record<string, any>>({});
  const [searchTerm] = useState<string>("");

  // Get loading and error state from Redux
  const { loading, error } = useSelector((state: RootState) => state.reportList);
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize visible columns after component mounts
  useEffect(() => {
    if (!isMountedRef.current) return;
    const columns = reportColumns(sortedColumn, setSortedColumn);
    setVisibleColumns(columns.map(col => col.accessorKey));
  }, [sortedColumn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const ApplyFilter = useCallback(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer to debounce the API call
    debounceTimerRef.current = setTimeout(() => {
      // Validate date range
      if (!date?.from || !date?.to) {
        return;
      }

      const payload: any = {
        fromDate: format(date.from, "yyyy-MM-dd"),
        toDate: format(date.to, "yyyy-MM-dd"),
        hospitalIds: ["f1b0f4c7-9f66-48db-b94d-0f4ca190d477"],
        billType: 1,
        patientId: null,
      };
      
      if (serviceGroup.length) payload.serviceGroupIds = serviceGroup;
      if (department.length) payload.serviceDepartmentIds = department;
      if (service.length) payload.serviceIds = service;
      if (billingClass.length) payload.billingClassIds = billingClass;
      if (companyName.length) payload.companyNameIds = companyName;
      if (groupBy.length) payload.groupBy = groupBy;
      if (searchTerm) payload.searchTerm = searchTerm;
   
      Object.assign(payload, filters);
      dispatch(fetchServicewiseReport(payload) as any);
    }, 300); // 300ms debounce delay
  }, [date, serviceGroup, department, service, billingClass, companyName, groupBy, filters, searchTerm, dispatch]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Memoize the ApplyFilter function to prevent unnecessary re-renders
  const memoizedApplyFilter = React.useMemo(() => ApplyFilter, [ApplyFilter]);

  // Success callback for filter application
  const handleFilterSuccess = useCallback(() => {
    if (!isMountedRef.current) return;
    setShowSuccessToast(true);
  }, []);

  return (
    <div className="flex flex-col w-full mb-4">
      <div className="flex justify-between items-center p-md border-b border-[#D9D9E0]">
        <div className="flex space-x-2">
          <Image
            src="/assets/icons/NotepadTimer.svg"
            alt="Report Icon"
            width={24}
            height={24}
          />
          <span className="font-bold text-lg">User Wise Collection Summary</span>
        </div>
        <div className="flex space-x-2 items-center">
          <button
            type="button"
            className="bg-white flex space-x-sm rounded-lg px-md py-sm font-medium text-sm items-center border border-[#CDCED6]"
          >
            <Printer size={20} color="black" />
            <span>Print</span>
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="bg-primary text-white flex space-x-sm rounded-lg px-md py-sm hover:bg-primary-hover font-medium text-sm items-center cursor-pointer"
              >
                <span>Download</span>
                <ChevronDown size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              className="z-50 mt-2 w-40 rounded-md border bg-white shadow-md p-0"
            >
              <div 
                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-100"
                onClick={() => {
                  // Handle XLS download
                  console.log("Download XLS clicked");
                }}
              >
                Download XLS
              </div>
              <div 
                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  // Handle PDF download
                  console.log("Download PDF clicked");
                }}
              >
                Download PDF
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Info alert */}
      {showAlert && (
        <div className="mx-lg transition-transform duration-1000 delay-1000 px-4">
          {/* <Alerts
            heading="Info."
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            variant="primary"
            open={true}
            disappear={false}
            showCloseIcon={true}
            className="mb-5 px-4 py-3 rounded-md shadow-sm border border-blue-200"
            onClick={() => setShowAlert(false)}
          /> */}
        </div>
      )}
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="mx-lg px-4 py-2">
          <Alerts
            variant="success"
            heading={t("common.success")}
            content={t("success.reportFiltersApplied")}
            showCloseIcon={true}
            disappear={false}
            onClick={() => setShowSuccessToast(false)}
          />
        </div>
      )}
      
      {/* Filters and Table */}
      <div className="px-4">
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800">{t("reportDataLoading")}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-2">
              <span className="text-red-800">{t("common.error")}: {error}</span>
            </div>
          </div>
        )}
        <BillingTableFilters 
          serviceGroup={serviceGroup}
          setServiceGroup={setServiceGroup}
          department={department}
          setDepartment={setDepartment}
          service={service}
          setService={setService}
          billingClass={billingClass}
          setBillingClass={setBillingClass}
          companyName={companyName}
          setCompanyName={setCompanyName}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          ApplyFilter={memoizedApplyFilter}
          dateProps={{ date, setDate }}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          loading={loading}
          onSuccess={handleFilterSuccess}
        />
        <div className="table-wrapper">
          <DataTable 
            dateProps={{ date, setDate }}
            visibleColumns={visibleColumns}
            groupByColumn={groupBy}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}
