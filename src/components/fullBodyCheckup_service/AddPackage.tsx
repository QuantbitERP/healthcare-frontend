import React, { useState } from "react";
import Image from "next/image";
// import Avatar from "react-avatar";
import { DataTable } from "@/components/EditableCellsTable/TableTry";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  tableTwoData,
  tableTwoColumn,
} from "./TableData";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Buttons from "../buttons/Button";

export interface ServiceProps {
  setOpen: (value: boolean) => void;
  showHeader?: boolean;
  isNestedDialog?: boolean;
  header?: string;
  subHeader?: string;
  serviceCode?: string;
  rate?: string;
  packageType?: string;
  dateAdded?: string;
  unit?: string;
  serviceName?: string;
  serviceRemark?: string;
  doctor?: string[];
  size?: "small" | "medium" | "large";
}

const AddPackage: React.FC<ServiceProps> = ({
  setOpen 
}) => {
  const { referredDoctors = [] } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );
  const [_selectedDoctor, _setSelectedDoctor] = useState<string>(
    referredDoctors?.[0]?.value || ""
  );
  // const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [twoData, setTwoData] = useState(tableTwoData);

  const tableTwo = useReactTable({
    data: twoData,
    columns: tableTwoColumn,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full h-full rounded-lg flex flex-col bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
    <div className="flex flex-row items-center justify-between  px-4 border-b border-b-[#D9D9E0]">
       <div className="w-full px-0 py-4  gap-2 flex flex-row">
         <Image
           src={"/assets/icons/Concession.svg"}
           width={24}
           height={24}
           alt="Rupee"
         />
         <p className="text-[#1C2024] text-base font-semibold">Add Package</p>
       </div>
       <Buttons
         iconSrc={"/assets/icons/X.svg"}
         size="sm"
         type="secondary-button"
         variant="icon"
         onClick={() => setOpen(false)}
       ></Buttons>
     </div>

     <div className="flex-1 w-full overflow-y-auto px-20 py-15">
     <DataTable
            table={tableTwo}
            columns={tableTwoColumn}
            initialData={tableTwoData}
            dataProps={{ data: twoData, setData: setTwoData }}
            addButton={true}
          />
     </div>

     <div className="w-full px-6 py-3 border-t border-t-[#D9D9E0] gap-4 flex flex-row justify-end">
       <Buttons
         size="button-small"
         type="secondary-button"
         variant="button"
        
       >
         Cancel
       </Buttons>
       <Buttons
         size="button-small"
         type="primary-button"
         variant="button"
         onClick={() => {
          
         }}
       >
         Save Changes
       </Buttons>
     </div>
   </div>
  );
};

export default AddPackage;
