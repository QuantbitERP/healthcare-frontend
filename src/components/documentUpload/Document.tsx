"use client";
import Image from "next/image";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for the props passed to the Document component
interface DocumentProps {
  setOpen: (value: boolean) => void;
}

const Document: React.FC<DocumentProps> = ({ setOpen }) => {
  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      <div className="w-full px-6 py-4 border-b border-b-[#D9D9E0] flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Image src={'/assets/icons/Paper.svg'} width={24} height={24} alt="Rupee" />
          <p className="text-[#1C2024] text-base font-semibold">Document Upload</p>
        </div>
        <Image
          src={'/assets/icons/CloseIcon.svg'}
          width={24}
          height={24}
          alt="Close Icon"
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="w-full flex p-6 flex-col gap-6">
        <div className="w-full h-fit border border-dashed border-[#D9D9E0] rounded-lg px-10 py-6 flex items-center justify-center">
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image src={'/assets/icons/UploadDoc.svg'} width={20} height={20} alt="Upload Icon" />
            <div className="flex flex-row gap-1 text-[#1C2024] text-xs font-medium">
              <span>Drag & Drop or</span>
              <a href="#" className="text-[#0D74CE]">
                Choose File
              </a>
              <span>to Upload</span>
            </div>
            <span className="text-[#60646C] text-[10px] font-normal">PDF, DOCX</span>
            <span className="text-[#60646C] text-[10px] font-normal">Maximum file size 10 MB</span>
          </div>
        </div>

        <span className="text-[#1C2024] text-lg font-semibold">Previous Visit Data</span>
        <div className="w-full h-fit border border-[#D9D9E0] rounded-lg flex flex-col">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-row border-b border-[#D9D9E0] overflow-hidden">
              <div className="w-full h-10 px-3 py-2 flex flex-row gap-2 items-center">
                <Skeleton className="w-4 h-4 rounded-[4px]" />
                <Skeleton className="w-full h-4 rounded-lg" />
              </div>
              <div className="w-fit h-10 px-3 py-2 flex flex-row items-center justify-start">
                <Skeleton className="w-12 h-4 rounded-lg" />
              </div>
              <div className="w-fit h-10 px-3 py-2 flex flex-row items-center">
                <Skeleton className="w-[72px] h-4 rounded-lg" />
              </div>
              <div className="w-fit h-10 px-3 py-2 flex flex-row items-center">
                <Skeleton className="w-[56px] h-4 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Document;
