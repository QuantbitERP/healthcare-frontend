import React, { useState } from "react";
import Image from "next/image";
import Avatar from "react-avatar";
import Button from "../buttons/Button";
import PatientDetailsCard from "@/components/patientDetailsCardIPD/PatientDetailsCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tags from "@/components/statusTags/Tags";
import Company from "@/components/companyDetails/CompanyDetails";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Pipe from "@/assets/icons/DividerVertical.svg";
import LastVisitCard from "../patientDetailsCardIPD/LastVisitCard";

interface PatientCardProps {
  name?: string;
  ward?: string;
  doctor?: string;
  category?: string;
  company?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({
  name = "Neha Deshmukh",
  ward = "E/21/12",
  doctor = "Dr. Priya Iyer",
  category = "Concessional",
  company = "Tata Steel",
}) => {
  const [Open, setOpen] = useState<boolean>(false);
  // const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<string | null>(null);
  const [detailsCardOpen, setDetailsCardOpen] = useState(false);
  const [lastVisitCardOpen, setLastVisitCardOpen] = useState(false);

  // const toggleDropdown = (dropdownName: string) => {
  //   setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  // };

  return (
    <div>
      <Dialog open={Open} onOpenChange={setOpen}>
        <div className="flex flex-col w-[256px] h-fit gap-4 p-4 rounded-lg border border-[#D9D9E0] bg-[#FFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2">
              <span className="w-[208px] text-[#60646C] text-xs font-normal">
                Visit Information
              </span>
              <div className="flex flex-row gap-2 items-center">
                <Avatar
                  name={name.charAt(0)}
                  size="24"
                  round={true}
                  textSizeRatio={2}
                />
                <span className="text-[#0D74CE] text-sm font-semibold">
                  {name}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Tags
                  variant="tag"
                  tagText="Medical Legal Case"
                  type="cyan"
                  border
                />
                <Tags variant="tag" tagText="Insured" type="warning" border />
              </div>
              <Tags
                variant="tag"
                tagText="Package Patient"
                type="teal"
                border
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row h-8 items-center justify-between">
              <div className="flex flex-row gap-1">
                <Image
                  src={"assets/icons/Cake.svg"}
                  width={16}
                  height={16}
                  alt="Cake"
                />
                <span className="w-full text-[#1C2024] text-xs font-normal">
                  Ward/Room/Bed
                </span>
              </div>
              <span className="text-[#1C2024] text-xs font-semibold">
                {ward}
              </span>
            </div>

            <div className="flex flex-row h-8 items-center justify-between">
              <div className="flex flex-row gap-1 w-fit whitespace-nowrap items-center">
                <Image
                  src={"assets/icons/FirstAidKit.svg"}
                  width={16}
                  height={16}
                  alt="FirstAidKit"
                />
                <span className=" text-[#1C2024] text-xs font-normal">
                  Doctor
                </span>
              </div>
              <span className="text-[#1C2024] font-medium text-xs">
                {doctor}
              </span>
            </div>

            <div className="flex flex-row h-8 items-center justify-between">
              <div className="flex flex-row gap-1">
                <Image
                  src={"assets/icons/Cash.svg"}
                  width={16}
                  height={16}
                  alt="Cash"
                />
                <span className="w-full text-[#1C2024] text-xs font-normal">
                  Class
                </span>
              </div>
              <span className="text-[#1C2024] font-medium text-xs">
                {category}
              </span>
            </div>
            <div className="flex flex-row h-8 items-center justify-between">
              <div className="flex flex-row gap-1 w-[142px]">
                <Image
                  src={"assets/icons/Building.svg"}
                  width={16}
                  height={16}
                  alt="Cash"
                />
                <span className=" text-[#1C2024] text-xs font-normal">
                  Company
                </span>
              </div>
              <DialogTrigger asChild>
                <span
                  className=" font-medium text-xs cursor-pointer text-[#0D74CE]"
                  onClick={() => setDialogType("Company")}
                >
                  {company}
                </span>
              </DialogTrigger>
            </div>
            <DialogTrigger asChild>
              <div className="w-fit h-fit flex justify-start gap-2">
                <Button
                  size="link-size"
                  type="link-secondary"
                  variant="link-button"
                  className="cursor-pointer"
                  onClick={() => {
                    setDetailsCardOpen(true)
                    setLastVisitCardOpen(false);
                  }
                  }

                >
                  Show more
                </Button>
                <div>
                  <Image src={Pipe.src} alt="Pipe" width={0} height={29} />
                </div>
                <Button
                  size="link-size"
                  type="link-secondary"
                  variant="link-button"
                  className="cursor-pointer"
                  onClick={() => setLastVisitCardOpen(true)}
                >
                  View Last Visits
                </Button>
              </div>
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="fixed bg-transparent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-0 rounded-lg shadow-none border-none max-w-none">
          <DialogTitle asChild>
            <VisuallyHidden>Submit Bills</VisuallyHidden>
          </DialogTitle>

          {/* {/* Render Company only when no child card is open */}
          {!detailsCardOpen &&
            !lastVisitCardOpen &&
            dialogType === "Company" && <Company setOpen={setOpen} />}

          {detailsCardOpen && (
            <PatientDetailsCard onClose={() => setDetailsCardOpen(false)} />
          )}
          {lastVisitCardOpen && (
            <LastVisitCard onClose={() => setLastVisitCardOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientCard;
