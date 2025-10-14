import React, { useState } from 'react';
import Image from 'next/image';

import Buttons from '../buttons/Button';
import Logo from '@/assets/icons/RupeeIcon.svg';

import { DataTable } from '../EditableCellsTable/TableTry';
import { Button } from '@/components/ui/button';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  // HeaderContext,
  // CellContext,
} from '@tanstack/react-table';

type RowData = {
  id: string;
  description: string;
  amount: number;
  tagText?: string;
};

type BalanceUtilizedProps = {
  setOpen: (val: boolean) => void;
};



const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: 'description',
    header: ({  }) => (
      <div className="flex flex-row items-center">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
        >
          Description
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => {
      const isTotalAmount = row.original.description === 'Balance Amount';
      return (
        <span
          className={`${
            row.original.tagText === 'Cancelled' ? 'line-through' : ''
          } ${isTotalAmount ? 'font-semibold' : ''}`}
        >
          {String(getValue())}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: () => (
      <div className="text-right w-full block border-l border-[#D9D9E0] -ml-3 p-0">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
        >
          Total Amount (₹)
        </Button>
      </div>
    ),
    cell: ({ row, getValue }) => {
      const isTotalAmount = row.original.description === 'Balance Amount';
      return (
        <div className="border-l border-[#D9D9E0] -ml-3">
          <span
            className={`text-right w-full block h-10 py-3 pl-3 ${
              row.original.tagText === 'Cancelled' ? 'line-through' : ''
            } ${isTotalAmount ? 'font-bold text-lg' : ''}`}
          >
            ₹{String(getValue())}
          </span>
        </div>
      );
    },
  },
];

const BalanceUtilized: React.FC<BalanceUtilizedProps> = ({ setOpen }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<RowData[]>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col gap-6 bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
        <Image src={Logo.src} width={24} height={24} alt="Rupee" />
        <p className="text-[#1C2024] text-base font-semibold">Balance Utilized</p>
      </div>

      <div className="w-full px-6">
        <DataTable columns={columns} initialData={[]} table={table} dataProps={{ data, setData }} addButton={undefined} />
      </div>

      <div className="w-[640px] px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
        <Buttons size="button-small" type="secondary-button" variant="button" onClick={() => setOpen(false)}>
          Cancel
        </Buttons>
        <Buttons size="button-small" type="primary-button" variant="button" onClick={() => setOpen(false)}>
          Done
        </Buttons>
      </div>
    </div>
  );
};

export default BalanceUtilized;
