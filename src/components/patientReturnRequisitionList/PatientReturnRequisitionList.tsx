import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "@/components/buttons/Button";
import DataTableComponent, { TableCellComponents } from "@/components/DataTable";
import { getAuthHeaders } from "@/utils/sessionAuth";
import { Button as UIButton } from "@/components/ui/button";
import { X, Eye } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/AuthContext";

interface PatientReturnRequisitionItem {
  name: string;
  item_code: string;
  item_name: string;
  batch_no: string;
  expiry_date: string;
  mrp: number;
  issue_qty: number;
  acknowledge_qty: number;
  sale_bill_no: string;
  sale_bill_date: string;
  requisition_no: string;
  requisition_date: string;
  requisition_from: string;
}

interface PatientReturnRequisition {
  name: string;
  custom_patient_name: string;
  custom_mrn: string;
  custom_age: string;
  custom_gender: string;
  custom_mobile: string;
  custom_ward: string;
  department: string;
  from_date: string;
  to_date: string;
  set_warehouse: string;
  requisition_acknowledgment_date: string;
  emergency: number;
  routine: number;
  discharge: number;
  table_vbbs: PatientReturnRequisitionItem[];
}

interface PatientReturnRequisitionListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRequisition: (requisition: PatientReturnRequisition) => void;
}

const PatientReturnRequisitionList: React.FC<PatientReturnRequisitionListProps> = ({
  isOpen,
  onClose,
  onSelectRequisition,
}) => {
  const { apiKey, apiSecret } = useAuth();
  const [requisitions, setRequisitions] = useState<PatientReturnRequisition[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [_expandedRequisition] = useState<string | null>(null);
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [selectedRequisitionItems, setSelectedRequisitionItems] = useState<any[]>([]);
  const [selectedRequisitionInfo, setSelectedRequisitionInfo] = useState<any>(null);

  const API_BASE_URL = 'https://gmcerp.quantcloud.in/api/resource';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRequisitions = useCallback(async (search?: string, dateRange?: DateRange) => {
    setLoading(true);
    try {
      // Build query parameters
      const params: any = {
        fields: JSON.stringify([
          "name",
          "custom_patient_name",
          "custom_mrn",
          "custom_age",
          "custom_gender",
          "custom_mobile",
          "custom_ward",
          "department",
          "from_date",
          "to_date",
          "set_warehouse",
          "requisition_acknowledgment_date",
          "emergency",
          "routine",
          "discharge"
        ]),
        limit_page_length: "2000000",
        order_by: "`tabPatient Return Requisition`.creation desc"
      };

      // Build filters array
      const filters: any[] = [];

      if (search?.trim()) {
        filters.push(["custom_patient_name", "like", `%${search.trim()}%`]);
        filters.push(["custom_mrn", "like", `%${search.trim()}%`]);
        filters.push(["department", "like", `%${search.trim()}%`]);
      }

      if (dateRange?.from) {
        filters.push(["from_date", ">=", format(dateRange.from, "yyyy-MM-dd")]);
      }

      if (dateRange?.to) {
        filters.push(["from_date", "<=", format(dateRange.to, "yyyy-MM-dd")]);
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

      const response = await axios.get(`${API_BASE_URL}/Patient Return Requisition`, {
        params,
        headers,
        withCredentials: true,
      });

      const data: any[] = response.data.data || [];

      // For each requisition, fetch the full document to get child table items
      const transformedData = await Promise.all(data.map(async (item: any) => {
        try {
          // Fetch full document which includes child tables
          const docResponse = await axios.get(`${API_BASE_URL}/Patient Return Requisition/${item.name}`, {
            headers,
            withCredentials: true,
          });

          const fullDoc = docResponse.data.data || {};

          return {
            name: fullDoc.name || item.name || "",
            custom_patient_name: fullDoc.custom_patient_name || item.custom_patient_name || "",
            custom_mrn: fullDoc.custom_mrn || item.custom_mrn || "",
            custom_age: fullDoc.custom_age || item.custom_age || "",
            custom_gender: fullDoc.custom_gender || item.custom_gender || "",
            custom_mobile: fullDoc.custom_mobile || item.custom_mobile || "",
            custom_ward: fullDoc.custom_ward || item.custom_ward || "",
            department: fullDoc.department || item.department || "",
            from_date: fullDoc.from_date || item.from_date || "",
            to_date: fullDoc.to_date || item.to_date || "",
            set_warehouse: fullDoc.set_warehouse || item.set_warehouse || "",
            requisition_acknowledgment_date: fullDoc.requisition_acknowledgment_date || item.requisition_acknowledgment_date || "",
            emergency: fullDoc.emergency || item.emergency || 0,
            routine: fullDoc.routine || item.routine || 0,
            discharge: fullDoc.discharge || item.discharge || 0,
            table_vbbs: fullDoc.table_vbbs || []
          };
        } catch (error) {
          console.error(`Error fetching full document for ${item.name}:`, error);
          return {
            ...item,
            table_vbbs: []
          };
        }
      }));

      setRequisitions(transformedData);
    } catch (error) {
      console.error("Failed to fetch patient return requisitions:", error);
      setRequisitions([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, apiSecret]);

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
    if (isOpen && apiKey && apiSecret) {
      fetchRequisitions();
    }
  }, [isOpen, fetchRequisitions, apiKey, apiSecret]);

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
      accessorKey: "custom_patient_name",
      header: "Patient Name",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="user" value={getValue()} />
      ),
    },
    {
      accessorKey: "custom_mrn",
      header: "UHID",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "from_date",
      header: "From Date",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="date" value={getValue()} />
      ),
    },
    {
      accessorKey: "to_date",
      header: "To Date",
      cell: ({ getValue }: any) => (
        <TableCellComponents type="date" value={getValue()} />
      ),
    },
    {
      accessorKey: "custom_ward",
      header: "Ward",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setSelectedRequisitionItems(row.original.table_vbbs || []);
              setSelectedRequisitionInfo({
                name: row.original.name,
                custom_patient_name: row.original.custom_patient_name,
                custom_mrn: row.original.custom_mrn
              });
              setShowItemModal(true);
            }}
            size="button-small"
            type="secondary-button"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onSelectRequisition(row.original)}
            size="button-small"
            type="primary-button"
          >
            Select
          </Button>
        </div>
      ),
    },
  ];

  const columnNames = {
    custom_patient_name: "Patient Name",
    custom_mrn: "UHID",
    department: "Department",
    from_date: "From Date",
    to_date: "To Date",
    custom_ward: "Ward",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
      <Card className="w-[95vw] max-w-6xl max-h-[95vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="text-lg font-semibold">Patient Return Requisition Details</CardTitle>
          <UIButton onClick={onClose} variant="ghost" size="icon" className="p-0">
            <X className="h-5 w-5" />
          </UIButton>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
          {/* Scrollable DataTable Section */}
          <div className="flex-1 overflow-auto p-4">
            <DataTableComponent
              pageName="PatientReturnRequisition"
              isRowSelectable={false}
              searchPlaceholder="Search by Patient Name, UHID, or Department..."
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

      {/* Mini Modal for Items */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Items for {selectedRequisitionInfo?.custom_patient_name} ({selectedRequisitionInfo?.custom_mrn})
              </h3>
              <UIButton onClick={() => setShowItemModal(false)} variant="ghost" size="icon" className="p-0">
                <X className="h-5 w-5" />
              </UIButton>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {selectedRequisitionItems && selectedRequisitionItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Batch No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiry Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">MRP</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Issue Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acknowledge Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sale Bill No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sale Bill Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRequisitionItems.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{item.item_code}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.item_name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.batch_no}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : ''}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">₹{item.mrp}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.issue_qty}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.acknowledge_qty}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.sale_bill_no}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.sale_bill_date ? new Date(item.sale_bill_date).toLocaleDateString() : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No items found for this requisition.</p>
              )}
            </div>

            <div className="p-4 border-t flex justify-end">
              <Button type="secondary-button" size="button-medium" onClick={() => setShowItemModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientReturnRequisitionList;
