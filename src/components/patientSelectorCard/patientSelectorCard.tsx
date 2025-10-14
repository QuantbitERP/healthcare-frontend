import React, { useState, useEffect } from "react";
import SelectInput from "@/components/form/Select";
import SearchInput from "@/components/form/SearchInput";

export interface SelectedPatient {
    name: string;
    age?: string;
    sex?: "Male" | "Female" | string;
    phone?: string;
    ABHAID?: string;
    category?: string;
    company?: string;
    visitType?: string;
    doctor?: string;
}

interface Props {
    selectOptions?: { label: string; value: string }[];
    onPatientSelect: (patient: SelectedPatient) => void;
    initialSelectValue?: string;
    initialSearchValue?: string;
}

const PatientSelectorCard: React.FC<Props> = ({
    selectOptions = [
        { label: "UHID", value: "uhid" },
        { label: "Aadhaar No", value: "aadhaar" },
        { label: "Mobile No", value: "mobile" },
        { label: "Full Name", value: "fullName" },
    ],
    onPatientSelect,
    initialSelectValue = "uhid",
    initialSearchValue = "",
}) => {
    const [selValue, setSelValue] = useState<string>(initialSelectValue);
    const [searchValue, setSearchValue] = useState<string>(initialSearchValue);

    // Build patient object (replace with API call if needed)
    const buildPatient = (): SelectedPatient => {
        return {
            name: searchValue,
            age: "22",
            sex: "Male",
            phone: "+91-9000000000",
            ABHAID: selValue ? `${selValue}-12345` : "N/A",
            category: "Regular",
            company: "City Hospital",
            visitType: "OPD",
            doctor: "Dr. Smith",
        };
    };

    // Auto trigger when both values are set
    useEffect(() => {
        if (selValue && searchValue) {
            onPatientSelect(buildPatient());
        }
    }, [selValue, searchValue]);

    return (
        <div className="w-[256px] h-[394px] p-4 rounded-lg border border-[#D9D9E0] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-2">
                <span className="text-[#60646C] text-xs font-normal">
                    Select Patient
                </span>
            </div>

            <div className="flex flex-col items-center space-y-2">
                {/* Dropdown */}
                <div className="w-full">
                    <SelectInput
                        placeholder="UHID"
                        value={selValue} // ✅ controlled by parent state
                        data={selectOptions}
                        onValueChange={(v: string) => setSelValue(v)}
                        className="w-full"
                    />
                </div>

                {/* Search bar */}
                <div className="w-full">
                    <SearchInput
                        arrayData={[
                            "Vishal Dhayarkar",
                            "Roytr Rossy",
                            "Anita Sharma",
                            "Suresh Patil",
                        ]}
                        onSelect={(v: string) => setSearchValue(v)}
                        placeholder="Search Patients"
                        inputImage={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default PatientSelectorCard;
