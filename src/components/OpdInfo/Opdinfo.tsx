import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from 'next/image';
import Avatar from 'react-avatar';
import Button from '../buttons/Button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Tags from '@/components/statusTags/Tags';

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PosInfoCardDetails from '../posInfoCard/posInfoCardDetails';
import { useFrappeApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import SelectInput from "@/components/form/Select";
// import Cash from "@/assets/icons/Cash.svg";
import Dropdown from '../dropdownForPatientCard/Dropdown';
import axios from "axios";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { useAlert } from "@/components/AlertContext/AlertContext";


interface PatientCardProps {
    name?: string;
    age?: string;
    sex?: 'Male' | 'Female' | string;
    phone?: string;
    ABHAID?: string;
    category?: string;
    company?: string;
    visitType?: string;
    doctor?: string;
    patientData?: SelectedPatient | null;
    onPatientChange?: (p: SelectedPatient) => void;
    selectedWarehouse?: string;
    setSelectedWarehouse?: (value: string) => void;
    selectedCustomer?: string;
    setSelectedCustomer?: (value: string) => void;
    selectedCompany?: string;
    setSelectedCompany?: (value: string) => void;
    selectedBranch?: string;
    setSelectedBranch?: (value: string) => void;
    selectedDepartment?: string;
    setSelectedDepartment?: (value: string) => void;
    selectedSubDepartment?: string;
    setSelectedSubDepartment?: (value: string) => void;
    isReturn: boolean;
    onReturnStatusChange: (status: boolean) => void;
}

type SelectOption = { label: string; value: string };

type SelectedPatient = {
    name: string;
    age: string;
    sex: string;
    phone: string;
    ABHAID: string;
    category: string;
    doctor: string;
    mrn?: string;
    displayNo?: string;
    dept?: string;
    visitType?: string;
    company?: string;
    visitID?: string;
    payerType?: string;
    payerName?: string;
    network?: string;
    insuranceNo?: string;
    subInsurance?: string;
    otherNo?: string;
    validityFrom?: string;
    expiryValidityTo?: string;
    hospitalId?: string;
    coPay?: number;
};

const PATIENT_API_BASE_URL = "https://gmcerp.quantcloud.in/api/method/quantbit_hims_integration.quantbit_hims_integration.patient_api.search_patient";

const OpdCard: React.FC<PatientCardProps> = ({
    name = '',
    age = '22',
    sex = 'Male',
    phone = '',
    ABHAID = '',
    category = 'Corporate',
    company = '',
    visitType = '',
    doctor = '',
    patientData = null,
    onPatientChange,
    selectedWarehouse = '',
    setSelectedWarehouse,
    selectedCustomer = '',
    setSelectedCustomer,
    selectedCompany = '',
    setSelectedCompany,
    selectedBranch = '',
    setSelectedBranch,
    selectedDepartment = '',
    setSelectedDepartment,
    // selectedSubDepartment = '',
    // setSelectedSubDepartment,
    isReturn,
    onReturnStatusChange,
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const { fetchWarehouses, fetchBranch, customers, companies, departments, fetchDoctors } = useFrappeApi();
    const { apiKey, apiSecret, isInitialized } = useAuth();
    // fetchWarehouseForSubdepartment
    const { showAlert } = useAlert();

    // Local state for doctors since API hook doesn't provide setter
    const [localDoctors, setLocalDoctors] = useState<any[]>([]);

    // State for editable fields
    const [editedPatient, setEditedPatient] = useState<SelectedPatient>({
        name: patientData?.name ?? name,
        age: patientData?.age ?? age,
        sex: patientData?.sex ?? sex,
        phone: patientData?.phone ?? phone,
        ABHAID: patientData?.ABHAID ?? ABHAID,
        category: patientData?.category ?? category,
        company: patientData?.company ?? company,
        visitType: patientData?.visitType ?? visitType,
        doctor: patientData?.doctor ?? doctor,
        mrn: patientData?.mrn,
        displayNo: patientData?.displayNo,
        dept: patientData?.dept,
        visitID: patientData?.visitID ?? '',
        payerType: patientData?.payerType ?? '',
        payerName: patientData?.payerName ?? '',
        network: patientData?.network ?? '',
        insuranceNo: patientData?.insuranceNo ?? '',
        subInsurance: patientData?.subInsurance ?? '',
        otherNo: patientData?.otherNo ?? '',
        validityFrom: patientData?.validityFrom ?? '',
        expiryValidityTo: patientData?.expiryValidityTo ?? '',
    });

    const [warehouses, setWarehouses] = useState<{ label: string; value: string }[]>([]);
    const [branches, setBranches] = useState<{ label: string; value: string }[]>([]);
    const [defaultBranch] = useState<string>("");
    // const [selectedWarehouse, setSelectedWarehouse] = useState<string>(''); // Removed
    // const [selectedCustomer, setSelectedCustomer] = useState<string>(''); // Removed
    // const [selectedCompany, setSelectedCompany] = useState<string>(''); // Removed
    // const [selectedBranch, setSelectedBranch] = useState<string>(''); // Removed
    // const [selectedDepartment, setSelectedDepartment] = useState<string>(''); // Removed
    // const [selectedSubDepartment, setSelectedSubDepartment] = useState<string>(''); // Removed
    const [_loading, setLoading] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>("fullName"); // Use value, not label
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectOptions: SelectOption[] = [
        { label: "UHID", value: "uhid" },
        { label: "Aadhaar No", value: "aadharCardNo" },
        { label: "Mobile No", value: "mobile" },
        { label: "Full Name", value: "fullName" },
    ];

    const sexOptions: SelectOption[] = [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
    ];

    // const visitTypeOptions: SelectOption[] = [
    //     { label: "OP", value: "OP" },
    //     { label: "IP", value: "IP" },
    //     { label: "Emergency", value: "Emergency" },
    // ];

    // ... (rest of your existing functions: useEffect, searchPatients, handlers, etc.) ...
    // Update internal state when patientData prop changes
    useEffect(() => {
        if (patientData) {
            setEditedPatient({
                name: patientData.name ?? name,
                age: patientData.age ?? age,
                sex: patientData.sex ?? sex,
                phone: patientData.phone ?? phone,
                ABHAID: patientData.ABHAID ?? ABHAID,
                category: patientData.category ?? category,
                company: patientData.company ?? company,
                visitType: patientData.visitType ?? visitType,
                doctor: patientData.doctor ?? doctor,
                mrn: patientData.mrn,
                displayNo: patientData.displayNo,
                dept: patientData.dept,
                visitID: patientData.visitID,
                payerType: patientData.payerType ?? '',
                payerName: patientData.payerName ?? '',
                network: patientData.network ?? '',
                insuranceNo: patientData.insuranceNo ?? '',
                subInsurance: patientData.subInsurance ?? '',
                otherNo: patientData.otherNo ?? '',
                validityFrom: patientData.validityFrom ?? '',
                expiryValidityTo: patientData.expiryValidityTo ?? '',
            });
            setSearchValue(`${patientData.name} (${patientData.mrn})`);
        } else {
            // Clear patient data when patientData is null
            setEditedPatient({
                name: '', age: '', sex: '', phone: '', ABHAID: '',
                category: '', doctor: '', company: '', visitType: '',
                visitID: '',
                payerType: '',
                payerName: '',
                network: '',
                insuranceNo: '',
                subInsurance: '',
                otherNo: '',
                validityFrom: '',
                expiryValidityTo: '',
            });
            setSearchValue('');
        }
    }, [patientData, name, age, sex, phone, ABHAID, category, company, visitType, doctor]);

    const searchPatients = useCallback(
        debounce(async (value: string, searchType: string) => {
            if (value.length < 2) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            // Check if authentication is available
            if (!isInitialized) {
                console.error("Authentication not initialized yet");
                showAlert('danger', 'Authentication Error', 'Authentication is still initializing. Please wait a moment and try again.');
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            // For patient search API, we need either API keys or session-based authentication
            const useSessionAuth = localStorage.getItem('useSessionAuth');
            if ((!apiKey || !apiSecret) && !useSessionAuth) {
                console.error("No authentication method available for patient search:", { isInitialized, apiKey: !!apiKey, apiSecret: !!apiSecret, useSessionAuth });
                showAlert('danger', 'Authentication Error', 'No authentication method available. Please ensure you are properly logged in.');
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            // Build headers based on available authentication method
            const headers: any = {
                'Content-Type': 'application/json',
            };

            // Use token authentication if API keys are available
            if (apiKey && apiSecret) {
                headers['Authorization'] = `token ${apiKey}:${apiSecret}`;
            }
            // For session-based auth, let the fetch interceptor handle it
            // No additional headers needed, just use fetch with credentials

            setIsLoading(true);

            try {
                const apiParam = searchType === "uhid" ? "UHID" : searchType === "aadharCardNo" ? "Aadhar No" : searchType === "mobile" ? "Mobile No" : searchType === "fullName" ? "Full Name" : "Aadhar No";
                console.log("API call with param:", apiParam, "and value:", value);

                const response = await axios.get(PATIENT_API_BASE_URL, {
                    params: {
                        search_type: apiParam,
                        search_value: value,
                        PageIndex: "1",
                        PageSize: "10",
                        IsExpired: "false",
                    },
                    headers: headers,
                    withCredentials: true // Important for session-based authentication
                });
                const patients = response.data.message || [];
                console.log("Search results:", patients);
                setSearchResults(patients);
                setShowDropdown(patients.length > 0);
            } catch (error: any) {
                console.error("Patient search failed:", error);

                // Handle authentication errors specifically
                if (error.response?.status === 401 ||
                    (error.response?.data?.exception && error.response?.data?.exception.includes("AuthenticationError"))) {
                    showAlert('danger', 'Authentication Error', 'Authentication failed. Please check your login credentials and try again.');
                } else if (error.response?.data?.exception) {
                    showAlert('danger', 'API Error', error.response.data.exception);
                } else {
                    showAlert('danger', 'Error', 'Search failed. Please try again.');
                }

                setSearchResults([]);
                setShowDropdown(false);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        [apiKey, apiSecret, isInitialized, showAlert]
    );

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        console.log("Search value:", value, "Selected value:", selectedValue, "Search type for API:", selectedValue === "uhid" ? "UHID" : selectedValue === "aadharCardNo" ? "aadharCardNo" : selectedValue === "mobile" ? "MobileNo" : selectedValue === "fullName" ? "FullName" : "aadharCardNo");
        if (selectedValue) {
            searchPatients(value, selectedValue);
        } else {
            showAlert('warning', 'Warning', 'Please select a search field (e.g., UHID, Full Name).');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || searchResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => prev < searchResults.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : searchResults.length - 1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    handleSelectPatient(searchResults[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    const clearSearch = () => {
        setSearchValue('');
        setSearchResults([]);
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const highlightMatch = (text: string = '', query: string = '') => {
        if (!query.trim()) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        const parts = String(text).split(regex);
        return parts.map((part, idx) =>
            regex.test(part) ? (
                <mark key={idx} className="bg-blue-200 text-blue-900 font-medium">{part}</mark>
            ) : (
                <React.Fragment key={idx}>{part}</React.Fragment>
            )
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectPatient = (patient: any) => {
        console.log('Selected patient from search:', patient);
        console.log('Payer details in search response:', {
            payerType: patient.payerType,
            payerName: patient.payerName,
            network: patient.network,
            insurnaceNo: patient.insurnaceNo,
            subInsurance: patient.subInsurance,
            otherNo: patient.otherNo,
            validateFrom: patient.validateFrom,
            expiryDate: patient.expiryDate
        });

        const newPatientData = {
            name: patient.patientFullName || "N/A",
            age: patient.ageDisplay || "N/A",
            sex: patient.genderValue || "N/A",
            phone: patient.mobileNo || patient.phoneNo || "N/A",
            ABHAID: patient.aadharCardNo || "N/A",
            category: patient.patientCategory || "N/A",
            doctor: patient.consultingDoctor || "N/A",
            mrn: patient.mrn || "N/A",
            displayNo: patient.displayNo || "N/A",
            dept: patient.departmentName || "N/A",
            visitType: patient.patientVisitType || "N/A",
            company: patient.patientCompany || "N/A",
            Bed: patient.bedName || "N/A",
            visitID: patient.visitID || "N/A",
            // Payer details from search response
            payerType: patient.payerType || "",
            payerName: patient.payerName || "",
            network: patient.network || "",
            insuranceNo: patient.insurnaceNo || "",
            subInsurance: patient.subInsurance || "",
            otherNo: patient.otherNo || "",
            validityFrom: patient.validateFrom || "",
            expiryValidityTo: patient.expiryDate || "",
            hospitalId: patient.hospitalId || "",
            coPay: patient.co_Pay || 0,
        };

        console.log('New patient data being set:', newPatientData);

        setEditedPatient(newPatientData);
        if (onPatientChange) {
            onPatientChange(newPatientData);
        }

        // Auto-set customer based on patient's company or default to self-paid
        if (setSelectedCustomer && customers.length > 0) {
            // If patient has a company, try to find matching customer
            if (newPatientData.company && newPatientData.company !== "N/A") {
                const matchingCustomer = customers.find((customer: any) =>
                    customer.label === newPatientData.company || customer.value === newPatientData.company
                );
                if (matchingCustomer) {
                    setSelectedCustomer(matchingCustomer.value);
                    console.log('Set customer to patient company:', matchingCustomer.value);
                } else {
                    // If no matching customer found, default to self-paid
                    const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
                    if (defaultSelfPaidCustomer) {
                        setSelectedCustomer(defaultSelfPaidCustomer.value);
                        console.log('No matching customer found, defaulted to self-paid:', defaultSelfPaidCustomer.value);
                    }
                }
            } else {
                // If patient has no company, default to self-paid
                const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
                if (defaultSelfPaidCustomer) {
                    setSelectedCustomer(defaultSelfPaidCustomer.value);
                    console.log('Patient has no company, defaulted to self-paid:', defaultSelfPaidCustomer.value);
                }
            }
        }

        // Fetch doctors for patient's department if available
        // Use department for doctors API since that's what we have in patient data
        if (newPatientData.dept && newPatientData.dept !== "N/A" && fetchDoctors) {
            console.log('Fetching doctors for department:', newPatientData.dept);
            fetchDoctors(newPatientData.dept).then(doctorData => {
                setLocalDoctors(doctorData);
                // If API succeeds but returns empty doctors, still set from patient data
                if (!doctorData || doctorData.length === 0) {
                    if (newPatientData.doctor && newPatientData.doctor !== "N/A") {
                        console.log('No doctors found from API, setting doctor from patient data:', newPatientData.doctor);
                        const patientDoctor = [{
                            name: newPatientData.doctor,
                            label: newPatientData.doctor,
                            value: newPatientData.doctor
                        }];
                        setLocalDoctors(patientDoctor);
                    }
                }
            }).catch(error => {
                console.error('Failed to fetch doctors:', error);
                // If doctors API fails, still set the doctor from patient data
                if (newPatientData.doctor && newPatientData.doctor !== "N/A") {
                    console.log('Setting doctor from patient data due to API failure:', newPatientData.doctor);
                    // Create a doctors array with just the patient's doctor for the dropdown
                    const patientDoctor = [{
                        name: newPatientData.doctor,
                        label: newPatientData.doctor,
                        value: newPatientData.doctor
                    }];
                    setLocalDoctors(patientDoctor);
                } else {
                    // Clear doctors if API fails and no patient doctor available
                    setLocalDoctors([]);
                }
            });
        }

        setSearchValue(`${patient.patientFullName} (${patient.mrn})`);
        setShowDropdown(false);
        setHighlightedIndex(-1);
        console.log("Selected patient data:", newPatientData);
        showAlert('success', 'Success', 'Patient selected successfully');
    };

    // Handle changes to editable fields
    const handleFieldChange = (field: keyof SelectedPatient, value: string) => {
        const updatedPatient = { ...editedPatient, [field]: value };
        setEditedPatient(updatedPatient);
        if (onPatientChange) {
            onPatientChange(updatedPatient);
        }
    };

    useEffect(() => {
        if (!isInitialized) return; // Wait for auth initialization

        const loadWarehouses = async () => {
            setLoading(true);
            try {
                const warehouseData = await fetchWarehouses();
                const warehouseOptions = warehouseData.map((warehouse: any) => ({
                    label: warehouse.name || warehouse.warehouse_name || 'Unnamed Warehouse',
                    value: warehouse.name,
                }));
                setWarehouses(warehouseOptions);
            } catch (error) {
                console.error('Error fetching warehouses:', error);
                setWarehouses([]);
            } finally {
                setLoading(false);
            }
        };

        loadWarehouses();
    }, [fetchWarehouses, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return; // Wait for auth initialization

        // Fetch and set default branch (hospital) from session

        const loadBranches = async () => {
            setLoading(true);
            try {
                const branchData = await fetchBranch();
                const branchOptions = branchData.map((branch: any) => ({
                    label: branch.name || 'Unnamed Branch',
                    value: branch.name,
                }));
                setBranches(branchOptions);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setBranches([]);
            } finally {
                setLoading(false);
            }
        };

        loadBranches();
    }, [fetchBranch, isInitialized, apiKey, apiSecret]);

    const handleWarehouseChange = useCallback(
        (value: string) => {
            setSelectedWarehouse?.(value);
        },
        [setSelectedWarehouse]
    );

    const handleCustomerChange = useCallback(
        (value: string) => {
            setSelectedCustomer?.(value);
        },
        [setSelectedCustomer]
    );

    const handleCompanyChange = useCallback(
        (value: string) => {
            setSelectedCompany?.(value);
        },
        [setSelectedCompany]
    );

    const handleBranchChange = useCallback(
        (value: string) => {
            setSelectedBranch?.(value);
            if (value) {
                fetchDoctors(value); // Fetch doctors when branch changes
            } else {
                // Clear doctors if no branch is selected
                // You might want to clear the selected doctor as well
                // setEditedPatient(prev => ({ ...prev, doctor: '' }));
            }
        },
        [setSelectedBranch, fetchDoctors] // Add fetchDoctors to dependency array
    );

    const handleDepartmentChange = useCallback(
        (value: string) => {
            setSelectedDepartment?.(value);
        },
        [setSelectedDepartment]
    );

    const handleSelectChange = (value: string) => {
        if (value) {
            // Find the actual value from the label if needed
            const option = selectOptions.find(opt => opt.label === value);
            const actualValue = option ? option.value : value;
            setSelectedValue(actualValue);
            setSearchResults([]);

            console.log("Search field changed:", value, "Setting selectedValue to:", actualValue);
            if (searchValue) {
                searchPatients(searchValue, actualValue);
            }
        } else {
            setSelectedValue("");
            showAlert('danger', 'Error', 'Invalid search field selected.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className='flex flex-col w-[280px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'>
                {/* ... (rest of your existing JSX) ... */}
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex flex-col gap-2'>
                        <span className='w-[208px] text-[#60646C] text-xs font-normal'>Visit Information</span>
                        <div className='flex flex-row gap-2 items-center'>
                            <Avatar name={editedPatient.name.charAt(0)} size="24" round={true} textSizeRatio={2} />
                            {/* <Input
                                value={editedPatient.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                className='text-[#0D74CE] text-sm font-semibold'
                            /> */}
                        </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <Tags variant="tag" tagText="Medical Legal Case" type="cyan" border />
                        <Tags variant="tag" tagText="No Coverage" type="warning" border />
                    </div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <div className='flex flex-row h-8 items-center justify-between'>
                                <div className='flex flex-row gap-1'>
                                    <Image src="assets/icons/Cash.svg" width={16} height={16} alt='Cash' />
                                    <span className='w-full text-[#1C2024] text-xs font-normal'>Patient</span>
                                </div>
                                <div className='flex flex-row h-8 items-center justify-between'>
                                    <Dropdown
                                        reasons={selectOptions.map(customer => ({
                                            key: customer.value,
                                            value: customer.label,
                                        }))}
                                        value={selectedValue}
                                        onChange={(v: string) => handleSelectChange(v)}
                                        placeholder="Select Search Type"
                                        disabled={customers.length === 0}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div ref={searchRef} className="relative w-full">
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                value={searchValue}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => {
                                    if (searchResults.length > 0) setShowDropdown(true);
                                }}
                                placeholder="Search Patients"
                                className="w-full pr-10"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.414 10l4.95 4.95a1 1 0 01-1.414 1.415L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.415L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                            {isLoading && (
                                <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                        {showDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                                {searchResults.length > 0 ? (
                                    <>
                                        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                                            Found {searchResults.length} patient{searchResults.length !== 1 ? 's' : ''}
                                        </div>
                                        <ul className="max-h-64 overflow-y-auto">
                                            {searchResults.map((patient, index) => (
                                                <li
                                                    key={patient.mrn || patient.id || index}
                                                    className={`px-3 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${index === highlightedIndex ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50'}`}
                                                    onClick={() => handleSelectPatient(patient)}
                                                    onMouseEnter={() => setHighlightedIndex(index)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {highlightMatch(patient.patientFullName || 'N/A', searchValue)}
                                                                </p>
                                                                {patient.patientVisitType && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                        {patient.patientVisitType}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                                                <span>MRN: {highlightMatch(patient.mrn || 'N/A', searchValue)}</span>
                                                                <span>Age: {patient.ageDisplay || 'N/A'}</span>
                                                                <span>Visit ID: {patient.visitID || 'N/A'}</span>
                                                                <span>Visit Date: {patient.visitDateTime || 'N/A'}</span>
                                                                <span>Gender: {patient.genderValue || 'N/A'}</span>
                                                                {patient.mobileNo && <span>Mobile: {highlightMatch(patient.mobileNo, searchValue)}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                        No patients found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className="flex flex-col gap-2 w-full">
                        <div className='flex flex-row h-8 items-center justify-between'>
                            <div className='flex flex-row gap-1'>
                                <Image src="assets/icons/Cash.svg" width={16} height={16} alt='Cash' />
                                <span className='w-full text-[#1C2024] text-xs font-normal'>Store / Department</span>
                            </div>
                            <div className='flex flex-row h-8 items-center justify-between'>
                                <Dropdown
                                    reasons={warehouses.map(warehouse => ({
                                        key: warehouse.value,
                                        value: warehouse.label,
                                    }))}
                                    value={selectedWarehouse}
                                    onChange={handleWarehouseChange}
                                    placeholder="Select warehouse"
                                    disabled={true} // Make readonly

                                />
                            </div>
                        </div>
                    </div>
                    <InfoRow
                        icon="assets/icons/Cake.svg"
                        label="Gender"
                        value={editedPatient.age}
                        selectValue={editedPatient.sex}
                        // onChange={(value) => handleFieldChange('age', value)}
                        onSelectChange={(value) => handleFieldChange('sex', value)}
                        selectOptions={sexOptions}
                    />
                    {/* This is the new row for Age only */}
                    <InfoRow
                        icon="assets/icons/Cake.svg"
                        label="Age"
                        value={editedPatient.age}
                        onChange={(value) => handleFieldChange('age', value)}
                    />
                    <InfoRow
                        icon="assets/icons/Phone.svg"
                        label="Contact"
                        value={editedPatient.phone}
                        onChange={(value) => handleFieldChange('phone', value)}
                    />
                    <InfoRow
                        icon="assets/icons/Id.svg"
                        label="Visit No"
                        value={editedPatient.visitID || ''}
                        disabled={true}
                    />
                    <InfoRow
                        icon="assets/icons/Id.svg"
                        label="ABHA ID"
                        value={editedPatient.ABHAID}
                        onChange={(value) => handleFieldChange('ABHAID', value)}
                    />
                    <div className="flex flex-col gap-2 w-full">
                        <div className='flex flex-row h-8 items-center justify-between'>
                            <div className='flex flex-row gap-1'>
                                <Image src="assets/icons/Cash.svg" width={16} height={16} alt='Cash' />
                                <span className='w-full text-[#1C2024] text-xs font-normal'>Customer</span>
                            </div>
                            <div className='flex flex-row h-8 items-center justify-between'>
                                <Dropdown
                                    reasons={customers.map(customer => ({
                                        key: customer.value,
                                        value: customer.label,
                                    }))}
                                    value={selectedCustomer}
                                    onChange={handleCustomerChange}
                                    placeholder="Self Paid"
                                    disabled={customers.length === 0}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className='flex flex-row h-8 items-center justify-between'>
                            <div className='flex flex-row gap-1'>
                                <Image src="assets/icons/Cash.svg" width={16} height={16} alt='Cash' />
                                <span className='w-full text-[#1C2024] text-xs font-normal'>Company</span>
                            </div>
                            <div className='flex flex-row h-8 items-center justify-between'>
                                <Dropdown
                                    reasons={companies.map(company => ({
                                        key: company.value,
                                        value: company.label,
                                    }))}
                                    value={selectedCompany}
                                    onChange={handleCompanyChange}
                                    placeholder="Select company"
                                    disabled={companies.length === 0}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className='flex flex-row h-8 items-center justify-between'>
                            <div className='flex flex-row gap-1'>
                                <Image src="assets/icons/Cash.svg" width={16} height={16} alt='Cash' />
                                <span className='w-full text-[#1C2024] text-xs font-normal'>Hospital</span>
                            </div>
                            <div className='flex flex-row h-8 items-center justify-between'>
                                {defaultBranch ? (
                                    <div className="relative w-full">

                                        <input
                                            value={defaultBranch}
                                            disabled
                                            className="text-xs font-semibold placeholder:text-[#B0B3B9] focus:outline-none cursor-not-allowed transition-all  text-right w-full"
                                            style={{ textAlign: 'right' }}
                                        />
                                    </div>
                                ) : (
                                    <Dropdown
                                        reasons={branches.map(branch => ({
                                            key: branch.value,
                                            value: branch.label,
                                        }))}
                                        value={selectedBranch}
                                        onChange={handleBranchChange}
                                        placeholder="Select Hospital"
                                        disabled={branches.length === 0}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className='flex flex-row h-8 items-center justify-between'>
                            <div className='flex flex-row gap-1'>
                                <Image src="assets/icons/Cash.svg" width={16} height={16} alt='Cash' />
                                <span className='w-full text-[#1C2024] text-xs font-normal'>Patient Department</span>
                            </div>
                            <div className='flex flex-row h-8 items-center justify-between'>
                                <Dropdown
                                    reasons={departments.map(department => ({
                                        key: department.value,
                                        value: department.label,
                                    }))}
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                    placeholder="Select department"
                                    disabled={departments.length === 0}
                                />
                            </div>
                        </div>
                    </div>

                    <InfoRow
                        icon="assets/icons/Building.svg"
                        label="Customer Name"
                        value={editedPatient.name || ''}
                        onChange={(value) => handleFieldChange('name', value)}
                    />
                    <InfoRow
                        icon="assets/icons/DoorEnter.svg"
                        label="Visit Type"
                        value={editedPatient.visitType || ''}
                        disabled={true} // <-- 1. THIS IS YOUR ORIGINAL GOAL
                    />
                    <InfoRow
                        icon="assets/icons/FirstAidKit.svg"
                        label="Consulting Doctor"
                        value={editedPatient.doctor}
                        onChange={(value) => handleFieldChange('doctor', value)}
                        selectOptions={localDoctors.map(doctor => ({ label: doctor.label, value: doctor.value }))}
                        selectValue={editedPatient.doctor}
                        onSelectChange={(value) => handleFieldChange('doctor', value)}
                    />
                    <DialogTrigger asChild>
                        <div className='w-fit h-fit flex justify-start'>
                            <Button size="link-size" type="link-secondary" variant="link-button" className="cursor-pointer">
                                Show more
                            </Button>
                        </div>
                    </DialogTrigger>
                </div>
            </div>

            <DialogContent
                className="w-full max-w-none h-full max-h-none p-0 rounded-t-lg shadow-none border-none 
             mx-auto transition-transform duration-300 
             data-[state=open]:animate-slide-up 
             bg-n z-[10000] [&>button]:hidden"
            >
                <VisuallyHidden>
                    <DialogTitle>Patient Requisition Details</DialogTitle>
                </VisuallyHidden>
                <PosInfoCardDetails
                    name={editedPatient.name}
                    age={editedPatient.age}
                    sex={editedPatient.sex}
                    phone={editedPatient.phone}
                    ABHAID={editedPatient.ABHAID}
                    category={editedPatient.category}
                    company={editedPatient.company}
                    doctor={editedPatient.doctor}
                    onClose={() => setOpen(false)}
                    isReturn={isReturn}
                    onReturnStatusChange={onReturnStatusChange}
                />
            </DialogContent>
        </Dialog>
    );
};

export default OpdCard;

interface InfoRowProps {
    icon: string;
    label: string;
    value: string | undefined;
    selectValue?: string;
    onChange?: (value: string) => void;
    onSelectChange?: (value: string) => void;
    selectOptions?: SelectOption[];
    disabled?: boolean;
}

// <-- 2. 'disabled' IS NOW RECEIVED HERE
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, selectValue, onChange, onSelectChange, selectOptions, disabled }) => (
    <div className='flex flex-row h-8 items-center justify-between border-none border-0 border-input-none'>
        <div className='flex flex-row gap-1'>
            <Image src={icon} width={16} height={16} alt={label} />
            <span className='text-[#1C2024] text-xs font-normal'>{label}</span>
        </div>
        {selectOptions ? (
            <SelectInput
                placeholder={`Select ${label}`}
                value={selectValue || ''}
                data={selectOptions}
                onValueChange={onSelectChange}
                className="text-[#1C2024] text-xs font-semibold w-[120px] border-none border-0 border-input-none"
                disabled={disabled} // <-- 3. PROP IS PASSED TO SELECTINPUT
            />
        ) : (
            <Input
                value={value || ''}
                onChange={(e) => onChange && onChange(e.target.value)}
                className='text-[#1C2024] text-xs font-semibold w-[120px]'
                disabled={disabled} // <-- 4. FIXED: CHANGED FROM 'true' TO 'disabled'
            />
        )}
    </div>
);