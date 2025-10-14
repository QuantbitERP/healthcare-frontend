import React, { useState, useEffect } from 'react';
import Button from '../buttons/Button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useFrappeApi } from "@/api/api";
import SelectInput from "@/components/form/Select";
import { Label } from "@/components/ui/label";
import PosInfoCardDetails from './posInfoCardDetails';

interface PosInfoProps {
  patientData: any;
  onReturnStatusChange: (status: boolean) => void;
  isReturn: boolean;
}

const PosInfo = ({ patientData, onReturnStatusChange, isReturn }: PosInfoProps) => {
  const { fetchWarehouses, fetchCustomer, fetchCompany, fetchBranch, fetchDepartment, fetchSubDepatment } = useFrappeApi();
    const [open, setOpen] = useState<boolean>(false);
    const [warehouses, setWarehouses] = useState<{ label: string; value: string }[]>([]);
    const [customers, setCustomers] = useState<{ label: string; value: string }[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [selectedGender, setSelectedGender] = useState<string>('');
    const [companyOptionsList, setCompanyOptionsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
    const [branchOptionsList, setBranchOptionsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [departmentOptionsList, setDepartmentOptionsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [subDepartmentOptionsList, setSubDepartmentOptionsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedSubDepartment, setSelectedSubDepartment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch warehouses on component mount
    useEffect(() => {
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
    }, [fetchWarehouses]);

    // Fetch customers on component mount
    useEffect(() => {
        const loadCustomers = async () => {
            setLoading(true);
            try {
                const customerData = await fetchCustomer();
                const customerOptions = customerData.map((customer: any) => ({
                    label: customer.name || customer.customer_name || 'Unnamed Customer',
                    value: customer.name,
                }));
                setCustomers(customerOptions);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, [fetchCustomer]);

    useEffect(() => {
        const loadCompany = async () => {
            setLoading(true);
            try {
                const companyData = await fetchCompany();
                const companyOptions = companyData.map((company: any) => ({
                    label: company.name || company.customer_name || 'Unnamed Customer',
                    value: company.name,
                }));
                setCompanyOptionsList(companyOptions);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setCompanyOptionsList([]);
            } finally {
                setLoading(false);
            }
        };

        loadCompany();
    }, [fetchCompany]);

    useEffect(() => {
        const loadBranch = async () => {
            setLoading(true);
            try {
                const branchData = await fetchBranch();
                const branchOptions = branchData.map((branch: any) => ({
                    label: branch.name || branch.customer_name || 'Unnamed Customer',
                    value: branch.name,
                }));
                setBranchOptionsList(branchOptions);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setBranchOptionsList([]);
            } finally {
                setLoading(false);
            }
        };

        loadBranch();
    }, [fetchBranch]);


    useEffect(() => {
        const loadDepartment = async () => {
            setLoading(true);
            try {
                const departmentData = await fetchDepartment();
                const departmentOptions = departmentData.map((department: any) => ({
                    label: department.name,
                    value: department.name,
                }));
                setDepartmentOptionsList(departmentOptions);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setDepartmentOptionsList([]);
            } finally {
                setLoading(false);
            }
        };

        loadDepartment();
    }, [fetchDepartment]);

    useEffect(() => {
        const loadSubDepartment = async () => {
            setLoading(true);
            try {
                const subdepartmentData = await fetchSubDepatment();
                const subdepartmentOptions = subdepartmentData.map((department: any) => ({
                    label: department.name,
                    value: department.name,
                }));
                setSubDepartmentOptionsList(subdepartmentOptions);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setSubDepartmentOptionsList([]);
            } finally {
                setLoading(false);
            }
        };

        loadSubDepartment();
    }, [fetchSubDepatment]);

    const handleWarehouseChange = (value: string) => {
        setSelectedWarehouse(value);
        console.log("Selected warehouse:", value);
    };
    const handleCompanyChange = (value: string) => {
        setSelectedCompany(value);
    };
    const handleCustomerChange = (value: string) => {
        setSelectedCustomer(value);
        console.log("Selected customer:", value);
    };

    const handleGenderChange = (value: string) => {
        setSelectedGender(value);
        console.log("Selected gender:", value);
    };



    const handlePaymentTypeChange = (value: string) => {
        setSelectedPaymentType(value);
        console.log("Selected payment type:", value);
    };

    const handleBranchChange = (value: string) => {
        setSelectedBranch(value);
        console.log("Selected branch:", value);
    };

    const handleDepartmentChange = (value: string) => {
        setSelectedDepartment(value);
        console.log("Selected department:", value);
    };

    const handleSubDepartmentChange = (value: string) => {
        setSelectedSubDepartment(value);
        console.log("Selected sub-department:", value);
    };

    // Static options for new select inputs
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];

    const paymentTypeOptions = [
        { label: 'Cash', value: 'cash' },
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Insurance', value: 'insurance' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className='flex flex-col w-[256px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'>
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex flex-col gap-2'>
                        <span className='w-[208px] text-[#60646C] text-xs font-normal'>Visit Information</span>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Customer</Label>
                        <SelectInput
                            value={selectedCustomer}
                            onValueChange={handleCustomerChange}
                            data={customers}
                            placeholder={loading ? "Loading customers..." : "Select"}
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedCustomer}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Warehouse</Label>
                        <SelectInput
                            value={selectedWarehouse}
                            onValueChange={handleWarehouseChange}
                            data={warehouses}
                            placeholder={loading ? "Loading warehouses..." : "Select"}
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedWarehouse}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Gender</Label>
                        <SelectInput
                            value={selectedGender}
                            onValueChange={handleGenderChange}
                            data={genderOptions}
                            placeholder="Select"
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedGender}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Company</Label>
                        <SelectInput
                            value={selectedCompany}
                            onValueChange={handleCompanyChange}
                            data={companyOptionsList}
                            placeholder="Select"
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedCompany}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Payment Type</Label>
                        <SelectInput
                            value={selectedPaymentType}
                            onValueChange={handlePaymentTypeChange}
                            data={paymentTypeOptions}
                            placeholder="Select"
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedPaymentType}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Branch</Label>
                        <SelectInput
                            value={selectedBranch}
                            onValueChange={handleBranchChange}
                            data={branchOptionsList}
                            placeholder="Select"
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedBranch}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Department</Label>
                        <SelectInput
                            value={selectedDepartment}
                            onValueChange={handleDepartmentChange}
                            data={departmentOptionsList}
                            placeholder="Select"
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedDepartment}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='text-[#1C2024] text-xs font-normal'>Sub Department</Label>
                        <SelectInput
                            value={selectedSubDepartment}
                            onValueChange={handleSubDepartmentChange}
                            data={subDepartmentOptionsList}
                            placeholder="Select"
                            className="w-full border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            selValue={selectedSubDepartment}
                        />
                    </div>
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
                    onClose={() => setOpen(false)}
                    name={patientData?.name || "N/A"}
                    age={patientData?.age || "N/A"}
                    sex={patientData?.sex || "N/A"}
                    phone={patientData?.phone || "N/A"}
                    ABHAID={patientData?.ABHAID || "N/A"}
                    category={patientData?.category || "N/A"}
                    doctor={patientData?.doctor || "N/A"}
                    uhid={patientData?.mrn || "N/A"}
                    bedno={patientData?.bed || "N/A"}
                    visitNo={patientData?.visitID || "N/A"}
                    company={patientData?.company || "N/A"}
                    requisitionNo="N/A" // Placeholder, will be passed from page.tsx
                    debitNo="N/A" // Placeholder
                    billNo="N/A" // Placeholder
                    posProfile="N/A" // Placeholder
                    postingDate="N/A" // Placeholder
                    warehouse={selectedWarehouse || "N/A"} // Placeholder
                    priceList="Standard Selling" // Placeholder
                    currency="INR" // Placeholder
                    registrationDate="N/A" // Placeholder
                    address="N/A" // Placeholder
                    lastVisitDate="N/A" // Placeholder
                    lastVisitTime="N/A" // Placeholder
                    billingClass="N/A" // Placeholder
                    isReturn={isReturn}
                    onReturnStatusChange={onReturnStatusChange}
                />
            </DialogContent>
        </Dialog>
    );
};

// interface InfoRowProps {
//     icon: string;
//     label: string;
//     value: string;
// }

// const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
//     <div className='flex flex-row h-8 items-center justify-between'>
//         <div className='flex flex-row gap-1'>
//             <Image src={icon} width={16} height={16} alt={label} />
//             <span className='text-[#1C2024] text-xs font-normal'>{label}</span>
//         </div>
//         <span className='text-[#1C2024] text-xs font-semibold'>{value}</span>
//     </div>
// );

export default PosInfo;