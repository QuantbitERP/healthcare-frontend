"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConcessionCategoryTypes,
} from "@/store/concession_category/thunk";
import { fetchConcessionCategoryTypeById } from "@/store/slices/financeAuthority";
import type { RootState, AppDispatch } from "@/store";
import Buttons from "../buttons/Button";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
  Table as TableType,
  SortingState,
  SortingFn,
  ColumnDef,
  CellContext,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { GetBillConcessionDetails } from "@/services/api-client/models/GetBillConcessionDetails";
import { useGlobalTables } from "@/context/GlobalTablesContext";
import { ConcessionCategoryService, KVPair } from "@/services/api-client";

const initialData = [];
type RowType = GetBillConcessionDetails & { id: any } & { tagText: any };
const CategorySelect = ({
  value,
  onChange,
  isNewRow,
}: {
  value: string;
  onChange: (value: string) => void;
  isNewRow: boolean;
  allCategories: any;
}) => {

  const [categories, setCategories] = useState<KVPair[]>([]);
  const [_loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await ConcessionCategoryService.getApiVConcessionCategoryConcessionCategories("1", "");
        setCategories(res?.data?.items ?? []);
      } catch (error) {
        console.error("Failed to load concession categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  const dispatch = useDispatch<AppDispatch>();

  const { data: categoryByIdData, loading: isLoadingById } = useSelector(
    (state: RootState) => state.concessionCategoryTypeById
  );

  const [selectedId, setSelectedId] = React.useState<string>(value);

  useEffect(() => {
    if (value && !isNewRow) {
      dispatch(
        fetchConcessionCategoryTypeById({ id: value, version: "1", tenant: "" })
      );
    }
  }, [dispatch, value, isNewRow]);

  useEffect(() => {
    setSelectedId(value);
  }, [value]);

  const handleSelect = (newId: string) => {
    setSelectedId(newId);
    onChange(newId);
  };

  const options = categories ?? [];

  const selectedLabel =
    options.find((item) => item.key === selectedId)?.value ??
    (isLoadingById ? "Loading..." : "-");

  if (!isNewRow && value) {
    return (
      <span className="text-xs font-medium text-gray-700">
        {isLoadingById
          ? "Loading..."
          : categoryByIdData?.data?.concessionCategoryName ?? "-"}
      </span>
    );
  }

  return (
    <Select
      value={selectedId}
      onValueChange={handleSelect}
      defaultOpen={isNewRow}
    >
      <SelectTrigger className="w-fit border-none text-xs p-0 rounded-none h-10 focus:outline-none focus:ring-0">
        {selectedId ? selectedLabel : "Select"}
      </SelectTrigger>
      <SelectContent className="m-0 px-0 py-2 [&>div]:!px-0 [&>div]:!py-2 border-[#D9D9E0] z-[300]">
        {options.map((option) => (
          <SelectItem
            key={option.key}
            value={option.key ?? ""}
            className="data-[highlighted]:bg-[#E6F4FE] data-[highlighted]:text-[#0D74CE] rounded-none"
          >
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};



type CustomColumnDef<T> = ColumnDef<T> & {
  isList?: boolean;
  isDropdown?: boolean;
  enableSorting?: boolean;
  sortingFn?: SortingFn<T>;
};

function Concession({
  setOpen,
  totalAmountforConcession,
}: {
  setOpen: (open: boolean) => void;
  selectedPatientBillConcession: GetBillConcessionDetails[] | null | undefined;
  totalAmountforConcession: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: concessionOptions } = useSelector(
    (state: RootState) => state.concessionGivenBy
  );
  const { types: allCategories } = useSelector(
    (state: RootState) => state.concessionCategory
  );
  const { patientBillConcession, setPatientBillConcession } = useGlobalTables();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<RowType[]>(
    (patientBillConcession ?? []).map((item, idx) => ({
      ...item,
      id: item.applicationuserid ?? idx,
      tagText: "",
    }))
  );

  useEffect(() => {
    dispatch(fetchConcessionCategoryTypes(""));
  }, [dispatch])

  const columns: CustomColumnDef<RowType>[] = [
    {
      accessorKey: "applicationuserid",
      header: ({
        table,
        column,
      }: {
        table: TableType<RowType>;
        column: Column<RowType>;
      }) => {
        return (
          <div className="flex flex-row space-x-2 pr-3  items-center">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            </div>
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Authorized By
              {column.getIsSorted() ? (
                column.getIsSorted() === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                )
              ) : null}
            </Button>
          </div>
        );
      },
      cell: (props: CellContext<RowType, unknown>) => {
        const { row, getValue } = props;
        const isTotalAmount = row.original.concessionamount;
        const value = getValue() as string;
        const matchedOption = concessionOptions?.data?.items?.find(
          (option) => option.key === value
        );
        return (
          <div className="flex flex-row space-x-2 pr-3 items-center">
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            </div>
            <div className="flex flex-row items-center gap-2 cursor-pointer">
              {/* <Avatar
                name={
                  (
                    value.split(" ")[1] || value.split(" ")[0]
                  )?.charAt(0) || ""
                }
                size="24"
                round={true}
                textSizeRatio={2}
              /> */}
              <span
                className={` ${row?.original?.tagText === "Cancelled" ? "line-through" : ""
                  } ${isTotalAmount ? "font-semibold" : ""}`} // Apply bold & larger text for Total Amount
              >
                {matchedOption?.value}
              </span>
            </div>
          </div>
        );
      },
      isList: true,
      enableSorting: true,
      meta: { noneditable: true },
    },
    {
      accessorKey: "concessioncategoryid",
      header: ({ column }: { column: Column<RowType> }) => (
        <div className="flex flex-row items-center">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : null}
          </Button>
        </div>
      ),
      cell: (props: CellContext<RowType, unknown>) => {
        const { row, getValue } = props;
        const isNewRow = !row.original.id;
        const value = getValue() as string;
        return (
          <CategorySelect
            value={value}
            onChange={(value) => (row.original.concessioncategoryid = value)}
            isNewRow={isNewRow}
            allCategories={allCategories}
          />
        );
      },
      enableSorting: true,
      isDropdown: true,
      meta: { noneditable: false, isNumeric: false },
    },
    {
      accessorKey: "concessionPercent",
      header: ({ column }: { column: Column<RowType> }) => (
        <div className="text-right w-full block  p-0">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Concession (%)
            {column.getIsSorted() &&
              (column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              ))}
          </Button>
        </div>
      ),
      cell: (props: CellContext<RowType, unknown>) => {
        const { row, getValue } = props;
        let value = getValue() as number;

        const isNewRow = !row.original.id;

        // Convert string numbers to actual numbers (if necessary)
        if (typeof value === "string") {
          value = parseFloat(value);
        }

        if (isNewRow && (!value || isNaN(value) || value <= 0)) {
          value = 0;
        }

        // Ensure it's a valid number greater than 0
        if (!value || isNaN(value) || value <= 0) {
          return null; // Don't display anything if invalid
        }
        return (
          <span
            className={`text-right w-full block ${row?.original?.tagText === "Cancelled" ? "line-through" : ""
              }`} // Apply bold & larger text for Total Amount
          >
            {value}%
          </span>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true, noneditable: false },
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue<number>("concession");
        const b = rowB.getValue<number>("concession");
        return a - b;
      },
    },
    {
      accessorKey: "approvalStatus",
      header: ({ column }: { column: Column<RowType> }) => (
        <div className="flex flex-row items-center">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Approval Status
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              )
            ) : null}
          </Button>
        </div>
      ),
      cell: (props: CellContext<RowType, unknown>) => {
        const { } = props;
        // const isNewRow = !row.original.id;
        // const value = getValue() as string;
        return (
          <span>Approved</span>
        );
      },
      enableSorting: true,
      isDropdown: true,
      meta: { noneditable: true },
    },
    {
      accessorKey: "concessionamount",
      header: ({ column }: { column: Column<RowType> }) => (
        <div className="text-right w-full block border-l border-[#D9D9E0] -ml-3 p-0">
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 text-[#60646C] text-xs font-semibold h-10 pl-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Amount (₹)
            {column.getIsSorted() &&
              (column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4" />
              ))}
          </Button>
        </div>
      ),
      cell: (props: CellContext<RowType, unknown>) => {
        const { row, getValue } = props;
        let value = getValue() as number;
        if (typeof value === "string") {
          value = parseFloat(value);
        }
        const calculatedConcession = ((row.original.concessionPercent ?? 0) * totalAmountforConcession) / 100;
        if (!value || isNaN(value) || value === 0) {
          const newConcession = Number(calculatedConcession.toFixed(2));
          row.original.concessionamount = newConcession;
          value = newConcession;
        }
        return (
          <div className="border-l border-[#D9D9E0] -ml-3">
            <span
              className={`text-right w-full block h-10 py-3 ${row?.original?.tagText === "Cancelled" ? "line-through" : ""
                } ${row?.original?.concessionamount ? "font-bold text-lg" : ""}`} // Apply bold & larger text for Total Amount
            >
              ₹{value ? value : calculatedConcession}
            </span>
          </div>
        );
      },
      enableSorting: true,
      meta: { isNumeric: true, noneditable: true },
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue<number>("totalamt");
        const b = rowB.getValue<number>("totalamt");
        return a - b;
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });


  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-[640px] px-6 py-4 border-b border-b-[#D9D9E0] gap-2 flex flex-row">
        <Image
          src={"assets/icons/Concession.svg"}
          width={24}
          height={24}
          alt="Rupee"
        />
        <p className="text-[#1C2024] text-base font-semibold">Concession</p>
      </div>

      <div className="w-full flex  p-6">
        <DataTable<RowType>
          table={table}
          columns={columns}
          dataProps={{ data, setData }}
          initialData={initialData}
          addButton={true}
        />
      </div>

      <div className="w-[640px] px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
        <Buttons
          size="button-small"
          type="secondary-button"
          variant="button"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Buttons>
        <Buttons
          size="button-small"
          type="primary-button"
          variant="button"
          onClick={() => {
            setPatientBillConcession(data);
            setOpen(false);
          }}
        >
          Save Changes
        </Buttons>
      </div>
    </div>
  );
}

export default Concession;
