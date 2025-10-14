import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../buttons/Button';
import { useAuth } from '@/context/AuthContext';
import DataTableComponent from '../DataTable';
import { TableCellComponents } from '../DataTable';

interface SelectInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (invoice: any) => void;
}

const SelectInvoiceModal: React.FC<SelectInvoiceModalProps> = ({ isOpen, onClose, onSelect }) => {
  const { apiKey, apiSecret } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customer, _setCustomer] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  const columnNames = {
    name: 'Invoice No',
    customer: 'Customer',
    posting_date: 'Date',
    posting_time: 'Time',
    grand_total: 'Amount',
    status: 'Status',
    action: 'Action',
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Invoice No',
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ getValue }: any) => (
        <TableCellComponents type="user" value={getValue()} />
      ),
    },
    {
      accessorKey: 'posting_date',
      header: 'Date',
      cell: ({ row }: any) => new Date(row.original.posting_date).toLocaleDateString(),
    },
    {
      id: 'posting_time',
      header: 'Time',
      cell: ({ row }: any) => new Date(row.original.posting_date).toLocaleTimeString(),
    },
    {
      accessorKey: 'grand_total',
      header: 'Amount',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>{row.original.status}</span>,
    },
    {
      id: 'action',
      header: 'Action',
      cell: ({ row }: any) => (
        <Button
          type='primary-button'
          onClick={async () => {
            setLoading(true);
            try {
              const res = await fetch(`https://192.168.7.221:4422/api/resource/POS Invoice/${row.original.name}`, {
                headers: {
                  'Authorization': `token ${apiKey}:${apiSecret}`,
                }
              });
              const data = await res.json();
              onSelect(data.data);
            } catch (e) {
              console.error('Failed to fetch full invoice', e);
            }
            setLoading(false);
          }}>
          Select
        </Button>
      ),
    },
  ];

  const fetchInvoices = async (invNum = invoiceNumber, cust = customer, dRange = dateRange) => {
    setLoading(true);
    try {
      const apiFilters: any[] = [['docstatus', '=', 1]];
      if (invNum) apiFilters.push(['name', 'like', `%${invNum}%`]);
      if (cust) apiFilters.push(['customer', 'like', `%${cust}%`]);
      if (dRange[0]) apiFilters.push(['posting_date', '>=', dRange[0].toISOString()]);
      if (dRange[1]) apiFilters.push(['posting_date', '<=', dRange[1].toISOString()]);

      const queryParams = new URLSearchParams({
        fields: JSON.stringify(['name', 'customer', 'posting_date', 'grand_total', 'status']),
        filters: JSON.stringify(apiFilters),
        limit_page_length: '100'
      });

      const response = await fetch(`https://192.168.7.221:4422/api/resource/POS Invoice?${queryParams.toString()}`, {
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
        }
      });
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center  p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">POS Invoice Returns</h2>
          <Button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></Button>
        </div>
        <DataTableComponent
          columns={columns}
          data={invoices}
          loading={loading}
          columnNames={columnNames}
          onSearch={(term) => {
            setInvoiceNumber(term);
            fetchInvoices(term, customer, dateRange);
          }}
          onDataChange={(dates) => {
            if (dates) {
              const newDateRange: [Date | null, Date | null] = [dates.from || null, dates.to || null];
              setDateRange(newDateRange);
              fetchInvoices(invoiceNumber, customer, newDateRange);
            }
          }}
          searchPlaceholder='Search by Invoice No...'
          hideFilters={false} // Ensure filters are visible
        />
        <div className="flex items-center justify-end p-4 border-t">
          <Button onClick={onClose} type='secondary-button'>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default SelectInvoiceModal;
