import * as Tabs from "@radix-ui/react-tabs";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DistributeDataTable } from "./DistributeAmountTable";
import { exclusionColumns, pharmacyExclusionColumns } from "./tableData";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/store/patientCompany/patientCompanySlice";
import { KVPair } from "@/services/api-client";
import { fetchServicesOrDepartments } from "@/store/patientCompany/servicesSearchThunks";


const ExclusionTabs = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [serviceData, setServiceData] = useState<any[]>([]);
  const [pharmacyData, setPharmacyData] = useState<any[]>([]);
  const [departAndServiceDropdownItems, setDepartAndServiceDropdownItems] = useState<KVPair[]>([]);
  const [pharmacyDropdownItems, ] = useState<KVPair[]>([]);
  const {items:serviceOrDepartmentItems} = useSelector((state:RootState)=>state.servicesSearch);
  const[ departmentplaceholder,setDepartmentplaceholder] = useState<string>("select service / department");
  useEffect(()=>{
    if(serviceOrDepartmentItems) {
      setDepartAndServiceDropdownItems(serviceOrDepartmentItems.data?.items.map((item)=>({key:item.id,value:item.name}))|| [] as KVPair[]);
    }
  },[serviceOrDepartmentItems]);
 
  const tableExclusion = useReactTable({
    data: serviceData,
    columns: exclusionColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const tablePharmacy = useReactTable({
    data: pharmacyData,
    columns: pharmacyExclusionColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  useEffect(() => {
    dispatch(updateField({ field: "exclusions", value: serviceData }))
  },[serviceData,dispatch]);

function onDeparmtmentServceSelect(value: string) {
  setDepartmentplaceholder(serviceOrDepartmentItems?.data?.items.find((item)=>item.id===value)?.name || "" )
 
}
function onPharmacySelect(value: string) {
  console.log(value);
 // setPharmacyplaceholder(pharmacyItems?.data?.items.find((item)=>item.id===value)?.name || "")
}
function onDepartmentServiceApiSearch(value: string) {
  if(value) {
    dispatch(fetchServicesOrDepartments({ version: "1", tenant: "",name:value }));
  }

}
function onPharmacyApiSearch(value: string) {
  console.log(value)
}
function onAddDepartmentService(value: string) {
   setServiceData((prev) => [
        ...prev,
        {
          service: value,
          serviceName: serviceOrDepartmentItems?.data?.items.find((item)=>item.id===value)?.name,
          serviceCode: serviceOrDepartmentItems?.data?.items.find((item)=>item.id===value)?.code,
        } as unknown as any,
      ]);
     setDepartmentplaceholder("select service / department") 
}
function onAddPharmacy() {
}
  
  return (
    <Tabs.Root defaultValue="service">
      <Tabs.List className="flex space-x-4 border-b border-gray-200 mb-4">
        <Tabs.Trigger
          value="service"
          className="px-4 py-2 text-sm font-medium border-b-4 border-transparent data-[state=active]:border-[#0090FF]"
        >
          Service / Department (EX)
        </Tabs.Trigger>
        <Tabs.Trigger
          value="pharmacy"
          className="px-4 py-2 text-sm font-medium border-b-4 border-transparent data-[state=active]:border-[#0090FF]"
        >
          Pharmacy Item / Pharmacy Category (EX)
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="service">
        <DistributeDataTable
          table={tableExclusion}
          columns={exclusionColumns}
          dataProps={{ data: serviceData, setData: setServiceData }}
          addButton={true}
          dropdownItems={departAndServiceDropdownItems}
          dropdownplaceHolder={departmentplaceholder}
          onselect={onDeparmtmentServceSelect}
          onSearch={onDepartmentServiceApiSearch}
          onAdd={onAddDepartmentService}
        />
      </Tabs.Content>

      <Tabs.Content value="pharmacy">
        <DistributeDataTable
          table={tablePharmacy}
          columns={pharmacyExclusionColumns}
          dataProps={{ data: pharmacyData, setData: setPharmacyData }}
          addButton={true}
          dropdownItems={pharmacyDropdownItems}
          dropdownplaceHolder="Select Pharmacy Item / Pharmacy Category"
          onselect={onPharmacySelect}
          onSearch={onPharmacyApiSearch}
          onAdd={onAddPharmacy}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default ExclusionTabs;
