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
import { X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/AuthContext";

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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showCompleted, setShowCompleted] = useState(false);

  const API_BASE_URL = 'http://192.168.1.30:4414/api/resource';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrescriptions = useCallback(async (search?: string, dateRange?: DateRange) => {
    setLoading(true);
    try {
      // Build query parameters
      const params: any = {
        fields: JSON.stringify([
          "name",
          "creation",
          "full_name",
          "patient_id",
          "doctor",
          "department",
          "visit_id",
          "requisition_from"
        ]),
        limit_page_length: "2000000",
        order_by: "creation desc"
      };

      // Build filters array
      const filters: any[] = [
        ["name", "like", "PR%"], // Add this filter to show only prescriptions
      ];

      if (search?.trim()) {
        filters.push(["full_name", "like", `%${search.trim()}%`]);
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

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `token ${apiKey}:${apiSecret}`,
      };

      const response = await axios.get(`${API_BASE_URL}/Patient Requisition`, {
        params,
        headers,
        withCredentials: true,
      });

      let data: any[] = response.data.data || [];
      
      // Filter out completed prescriptions if showCompleted is false
      if (!showCompleted) {
        data = data.filter(
          (prescription: Prescription) => prescription.prescription_status !== "Completed"
        );
      }
      
      const transformedData = data.map((item: any, index: number) => ({
        id: index + 1,
        prescription_number: item.name || "",
        prescription_date: item.creation || "",
        patient_name: item.full_name || "",
        patient_id: item.patient_id || "",
        doctor_id: item.doctor || "",
        department: item.department || item.requisition_from || "",
        visit_id: item.visit_id || "",
        start_date: item.start_date || "",
        end_date: item.end_date || "",
      }));

      setPrescriptions(transformedData);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      setPrescriptions([]);
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
    return count;
  }, [searchTerm, dateRange]);

  // Define columns for DataTableComponent
  const columns = [
    {
      accessorKey: "prescription_number",
      header: "Prescription Number",
    },
    {
      accessorKey: "prescription_date",
      header: "Prescription Date",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="date" value={getValue()} />
      ),
    },
    {
      accessorKey: "visit_id",
      header: "Visit ID",
    },
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

        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
          {/* Show Completed Filter */}
          <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded">
            <Checkbox
              id="showCompletedPrescription"
              checked={showCompleted}
              onCheckedChange={(checked) => setShowCompleted(checked === true)}
            />
            <Label htmlFor="showCompletedPrescription" className="text-xs">Show Completed</Label>
          </div>

          {/* DataTableComponent with built-in search and date filters */}
          <div className="flex-1 overflow-hidden">
            <DataTableComponent
              pageName="Prescription"
              isRowSelectable={false}
              searchPlaceholder="Search by Patient Name..."
              data={prescriptions}
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