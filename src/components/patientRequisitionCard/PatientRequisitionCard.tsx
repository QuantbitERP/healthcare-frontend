import React, { useState } from 'react';
import Image from 'next/image';
import Avatar from 'react-avatar';
import Button from '../buttons/Button';
import PatientRequisitionDetailsCard from '../patientRequisitionDetailsCard/PatientRequisitionDetailsCard';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import Tags from '@/components/statusTags/Tags';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
interface PatientCardProps {
    name: string;
    age: string;
    sex?: 'Male' | 'Female' | string;
    phone?: string;
    ABHAID?: string;
    company?: string;
    visitType?: string;
    doctor?: string;
    departmentName?: string;
    wardName?: string;
    bedName?: string;
    patientCategory: string;
    uhid: string;
    visitId: string;
    visitDateTime: string;
    registrationDate: string;
    aadhaarNo: string;
}

const PatientCard: React.FC<PatientCardProps> = ({
    name,
    age,
    phone,
    ABHAID,
    company,
    visitType,
    doctor,
    departmentName,
    wardName,
    bedName,
    patientCategory,
    uhid,
    visitId,
    visitDateTime,
    registrationDate,
    aadhaarNo,
}) => {
    const [open, setOpen] = useState<boolean>(false);

    // Fallback values
    const displayName = name || 'N/A';
    const displayAge = age || 'N/A';
    const displayPhone = phone || 'N/A';
    const displayABHAID = ABHAID || 'N/A';
    const displayCompany = company || 'N/A';
    const displayVisitType = visitType || 'N/A';
    const displayDoctor = doctor || 'N/A';
    const displayDepartmentName = departmentName || 'N/A';
    const displayWardName = wardName || 'N/A';
    const displayBedName = bedName || 'N/A';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className='flex flex-col w-[256px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'>
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex flex-col gap-2'>
                        <span className='w-[208px] text-[#60646C] text-xs font-normal'>Visit Information</span>
                        <div className='flex flex-row gap-2 items-center'>
                            <Avatar name={displayName.charAt(0)} size="24" round={true} textSizeRatio={2} />
                            <span className='text-[#0D74CE] text-sm font-semibold'>{displayName}</span>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <Tags variant="tag" tagText="Medical Legal Case" type="cyan" border />
                        <Tags variant="tag" tagText="No Coverage" type="warning" border />
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <InfoRow icon="/assets/icons/Cake.svg" label="Age / Gender" value={`${displayAge}`} />
                    <InfoRow icon="/assets/icons/Phone.svg" label="Contact" value={displayPhone} />
                    <InfoRow icon="/assets/icons/Id.svg" label="ABHA ID" value={displayABHAID} />
                    <InfoRow icon="/assets/icons/Building.svg" label="Company" value={displayCompany} />
                    <InfoRow icon="/assets/icons/DoorEnter.svg" label="Visit Type" value={displayVisitType} />
                    <InfoRow icon="/assets/icons/FirstAidKit.svg" label="Consulting Doctor" value={displayDoctor} />
                    <InfoRow icon="/assets/icons/FirstAidKit.svg" label="Department" value={displayDepartmentName} />
                    <InfoRow icon="/assets/icons/FirstAidKit.svg" label="Ward" value={displayWardName} />
                    <InfoRow icon="/assets/icons/FirstAidKit.svg" label="Bed" value={displayBedName} />
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
                <PatientRequisitionDetailsCard
                    onClose={() => setOpen(false)}
                    name={name}
                    patientCategory={patientCategory}
                    uhid={uhid}
                    visitId={visitId}
                    visitDateTime={visitDateTime}
                    registrationDate={registrationDate}
                    aadhaarNo={aadhaarNo}
                />
            </DialogContent>
        </Dialog>
    );
};

export default PatientCard;

interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
    <div className='flex flex-row h-8 items-center justify-between'>
        <div className='flex flex-row gap-1 items-center min-w-0'>
            <Image src={icon} width={16} height={16} alt={label} />
            <span className='text-[#1C2024] text-xs font-normal truncate'>{label}</span>
        </div>
        <span className='text-[#1C2024] text-xs font-semibold truncate flex-shrink-0 max-w-[150px] overflow-hidden text-overflow-ellipsis whitespace-nowrap'>
            {value}
        </span>
    </div>
);