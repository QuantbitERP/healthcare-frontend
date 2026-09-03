import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import Image from 'next/image';
import Avatar from 'react-avatar';
import Button from '../buttons/Button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
// import Tags from '@/components/statusTags/Tags';

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
import { Checkbox } from "@/components/ui/checkbox";
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
    onPatientChange?: (p: SelectedPatient, rawPatient?: any) => void;
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
    isIPDPage?: boolean;
    isSelfPaying?: boolean;
    onSelfPayingChange?: (val: boolean) => void;
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
    visitNo?: string;
    bedName?: string;
    wardName?: string;
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

export interface OpdCardRef {
    handleSelectPatient: (patient: any) => void;
}

const OpdCard = forwardRef<OpdCardRef, PatientCardProps>(({
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
    selectedCompany: _selectedCompany = '',
    setSelectedCompany: _setSelectedCompany,
    selectedBranch = '',
    setSelectedBranch,
    selectedDepartment = '',
    setSelectedDepartment,
    // selectedSubDepartment = '',
    // setSelectedSubDepartment,
    isReturn,
    onReturnStatusChange,
    isIPDPage = false,
    isSelfPaying: isSelfPayingProp,
    onSelfPayingChange,
}, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const { fetchWarehouses, fetchBranch, customers, companies: _companies, departments, fetchDoctors } = useFrappeApi();
    const { apiKey, apiSecret, isInitialized } = useAuth();
    // fetchWarehouseForSubdepartment
    const { showAlert } = useAlert();

    // Local state for doctors since API hook doesn't provide setter
    const [localDoctors, setLocalDoctors] = useState<any[]>([]);

    // State for tracking if patient was searched/selected from patient search
    const [isPatientSearched, setIsPatientSearched] = useState<boolean>(false);

    // Local state for self paying checkbox
    const [localSelfPaying, setLocalSelfPaying] = useState<boolean>(isSelfPayingProp ?? true);

    useEffect(() => {
        if (isSelfPayingProp !== undefined) {
            setLocalSelfPaying(isSelfPayingProp);
        }
    }, [isSelfPayingProp]);

    useEffect(() => {
        if (!patientData) {
            setIsPatientSearched(false);
            if (isSelfPayingProp !== undefined) {
                setLocalSelfPaying(isSelfPayingProp);
            } else {
                setLocalSelfPaying(true);
            }
        }
    }, [patientData, isSelfPayingProp]);

    const handleSelfPayingChange = (checked: boolean) => {
        setLocalSelfPaying(checked);
        if (onSelfPayingChange) {
            onSelfPayingChange(checked);
        }
    };

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
        visitNo: patientData?.visitNo ?? '',
        bedName: patientData?.bedName ?? '',
        wardName: patientData?.wardName ?? '',
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
    const [branches, setBranches] = useState<{ label: string; value: string; custom_hospital_id?: string }[]>([]);
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
        // { label: "Aadhaar No", value: "aadharCardNo" },
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
            const hasSearchedInfo = Boolean(
                (patientData as any).isSearched ||
                (patientData.mrn && patientData.mrn !== "N/A" && patientData.mrn !== "") ||
                (patientData.displayNo && patientData.displayNo !== "N/A" && patientData.displayNo !== "") ||
                (patientData.visitID && patientData.visitID !== "N/A" && patientData.visitID !== "")
            );
            setIsPatientSearched(hasSearchedInfo);

            let parsedSex = patientData.sex || "";
            if (!parsedSex || parsedSex === "N/A") {
                if (patientData.age && typeof patientData.age === "string") {
                    const upperAge = patientData.age.toUpperCase();
                    if (upperAge.includes("/M")) parsedSex = "Male";
                    else if (upperAge.includes("/F")) parsedSex = "Female";
                }
            }
            if (parsedSex && parsedSex.toUpperCase() === "M") parsedSex = "Male";
            if (parsedSex && parsedSex.toUpperCase() === "F") parsedSex = "Female";

            setEditedPatient({
                name: patientData.name || "N/A",
                age: patientData.age || "N/A",
                sex: parsedSex || "N/A",
                phone: patientData.phone || "N/A",
                ABHAID: patientData.ABHAID || "N/A",
                category: patientData.category || "N/A",
                company: patientData.company || "N/A",
                visitType: (patientData.visitType && patientData.visitType !== "N/A") ? patientData.visitType : (isIPDPage ? "IP" : "OP"),
                doctor: patientData.doctor || "N/A",
                mrn: patientData.mrn || "N/A",
                displayNo: patientData.displayNo || patientData.mrn || "N/A",
                dept: patientData.dept || "N/A",
                visitID: patientData.visitID || "N/A",
                visitNo: patientData.visitNo || patientData.visitID || "N/A",
                bedName: patientData.bedName || "N/A",
                wardName: patientData.wardName || "N/A",
                payerType: patientData.payerType || '',
                payerName: patientData.payerName || '',
                network: patientData.network || '',
                insuranceNo: patientData.insuranceNo || '',
                subInsurance: patientData.subInsurance || '',
                otherNo: patientData.otherNo || '',
                validityFrom: patientData.validityFrom || '',
                expiryValidityTo: patientData.expiryValidityTo || '',
            });
            const displayName = patientData.name && patientData.name !== "N/A" ? patientData.name : "";
            const displayMRN = patientData.mrn && patientData.mrn !== "N/A" ? patientData.mrn : "";
            setSearchValue(displayName ? `${displayName}${displayMRN ? ` (${displayMRN})` : ''}` : '');
        } else {
            setIsPatientSearched(false);
            // Clear patient data when patientData is null
            setEditedPatient({
                name: '', age: '', sex: '', phone: '', ABHAID: '',
                category: '', doctor: '', company: '', visitType: '',
                visitID: '', visitNo: '', bedName: '', wardName: '',
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
                const visitTypeParam = isIPDPage ? "IPD" : "OPD";
                console.log("API call with param:", apiParam, "value:", value, "visitType:", visitTypeParam);

                const response = await axios.get(PATIENT_API_BASE_URL, {
                    params: {
                        search_type: apiParam,
                        search_value: value,
                        patient_visit_type: visitTypeParam,
                        PageIndex: "1",
                        PageSize: "10",
                        IsExpired: "false",
                    },
                    headers: headers,
                    withCredentials: true // Important for session-based authentication
                });
                const patients = response.data.message || [];
                const filteredPatients = patients.filter((p: any) => {
                    const vType = (p.patientVisitType || p.visitType || p.custom_visit_type || p.visit_type || "").toString().trim().toUpperCase();
                    const hasBedOrWard = !!(p.bedName || p.wardName || p.custom_bed_no || p.custom_ward || p.custom_bed || p.bed_no || p.ward || p.bed || p.admissionNo || p.ipdNo || p.ipd_no);
                    const isAdmitted = p.isAdmitted === true || p.is_admitted === true || (p.status || "").toString().toUpperCase().includes("ADMIT");
                    if (isIPDPage) {
                        if ((vType === "OPD" || vType === "OP" || vType.includes("OUTPATIENT")) && !hasBedOrWard && !isAdmitted) {
                            return false;
                        }
                        return true;
                    } else {
                        if ((vType === "IPD" || vType === "IP" || vType.includes("INPATIENT") || hasBedOrWard || isAdmitted) && !(vType === "OPD" || vType === "OP")) {
                            return false;
                        }
                        return true;
                    }
                });
                console.log("Search results (filtered for " + (isIPDPage ? "IPD" : "OPD") + "):", filteredPatients);
                setSearchResults(filteredPatients);
                setShowDropdown(filteredPatients.length > 0);
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
        [apiKey, apiSecret, isInitialized, showAlert, isIPDPage]
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
        setIsPatientSearched(false);
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

    useImperativeHandle(ref, () => ({
        handleSelectPatient: (patient: any) => {
            handleSelectPatient(patient);
        }
    }));

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

        const rawAge = patient.ageDisplay || patient.custom_age || patient.age || "N/A";
        let rawSex = patient.genderValue || patient.custom_gender || patient.sex || "";
        if (!rawSex || rawSex === "N/A") {
            if (rawAge && typeof rawAge === "string") {
                const upperAge = rawAge.toUpperCase();
                if (upperAge.includes("/M")) rawSex = "Male";
                else if (upperAge.includes("/F")) rawSex = "Female";
            }
        }
        if (rawSex && rawSex.toUpperCase() === "M") rawSex = "Male";
        if (rawSex && rawSex.toUpperCase() === "F") rawSex = "Female";

        const isDischargedFlag = Boolean(
            patient?.isDischarged === true ||
            patient?.isDischarged === "true" ||
            patient?.isDischarged === 1 ||
            patient?.is_discharged === true ||
            patient?.is_discharged === "true" ||
            patient?.is_discharged === 1 ||
            patient?.discharged === true ||
            patient?.discharged === "true" ||
            patient?.discharged === 1
        );

        const isFinalBillDoneFlag = Boolean(
            patient?.isFinalBillDone === true ||
            patient?.isFinalBillDone === "true" ||
            patient?.isFinalBillDone === 1 ||
            patient?.is_final_bill_done === true ||
            patient?.is_final_bill_done === "true" ||
            patient?.is_final_bill_done === 1 ||
            patient?.final_bill_done === true ||
            patient?.final_bill_done === "true" ||
            patient?.final_bill_done === 1
        );

        const isDischargedBool = isDischargedFlag || isFinalBillDoneFlag;

        const newPatientData = {
            name: patient.patientFullName || patient.custom_patient_name || patient.patient_name || patient.name || "N/A",
            age: rawAge,
            sex: rawSex || "N/A",
            phone: patient.mobileNo || patient.phoneNo || patient.custom_phone || patient.contact_mobile || patient.phone || "N/A",
            ABHAID: patient.aadharCardNo || patient.custom_aadhar || patient.ABHAID || "N/A",
            category: patient.patientCategory || patient.custom_patient_category || patient.category || "N/A",
            doctor: patient.consultingDoctor || patient.custom_doctor_name || patient.custom_doctor || patient.doctor || "N/A",
            mrn: patient.mrn || patient.custom_uhid || patient.custom_mrn || patient.custom_patient_id || "N/A",
            displayNo: patient.displayNo || patient.custom_uhid || patient.mrn || "N/A",
            dept: patient.departmentName || patient.custom_department || patient.dept || "N/A",
            visitType: patient.patientVisitType || patient.visitType || patient.custom_visit_type || patient.visit_type || "N/A",
            company: patient.patientCompany || patient.custom_patient_company || patient.company || "N/A",
            bedName: patient.bedName || patient.custom_bed_no || patient.custom_bed || patient.bed_no || patient.bed_name || patient.bed || "N/A",
            wardName: patient.wardName || patient.custom_ward || patient.custom_ward_no || patient.custom_ward_name || patient.ward || "N/A",
            visitID: patient.visitID || patient.custom_visit_code || "N/A",
            visitNo: patient.visitNumber || patient.visitNo || patient.patientVisitNo || patient.custom_visit_code || patient.visitID || "N/A",
            // Payer details from search response
            payerType: patient.payerType || patient.custom_payer_category || "",
            payerName: patient.payerName || patient.custom_payer_name || "",
            network: patient.network || patient.custom_network || "",
            insuranceNo: patient.insurnaceNo || patient.custom_insurance_no || "",
            subInsurance: patient.subInsurance || patient.custom_sub_insurance || "",
            otherNo: patient.otherNo || patient.custom_other_no || "",
            validityFrom: patient.validateFrom || patient.custom_validity_from || "",
            expiryValidityTo: patient.expiryDate || patient.custom_validity_to || "",
            hospitalId: patient.hospitalId || patient.custom_hospital || "",
            coPay: patient.co_Pay || patient.co_pay || 0,
            isDischarged: isDischargedBool,
            isSearched: true,
        };

        console.log('New patient data being set:', newPatientData);

        // Determine Self Pay status based on patient search API response data
        let isPatientSelfPay = true;
        if (patient.isSelfPaying !== undefined) {
            isPatientSelfPay = Boolean(patient.isSelfPaying);
        } else if (patient.is_self_paying !== undefined) {
            isPatientSelfPay = Boolean(patient.is_self_paying);
        } else if (patient.isSelfPaid !== undefined) {
            isPatientSelfPay = Boolean(patient.isSelfPaid);
        } else if (patient.is_self_paid !== undefined) {
            isPatientSelfPay = Boolean(patient.is_self_paid);
        } else {
            const companyVal = String(patient.patientCompany || patient.custom_patient_company || patient.company || "").trim();
            const payerNameVal = String(patient.payerName || patient.custom_payer_name || "").trim();
            const payerTypeVal = String(patient.payerType || patient.custom_payer_category || patient.patientCategory || patient.category || "").trim();
            const insuranceNoVal = String(patient.insurnaceNo || patient.insuranceNo || patient.custom_insurance_no || "").trim();

            const isNonSelfCompany = Boolean(companyVal && !["SELF", "SELF PAY", "SELF-PAY", "SELF PAID", "SELF-PAID", "CASH", "N/A", "NONE"].includes(companyVal.toUpperCase()));
            const isNonSelfPayer = Boolean(payerNameVal && !["SELF", "SELF PAY", "SELF-PAY", "SELF PAID", "SELF-PAID", "CASH", "N/A", "NONE"].includes(payerNameVal.toUpperCase()));
            const isInsurancePayerType = Boolean(payerTypeVal && !["SELF", "SELF PAY", "SELF-PAY", "SELF PAID", "SELF-PAID", "CASH", "N/A", "NONE"].includes(payerTypeVal.toUpperCase()));
            const hasInsuranceNo = Boolean(insuranceNoVal && insuranceNoVal !== "N/A");

            if (isNonSelfCompany || isNonSelfPayer || isInsurancePayerType || hasInsuranceNo) {
                isPatientSelfPay = false;
            } else {
                isPatientSelfPay = true;
            }
        }

        handleSelfPayingChange(isPatientSelfPay);

        setIsPatientSearched(true);
        setEditedPatient(newPatientData);
        if (onPatientChange) {
            onPatientChange(newPatientData, patient);
        }

        // Auto-set hospital based on patient's hospitalId
        if (patient.hospitalId && setSelectedBranch) {
            // Find the branch where custom_hospital_id matches patient.hospitalId
            // Branches might not be populated if this is called early, so we also use a useEffect
            const matchingBranch = branches.find((b: any) => b.custom_hospital_id === patient.hospitalId);
            if (matchingBranch) {
                setSelectedBranch(matchingBranch.value);
            }
        }

        // Auto-set customer based on patient's payer/company or default to self-paid
        if (setSelectedCustomer && customers.length > 0) {
            const candidates = [
                patient.payerName,
                patient.custom_payer_name,
                newPatientData.payerName,
                patient.patientCompany,
                patient.custom_patient_company,
                newPatientData.company,
                patient.customer,
                patient.custom_customer,
                patient.company,
                patient.payerType,
                patient.custom_payer_category,
            ].filter((val): val is string => Boolean(val && typeof val === 'string' && val.trim() !== '' && val.trim() !== 'N/A'));

            let matchingCustomer: any = null;
            for (const candidate of candidates) {
                const trimmedCandidate = candidate.trim().toUpperCase();
                matchingCustomer = customers.find((customer: any) =>
                    String(customer.label || '').trim().toUpperCase() === trimmedCandidate ||
                    String(customer.value || '').trim().toUpperCase() === trimmedCandidate ||
                    String(customer.name || '').trim().toUpperCase() === trimmedCandidate
                );
                if (matchingCustomer) break;
            }

            if (matchingCustomer) {
                setSelectedCustomer(matchingCustomer.value);
                console.log('Set customer to matching payer/company:', matchingCustomer.value);
            } else if (isPatientSelfPay) {
                // Only default to self-paid if patient is self-paying
                const defaultSelfPaidCustomer = customers.find((customer: any) => customer.isSelfPaid);
                if (defaultSelfPaidCustomer) {
                    setSelectedCustomer(defaultSelfPaidCustomer.value);
                    console.log('Patient is self-paying, set customer to default self-paid:', defaultSelfPaidCustomer.value);
                }
            } else {
                console.log('Patient is non-self-paying and no matching payer customer was found; preserving customer without defaulting to self-paid.');
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

        const displayName = newPatientData.name !== "N/A" ? newPatientData.name : patient.patientFullName || patient.name || "";
        const displayMRN = newPatientData.mrn !== "N/A" ? newPatientData.mrn : patient.mrn || "";
        setSearchValue(displayName ? `${displayName}${displayMRN ? ` (${displayMRN})` : ''}` : '');
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
                    custom_hospital_id: branch.custom_hospital_id,
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

    const _handleCustomerChange = useCallback(
        (value: string) => {
            setSelectedCustomer?.(value);
        },
        [setSelectedCustomer]
    );

    const _handleCompanyChange = useCallback(
        (value: string) => {
            _setSelectedCompany?.(value);
        },
        [_setSelectedCompany]
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


    // Auto-select hospital when branches load if a patient with hospitalId is already selected
    useEffect(() => {
        if (editedPatient.hospitalId && branches.length > 0 && setSelectedBranch && !selectedBranch) {
            const matchingBranch = branches.find(b => b.custom_hospital_id === editedPatient.hospitalId);
            if (matchingBranch) {
                setSelectedBranch(matchingBranch.value);
            }
        }
    }, [editedPatient.hospitalId, branches, setSelectedBranch, selectedBranch]);

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
                    {/* <div className='flex flex-row gap-2'>
                        <Tags variant="tag" tagText="Medical Legal Case" type="cyan" border />
                        <Tags variant="tag" tagText="No Coverage" type="warning" border />
                    </div> */}
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
                                                                {(patient.isDischarged === true || patient.isDischarged === "true" || patient.isDischarged === 1 || patient.is_discharged === true || patient.is_discharged === "true" || patient.is_discharged === 1 || patient.discharged === true || patient.discharged === "true" || patient.discharged === 1 || patient.isFinalBillDone === true || patient.isFinalBillDone === "true" || patient.isFinalBillDone === 1 || patient.is_final_bill_done === true || patient.is_final_bill_done === "true" || patient.is_final_bill_done === 1 || patient.final_bill_done === true || patient.final_bill_done === "true" || patient.final_bill_done === 1) && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                                                        Discharged
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
                                    disabled={isPatientSearched}

                                />
                            </div>
                        </div>
                    </div>
                    <InfoRow
                        icon="assets/icons/Building.svg"
                        label="Customer Name"
                        value={editedPatient.name === "N/A" ? "" : editedPatient.name || ''}
                        onChange={(value) => handleFieldChange('name', value)}
                        disabled={isPatientSearched}
                    />
                    <div className='flex flex-row h-8 items-center justify-between border-none border-0 border-input-none'>
                        <div className='flex flex-row gap-1 items-center'>
                            <Image src="assets/icons/Cash.svg" width={16} height={16} alt="Self Pay" />
                            <span className='text-[#1C2024] text-xs font-normal'>Self Pay</span>
                        </div>
                        <div className="flex items-center justify-end w-[120px]">
                            <Checkbox
                                id="selfPay"
                                checked={localSelfPaying}
                                onCheckedChange={(checked) => handleSelfPayingChange(!!checked)}
                                disabled={isPatientSearched}
                            />
                        </div>
                    </div>
                    <InfoRow
                        icon="assets/icons/Cake.svg"
                        label="Gender"
                        value={editedPatient.sex === "N/A" ? "" : editedPatient.sex}
                        selectValue={editedPatient.sex === "N/A" ? "" : editedPatient.sex}
                        onSelectChange={(value) => handleFieldChange('sex', value)}
                        selectOptions={sexOptions}
                        disabled={isPatientSearched}
                    />
                    {/* This is the row for Age */}
                    <InfoRow
                        icon="assets/icons/Cake.svg"
                        label="Age"
                        value={editedPatient.age === "N/A" ? "" : editedPatient.age}
                        onChange={(value) => handleFieldChange('age', value)}
                        disabled={isPatientSearched}
                    />
                    <InfoRow
                        icon="assets/icons/Id.svg"
                        label="Visit No"
                        value={editedPatient.visitNo === "N/A" ? "" : editedPatient.visitNo || editedPatient.visitID || ''}
                        onChange={(value) => handleFieldChange('visitNo', value)}
                        disabled={isPatientSearched}
                    />
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
                                        disabled={isPatientSearched}
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
                                    disabled={isPatientSearched}
                                />
                            </div>
                        </div>
                    </div>

                    <InfoRow
                        icon="assets/icons/DoorEnter.svg"
                        label="Visit Type"
                        value={editedPatient.visitType === "N/A" ? "" : editedPatient.visitType || ''}
                        onChange={(value) => handleFieldChange('visitType', value)}
                        disabled={isPatientSearched}
                    />
                    <InfoRow
                        icon="assets/icons/FirstAidKit.svg"
                        label="Consulting Doctor"
                        value={editedPatient.doctor === "N/A" ? "" : editedPatient.doctor}
                        onChange={(value) => handleFieldChange('doctor', value)}
                        selectOptions={localDoctors.map(doctor => ({ label: doctor.label, value: doctor.value }))}
                        selectValue={editedPatient.doctor === "N/A" ? "" : editedPatient.doctor}
                        onSelectChange={(value) => handleFieldChange('doctor', value)}
                        disabled={isPatientSearched}
                    />
                    <InfoRow
                        icon="assets/icons/Id.svg"
                        label="Bed Name"
                        value={editedPatient.bedName === "N/A" ? "" : editedPatient.bedName || ''}
                        onChange={(value) => handleFieldChange('bedName', value)}
                        disabled={isPatientSearched}
                    />
                    <InfoRow
                        icon="assets/icons/Id.svg"
                        label="Ward Name"
                        value={editedPatient.wardName === "N/A" ? "" : editedPatient.wardName || ''}
                        onChange={(value) => handleFieldChange('wardName', value)}
                        disabled={isPatientSearched}
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
                    company={_companies?.find((c: any) => c.value === _selectedCompany)?.label || _selectedCompany || editedPatient.company}
                    customer={customers?.find((c: any) => c.value === selectedCustomer)?.label || selectedCustomer}
                    customerName={editedPatient.name}
                    doctor={editedPatient.doctor}
                    onClose={() => setOpen(false)}
                    isReturn={isReturn}
                    onReturnStatusChange={onReturnStatusChange}
                    isSelfPaying={localSelfPaying}
                />
            </DialogContent>
        </Dialog>
    );
});

OpdCard.displayName = "OpdCard";

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
                disabled={disabled}
            />
        )}
    </div>
);