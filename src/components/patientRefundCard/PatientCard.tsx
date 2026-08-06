import React, { useState } from 'react';
import Image from 'next/image';
import Avatar from 'react-avatar';
import Button from '../buttons/Button';
import PatientDetailsCard from '../patientDetailsCardIPD/PatientDetailsCard';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Tags from '@/components/statusTags/Tags';

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
}

const PatientCard: React.FC<PatientCardProps> = ({
  name = 'Neha Deshmukh',
  age = '28',
  sex = 'Female',
  phone = '+91-9096396014',
  ABHAID = '12-2456-7544-2485',
  category = 'Corporate',
  company = 'Tata Motors',
  visitType = 'OPD',
  doctor = 'Dr. Priya Iyer',
}) => {
  const [open, setOpen] = useState<boolean>(false);
  // const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // const toggleDropdown = (dropdownName: string) => {
  //   setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className='flex flex-col w-[256px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'>
        <div className='flex flex-col gap-2'>
          <div className='w-full flex flex-col gap-2'>
            <span className='w-[208px] text-[#60646C] text-xs font-normal'>Visit Information</span>
            <div className='flex flex-row gap-2 items-center'>
              <Avatar name={name.charAt(0)} size="24" round={true} textSizeRatio={2} />
              <span className='text-[#0D74CE] text-sm font-semibold'>{name}</span>
            </div>
          </div>
          <div className='flex flex-row gap-2'>
            <Tags variant="tag" tagText="Medical Legal Case" type="cyan" border />
            <Tags variant="tag" tagText="No Coverage" type="warning" border />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <InfoRow icon="assets/icons/Cake.svg" label="Age / Gender" value={`${age} / ${sex.charAt(0).toUpperCase()}`} />
          <InfoRow icon="assets/icons/Phone.svg" label="Contact" value={phone} />
          <InfoRow icon="assets/icons/Id.svg" label="ABHA ID" value={ABHAID} />
          <InfoRow icon="assets/icons/Cash.svg" label="Category" value={category} />
          <InfoRow icon="assets/icons/Building.svg" label="Company" value={company} />
          <InfoRow icon="assets/icons/DoorEnter.svg" label="Visit Type" value={visitType} />
          <InfoRow icon="assets/icons/FirstAidKit.svg" label="Referral Doctor" value={doctor} />

          <DialogTrigger asChild>
            <div className='w-fit h-fit flex justify-start'>
              <Button size="link-size" type="link-secondary" variant="link-button" className="cursor-pointer">
                Show more
              </Button>
            </div>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit p-0 rounded-lg shadow-none border-none [&>button]:hidden max-w-none">
        <PatientDetailsCard setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default PatientCard;

// Reusable InfoRow component for cleaner JSX
interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className='flex flex-row h-8 items-center justify-between'>
    <div className='flex flex-row gap-1'>
      <Image src={icon} width={16} height={16} alt={label} />
      <span className='text-[#1C2024] text-xs font-normal'>{label}</span>
    </div>
    <span className='text-[#1C2024] text-xs font-semibold'>{value}</span>
  </div>
);
