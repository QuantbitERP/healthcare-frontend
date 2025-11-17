import React from "react";
import Image from "next/image";
import Link from "next/link";
import UserProfile from "@/components/userProfile/UserProfile";
import POSInfo from "@/components/posInfo/POSInfo";

interface PageHeaderProps {
  title: string;
  icon: string;
  rightButtons?: React.ReactNode;
  parentTitle?: string;
  parentLink?: string;
  posProfile?: string;
  warehouse?: string;
}

function PageHeader(props: PageHeaderProps) {
  const { title, icon, rightButtons } = props;
  return (
    <div style={{}} className="flex justify-between items-center p-md border-b border-[#D9D9E0] fixed top-0 right-0 bg-white w-full z-50 " >
      <div className="flex space-x-2 items-center">
        <Image src={icon} alt="Rupee icon" width={24} height={24} />
        {props.parentLink && props.parentTitle ? (
          <>
            <Link
              href={props.parentLink}
              className="font-bold text-lg text-primary "
            >
              {props.parentTitle}
            </Link>
            <span className="text-lg" >/</span>
          </>
        ) : null}
        <span className="font-bold cappitalize  text-lg">{title}</span>
        {(props.posProfile || props.warehouse) && (
          <>
            <span className="text-gray-300 mx-2">|</span>
            <POSInfo posProfile={props.posProfile} warehouse={props.warehouse} />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        
        {rightButtons}
        <UserProfile />
      </div>
    </div>
  );
}

export default PageHeader;
