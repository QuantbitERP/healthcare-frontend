import { Fragment, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import Buttons from "@/components/buttons/Button";
import Image from "next/image";
import Up from "@/assets/icons/ArrowUpBlack.svg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import Circle from "@/assets/icons/InfoCircleWhite.svg";


const authorizedBy = [
  { value: "Dr. Sangram Chougale", label: "Dr. Sangram Chougale", },
  { value: "Dr. Ashish Shinde", label: "Dr. Ashish Shinde", },
  { value: "Dr. Sahil Chougale", label: "Dr. Sahil Chougale", },
  { value: "Dr. Vaibhav Gavas", label: "Dr. Vaibhav Gavas", },
];

export function DataTable({
  columns,
  initialData,
  addButton,
  table,
  dataProps: { data, setData },
  expandedGroups,
  setExpandedGroups
}) {
  const [_showAddButton, setShowAddButton] = useState(true);
  const [_showCommand, setShowCommand] = useState(false);
  const [showList, setShowList] = useState(false);
  const [_selectedRow, setSelectedRow] = useState(null);
  // const commandRef = useRef(null);
  const [value, _setValue] = useState(""); // Ensure value is initialized
  const [_tempSelectedService, setTempSelectedService] = useState("");
  const cellRefs = useRef<HTMLTableCellElement[][]>([]);
  const toggleGroup = (dept) => {
    setExpandedGroups((prev) => {
      const updated = {
        ...prev,
        [dept]: !prev[dept], // Toggle the clicked department
      };
      return updated;
    });
  };
  // const openCommand = (rowIndex) => {
  //   setSelectedRow(rowIndex);
  //   setShowCommand(true);
  // };
  // const openList = (rowIndex) => {
  //   setSelectedRow(rowIndex);
  //   setShowList(true);
  // };

  const _selectCommandValue = (value) => {
    setData((prev) => [
      ...prev,
      { id: prev.length + 1, service: value, amount: "", status: "Pending" },
    ]);
    setShowCommand(false);
    setShowAddButton(true);
  };
  const selectListValue = (value) => {
    setData((prev) => [
      ...prev,
      { id: prev.length + 1, authorizedBy: value, amount: "" },
    ]);
    setShowList(false);
    setShowAddButton(true);
  };

  const handleUpdate = (id, field, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  const [showInputRow, setShowInputRow] = useState(false);
  const [initialInput, setInitialInput] = useState("");
  const patientInputRef = useRef<HTMLInputElement | null>(null);

  const _showNew = (isCommand) => {
    setShowAddButton(false);

    if (isCommand) {
      setShowCommand(true); // Show the command selection UI
    } else {
      setShowInputRow(true); // Show the text input row with Save and Delete buttons
    }
  };
  const _showNewList = (isList) => {
    if (isList) {
      setShowList(true);
    } else {
      setShowInputRow(true); // Show the text input row with Save and Delete buttons
    }
  };

  useEffect(() => {
    if (showInputRow && columns[0]?.id === "service") {
      setShowCommand(true);
    }
    if (showInputRow && columns[0]?.id === "authorizedBy") {
      setShowList(true);
    }
  }, [showInputRow, columns]);

  useEffect(() => {
    if (showInputRow && patientInputRef.current) {
      patientInputRef.current.focus();
    }
  }, [showInputRow]);
  const addRow = (values) => {
    setShowInputRow(false);
    const newRow = { ...values };
    setData((prev) => [...prev, newRow]);
    setShowAddButton(true);
  };
  const removeRow = () => {
    setShowInputRow(false);
    setShowAddButton(true);
  };

  useEffect(() => {
    if (!data) return;
  }, [data]);




  const focusNextCell = (rowIndex: number, columnIndex: number) => {
    const nextCell =
      cellRefs.current[rowIndex]?.[columnIndex + 1] ||
      cellRefs.current[rowIndex + 1]?.[0];

    if (nextCell) nextCell.click();
  };

  // const [allExpanded, setAllExpanded] = useState(false);
  const [_expandedRows, setExpandedRows] = useState({});

  const _handleToggleAll = () => {
    const areAllExpanded = Object.values(expandedGroups).every(value => value);
    const departments = table.getRowModel().rows.reduce((acc, row) => {
      const dept = row.original.serviceDepartment || "Others";
      if (!acc.includes(dept)) acc.push(dept);
      return acc;
    }, []);

    const newExpandedGroups = {};
    departments.forEach(dept => {
      newExpandedGroups[dept] = !areAllExpanded;
    });

    setExpandedGroups(newExpandedGroups);
  };

  const _handleToggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div
      className={`relative w-full border border-[#CDCED6] rounded-t-lg overflow-x-auto bg-white rounded-lg max-h-[50vh]`}
    >
      <div className="relative flex flex-col h-full">
        <Table
          className={`w-full border-separate rounded-lg border-spacing-0 text-xs whitespace-nowrap 
            ${!showInputRow ? "rounded-none" : "rounded-b-lg"}`}
        >
          <TableHeader className="sticky top-0 z-40 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`min-h-0 px-3 py-0  bg-[#F9F9FB] hover:bg-[#F9F9FB] border border-x-0 border-t-0 border-b-[#CDCED6] text-[#60646C] hover:text-[#1C2024] font-semibold cursor-pointer
                                ${header.column.id === "service" ? "sticky left-0  z-10" : header.column.id === "services" ? "sticky left-0  z-10" : ""
                      }  // First column
                                ${header.column.id === "totalamt"
                        ? "sticky right-0  z-10 "
                        : ""
                      } // Last column
                              `}
                  >
                    <div className="flex items-center ">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Object.entries(
              table.getRowModel().rows.reduce((acc, row) => {
                const dept = row.original.serviceDepartment || "Others";
                if (!acc[dept]) acc[dept] = [];
                acc[dept].push(row);
                return acc;
              }, {})
            ).map(([dept, rows]) => (
              <Fragment key={dept}>
                {/* Group heading row (clickable to toggle accordion) */}
                <TableRow
                  onClick={() => toggleGroup(dept)}
                  className="bg-[#F9F9FB] cursor-pointer hover:bg-[#F9F9FB] "
                >
                  <TableCell
                    colSpan={columns.length}
                    className="border-b border-[#D9D9E0] text-[#1C2024] font-semibold text-xs h-8 px-0 py-0"
                  >
                    <div className="w-full flex flex-row items-center relative">
                      {/* Sticky Department Name (left-aligned like first column) */}
                      <div className="flex items-center gap-2 sticky left-0 bg-[#F9F9FB] px-3 h-8 min-w-[160px] z-[1]">
                        <Image
                          src={Up}
                          alt="toggle"
                          width={16}
                          height={16}
                          className={`transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95 ${expandedGroups[dept] ? "" : "rotate-180"}`}
                        />
                        {dept}
                      </div>

                      {/* Spacer to push the amount right */}
                      <div className="flex-1" />

                      {/* Sticky Amount (right-aligned like last column) */}
                      <div className="text-[#1C2024] font-semibold text-xs sticky right-0 bg-[#F9F9FB] px-3 h-8 min-w-[120px] z-[1] flex items-center justify-end">
                        ₹{" "}
                        {/* Corrected the misplaced .toLocaleString call */}
                        {Array.isArray(rows) ?
                          rows.reduce((totalamt, row) => {
                            const amount = parseFloat(row.original.totalamt);
                            return totalamt + (isNaN(amount) ? 0 : amount);
                          }, 0).toLocaleString("en-IN")
                          : "0.00"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>



                {/* Conditionally render group rows */}
                {expandedGroups[dept] &&
                  Array.isArray(rows) && rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      className={`h-10 text-[#1C2024] bg-white group hover:bg-[#E6F4FE] hover:text-[#0D74CE] ${rowIndex === table.getRowModel().rows.length - 1 ? "border-b border-[#CDCED6]" : ""
                        }`}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, columnIndex) => (
                        <EditableCell
                          key={cell.id}
                          cell={cell}
                          onUpdate={handleUpdate}
                          focusNextCell={focusNextCell}
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          type={cell.column.id === "authorizedBy" ? "list" : cell.column.id === "service" ? "command" : "text"}
                          // openCommand={openCommand}
                          setSelectedRow={setSelectedRow}
                          setShowAddButton={setShowAddButton}
                          // openList={openList}
                          // columns={columns}
                          addButton={addButton}
                          initialData={initialData}
                          ref={(el) => {
                            if (!cellRefs.current[rowIndex]) {
                              cellRefs.current[rowIndex] = [];
                            }
                            cellRefs.current[rowIndex][columnIndex] = el;
                          }}
                          className={""}
                        />
                      ))}
                    </TableRow>
                  ))}
              </Fragment>
            ))}

            {showInputRow && (
              <TableRow className="max-w-[768px]">
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center w-full gap-2 px-0">
                    <Input
                      placeholder="Type here..."
                      value={initialInput}
                      onChange={(e) => setInitialInput(e.target.value)}
                      ref={patientInputRef}
                    />

                    <div className="flex items-center gap-2">
                      <Buttons
                        size="button-xsmall"
                        type="secondary-button"
                        variant="button"
                        onClick={() => {
                          addRow({ service: initialInput });
                          setTempSelectedService("");
                          setShowInputRow(false);
                          setShowAddButton(true);
                        }}
                      >
                        Save
                      </Buttons>
                      <button
                        className="w-fit h-[24px] font-medium text-xs leading-4 pl-3 pr-3 pt-1 pb-1 rounded-[4px] bg-white border-[1px] border-[#D9D9E0] hover:bg-[#E8E8EC] hover:border-[#B9BBC6] active:bg-[#E8E8EC] focus-visible:ring-[#0090FF] disabled:border-[#B9BBC6] disabled:text-[#000000] disabled:bg-white flex flex-row gap-2 justify-center items-center text-[#CE2C31] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none whitespace-nowrap"
                        onClick={() => removeRow()}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showList && (
          <Popover
            open={showList}
            onOpenChange={(open) => {
              setShowList(open);
              if (!open) setShowAddButton(true); // Ensure "Add New" shows when command closes
            }}
          >
            <PopoverTrigger asChild onClick={() => setShowList(true)}>
              <Button
                variant="outline"
                role="combobox"
                aria-controls="command-list"
                aria-expanded={showList}
                className="w-full rounded-t-none h-10 justify-between hover:bg-[#E6F4FE] hover:text-[#0D74CE] border-none"
              >
                {value
                  ? authorizedBy.find(
                    (ab: { value: string; label: string }) => ab.value === value
                  )?.label
                  : "Select a Doctor"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 shadow-none border-[#D9D9E0]" sideOffset={-630}>
              <Command className="w-[588px] shadow-none rounded-b-none">
                <CommandInput placeholder="Search Doctors..." />
                <CommandList className="max-h-[236px] overflow-y-auto">
                  <CommandEmpty>No Doctor found.</CommandEmpty>
                  <CommandGroup className="pt-2 pb-3 pl-0 pr-0">
                    {authorizedBy.map((authorizedBy) => (
                      <CommandItem
                        className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] !important h-9 px-4 py-1"
                        key={authorizedBy.value}
                        value={authorizedBy.value}
                        onSelect={(currentValue) => {
                          selectListValue(currentValue);
                          // setOpen(false);
                        }}
                      >
                        {authorizedBy.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}


function EditableCell({
  cell,
  onUpdate,
  focusNextCell,
  rowIndex,
  columnIndex,
  ref,
  type,
  // index,
  // columns,
  addButton,
  initialData,
  setShowAddButton,
  setSelectedRow,
  className,
  // openCommand,
  // openList
}) {
  const [value, setValue] = useState<string>(String(cell.getValue?.() ?? ""));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showList, setShowList] = useState<boolean>(false);

  // validation logic
  const [error, setError] = useState<string | null>(null);
  const _validateValue = (val) => {
    const num = parseFloat(val);
    if (cell.column.id === "rate" && (isNaN(num) || num <= 0)) {
      return "Please enter a numeric value.";
    }
    if (cell.column.id === "quantity" && (isNaN(num) || num <= 0 || !Number.isInteger(num))) {
      return "Please enter a numeric value.";
    }
    return "";
  };



  const isValidNumber = (val) => {
    if (typeof val !== "string") return false;

    // For quantity column, only allow whole numbers
    if (cell.column.id === "quantity") {
      return /^\d+$/.test(val) && parseInt(val) > 0;
    }

    // For other numeric fields, allow decimals
    return /^(\d+(\.\d{1,2})?)?$/.test(val);
  };

  const handleBlur = () => {
    const isRateColumn = cell.column.id === "rate";
    const isQuantityColumn = cell.column.id === "quantity";
    const initialValue = cell.getValue();

    if ((isRateColumn || isQuantityColumn) && !isValidNumber(value)) {
      setValue(""); // reset to empty if invalid
      setError(isQuantityColumn ? "Enter a whole number" : "Enter a valid number"); // show tooltip
    } else {
      setError("");
      if (value !== initialValue) {
        onUpdate(cell.row.original.id, cell.column.id, value);
      }
    }

    setIsEditing(false);
  };
  //end of validation logic

  useEffect(() => {
    setValue(cell.getValue() ?? "");
  }, [cell]);
  const handleKeyDown = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
      focusNextCell(rowIndex, columnIndex);
    }
  };


  const selectListValue = (newValue) => {
    if (value !== newValue) {
      setValue(newValue);
      onUpdate(cell.row.original.id, cell.column.id, newValue);
    }
    setTimeout(() => setShowList(false), 100);
  };

  return (
    <TableCell
      ref={ref}
      onClick={(e) => {
        if (!addButton) return;

        // Check if the event target is a button or part of a dropdown
        const isDropdownElement =
          (e.target as HTMLElement).closest('[role="combobox"]') ||
          (e.target as HTMLElement).closest(".select-trigger") ||
          (e.target as HTMLElement).closest("button");

        // If the click was on a dropdown element, don't open the input
        if (isDropdownElement) return;

        if (type === "command" || cell.column.columnDef?.ischeckbox) return;
        if (type === "list") {
          setShowList(true);
          return;
        }

        // Don't edit cells that have custom renderers with components
        const hasCustomCellRenderer = typeof cell.column.columnDef.cell === 'function' &&
          (cell.column.id === "category" ||
            cell.column.id === "doctor" ||
            cell.column.id === "concessionGivenBy" ||
            cell.column.id === "modifiedby" ||
            cell.column.id === "paymentMode" ||
            cell.column.id === "authorizedBy" ||
            cell.column.id === "status")
          ;

        if (hasCustomCellRenderer) return;

        // For regular editable cells, show the input
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }}
      className={`cursor-pointer border-b border-[#CDCED6] px-3 py-0 bg-white group-hover:bg-[#E6F4FE] group-hover:text-[#0D74CE]
      ${cell.column.id === "service" ? "sticky left-0 z-10" :
          cell.column.id === "services" ? "sticky left-0 z-10" : ""
        }
      ${cell.column.id === "totalamt" ? "sticky right-0 z-10" : ""
        }
      ${addButton || rowIndex !== initialData.length - 1
          ? "border-[#CDCED6]"
          : "border-none"
        }
      ${className}
    `}
    >
      {showList && type === "list" ? (
        <Popover
          open={showList}
          onOpenChange={(open) => {
            setShowList(open);
            if (!open) setShowAddButton(true); // Ensure "Add New" shows when command closes
          }}
        >
          <PopoverTrigger
            asChild
            onClick={() => {
              setSelectedRow(rowIndex);
              setShowList(true);
            }}
          >
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={showList}
              className="w-full rounded-t-none h-10 justify-between hover:bg-[#E6F4FE] border-none bg-transparent"
            >
              {value
                ? authorizedBy.find(
                  (ab: { value: string; label: string }) => ab.value === value
                )?.label
                : "Select a Doctor"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 -translate-x-[13px] rounded-t-none border-none"
            sideOffset={-1}
            align={"start"}
          >
            <Command className="w-[590px] border border-[#D9D9E0] rounded-t-none">
              <CommandInput placeholder="Search Doctors..." />
              <CommandList className="max-h-[236px] overflow-y-auto">
                <CommandEmpty>No Doctor found.</CommandEmpty>
                <CommandGroup className="pt-2 pb-3 pl-0 pr-0">
                  {authorizedBy.map((authorizedBy) => (
                    <CommandItem
                      className="hover:bg-[#E6F4FE] hover:text-[#0D74CE] data-[selected=true]:bg-[#E6F4FE] data-[selected=true]:text-[#0D74CE] !important h-9 px-4 py-1"
                      key={authorizedBy.value}
                      value={authorizedBy.value}
                      onSelect={(currentValue) => {
                        selectListValue(currentValue);
                        setShowList(false); // Ensure it hides after selection
                      }}
                    >
                      {authorizedBy.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : isEditing ? (
        type === "select" ? (
          <Select
            value={value}
            onValueChange={(value) => setValue(value)}
          >
            <SelectTrigger className="h-10 w-full px-0 py-2 text-xs outline-none rounded-none border-none focus-visible:ring-[#5EB1EF] ">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className=" py-0 px-0 ">
              <SelectItem
                value="Paid"
                className="cursor-pointer hover:bg-[#4099d8]"
              >
                Paid
              </SelectItem>
              <SelectItem value="Pending" className="cursor-pointer">
                Pending
              </SelectItem>
              <SelectItem value="Failed" className="cursor-pointer">
                Failed
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (

          //validation input row 
          <TooltipProvider>
            <Tooltip open={!!error}>
              <TooltipTrigger asChild>
                <Input
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    const columnId = cell.column.id;
                    const isNumericField = cell.column.columnDef.meta?.isNumeric === true;

                    if (isNumericField) {
                      if (!isValidNumber(newValue)) {
                        setError("Enter a valid number");
                      } else if (columnId === "quantity" && newValue.length > 2) {
                        setError("Quantity must be at most 2 digits");
                        return;
                      } else if (columnId === "rate" && newValue.length > 8) {
                        setError("Rate must be at most 8 digits");
                      } else {
                        setError(null);
                      }
                    } else {
                      setError(newValue.trim() ? null : "Field cannot be empty");
                    }
                    setValue(newValue);
                  }}
                  onBlur={handleBlur}
                  autoFocus
                  onKeyDown={handleKeyDown}
                  className={`min-w-[90px] text-black ${error ? "bg-red-100 border border-red-500" : ""
                    }`}
                  title={error || ""}
                />
              </TooltipTrigger>
              <TooltipContent className='bg-[#DC3E42] text-white text-sm font-medium flex flex-row gap-1 item'>
                <Image src={Circle.src} alt="Circle" width={16} height={16} className="rounded-lg" />
                {error}
                <TooltipArrow className="fill-[#DC3E42]" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          //end of validation input row 
        )
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )}
    </TableCell>
  );
}