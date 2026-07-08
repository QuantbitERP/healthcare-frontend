import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/buttons/Button";
import DataTableComponent, { TableCellComponents } from "@/components/DataTable";
import { Button as UIButton } from "@/components/ui/button";
import { X, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/AuthContext";
import { getAuthHeaders, setSessionAuthPreference } from "@/utils/sessionAuth";

// Tooltip component
const StatusTooltip: React.FC<{
  status: string;
  requisitions: PatientRequisition[];
  children: React.ReactNode;
}> = ({ status, requisitions, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const statusRequisitions = requisitions.filter(req => req.requisition_status === status);

  // Filter requisitions based on search term
  const filteredRequisitions = statusRequisitions.filter(req =>
    req.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && statusRequisitions.length > 0 && (
        <div className="absolute z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-3 top-full left-0 mt-1">
          <div className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">
            {status} ({filteredRequisitions.length} of {statusRequisitions.length})
          </div>

          {/* Search Input */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search by patient name or requisition ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()} // Prevent tooltip from closing
            />
          </div>

          {/* Requisitions List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredRequisitions.length > 0 ? (
              filteredRequisitions.map((req, index) => (
                <div key={index} className="text-xs py-2 px-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {
                  // Optional: Handle click on requisition
                  console.log("Selected requisition:", req);
                }}>
                  <div className="font-medium text-gray-800">{req.name}</div>
                  <div className="text-gray-600">{req.patient_name}</div>
                  {req.doctor && <div className="text-gray-500">Dr: {req.doctor}</div>}
                  {req.transaction_date && <div className="text-gray-500 text-xs">{new Date(req.transaction_date).toLocaleDateString()}</div>}
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 italic py-2 text-center">
                {searchTerm ? "No matching requisitions found" : "No requisitions in this status"}
              </div>
            )}
          </div>

          {filteredRequisitions.length > 0 && (
            <div className="text-xs text-gray-500 pt-2 border-t mt-2">
              Showing {filteredRequisitions.length} of {statusRequisitions.length} requisitions
            </div>
          )}
        </div>
      )}
    </div>
  );
};
interface PatientRequisition {
  id: number;
  name: string;
  patient_id: string;
  patient_name: string;
  doctor: string;
  transaction_date: string;
  sale_type: string;
  status: string;
  visit_id: string;
  department: string;
  company: string;
  remark: string;
  requisition_status?: "Pending" | "Completed" | "Partially Pending";
  total_qty?: number;
  invoiced_qty?: number;
}

interface PatientRequisitionListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRequisition: (requisition: PatientRequisition) => void;
}

const PatientRequisitionList: React.FC<PatientRequisitionListProps> = ({
  isOpen,
  onClose,
  onSelectRequisition,
}) => {
  const [requisitions, setRequisitions] = useState<PatientRequisition[]>([]);
  const [allRequisitions, setAllRequisitions] = useState<PatientRequisition[]>([]); // Store unfiltered data for summary
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [ipNo, setIpNo] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isStat, setIsStat] = useState(false);
  const [isDischarge, setIsDischarge] = useState(false);
  const [isRoutine, setIsRoutine] = useState(false);
  const [isASAP, setIsASAP] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(true); // Default collapsed
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false); // Default open
  const { isAuthenticated, isInitialized, currentUser } = useAuth();
  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate summary counts
  const summaryCounts = useMemo(() => {
    const completed = allRequisitions.filter(req => req.requisition_status === "Completed").length;
    const partiallyCompleted = allRequisitions.filter(req => req.requisition_status === "Partially Pending").length;
    const pending = allRequisitions.filter(req => req.requisition_status === "Pending").length;

    return {
      total: allRequisitions.length,
      completed,
      partiallyCompleted,
      pending
    };
  }, [allRequisitions]);

  // Function to update requisition completion status


  const fetchRequisitions = useCallback(async (search?: string, dateRange?: DateRange) => {
    // Check if authentication is initialized
    if (!isInitialized) {
      console.log("Authentication not initialized yet, skipping fetch");
      setLoading(false);
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      console.log("User not authenticated, skipping fetch");
      setLoading(false);
      return;
    }

    // Force session-based authentication if no API keys are available
    const apiKey = localStorage.getItem("apiKey");
    const apiSecret = localStorage.getItem("apiSecret");
    if (!apiKey || !apiSecret) {
      console.log("No API keys found, enabling session-based authentication");
      setSessionAuthPreference(true);
    }

    setLoading(true);
    try {
      // Build query parameters
      const params: any = {
        fields: JSON.stringify(["*"
          // "name",
          // "patient_id",
          // "full_name",
          // "doctor",
          // "requisition_date_time",
          // "sale_type",
          // // "status",
          // "visit_id",
          // "requisition_from",
          // "patient_company",
          // // "remark",
          // "patient_requisition_item_details"
        ]),
        limit_page_length: "2000000",
        order_by: "creation desc"
      };

      // Build filters array
      const filters: any[] = [];

      if (search?.trim()) {
        filters.push(["full_name", "like", `%${search.trim()}%`]);
      }

      if (dateRange?.from) {
        filters.push(["requisition_date_time", ">=", format(dateRange.from, "yyyy-MM-dd")]);
      }

      if (dateRange?.to) {
        filters.push(["requisition_date_time", "<=", format(dateRange.to, "yyyy-MM-dd")]);
      }

      if (ipNo.trim()) {
        filters.push(["patient_id", "like", `%${ipNo.trim()}%`]);
      }

      // Status filters
      if (isExpired) filters.push(["expired", "=", "1"]);
      if (isStat) filters.push(["stat", "=", "1"]);
      if (isDischarge) filters.push(["discharge", "=", "1"]);
      if (isRoutine) filters.push(["routine", "=", "1"]);
      if (isASAP) filters.push(["asap", "=", "1"]);
      
      // Filter to show only requisitions where is_requistion == 1
      filters.push(["is_requisition", "=", "1"]);

      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }

      const headers = getAuthHeaders();
      // Convert HeadersInit to plain object for Axios compatibility
      const axiosHeaders = typeof headers === 'string' ? 
        JSON.parse(headers) : 
        Array.isArray(headers) ? 
          Object.fromEntries(headers) : 
          headers;

      const response = await axios.get(`${API_BASE_URL}/Patient Requisition`, {
        params,
        headers: axiosHeaders,
        withCredentials: true,
      });

      if (response.data.data) {
        // Process each requisition to calculate status
        const processedRequisitions = await Promise.all(
          response.data.data.map(async (req: any) => {
            // First, fetch the full requisition with child table data
            let fullRequisitionData = req;
            try {
              const fullReqResponse = await axios.get(
                `${API_BASE_URL}/Patient Requisition/${req.name}?fields=["name","patient_requisition_item_details"]`,
                { headers: axiosHeaders, withCredentials: true }
              );

              if (fullReqResponse.data?.data) {
                fullRequisitionData = fullReqResponse.data.data;
              }
            } catch (error) {
              console.error("Failed to fetch full requisition details for", req.name, ":", error);
            }

            // Debug: Show the actual requisition items structure
            console.log("Requisition items structure for", req.name, ":", fullRequisitionData.patient_requisition_item_details);

            // Get total quantity from requisition items
            const totalQty = (fullRequisitionData.patient_requisition_item_details || [])
              .reduce((sum: number, item: any) => {
                // Try all possible field names and log what we find
                console.log("Item fields:", Object.keys(item), "Item data:", item);
                const qty = item.req_qty || item.quantity || item.qty || item.ordered_qty || item.requested_qty || 0;
                console.log("Using quantity field:", qty, "from item:", item);
                return sum + qty;
              }, 0);

            // Get invoiced quantity from Sale Bills
            try {
              console.log("Searching for invoices with custom_req_no =", req.name);
              const invoiceResponse = await axios.get(
                `${API_BASE_URL}/Sale Bill?filters=[["custom_req_no","=","${req.name}"],["docstatus","=",1]]&fields=["name","custom_req_no"]`,
                { headers: axiosHeaders, withCredentials: true }
              );

              console.log("Invoice query response:", invoiceResponse.data);
              const invoices = invoiceResponse.data?.data || [];
              console.log("Found invoices:", invoices.length, invoices);

              let invoicedQty = 0;

              // Fetch full invoice details for each invoice to get items
              for (const invoice of invoices) {
                console.log("Processing invoice:", invoice.name, "custom_req_no:", invoice.custom_req_no);

                try {
                  const fullInvoiceResponse = await axios.get(
                    `${API_BASE_URL}/Sale Bill/${invoice.name}?fields=["name","items"]`,
                    { headers: axiosHeaders, withCredentials: true }
                  );

                  const fullInvoice = fullInvoiceResponse.data?.data;
                  if (fullInvoice?.items) {
                    console.log("Invoice items:", fullInvoice.items);
                    const invoiceQty = fullInvoice.items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0);
                    invoicedQty += invoiceQty;
                    console.log("Invoice qty:", invoiceQty, "Total invoiced so far:", invoicedQty);
                  }
                } catch (error: any) {
                  if (error.response?.status === 403) {
                    console.log(`Access forbidden (403) - User lacks permission for Sale Bill ${invoice.name}`);
                    // Continue processing other requisitions even if we can't access invoice details
                  } else {
                    console.error("Failed to fetch full invoice details for", invoice.name, ":", error);
                  }
                }
              }

              // Determine status
              let requisitionStatus: "Pending" | "Completed" | "Partially Pending" = "Pending";
              if (totalQty > 0) {
                if (invoicedQty >= totalQty) {
                  requisitionStatus = "Completed";
                } else if (invoicedQty > 0) {
                  requisitionStatus = "Partially Pending";
                }
              }

              console.log(`Requisition ${req.name}: Total=${totalQty}, Invoiced=${invoicedQty}, Status=${requisitionStatus}`);

              return {
                ...req,
                requisition_status: requisitionStatus,
                total_qty: totalQty,
                invoiced_qty: invoicedQty,
              };
            } catch (error: any) {
              if (error.response?.status === 403) {
                console.log(`Access forbidden (403) - User lacks permission for Sale Bill data when processing requisition ${req.name}`);
                // Return default status when we can't access invoice data
                return {
                  ...req,
                  requisition_status: "Pending",
                  total_qty: totalQty,
                  invoiced_qty: 0,
                };
              } else {
                console.error(`Error calculating status for requisition ${req.name}:`, error);
                return {
                  ...req,
                  requisition_status: "Pending",
                  total_qty: totalQty,
                  invoiced_qty: 0,
                };
              }
            }
          })
        );

        // Filter out completed requisitions if showCompleted is false
        let filteredRequisitions = processedRequisitions;
        if (!showCompleted) {
          filteredRequisitions = filteredRequisitions.filter(
            (req: PatientRequisition) => req.requisition_status !== "Completed"
          );
        }

        // Debug: Show all processed requisitions and filtered results
        console.log("All processed requisitions:", processedRequisitions.map(r => ({ name: r.name, status: r.requisition_status })));
        console.log("Filtered requisitions (showCompleted=" + showCompleted + "):", filteredRequisitions.map(r => ({ name: r.name, status: r.requisition_status })));

        // Check for duplicates
        const duplicateNames = processedRequisitions
          .map(r => r.name)
          .filter((name, index, arr) => arr.indexOf(name) !== index);
        if (duplicateNames.length > 0) {
          console.warn("Found duplicate requisition names:", duplicateNames);
        }

        // Set both all requisitions (for summary) and filtered requisitions (for display)
        setAllRequisitions(processedRequisitions);
        setRequisitions(filteredRequisitions);

        const transformedData = filteredRequisitions.map((item: any, index: number) => ({
          id: index + 1,
          name: item.name,
          patient_id: item.patient_id || "",
          patient_name: item.full_name || "",
          doctor: item.doctor || "",
          transaction_date: item.requisition_date_time || "",
          sale_type: item.sale_type || "",
          status: item.status || "",
          visit_id: item.visit_id || "",
          department: item.requisition_from || "",
          company: item.patient_company || "",
          remark: item.remark || "",
          requisition_status: item.requisition_status,
          total_qty: item.total_qty,
          invoiced_qty: item.invoiced_qty,
        }));

        setAllRequisitions(processedRequisitions.map((item: any, index: number) => ({
          id: index + 1,
          name: item.name,
          patient_id: item.patient_id || "",
          patient_name: item.full_name || "",
          doctor: item.doctor || "",
          transaction_date: item.requisition_date_time || "",
          sale_type: item.sale_type || "",
          status: item.status || "",
          visit_id: item.visit_id || "",
          department: item.requisition_from || "",
          company: item.patient_company || "",
          remark: item.remark || "",
          requisition_status: item.requisition_status,
          total_qty: item.total_qty,
          invoiced_qty: item.invoiced_qty,
        })));

        setRequisitions(transformedData);
      }
    } catch (error: any) {
      console.error("Failed to fetch patient requisitions:", error);
      
      // Handle 403 FORBIDDEN errors gracefully
      if (error.response?.status === 403) {
        console.log("Access forbidden (403) - User lacks permission for Patient Requisition or Sale Bill data");
        // You could show a user-friendly message here if needed
        // For now, we'll just clear the data and let the user see an empty list
      }
      
      setRequisitions([]);
      setAllRequisitions([]);
    } finally {
      setLoading(false);
    }
  }, [ipNo, isExpired, isStat, isDischarge, isRoutine, isASAP, showCompleted, isInitialized, isAuthenticated, currentUser]);

  // Debounced search implementation
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

  // Handle search input from DataTableComponent
  const handleSearch = useCallback((term: string) => {
    if (term === searchTerm) return;
    debouncedFetch(term, dateRange);
  }, [debouncedFetch, searchTerm, dateRange]);

  // Handle date range change from DataTableComponent
  const handleDateRangeChange = useCallback((newDateRange: DateRange | undefined) => {
    debouncedFetch(searchTerm, newDateRange);
  }, [debouncedFetch, searchTerm]);

  // Initial load when component opens or authentication is ready
  useEffect(() => {
    if (isOpen && isInitialized && isAuthenticated) {
      fetchRequisitions();
    }
  }, [isOpen, isInitialized, isAuthenticated, fetchRequisitions]);

  // Trigger fetch when status filters change
  useEffect(() => {
    if (isOpen) {
      fetchRequisitions(searchTerm, dateRange);
    }
  }, [isExpired, isStat, isDischarge, isRoutine, isASAP, isOpen, fetchRequisitions]);

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
    if (ipNo.trim()) count++;
    if (isExpired || isStat || isDischarge || isRoutine || isASAP) count++;
    return count;
  }, [searchTerm, dateRange, ipNo, isExpired, isStat, isDischarge, isRoutine, isASAP]);

  // Define columns for DataTableComponent
  const columns = [
    {
      accessorKey: "name",
      header: "Requisition Number",
    },
    {
      accessorKey: "transaction_date",
      header: "Requisition Date",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="date" value={getValue()} />
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "patient_id",
      header: "UHID",
    },
    {
      accessorKey: "patient_name",
      header: "Patient Name",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="user" value={getValue()} />
      ),
    },
    {
      accessorKey: "visit_id",
      header: "Visit Code",
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "remark",
      header: "Remark",
    },
    {
      accessorKey: "requisition_status",
      header: "Status",
      cell: ({ getValue }: any) => {
        const status = getValue();
        return (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Completed"
                ? "bg-green-100 text-green-800"
                : status === "Partially Pending"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
              {status || "Pending"}
            </span>
          </div>
        );
      },
    },
    // {
    //   id: "select",
    //   header: "Select",
    //   cell: ({ row }: any) => (
    //     <Button
    //       onClick={() => onSelectRequisition(row.original)}
    //       size="button-small"
    //       type="primary-button"
    //     >
    //       Select
    //     </Button>
    //   ),
    // },



  ];

  const columnNames = {
    name: "Requisition Number",
    transaction_date: "Requisition Date",
    department: "Department",
    patient_id: "UHID",
    patient_name: "Patient Name",
    visit_id: "Visit Code",
    company: "Company",
    remark: "Remark",
    requisition_status: "Status",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
      <Card className="w-[95vw] max-w-6xl max-h-[95vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-lg font-semibold">Patient Requisition List</CardTitle>
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
                  <StatusTooltip status="Completed" requisitions={allRequisitions}>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">{summaryCounts.completed} Completed</span>
                  </StatusTooltip>
                  {" • "}
                  <StatusTooltip status="Partially Pending" requisitions={allRequisitions}>
                    <span className="hover:text-orange-600 cursor-pointer transition-colors">{summaryCounts.partiallyCompleted} Partial</span>
                  </StatusTooltip>
                  {" • "}
                  <StatusTooltip status="Pending" requisitions={allRequisitions}>
                    <span className="hover:text-yellow-600 cursor-pointer transition-colors">{summaryCounts.pending} Pending</span>
                  </StatusTooltip>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Requisitions</p>
                        <p className="text-2xl font-bold text-blue-900">{summaryCounts.total}</p>
                      </div>
                      <div className="bg-blue-100 rounded-full p-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <StatusTooltip status="Completed" requisitions={allRequisitions}>
                      <div className="flex items-center justify-between cursor-pointer hover:bg-green-100 rounded-lg transition-colors">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Completed</p>
                          <p className="text-2xl font-bold text-green-900">{summaryCounts.completed}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </StatusTooltip>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <StatusTooltip status="Partially Pending" requisitions={allRequisitions}>
                      <div className="flex items-center justify-between cursor-pointer hover:bg-orange-100 rounded-lg transition-colors">
                        <div>
                          <p className="text-orange-600 text-sm font-medium">Partially Completed</p>
                          <p className="text-2xl font-bold text-orange-900">{summaryCounts.partiallyCompleted}</p>
                        </div>
                        <div className="bg-orange-100 rounded-full p-2">
                          <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </StatusTooltip>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <StatusTooltip status="Pending" requisitions={allRequisitions}>
                      <div className="flex items-center justify-between cursor-pointer hover:bg-yellow-100 rounded-lg transition-colors">
                        <div>
                          <p className="text-yellow-600 text-sm font-medium">Pending</p>
                          <p className="text-2xl font-bold text-yellow-900">{summaryCounts.pending}</p>
                        </div>
                        <div className="bg-yellow-100 rounded-full p-2">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                      </div>
                    </StatusTooltip>
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
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-gray-50">
                  <div>
                    <Label htmlFor="ipNo" className="text-xs font-medium">IP No:</Label>
                    <Input
                      id="ipNo"
                      placeholder="Enter IP No"
                      value={ipNo}
                      onChange={(e) => setIpNo(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="expired"
                      checked={isExpired}
                      onCheckedChange={(checked) => setIsExpired(checked === true)}
                    />
                    <Label htmlFor="expired" className="text-xs">Expired</Label>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="stat"
                      checked={isStat}
                      onCheckedChange={(checked) => setIsStat(checked === true)}
                    />
                    <Label htmlFor="stat" className="text-xs">Stat</Label>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="discharge"
                      checked={isDischarge}
                      onCheckedChange={(checked) => setIsDischarge(checked === true)}
                    />
                    <Label htmlFor="discharge" className="text-xs">Discharge</Label>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="routine"
                      checked={isRoutine}
                      onCheckedChange={(checked) => setIsRoutine(checked === true)}
                    />
                    <Label htmlFor="routine" className="text-xs">Routine</Label>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="asap"
                      checked={isASAP}
                      onCheckedChange={(checked) => setIsASAP(checked === true)}
                    />
                    <Label htmlFor="asap" className="text-xs">ASAP</Label>

                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="showCompleted"
                      checked={showCompleted}
                      onCheckedChange={(checked) => setShowCompleted(checked === true)}
                    />
                    <Label htmlFor="showCompleted" className="text-xs font-medium">Show Completed Requisitions</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable DataTable Section */}
          <div className="flex-1 overflow-auto" style={{ height: 'calc(95vh - 200px)' }}>
            <DataTableComponent
              pageName="Patient Requisition"
              isRowSelectable={false}
              searchPlaceholder="Search by Patient Name..."
              data={requisitions}
              loading={loading}
              columns={columns}
              columnNames={columnNames}
              filterCount={filterCount}
              onSearch={handleSearch}
              onDataChange={handleDateRangeChange}
              onFilterClick={() => { }}
              onRowClick={(row) => onSelectRequisition(row)}
              isSearchFocus={true}
              hideFilters={false}
              hideDatePicker={false}
              hideMeFilter={true}
              hideShowColumns={true}
              autoSize={true}
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

export default PatientRequisitionList;