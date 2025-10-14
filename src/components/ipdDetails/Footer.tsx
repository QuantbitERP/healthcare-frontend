import React, { useState } from 'react'
import Dialogue from "@/components/dialogueBox/DialogueBox";
import Buttons from "@/components/buttons/Button";
import Dots from "@/assets/icons/DotsVertical.svg";
// import SplitButton from "@/components/splitButton/splitButton";
import Print from "@/components/print/Print";
import Document from "@/components/documentUpload/Document";
import TransferLog from "@/components/transferLog/TransferLog";
import AddPackage from "@/components/fullBodyCheckup_service/AddPackage";
import PackageBillConversionLog from '../fullBodyCheckup_service/PackageBillConversionLog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


function Footer({}) {
  const [showDilogue, setShowDilogue] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  // const [showCancelButtons, setShowCancelButtons] = useState(true);
  const [dialogType, setDialogType] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [_visible, setVisible] = useState("true");
    const _handleClose = () => {
      setVisible("false");
    };
  return (
     <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full h-4 bg-[linear-gradient(0deg,rgba(217,217,217,0.42)_0%,rgba(217,217,217,0)_100%)] absolute bottom-16"></div>

{/* Footer */}
<Dialogue
  open={showDilogue}
  setOpen={setShowDilogue}
  showDropdown
  showTextbox
  data={[]}
/>
<Print
  open={showPrint}
  setOpen={setShowPrint}
/>
<div
  id="footer"
  className="w-full h-16 px-6 flex justify-between items-center border-y border-[#D9D9E0] fixed bottom-0 bg-white"
>
  <div className="w-fit h-fit flex items-center gap-4">
  <DropdownMenu>
      <DropdownMenuTrigger >
            <Buttons
              iconSrc={Dots}
              size="button-icon-medium"
              type="secondary-button"
              variant="icon"
            ></Buttons>
        </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="px-0 py-2 border-[#D9D9E0]">
        <DialogTrigger asChild>
          <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]" onClick={()=>setDialogType("documentUpload")}>Document Upload</DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]">Package Bill Conversion</DropdownMenuItem>
        <DialogTrigger asChild>
        <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]" onClick={()=>setDialogType("addPackage")} >Add Package</DropdownMenuItem>
        </DialogTrigger>
        <DialogTrigger asChild>
        <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]" onClick={()=>setDialogType("packageBillConversionLog")} >Package Bill Conversion Log</DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]">LIS Report</DropdownMenuItem>
        <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]">RIS Report</DropdownMenuItem>
        <DialogTrigger asChild>
          <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]" onClick={()=>setDialogType("transferLog")}>Transfer Log</DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem className="h-9 rounded-none data-[highlighted]:!bg-[#E6F4FE] data-[highlighted]:!text-[#0D74CE]">Patient Dues Details</DropdownMenuItem>
      </DropdownMenuContent>
  </DropdownMenu>
  
    <Buttons
      size="button-medium"
      type="danger-button"
      variant="button"
      onClick={() => setShowDilogue(true)}
    >
      Cancel Bill
    </Buttons>
    {/* <SplitButton
      buttonText="Print"
      listItems={[
        'Print Package',
        'Print Company Bill',
        'Print Gate Pass'
      ]}
      size="medium"
      type="secondary-button"
      onClick={() => setShowPrint(true)}
    /> */}
    <Buttons
      size="button-medium"
      type="secondary-button"
      variant="button"
      onClick={() => setShowPrint(true)}
    >
      Print
    </Buttons>
  </div>
  <div className="flex flex-row gap-4 items-center text-[#60646C] text-xs font-normal whitespace-nowrap">
    {/*
    <span>Auto Saved 2s Ago</span>
    <Buttons
      size="button-medium"
      type="secondary-button"
      variant="button"
    >
      Reset
    </Buttons>
    */}
    <Buttons
      size="button-medium"
      type="primary-outlined-button"
      variant="button"
    >
      Save as Draft
    </Buttons>
    <Buttons size="button-medium" type="primary-button" variant="button">
      Finalize & Print
    </Buttons>
  </div>
</div>
<DialogContent
        className="fixed 
    w-full h-[90%] pb-10 p-0 mt-9
    shadow-none border-none max-w-none
    [&>button]:hidden"
        // visible={visible}
        // onClose={handleClose}
      >
        {/* <DialogTitle></DialogTitle> */}
        {dialogType === "documentUpload" && <Document setOpen={setOpen} />}
        {dialogType === "transferLog" && <TransferLog setOpen={setOpen} />}
        {dialogType === "addPackage" && <AddPackage setOpen={setOpen}  />}
        {dialogType === "packageBillConversionLog" && <PackageBillConversionLog setOpen={setOpen} />}
      </DialogContent>
    </Dialog>
  )
}

export default Footer
