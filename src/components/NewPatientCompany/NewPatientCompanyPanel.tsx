"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { API_TENANT } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import { DistributeDataTable } from "./DistributeAmountTable";
import { createColumns, uploadColumns } from "./tableData";
import ExclusionTabs from "./ExclusionTabsTable";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import CheckboxInput from "./CheckboxInput";
import ArrayCheckboxInput from "./ArrayCheckboxInput";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";
import {
  fetchAllDropdownData,
  fetchHospitalList,
  fetchCountries,
  fetchDepartments,
} from "@/store/patientCompany/thunks";
import { fetchStates, fetchDistricts, fetchCities } from "@/store/common/thunk";
import { fetchAllOpdFilters } from "@/store/opd_bills/thunks";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchConcessionGivenBy } from "@/store/slices/financeAuthority";
import { fetchConcessionCategoryTypes } from "@/store/concession_category/thunk";
import DocumentUpload from "./DocumentUpload";
import { KVPair } from "@/services/api-client";
import { fetchServiceOrServiceGroup } from "@/store/patientCompany/servicesSearchThunks";

const checkboxFields: {
  field: keyof RootState["patientCompanySave"]["data"];
  label: string;
}[] = [
  { field: "isMediclaim", label: "Mediclaim" },
  {
    field: "isExcludeFromDoctorProfessionalFee",
    label: "Exclude From Doctor Professional Fee",
  },
  { field: "isBlock", label: "Deactivate" },
  { field: "isIPMaterial", label: "IP Material" },
  { field: "isIPService", label: "IP Service" },
  { field: "isOPMaterial", label: "OP Material" },
  { field: "isOPService", label: "OP Service" },
];
const inputFields = [
  { field: "licenseNo", label: "License No.", placeholder: "License No." },
  {
    field: "registrationNo",
    label: "Registration No.",
    placeholder: "Registration No.",
  },
  { field: "panNo", label: "PAN No.", placeholder: "PAN No." },
  { field: "gstNumber", label: "GSTIN", placeholder: "GSTIN" },
  { field: "mobileNo", label: "Mobile No.", placeholder: "Mobile No." },
  { field: "contactNo", label: "Contact No.", placeholder: "Contact No." },
  { field: "emailAddress", label: "Email", placeholder: "Email" },
  { field: "faxNo1", label: "Fax", placeholder: "Fax" },
  { field: "website", label: "Website", placeholder: "Website" },
];

const skillsFields = [
  { field: "highSkillPercentage", label: "High Skill(%)" },
  { field: "highRiskPercentage", label: "High Risk(%)" },
  { field: "emergencyPercentage", label: "Emergency(%)" },
];

// Additional companies and categories for the new dropdown section
const additionalCompanies: { value: string; label: string }[] = [];

// const insuranceCompaniesList = [
//   "Acko General Insurance",
//   "Aditya Birla Health Insurance company Ltd",
//   "Agriculture Insurance Company of India",
//   "National Insurance Company",
//   "MD India",
//   "Navi General Insurance Limited",
//   "Bajaj Allianz General Insurance",
//   "Niva Bupa Health Insurance",
//   "Care Health Insurance Ltd",
//   "Raheja QBE General Insurance",
// ];

const ReceiptDetailPanel: React.FC = ({}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { patientCategoryList: patientCategories, rateNameList: rateNames, companies } =
    useSelector((state: RootState) => state.patientCompanyFilter);
  
  const { departments } = useSelector(
    (state: RootState) => state.commonDropdown
  );
  const hospitals = useSelector(
    (state: RootState) => state.hospitalList.hospitals
  );

  const { countries, states, districts, cities } = useSelector(
    (state: RootState) => state.commonDropdown
  );

  const { data: concessionOptions } = useSelector(
    (state: RootState) => state.concessionGivenBy
  );

  const { types } = useSelector((state: RootState) => state.concessionCategory);

  const { visitTypes } = useSelector(
    (state: RootState) => state.opdFiltersOptions
  );

  const isMediclaim =
    useSelector(
      (state: RootState) => state.patientCompanySave.data.isMediclaim
    ) || false;

  // const hospitalIds = useSelector(
  //   (state: RootState) => state.patientCompanySave.data.hospitalIds
  // );

  const [data, setData] = useState<any[]>([]);
  const [uploadData, setUploadData] = useState<any[]>([]);

  // Handle input value updates for the table
  const handleUpdateValue = (rowIndex: number, field: string, value: string) => {
    setData(prevData => 
      prevData.map((row, index) => 
        index === rowIndex 
          ? { 
              ...row, 
              [field]: field === 'includeExclude' 
                ? (value === '0' ? null : parseInt(value)) 
                : (value === '' ? '' : (isNaN(parseFloat(value)) ? value : parseFloat(value)))
            }
          : row
      )
    );
  };
  const [placeHolderService, setPlaceHolderService] = useState<string>("select service / Service Group");
  const [ServiceDropdownValue, setServiceDropdownValue] = useState<KVPair[]>([]);
  const [DepartmentName, setDepartmentName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const { items } = useSelector( (state: RootState) => state.searchServiceOrServiceGroup);
  
console.log(items);
  useEffect(() => {
    if(items) {
      setServiceDropdownValue(items.data?.items.map((item)=>({key:item.id,value:item.name})) || []);
    }
  }, [items]);

  function handleAdd(value: string) {
    console.log(ServiceDropdownValue.find((item)=>item.key===value)?.value)
    setData((prev)=>[...prev,{serviceId:value,
      serviceName:ServiceDropdownValue.find((item)=>item.key===value)?.value || "",
      code:items?.data.items.find((item)=>item.id===value)?.code || "",
      serviceDepartmentName:items?.data.items.find((item)=>item.id===value)?.serviceDepartmentName || ""
    }
    ]
    );
    

    setPlaceHolderService("select service / Service Group");
  }
  function handleSearch(value: string) {
    if(value.length>2)
    dispatch(fetchServiceOrServiceGroup({ version: "1", tenant: "", hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477", searchTerm: value }));
    setDepartmentName("");
    setCode("");
  }
  useEffect(() => {
    console.log(data);
  }, [data]);
  function handleSelect(value: string) {

    setPlaceHolderService(items?.data?.items.find((item)=>item.id===value)?.name || "select service / Service Group");
    setDepartmentName(items?.data?.items.find((item)=>item.id===value)?.serviceDepartmentName || "");
    setCode(items?.data?.items.find((item)=>item.id===value)?.code || "");
    console.log(DepartmentName);
    console.log(code);

  }
  // function handleDelete(value: string) {
  //   console.log(value);
  // }

  useEffect(() => {
    dispatch(
      fetchAllDropdownData({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchHospitalList({
        version: "1",
        tenant: "",
      })
    );
    dispatch(
      fetchAllOpdFilters({
        version: "1",
        tenant: "",
        // hospitalId: "f1b0f4c7-9f66-48db-b94d-0f4ca190d477",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchDepartments());
    dispatch(fetchConcessionGivenBy({ version: "1", tenant: "" }));
    dispatch(fetchConcessionCategoryTypes(API_TENANT));
  }, [dispatch]);

  const authorizedBy = (concessionOptions?.data?.items ?? [])
    .filter(
      (doc) => typeof doc.key === "string" && typeof doc.value === "string"
    )
    .map((doc) => ({
      label: doc.key as string,
      value: doc.value as string,
    }));

  

  // Create columns with update handler
  const columns = createColumns(handleUpdateValue);

  const tableUpload = useReactTable({
    data: uploadData,
    columns: uploadColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleFileUpload = (file: File) => {
    console.log(file);
    const newFile = {
      id: Date.now().toString(), // Generate unique ID
      fileName: file.name,
      fileDescription: file.name, // Default description to file name
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date().toISOString(),
      file: file, // Store the actual file object
    };
    
    setUploadData((prev) => {
      if (Array.isArray(prev)) {
        return [...prev, newFile];
      }
      return [newFile];
    });
  };

  return (
    <div className="space-y-6  flex flex-col  max-w-6xl mx-auto pb-10 ">
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Primary Details</h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <SelectInput
              key={`hospital-${hospitals?.length || 0}`}
              field="hospitalIds"
              label="Hospital"
              required={true}
              options={(() => {
                const hospitalOptions =
                  hospitals?.map((h) => ({
                    label: h.key || "",
                    value: h.value || "",
                  })) || [];
                return hospitalOptions;
              })()}
            />
            <TextInput field="name" label="Name" required={true} />
            <SelectInput
              key={`patientCategory-${
                patientCategories?.data?.items?.length || 0
              }`}
              field="schemeCompanyTypeId"
              label="Patient Category"
              required={true}
              options={
                patientCategories?.data?.items?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
            />
            <SelectInput
              key={`rateName-${rateNames?.data?.items?.length || 0}`}
              field="scheduleOfChargesTypeId"
              label="Rate Name"
              required={true}
              options={
                rateNames?.data?.items?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
            />
            <TextInput field="shortName" label="Short Name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 transition-all duration-300 ease-in-out">
            {checkboxFields
              .filter(({ field }) => {
                // Always show Mediclaim checkbox
                if (field === "isMediclaim") return true;
                // Always show other non-IP/OP checkboxes
                if (
                  field === "isExcludeFromDoctorProfessionalFee" ||
                  field === "isBlock"
                )
                  return true;
                // Only show IP/OP related checkboxes when Mediclaim is checked
                if (isMediclaim) return true;
                // Hide IP/OP related checkboxes when Mediclaim is unchecked
                return false;
              })
              .map(({ field, label}) => (
                <CheckboxInput key={label} field={field} label={label} />
              ))}
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Associated Companies</h2>
        </div>
        <div>
          <div className="h-64 overflow-y-auto border border-[#D9D9E0] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {
                companies?.map(company=>{
                  return <ArrayCheckboxInput
                  key={company.key}
                  field="associateSchemeCompanyIds"
                  value={company.key}
                  label={company.value}
                />
                })
              }
              {additionalCompanies.map((company) => (
                <ArrayCheckboxInput
                  key={company.value}
                  field="associateSchemeCompanyIds"
                  value={company.value}
                  label={company.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Company Details</h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {inputFields.map(({ field, label, placeholder }) => (
              <TextInput
                key={field}
                field={field as any}
                placeholder={placeholder}
                label={label}
              />
            ))}
            <DateInput field="fromDate" label="From Date" />
            <DateInput field="toDate" label="To Date" />

            {skillsFields.map(({ field, label }) => (
              <TextInput key={field} field={field as any} label={label} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <TextInput
              field="referralLetterValidityDays"
              label="Referral Letter Validity(Days)"
              placeholder="0"
            />
            <SelectInput
              field="visitType"
              label="Visit Type"
              options={
                visitTypes?.data?.items?.map((h) => ({
                  label: String(h.id) || "",
                  value: h.name || "",
                })) || []
              }
            />
            {
              <SelectInput
                field="departmentid"
                label="Departments"
                options={
                  departments?.map((dept) => ({
                    label: dept.key || "",
                    value: dept.value || "",
                  })) || []
                }
              />
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <TextInput
              field="description"
              label="Description"
              placeholder="-"
            />

            <div className="flex flex-col space-y-0">
              <Label>
                <div className="flex items-center">
                  <CheckboxInput label="" field="registrationValidityDays" />
                  Unlimited Regi. Validity(Days)
                </div>
              </Label>
              <TextInput
                field="registrationValidityDays"
                label=""
                placeholder="180"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Upload File(s)</h2>
        </div>
        <DocumentUpload onUpload={handleFileUpload} />
        <DistributeDataTable
          table={tableUpload}
          columns={uploadColumns}
          dataProps={{ data: uploadData, setData: setUploadData }}
          addButton={false}
        />
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Address Details</h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <SelectInput
              field="countryId"
              label="Country"
              options={
                countries?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
              onChange={(value) => {
                // Find the country by value (name) and get its key (ID)
                const selectedCountry = countries?.find(country => country.value === value);
                if (selectedCountry) {
                  dispatch(fetchStates(selectedCountry.key));
                }
              }}
            />
            <SelectInput
              field="stateId"
              label="State"
              options={
                states?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
              onChange={(value) => {
                // Find the state by value (name) and get its key (ID)
                const selectedState = states?.find(state => state.value === value);
                if (selectedState) {
                  dispatch(fetchDistricts(selectedState.key));
                }
              }}
            />
            <SelectInput
              field="districtId"
              label="District"
              options={
                districts?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
              onChange={(value) => {
                // Find the district by value (name) and get its key (ID)
                const selectedDistrict = districts?.find(district => district.value === value);
                if (selectedDistrict) {
                  dispatch(fetchCities(selectedDistrict.key));
                }
              }}
            />
            <SelectInput
              field="cityId"
              label="City"
              options={
                cities?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
            />
            <TextInput field="areaId" label="Area" />

            <TextInput field="pincode" label="Pincode" />
            <TextInput field="address" label="Address" />
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Contact Person Details</h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <TextInput field="emergencyContactName" label="Person Name" />
            <TextInput field="emergencyContactNo" label="Person's Mobile No." />
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Exclusion(s)</h2>
        </div>
        <div>
          <div className="w-full">
            <ExclusionTabs />
          </div>
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Company Discount Rules</h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <SelectInput
              field="discountGivenBy"
              label="Authorized By"
              options={
                authorizedBy?.map((h) => ({
                  label: h.label || "",
                  value: h.value || "",
                })) || []
              }
            />
            <SelectInput
              field="discountCategory"
              label="Conc. Category"
              options={
                types?.map((h) => ({
                  label: h.key || "",
                  value: h.value || "",
                })) || []
              }
            />
          </div>
          <DistributeDataTable
            table={table}
            columns={columns}
            dataProps={{ data, setData }}
            addButton={true}
            onAdd={handleAdd}
            onSearch={handleSearch}
            onselect={handleSelect}
            dropdownplaceHolder={placeHolderService}
            dropdownItems={ServiceDropdownValue}
          />
        </div>
      </div>
      <div className="w-full  max-w-4xl p-6 bg-white border border-[#D9D9E0] rounded-xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Emergency Packages</h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <DateInput
              field="emergencyPackageApplicableDate"
              label="Date of Applicable"
              placeholder="MM/DD/YYYY"
            />
            <TimeInput
              field="emergencyPackageApplicableTime"
              label="Applicable Time"
              placeholder="HH:MM"
            />
            <TextInput
              field="emergencyPackagePercentage"
              label="Emergency(%)"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReceiptDetailPanel;
