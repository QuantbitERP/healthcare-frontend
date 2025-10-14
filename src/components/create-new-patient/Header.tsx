import React from 'react';
import Image from 'next/image';


const Header: React.FC = () => {

  return (
    <div
      id="header"
      className="w-full h-16 p-4 flex justify-between items-center flex-shrink-0 border-b border-[#D9D9E0]"
    >
      <div className="w-fit h-fit flex flex-row items-center gap-2">
        <Image src={'/assets/icons/receipt-rupee.svg'} alt="Icon" width={24} height={24} />
        <div className="flex gap-1 text-base font-semibold">
          <span
            className="text-[#0D74CE] cursor-pointer"
          >
            Create New Patient
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
