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
import { X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/AuthContext";
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
  requisition_status?: "Pending" | "Completed";
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
  const { apiKey, apiSecret } = useAuth();
  const API_BASE_URL = 'https://192.168.7.221:4422/api/resource';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRequisitions = useCallback(async (search?: string, dateRange?: DateRange) => {
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

      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `token ${apiKey}:${apiSecret}`,
      };

      const response = await axios.get(`${API_BASE_URL}/Patient Requisition`, {
        params,
        headers,
        withCredentials: true,
      });

      if (response.data.data) {
        // Filter out completed requisitions if showCompleted is false
        let filteredRequisitions = response.data.data;
        if (!showCompleted) {
          filteredRequisitions = filteredRequisitions.filter(
            (req: PatientRequisition) => req.requisition_status !== "Completed"
          );
        }
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
        }));

        setRequisitions(transformedData);
      }
    } catch (error) {
      console.error("Failed to fetch patient requisitions:", error);
      setRequisitions([]);
    } finally {
      setLoading(false);
    }
  }, [ipNo, isExpired, isStat, isDischarge, isRoutine, isASAP, showCompleted]);

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

  // Initial load when component opens
  useEffect(() => {
    if (isOpen) {
      fetchRequisitions();
    }
  }, [isOpen, fetchRequisitions]);

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
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Completed" 
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
          onClick={() => onSelectRequisition(row.original)}
          size="button-small"
          type="primary-button"
        >
          Select
        </Button>
      ),
    },
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
          {/* Sticky Filters Section */}
          <div className="flex-shrink-0 bg-white border-b">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50">
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
                <Label htmlFor="showCompleted" className="text-xs">Show Completed</Label>
              </div>
            </div>
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