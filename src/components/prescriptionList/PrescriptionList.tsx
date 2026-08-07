import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/buttons/Button";
import DataTableComponent, { TableCellComponents } from "@/components/DataTable";
import { Button as UIButton } from "@/components/ui/button";
import { X, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders } from "@/utils/sessionAuth";

// Tooltip component
const PrescriptionStatusTooltip: React.FC<{
  status: string;
  prescriptions: Prescription[];
  children: React.ReactNode;
}> = ({ status, prescriptions, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const statusPrescriptions = prescriptions.filter(pres => pres.prescription_status === status);

  // Filter prescriptions based on search term
  const filteredPrescriptions = statusPrescriptions.filter(pres =>
    pres.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pres.prescription_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pres.patient_id && pres.patient_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pres.mobile_number && pres.mobile_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pres.aadhar_no && pres.aadhar_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && statusPrescriptions.length > 0 && (
        <div className="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-3 top-full left-0 mt-1">
          <div className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">
            {status} ({filteredPrescriptions.length} of {statusPrescriptions.length})
          </div>

          {/* Search Input */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by name, ID, mobile or Aadhar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()} // Prevent tooltip from closing
            />
          </div>

          {/* Prescriptions List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((pres, index) => (
                <div key={index} className="text-xs py-2 px-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {
                  // Optional: Handle click on prescription
                  console.log("Selected prescription:", pres);
                }}>
                  <div className="font-medium text-gray-800">{pres.prescription_number}</div>
                  <div className="text-gray-600">{pres.patient_name}</div>
                  {pres.doctor_id && <div className="text-gray-500">Dr: {pres.doctor_id}</div>}
                  {pres.prescription_date && <div className="text-gray-500 text-xs">{new Date(pres.prescription_date).toLocaleDateString()}</div>}
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 italic py-2 text-center">
                {searchTerm ? "No matching prescriptions found" : "No prescriptions in this status"}
              </div>
            )}
          </div>

          {filteredPrescriptions.length > 0 && (
            <div className="text-xs text-gray-500 pt-2 border-t mt-2">
              Showing {filteredPrescriptions.length} of {statusPrescriptions.length} prescriptions
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface Prescription {
  id: number;
  prescription_number: string;
  prescription_date: string;
  patient_name: string;
  patient_id: string;
  doctor_id: string;
  department: string;
  visit_id: string;
  start_date: string;
  end_date: string;
  prescription_status?: "Pending" | "Completed";
  total_qty?: number;
  invoiced_qty?: number;
  mobile_number?: string;
  aadhar_no?: string;
}

interface PrescriptionListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrescription: (prescription: Prescription) => void;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  isOpen,
  onClose,
  onSelectPrescription,
}) => {
  const { apiKey, apiSecret } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]); // Store unfiltered data for summary
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showCompleted, setShowCompleted] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(true); // Default collapsed
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false); // Default open

  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate summary counts
  const summaryCounts = useMemo(() => {
    const completed = allPrescriptions.filter(pres => pres.prescription_status === "Completed").length;
    const pending = allPrescriptions.filter(pres => pres.prescription_status === "Pending").length;

    return {
      total: allPrescriptions.length,
      completed,
      pending
    };
  }, [allPrescriptions]);

  const fetchPrescriptions = useCallback(async (search?: string, dateRange?: DateRange) => {
    setLoading(true);
    try {
      // Build query parameters
      const params: any = {
        fields: JSON.stringify([
          "name",
          "prescription_number",
          "custom_prescription_no",
          "prescription_no",
          "creation",
          "full_name",
          "patient_id",
          "doctor",
          "department",
          "visit_id",
          "requisition_from",
          "mobile_number",
          "aadhar_no"
        ]),
        limit_page_length: "2000000",
        order_by: "creation desc"
      };

      // Build filters array
      const filters: any[] = [
        ["name", "like", "PR%"], // Add this filter to show only prescriptions
      ];

      if (search?.trim()) {
        params.or_filters = JSON.stringify([
          ["full_name", "like", `%${search.trim()}%`],
          ["patient_id", "like", `%${search.trim()}%`],
          ["mobile_number", "like", `%${search.trim()}%`],
          ["aadhar_no", "like", `%${search.trim()}%`]
        ]);
      }

      if (dateRange?.from) {
        filters.push(["creation", ">=", format(dateRange.from, "yyyy-MM-dd")]);
      }

      if (dateRange?.to) {
        filters.push(["creation", "<=", format(dateRange.to, "yyyy-MM-dd")]);
      }


      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }

      const authHeaders = getAuthHeaders();
      // Convert HeadersInit to plain object for fetch compatibility
      const headers = typeof authHeaders === 'string' ?
        JSON.parse(authHeaders) :
        Array.isArray(authHeaders) ?
          Object.fromEntries(authHeaders) :
          authHeaders;

      const response = await axios.get(`${API_BASE_URL}/Patient Requisition`, {
        params,
        headers,
        withCredentials: true,
      });

      const data: any[] = response.data.data || [];

      // Store all prescriptions for summary
      const allTransformedData = data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name || "",
        prescription_number: item.custom_prescription_no || item.prescription_no || item.prescription_number || item.name || "",
        prescription_date: item.creation || "",
        patient_name: item.full_name || "",
        patient_id: item.patient_id || "",
        doctor_id: item.doctor || "",
        department: item.department || item.requisition_from || "",
        visit_id: item.visit_id || "",
        start_date: item.start_date || "",
        end_date: item.end_date || "",
        mobile_number: item.mobile_number || "",
        aadhar_no: item.aadhar_no || "",
      }));

      // Filter out completed prescriptions if showCompleted is false
      let filteredData = data;
      if (!showCompleted) {
        filteredData = data.filter(
          (prescription: Prescription) => prescription.prescription_status !== "Completed"
        );
      }

      const transformedData = filteredData.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name || "",
        prescription_number: item.custom_prescription_no || item.prescription_no || item.prescription_number || item.name || "",
        prescription_date: item.creation || "",
        patient_name: item.full_name || "",
        patient_id: item.patient_id || "",
        doctor_id: item.doctor || "",
        department: item.department || item.requisition_from || "",
        visit_id: item.visit_id || "",
        start_date: item.start_date || "",
        end_date: item.end_date || "",
        mobile_number: item.mobile_number || "",
        aadhar_no: item.aadhar_no || "",
      }));

      setAllPrescriptions(allTransformedData);
      setPrescriptions(transformedData);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      setPrescriptions([]);
      setAllPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, apiSecret, showCompleted]);





  // Debounced search implementation
  const debouncedFetch = useCallback((search: string, dateRange?: DateRange) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchPrescriptions(search, dateRange);
      setSearchTerm(search);
      setDateRange(dateRange);
    }, 400);
  }, [fetchPrescriptions]);

  // Handle search input from DataTableComponent
  const handleSearch = useCallback((term: string) => {
    if (term === searchTerm) return;
    debouncedFetch(term, dateRange);
  }, [debouncedFetch, searchTerm, dateRange]);

  // Handle date range change from DataTableComponent
  const handleDateRangeChange = useCallback((newDateRange: DateRange | undefined) => {
    debouncedFetch(searchTerm, newDateRange);
  }, [debouncedFetch, searchTerm]);

  // Handle showCompleted change
  useEffect(() => {
    if (isOpen) {
      fetchPrescriptions(searchTerm, dateRange);
    }
  }, [showCompleted, isOpen, fetchPrescriptions, searchTerm, dateRange]);

  // Initial load when component opens
  useEffect(() => {
    if (isOpen && apiKey && apiSecret) {
      fetchPrescriptions();
    }
  }, [isOpen, fetchPrescriptions, apiKey, apiSecret]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Calculate filter count for DataTableComponent
  const filterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (dateRange?.from || dateRange?.to) count++;
    if (!showCompleted) count++; // Count the "hide completed" filter
    return count;
  }, [searchTerm, dateRange, showCompleted]);

  // Define columns for DataTableComponent
  const columns = [
    {
      accessorKey: "prescription_number",
      header: "Prescription No",
    },
    {
      accessorKey: "prescription_date",
      header: "Prescription Date",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="date" value={getValue()} />
      ),
    },
    // {
    //   accessorKey: "visit_id",
    //   header: "Visit ID",
    // },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "patient_name",
      header: "Patient Name",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="user" value={getValue()} />
      ),
    },
    {
      accessorKey: "patient_id",
      header: "Patient ID",
    },
    {
      accessorKey: "mobile_number",
      header: "Mobile Number",
    },
    // {
    //   accessorKey: "aadhar_no",
    //   header: "Aadhar No",
    // },
    {
      accessorKey: "doctor_id",
      header: "Doctor Name",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="user" value={getValue()} />
      ),
    },
    {
      accessorKey: "prescription_status",
      header: "Status",
      cell: ({ getValue }: any) => {
        const status = getValue();
        return (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
              }`}>
              {status || "Pending"}
            </span>
          </div>
        );
      },
    },
    {
      id: "select",
      header: "Select",
      cell: ({ row }: any) => (
        <Button
          onClick={() => onSelectPrescription(row.original)}
          size="button-small"
          type="primary-button"
        >
          Select
        </Button>
      ),
    },
  ];

  const columnNames = {
    prescription_number: "Prescription Number",
    prescription_date: "Prescription Date",
    visit_id: "Visit ID",
    department: "Department",
    patient_name: "Patient Name",
    patient_id: "Patient ID",
    mobile_number: "Mobile Number",
    aadhar_no: "Aadhar No",
    doctor_id: "Doctor Name",
    prescription_status: "Status",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
      <Card className="w-[95vw] max-w-6xl max-h-[95vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-lg font-semibold">Prescription Details</CardTitle>
          <UIButton onClick={onClose} variant="ghost" size="icon" className="p-0">
            <X className="h-5 w-5" />
          </UIButton>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
          {/* Collapsible Summary Cards */}
          <div className="bg-white border-b">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}>
              <h3 className="text-sm font-semibold text-gray-700">Summary Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  <PrescriptionStatusTooltip status="Completed" prescriptions={allPrescriptions}>
                    <span className="hover:text-green-600 cursor-pointer transition-colors">{summaryCounts.completed} Completed</span>
                  </PrescriptionStatusTooltip>
                  {" • "}
                  <PrescriptionStatusTooltip status="Pending" prescriptions={allPrescriptions}>
                    <span className="hover:text-yellow-600 cursor-pointer transition-colors">{summaryCounts.pending} Pending</span>
                  </PrescriptionStatusTooltip>
                  {" • "}
                  <span className="text-gray-500">{summaryCounts.total} Total</span>
                </span>
                {isSummaryCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {!isSummaryCollapsed && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Prescriptions</p>
                        <p className="text-2xl font-bold text-blue-900">{summaryCounts.total}</p>
                      </div>
                      <div className="bg-blue-100 rounded-full p-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <PrescriptionStatusTooltip status="Completed" prescriptions={allPrescriptions}>
                      <div className="flex items-center justify-between cursor-pointer hover:bg-green-100 rounded-lg transition-colors">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Completed</p>
                          <p className="text-2xl font-bold text-green-900">{summaryCounts.completed}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </PrescriptionStatusTooltip>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <PrescriptionStatusTooltip status="Pending" prescriptions={allPrescriptions}>
                      <div className="flex items-center justify-between cursor-pointer hover:bg-yellow-100 rounded-lg transition-colors">
                        <div>
                          <p className="text-yellow-600 text-sm font-medium">Pending</p>
                          <p className="text-2xl font-bold text-yellow-900">{summaryCounts.pending}</p>
                        </div>
                        <div className="bg-yellow-100 rounded-full p-2">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </PrescriptionStatusTooltip>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Filters Section */}
          <div className="flex-shrink-0 bg-white border-b">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}>
              <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {filterCount > 0 ? `${filterCount} active` : 'No filters applied'}
                </span>
                {isFiltersCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {!isFiltersCollapsed && (
              <div className="px-4 pb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showCompletedPrescription"
                      checked={showCompleted}
                      onCheckedChange={(checked) => setShowCompleted(checked === true)}
                    />
                    <Label htmlFor="showCompletedPrescription" className="text-xs">Show Completed</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable DataTable Section */}
          <div className="flex-1 overflow-auto p-4">
            {/* DataTableComponent with built-in search and date filters */}
            <DataTableComponent
              pageName="Prescription"
              isRowSelectable={false}
              searchPlaceholder="Search by Patient Name, UHID, Mobile, Aadhar..."
              data={prescriptions}
              loading={loading}
              columns={columns}
              columnNames={columnNames}
              filterCount={filterCount}
              onSearch={handleSearch}
              onDataChange={handleDateRangeChange}
              onFilterClick={() => { }}
              onRowClick={(row) => onSelectPrescription(row)}
              isSearchFocus={true}
              hideFilters={false}
              hideDatePicker={false}
              hideMeFilter={true}
              hideShowColumns={true}
              autoSize={true}
              className="h-full"
            />
          </div>
        </CardContent>

        <div className="p-4 border-t flex justify-end space-x-2">
          <Button type="secondary-button" size="button-medium" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PrescriptionList;