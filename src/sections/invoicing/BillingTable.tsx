"use client";
import React, { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import Image from "next/image";

import ScoreCard from "./ScoreCard";
import { DataTable } from "./data-table";
import { Columns } from "./TableColumns";
import { TableDataType } from "./tableData";
import Alerts from "@/components/alerts/Alerts";
import { addDays } from "date-fns";
import { useInvoicingData } from "@/hooks/useInvoicingData";
import { useDeleteInvoicing } from "@/hooks/useDeleteInvoicing";
import { t } from "@/utils/languages";

import { DateRange } from "react-day-picker";

type AlertType = "cancel" | "submit" | "delete" | "error" | "exportSuccess" | "printSuccess" | false | null;

interface AlertData {
  type: AlertType;
  message?: string;
}

function BillingTable(): JSX.Element {
  const [meMode, setMeMode] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState({
    show: false,
    message: "",
    type: "create" as "create" | "update" | "delete" | "submit" | "cancel"
  });
  const [errorAlert, setErrorAlert] = useState({
    show: false,
    message: ""
  });

  // Centralized alert management function
  const clearAllAlerts = () => {
    setSuccessAlert({ show: false, message: "", type: "create" });
    setErrorAlert({ show: false, message: "" });
    setValidationError(null);
  };

  // Pagination state (same as OPD bills)
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  });

  // Use the API hook for data fetching
  const { 
    data: apiData, 
    loading, 
    error, 
    metadata, 
    refetch, 
    updateFilters 
  } = useInvoicingData();

  // Use the delete hook
  const { deleteInvoicingItems, error: deleteError, success: deleteSuccess } = useDeleteInvoicing();

  const [filteredData, setFilteredData] = useState<TableDataType[]>([]);

  const memoizedSetFilteredData = useCallback(
    (data: TableDataType[] | ((prev: TableDataType[]) => TableDataType[])) => {
      setFilteredData(data);
    },
    []
  );

      // Consolidated API call effect - only one API call per filter change
      useEffect(() => {
        // Make API call with current date range
        updateFilters({
          startDate: date?.from?.toISOString() || new Date().toISOString(),
          endDate: date?.to?.toISOString() || new Date().toISOString(),
          priorAuthDoneBy: meMode ? "Me" : undefined,
          billFinalizedBy: meMode ? "Me" : undefined,
          pageNumber: pageNumber,
          pageSize: pageSize,
        });
      }, [date?.from, date?.to, meMode, pageNumber, pageSize, updateFilters]);

  // Update filteredData when API data changes
  useEffect(() => {
    setFilteredData(apiData);
  }, [apiData]);

  // Show error alert if API fails
  useEffect(() => {
    if (error) {
      clearAllAlerts();
      setErrorAlert({
        show: true,
        message: error
      });
    }
  }, [error]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      clearAllAlerts();
      // Refresh the data after successful deletion
      refetch();
      setSuccessAlert({
        show: true,
        message: t("success.billingItemsDeleted"),
        type: "delete"
      });
    }
  }, [deleteSuccess, refetch]);

  // Handle alert data changes from SubmitBillModal, Export, and Print
  useEffect(() => {
    if (alertData?.type === "submit") {
      clearAllAlerts();
      setSuccessAlert({
        show: true,
        message: t("success.billsSubmitted"),
        type: "submit"
      });
      setAlertData(null); // Reset alert data
    } else if (alertData?.type === "exportSuccess") {
      clearAllAlerts();
      setSuccessAlert({
        show: true,
        message: t("success.exportCompleted"),
        type: "create"
      });
      setAlertData(null); // Reset alert data
    } else if (alertData?.type === "printSuccess") {
      clearAllAlerts();
      setSuccessAlert({
        show: true,
        message: t("success.printCompleted"),
        type: "create"
      });
      setAlertData(null); // Reset alert data
    } else if (alertData?.type === "error") {
      clearAllAlerts();
      setErrorAlert({
        show: true,
        message: alertData.message || t("error.billSubmissionFailed")
      });
      setAlertData(null); // Reset alert data
    }
  }, [alertData]);

  // Handle delete error
  useEffect(() => {
    if (deleteError) {
      clearAllAlerts();
      setErrorAlert({
        show: true,
        message: deleteError
      });
    }
  }, [deleteError]);

  // Delete handler function
  const handleDelete = async (selectedRows: TableDataType[]) => {
    try {
      // Extract IDs from selected rows - try different ID fields
      const ids = selectedRows.map(row => row.invId || row.id || row.billId).filter(Boolean) as string[];
      
      if (ids.length === 0) {
        return;
      }

      await deleteInvoicingItems(ids);
    } catch {
      // Error handled by useDeleteInvoicing hook
    }
  };

  // Handle filter changes from DataTable
  const handleFiltersChange = useCallback((filters: Record<string, unknown>) => {
    // Convert filters to the format expected by the API
    const apiFilters: any = {};
    
    if (filters.searchTerm && typeof filters.searchTerm === 'string') {
      apiFilters.searchTerm = filters.searchTerm;
    }
    if (filters.billStatus && Array.isArray(filters.billStatus)) {
      apiFilters.billStatus = filters.billStatus;
    }
    if (filters.billType && Array.isArray(filters.billType)) {
      apiFilters.billType = filters.billType;
    }
    if (filters.company && Array.isArray(filters.company)) {
      apiFilters.company = filters.company;
    }
    if (filters.associateCompany && Array.isArray(filters.associateCompany)) {
      apiFilters.associateCompany = filters.associateCompany;
    }
    
    // Update API filters
    updateFilters(apiFilters);
  }, [updateFilters]);

  return (
    <div className="flex flex-col w-full mb-4">
      <div className="flex justify-between items-center p-md border-b border-[#D9D9E0]">
        <div className="flex space-x-2">
          <Image
            src="/assets/icons/receipt-rupee.svg"
            alt="Rupee icon"
            width={24}
            height={24}
          />
          <span className="font-bold text-lg">{t("pageTitles.invoicing")}</span>
        </div>
      </div>

      <div className="px-4">
        {errorAlert.show && (
          <Alerts
            heading={t("common.error")}
            variant="danger"
            content={errorAlert.message}
            showCloseIcon
            disappear
            className="mb-5"
            onClick={() => setErrorAlert(prev => ({ ...prev, show: false }))}
          />
        )}
        {successAlert.show && (
          <Alerts
            heading={t("common.success")}
            variant="success"
            content={successAlert.message}
            showCloseIcon
            disappear
            className="mb-5"
            onClick={() => setSuccessAlert(prev => ({ ...prev, show: false }))}
          />
        )}
        {validationError && (
          <Alerts
            heading={t("common.error")}
            variant="danger"
            content={validationError}
            showCloseIcon
            disappear
            className="mb-5"
            onClick={() => setValidationError(null)}
          />
        )}
        <ScoreCard date={date} tableData={filteredData} />

        <div className="table-wrapper">
          <DataTable
            columns={Columns()}
            data={filteredData}
            meModeProps={{ checked: meMode, setChecked: setMeMode }}
            dateProps={{ date, setDate }}
            setFilteredData={memoizedSetFilteredData}
            alertProps={{ alertType: alertData?.type || null, setAlertType: (type, message) => setAlertData({ type, message }) }}
            loading={loading}
            refetch={refetch}
            metadata={metadata}
            onDelete={handleDelete}
            onFiltersChange={handleFiltersChange}
            onValidationError={(message) => {
              clearAllAlerts();
              setValidationError(message);
            }}
            onPageChange={(newPage: number) => setPageNumber(newPage)}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </div>
      </div>
    </div>
  );
}

export default BillingTable;
