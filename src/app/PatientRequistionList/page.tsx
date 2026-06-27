'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Button from "@/components/buttons/Button";
import DataTableComponent, { TableCellComponents } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface Requisition {
  id: number;
  requisitionNo: string;
  requisitionDate: string;
  requestedFromDept: string;
  requestedToDept: string;
  userName: string;
  docstatus: number;
  isRequisition: boolean;
}

export default function PatientRequisitionList() {
  const API_BASE_URL = "https://gmcerp.quantcloud.in/api/resource";
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const router = useRouter();

  const handleClick = () => {
    router.push("/PR");
  };

  const fetchRequisitions = useCallback(async (search?: string, dateRange?: DateRange) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        fields: JSON.stringify([
          "name",
          "requisition_date_time",
          "requisition_from",
          "requisition_to",
          "owner",
          "docstatus",
          "is_requisition"
        ]),
        limit_page_length: "40",
        order_by: "creation desc"
      };

      const filters: any[] = [];
      if (search?.trim()) {
        filters.push(["Patient Requisition", "name", "like", `%${search.trim()}%`]);
      }
      if (dateRange?.from) {
        filters.push(["Patient Requisition", "requisition_date_time", ">=", format(dateRange.from, "yyyy-MM-dd")]);
      }
      if (dateRange?.to) {
        filters.push(["Patient Requisition", "requisition_date_time", "<=", format(dateRange.to, "yyyy-MM-dd")]);
      }
      if (filters.length > 0) {
        params['filters'] = JSON.stringify(filters);
      }

      const response = await axios.get(
        `${API_BASE_URL}/Patient%20Requisition`,
        {
          params,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      const requisitionList = Array.isArray(response.data.data) ? response.data.data : [];

      const transformedData = requisitionList.map((doc: any, index: number) => ({
        id: index + 1,
        requisitionNo: doc.name || "",
        requisitionDate: doc.requisition_date_time || "",
        requestedFromDept: doc.requisition_from || "",
        requestedToDept: doc.requisition_to || "",
        userName: doc.owner || "",
        docstatus: doc.docstatus || 0,
        isRequisition: doc.is_requisition || false,
      }));

      setRequisitions(transformedData);
    } catch (err) {
      setError("Failed to load requisition data");
      console.error("Failed to load requisition data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFetch = useCallback((search: string, dateRange?: DateRange) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchRequisitions(search, dateRange);
      setSearchTerm(search);
      setDateRange(dateRange);
    }, 400);
  }, [fetchRequisitions]);

  const handleSearch = useCallback((term: string) => {
    if (term === searchTerm) return;
    debouncedFetch(term, dateRange);
  }, [debouncedFetch, searchTerm, dateRange]);

  const handleDateRangeChange = useCallback((newDateRange: DateRange | undefined) => {
    debouncedFetch(searchTerm, newDateRange);
  }, [debouncedFetch, searchTerm]);

  // Handle row click to navigate to PR form with requisition ID
  const handleRowClick = useCallback((row: Requisition) => {

    router.push(`/PR?requisitionNo=${row.requisitionNo}`);
  }, [router]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const filterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (dateRange?.from || dateRange?.to) count++;
    return count;
  }, [searchTerm, dateRange]);

  return (
    <div className="bg-white min-h-screen p-2">
      <div className="my-20">
        <PageHeader
          title="Patient Requisition"
          icon="../assets/icons/BriefcaseIcon.svg"
          rightButtons={
            <div className="flex flex-row space-x-2">
              <Button type="primary-button" size="button-medium" onClick={handleClick}>
                + New Requisition
              </Button>
            </div>
          }
        />
      </div>
      <div className="w-full">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <DataTableComponent
          pageName="Patient Requisition"
          isRowSelectable
          searchPlaceholder="Search by requisition number..."
          data={requisitions}
          loading={loading}
          columns={[
            { accessorKey: "requisitionNo", header: "Requisition No." },
            {
              accessorKey: "requisitionDate",
              header: "Requisition Date",
              cell: ({ getValue }: any) => (
                <TableCellComponents type="date" value={getValue()} />
              ),
            },
            { accessorKey: "requestedFromDept", header: "Requested From Dept./Ward" },
            { accessorKey: "requestedToDept", header: "Requested to Dept./Ward" },
            {
              accessorKey: "isRequisition",
              header: "Type",
              cell: ({ getValue }: any) => {
                const isRequisition = getValue();
                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRequisition 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {isRequisition ? 'Patient Requisition' : 'Prescription'}
                  </span>
                );
              },
            },
            {
              accessorKey: "docstatus",
              header: "Status",
              cell: ({ getValue }: any) => {
                const status = getValue();
                let statusText = "";
                let statusClass = "";

                if (status === 0) {
                  statusText = "Draft";
                  statusClass = "bg-yellow-100 text-yellow-800";
                } else if (status === 1) {
                  statusText = "Submitted";
                  statusClass = "bg-green-100 text-green-800";
                } else if (status === 2) {
                  statusText = "Cancelled";
                  statusClass = "bg-red-100 text-red-800";
                }

                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                    {statusText}
                  </span>
                );
              },
            },
            {
              accessorKey: "userName",
              header: "Created By",
              cell: ({ getValue }: any) => (
                <TableCellComponents type="user" value={getValue()} />
              ),
            },
          ]}
          columnNames={{
            requisitionNo: "Requisition No.",
            requisitionDate: "Requisition Date",
            requestedFromDept: "Requested From Dept./Ward",
            requestedToDept: "Requested to Dept./Ward",
            isRequisition: "Type",
            docstatus: "Status",
            userName: "Created By",
          }}
          filterCount={filterCount}
          onSearch={handleSearch}
          onDataChange={handleDateRangeChange}
          onFilterClick={() => { }}
          onRowClick={handleRowClick} // Add this to handle row clicks
          isSearchFocus={true}
        />
      </div>
    </div>
  );
}