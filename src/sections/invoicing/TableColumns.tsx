"use client";
import { useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, getCurrencySymbol } from "@/utils/CurrencyUtils";
import Tag from "@/components/statusTags/Tags";
import SortableHeaderButton from "@/components/table-util-buttons/SortableHeaderButton";
import { DropDownWithButton } from "../../components/dropDownMenuWithButtonFooter/DropDownWithButton";

import type { TableDataType } from "./tableData";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { t } from "@/utils/languages";


const tableActionMenu = [
  {
    title: "",
    items: [t("actionLabels.lab"), t("actionLabels.rts"), t("actionLabels.otsNotes"), t("actionLabels.dischargeSummary"), t("actionLabels.caseSheet")],
  },
];


export const Columns = (): ColumnDef<TableDataType>[] => {
  const [sortedColumn, setSortedColumn] = useState<keyof TableDataType>("modifiedOn");
  const handleSetSortedColumn = (columnId: string) => {
    setSortedColumn(columnId as keyof TableDataType);
  };


  return [
    {
      accessorKey: "billId",
      header: ({ table, column }) => (
        <div className="flex items-center text-[#60646C] gap-2 justify-start mr-24 border-r border-[#D9D9E0] w-full h-10">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(value)
            }
            aria-label="Select all"
            tabIndex={6}
          />
          <SortableHeaderButton
            column={column}
            label={t("table.billId")}
            sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
            className=""
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-start space-x-2 pr-3 border-r h-10 border-[#D9D9E0] w-full">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(value)}
            aria-label="Select row"
            tabIndex={7 + row.index}
          />
          <span className="text-gray-900">
            {row.original.billNo}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "patient",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.patient")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const patient = row.original.patient;
        return (
          <div className="flex items-center gap-2 text-nowrap">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-white font-normal text-[10px]">
                {patient?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{patient}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "authId",
      header: () => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block truncate w-[106px] cursor-pointer">
                Pre-Auth No./Co...
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-white rounded-2xl text-sm font-medium bg-[#0090FF]"
            >
              <p>Pre-Auth No./Code No./Claim ID</p>
              <TooltipArrow className="fill-[#0090FF]" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "uhid",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.uhid")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.company")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
    },
    {
      accessorKey: "associateCompany",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.associateCompany")}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
    },
    {
      accessorKey: "billType",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.billType")}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
    },
    {
      accessorKey: "billStatus",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.status")}
          className="justify-start w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => {
        const status = row.original.billStatus;
        return (
          <div className="flex items-center justify-start gap-1">
            <Tag className="" type={status === t("actionLabels.pending") ? "warning" : "success"} tagText={status} />
          </div>
        );
      },
    },
    {
      accessorKey: "claimSendNo",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.claimSendNo")}
          className="flex justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
      enableGrouping: true,
    },
    {
      accessorKey: "submittedBy",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.submittedBy")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const name = row.original.submittedBy;
        return (
          <div className="flex items-center gap-2 text-nowrap">
            {name && name.length > 1 && (
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-white font-normal text-[10px]">
                  {name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="group-hover:text-primary">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "companyAmount",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.companyAmount")}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          {formatCurrency(row.original.companyAmount, "INR")}
        </div>
      ),
    },
    {
      accessorKey: "patientAmount",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.patientAmount")}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          {formatCurrency(row.original.patientAmount, "INR")}
        </div>
      ),
    },
    {
      accessorKey: "referralLetterNo",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.referralLetterNo")}
          className="justify-end w-full"
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
        />
      ),
    },
    {
      accessorKey: "modifiedOn",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.modifiedOn")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const date = row.original.modifiedOn;
        if (!date) {
          return <div>-</div>;
        }
        let dateObj: Date | null = null;
        try {
          dateObj = parseISO(date);
        } catch {
          return <div>-</div>;
        }

        if (!dateObj || isNaN(dateObj.getTime())) {
          return <div>-</div>;
        }

        return (
          <div className="">
            <span>{format(dateObj, "dd-MMM-yyyy hh:mm a")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "priorAuthDoneBy",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.priorAuthDoneBy")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const name = row.original.priorAuthDoneBy;
        return (
          <div className="flex items-center gap-2 text-nowrap">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-white font-normal text-[10px]">
                {name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="group-hover:text-primary">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "billFinalizedBy",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.billFinalizedBy")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const name = row.original.billFinalizedBy;
        return (
          <div className="flex items-center gap-2 text-nowrap">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-white font-normal text-[10px]">
                {name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="group-hover:text-primary">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "submitDate",
      header: ({ column }) => (
        <SortableHeaderButton
          column={column}
          label={t("table.submitDate")}
          sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          className=""
        />
      ),
      cell: ({ row }) => {
        const date = row.original.submitDate;
        if (!date) {
          return <div>-</div>;
        }
        let dateObj: Date | null = null;
        try {
          dateObj = parseISO(date);
        } catch {
          return <div>-</div>;
        }

        if (!dateObj || isNaN(dateObj.getTime())) {
          return <div>-</div>;
        }

        return (
          <div className="">
            <span>{format(dateObj, "dd-MMM-yyyy hh:mm a")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "billAmount",
      header: ({ column }) => (
        <div className="h-10 border-l border-[#D9D9E0] pl-3">
          <SortableHeaderButton
            column={column}
            label={`${t("table.billAmount")} (${getCurrencySymbol("INR")})`}
            className="justify-end w-full"
            sortedProps={{ sortedColumn, setSortedColumn: handleSetSortedColumn }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-0 border-l border-[#D9D9E0] h-10">
          {formatCurrency(row.original.billAmount, "INR")}
          <DropDownWithButton
            trigger={
              <Image
                src="assets/icons/DotsVertical.svg"
                alt="More"
                width={16}
                height={16}
              />
            }
            menuRendering={tableActionMenu}
          />
        </div>
      ),
    },
  ] as ColumnDef<TableDataType>[];
};
