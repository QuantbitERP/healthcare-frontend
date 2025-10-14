import React from 'react';
import { ColumnDef, Table } from '@tanstack/react-table';
import { DataTable } from '@/components/EditableCellsTable/TableTry';

type CustomColumnDef<T> = ColumnDef<T> & {
  isCommand?: boolean;
  isList?: boolean;
  accessorKey?: string;
};

interface ServiceTableProps<TData extends { id: string | number }> {
  columns: CustomColumnDef<TData>[]; 
  initialData: TData[];
  table: Table<TData>;
  dataProps: {
    data: TData[];
    setData: React.Dispatch<React.SetStateAction<TData[]>>;
  };
  showCustomAlert: (config: {
    heading: string;
    content: string;
    variant?: "success" | "warning" | "danger" | "primary" | "secondary";
    buttonText?: string;
    showButton?: boolean;
    onClick?: () => void;
    disappear?: boolean;
  }) => void;
}

export const ServiceTable = <TData extends { id: string | number },>({
  columns,
  initialData,
  dataProps: { data, setData },
  table,
}: ServiceTableProps<TData>) => {

  return (
    <div>
      <DataTable
        columns={columns}
        initialData={(initialData ?? []).map((item, idx) => ({
          ...item,
          id: item.id ?? idx,
        }))}
        table={table}
        dataProps={{ data, setData }}
        addButton={false}
      />
    </div>
  );
};


