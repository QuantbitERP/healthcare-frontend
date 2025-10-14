import React from "react";
import { ReactNode } from "react";
import Image from "next/image";


interface InfoRowItemProps {
  icon: string; 
  label: string;
  value: string | number | ReactNode;
}

const InfoRowItem: React.FC<InfoRowItemProps> = ({ icon, label, value }) => {
  return (
    <div className="w-full px-6 py-5 border-r last:border-r-0 border-[#D9D9E0] flex items-center justify-between text-sm">
      <div className="flex gap-1 items-center">
        <Image src={icon} width={16} height={16} alt={label} />
        <span className="font-normal">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default InfoRowItem;

