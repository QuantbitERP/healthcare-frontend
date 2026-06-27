"use client";
import React, { useState, useRef, UIEventHandler, useEffect, useMemo } from "react";
import Image from "next/image";


import Buttons from "@/components/buttons/Button";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { SubmitDataTable } from "@/components/submittedBillsTable/SubmittedBillsTable";
import InfoRowItem from "./InfoRowItem";
import SelectInput from "@/components/form/Select";

import { columns as getColumns, BillRow } from "./BillTableData";
import { useSubmitBills } from "@/hooks/useSubmitBills";
import { useCoverLetters } from "@/hooks/useCoverLetters";
import { useCoverLetterContent } from "@/hooks/useCoverLetterContent";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCoverLetterFields } from "@/store/cover_letter/thunk";
import { API_VERSION, API_TENANT } from "@/utils/constants";
import { TableDataType } from "@/sections/invoicing/tableData";
import { Label } from "@radix-ui/react-label";

// Custom CSS for Quill tooltip positioning
const quillTooltipStyles = `
  .ql-tooltip {
    left: 0 !important;
  }
  
  .ql-size {
    width: auto;
    height: auto;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 12px;
  }
  
  .ql-size select {
    border: none;
    background: transparent;
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .ql-size select:hover {
    background-color: #f3f4f6;
  }
  
  .ql-size select:focus {
    outline: none;
    background-color: #e5e7eb;
  }
  
  /* Prevent focus issues */
  .ql-editor {
    outline: none;
  }
  
  .ql-editor:focus {
    outline: none;
  }
  
  /* Ensure ReactQuill wrapper is properly initialized */
  .react-quill-wrapper {
    position: relative;
  }
  
  .react-quill-wrapper .ql-container {
    border: none;
  }
  
  .react-quill-wrapper .ql-editor {
    padding: 12px;
    min-height: 300px;
  }
`;

const modules = {
  toolbar: {
    container: "#toolbar"
  }
};

const formats = [
  'font',
  'size',
  'color',
  'bold',
  'italic',
  'underline',
  'link',
];

function CustomToolbar({ onUndo, onRedo, _onCut, _onCopy, onAttachment, onAddLink, onRemoveLink, _quillRef }: {
  onUndo: () => void;
  onRedo: () => void;
  _onCut: () => void;
  _onCopy: () => void;
  onAttachment: () => void;
  onAddLink: () => void;
  onRemoveLink: () => void;
  _quillRef: React.RefObject<any>;
}) {

  return (
    <TooltipProvider>
      <div id="toolbar" className="flex items-center space-x-4 border p-2  rounded-md bg-white">
        <div className="flex gap-2 border-r border-border " >
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ql-bold p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Image src="assets/icons/fontBold.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Bold</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ql-italic p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Image src="assets/icons/fontItalic.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Italic</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ql-underline p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Image src="assets/icons/Underline.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Underline</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2 border-r border-border">
          <span className="ql-formats">
            <select className="ql-size">
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="huge">Huge</option>
            </select>
          </span>
        </div>
        <div className="flex gap-2 border-r border-border ">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAttachment}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/UploadDoc.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Add Attachment</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAddLink}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/fontLink.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Add Link</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRemoveLink}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/fontUnlink.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Remove Link</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2 border-r border-border ">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => document.execCommand('cut')}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/fontCut.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Cut</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => document.execCommand('copy')}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/fontCopy.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Copy</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRedo}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/fontRedo.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Redo</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onUndo}
                className="p-1 rounded hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image src="assets/icons/fontUndo.svg" alt={""} width={20} height={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 text-zinc-50 text-xs px-3 py-1.5 rounded-md">
              <p>Undo</p>
              <TooltipArrow className="fill-zinc-900" />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface SubmitBillModalProps {
  department?: string;
  onClose: () => void;
  setAlertType?: (type: "submit" | string) => void;
  selectedBills: TableDataType[]; // Selected bills from the main table
}

interface CoverLetterOption {
  label: string;
  value: string;
}

const SubmitBillModal: React.FC<SubmitBillModalProps> = ({
  onClose,
  setAlertType,
  selectedBills,
}) => {
  // Add CSS styles for ReactQuill
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = quillTooltipStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const coverLetterFilter = useSelector((state: RootState) => state.coverLetter.filter);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const [_isEditingCoverLetter, setIsEditingCoverLetter] = useState(true);
  const [coverLetterId, setCoverLetterId] = useState("");
  const [remarks, setRemarks] = useState("Payment received. Thank you!");
  const [submissionRefNo, _setSubmissionRefNo] = useState("");
  const [coverLetterContents, setCoverLetterContents] = useState("");
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);

  // ReactQuill specific state
  const quillRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const [fieldPickerPosition, setFieldPickerPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState<number | null>(null); // Default to today's date

  // Use submit bills hook
  const { submitBills, loading: submitLoading, error: submitError, success: submitSuccess } = useSubmitBills();

  // Use cover letters hook
  const { coverLetters, loading: coverLetterLoading, error: coverLetterError } = useCoverLetters();

  // Use cover letter content hook
  const { coverLetterContent, loading: contentLoading, error: contentError } = useCoverLetterContent(coverLetterId);

  // Validation function for selected bills
  const validateBillsForSubmission = (bills: TableDataType[]) => {
    if (bills.length === 0) return { valid: false, error: "No bills selected" };

    const firstBill = bills[0];
    const allSameCompany = bills.every(bill => bill.company === firstBill.company);

    if (!allSameCompany) return { valid: false, error: "All bills must be from the same company" };

    return { valid: true };
  };

  // Use API data for cover letters, fallback to empty array if loading or error
  const coverLetterOptions: CoverLetterOption[] = useMemo(() => {
    return coverLetterLoading || coverLetterError
      ? []
      : coverLetters.map(coverLetter => ({
        label: coverLetter.value,
        value: coverLetter.key, // Using the key as value for API submission
      }));
  }, [coverLetters, coverLetterLoading, coverLetterError]);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    setShowGradient(!isAtBottom);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(document.activeElement)
      ) {
        setIsEditingCoverLetter(false);
      }
    }, 0);
  };

  // ReactQuill toolbar handlers
  const handleUndo = () => {
    try {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.history.undo();
      }
    } catch {
    }
  };

  const handleRedo = () => {
    try {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        editor.history.redo();
      }
    } catch {
    }
  };

  const handleAttachment = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle file attachment logic here
      }
    };
    input.click();
  };

  const handleAddLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      try {
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection();
          if (range) {
            editor.formatText(range.index, range.length, 'link', url);
          }
        }
      } catch {
      }
    }
  };

  const handleRemoveLink = () => {
    try {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        const range = editor.getSelection();
        if (range) {
          editor.formatText(range.index, range.length, 'link', false);
        }
      }
    } catch {
    }
  };

  const transformedData = useMemo((): BillRow[] => {
    // Transform selected bills to BillRow format
    return selectedBills.map((bill, index) => ({
      billId: bill.invId || bill.id || bill.billId || `bill-${index}`, // Use most unique identifier
      billNo: bill.billNo,
      billDate: bill.billDateandTime || '',
      ipNo: bill.uhid, // Using UHID as IP number
      claimNo: bill.claimSendNo,
      patientName: bill.patient,
      totalAmount: bill.billAmount,
      priorAuthId: bill.priorAuthId || '',
    }));
  }, [selectedBills]);

  const [tableData, setTableData] = useState<BillRow[]>(transformedData);

  useEffect(() => {
    setTableData(transformedData);
  }, [transformedData]);

  // Function to remove a bill from the table
  const handleRemoveBill = (billId: string) => {
    setTableData(prevData => prevData.filter(bill => bill.billId !== billId));
  };

  // Set default cover letter when options load
  useEffect(() => {
    if (coverLetterOptions.length > 0 && !coverLetterId) {
      setCoverLetterId(coverLetterOptions[0].value);
    }
  }, [coverLetterOptions, coverLetterId]);

  // Auto-populate cover letter content when it's loaded
  useEffect(() => {
    if (coverLetterContent?.coverLetterFormatResult) {
      setCoverLetterContents(coverLetterContent.coverLetterFormatResult);
    }
  }, [coverLetterContent]);

  // Clear content when cover letter ID changes (before new content loads)
  useEffect(() => {
    if (coverLetterId) {
      setCoverLetterContents('');
    }
  }, [coverLetterId]);

  // Focus search input when field picker is shown
  useEffect(() => {
    if (showFieldPicker && searchInputRef.current) {
      // Use setTimeout to ensure the DOM is ready
      setTimeout(() => {
        try {
          if (searchInputRef.current && typeof searchInputRef.current.focus === 'function') {
            searchInputRef.current.focus();
          }
        } catch {
          // Silently handle focus errors
        }
      }, 0);
    }
  }, [showFieldPicker]);

  // Fetch cover letter fields on component mount
  useEffect(() => {
    dispatch(fetchCoverLetterFields({
      version: API_VERSION,
      tenant: API_TENANT
    }));
  }, [dispatch]);

  // Handle click outside field picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const fieldPicker = target.closest('.field-picker');
      const editor = target.closest('.ql-editor');
      const toolbar = target.closest('#toolbar');

      // Close if clicked outside field picker, editor, and toolbar
      if (!fieldPicker && !editor && !toolbar) {
        setShowFieldPicker(false);
        setCursorPosition(null);
      }
    };

    if (showFieldPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFieldPicker]);

  // Validate selected bills
  const validation = validateBillsForSubmission(selectedBills);

  // Early return for invalid selection
  if (!validation.valid) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image
              src={"assets/icons/AlertCircle.svg"}
              width={24}
              height={24}
              alt="error"
            />
            <h2 className="text-lg font-semibold text-red-600">Invalid Selection</h2>
          </div>
          <p className="text-gray-700 mb-4">{validation.error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full h-[95%] bg-white rounded-t-sm shadow-xl flex flex-col animate-slideUp">
        {/* Header */}
        <div className="w-full h-fit flex items-center px-6 py-4 border-b border-[#D9D9E0] gap-2">
          <Image
            src={"assets/icons/Notepad.svg"}
            width={24}
            height={24}
            alt="notepad"
          />
          <span className="text-[#1C2024] font-semibold text-base flex-1">
            Submit Bills
          </span>
          <Buttons
            size="button-icon-small"
            type="secondary-button"
            variant="icon"
            iconSrc={"assets/icons/x.svg"}
            onClick={onClose}
            className={undefined}
          >
            {undefined}
          </Buttons>
        </div>

        {/* Body */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-54 py-4 flex flex-col gap-6 no-scrollbar"
        >
          {/* Invoice Info */}
          <div className="flex flex-col w-full border border-[#D9D9E0] rounded-md text-sm">
            <div className="flex w-full border-b border-[#D9D9E0]">
              <InfoRowItem
                icon={"assets/icons/Hashtag.svg"}
                label="Selected Bills"
                value={`${selectedBills.length} bills selected`}
              />
              <InfoRowItem
                icon={"assets/icons/DateAdded.svg"}
                label="Invoice Date"
                value={new Date().toLocaleDateString()}
              />
            </div>
            <div className="flex w-full border-b border-[#D9D9E0]">
              <InfoRowItem
                icon={"assets/icons/Company.svg"}
                label="Company"
                value={selectedBills[0]?.company || ''}
              />
              <InfoRowItem
                icon={"assets/icons/Hashtag.svg"}
                label="Total Amount"
                value={`₹${selectedBills.reduce((sum, bill) => sum + bill.billAmount, 0).toLocaleString()}`}
              />
            </div>

          </div>

          {/* Submission Date */}
          <div className="w-1/2 flex flex-col gap-2">
            <Label className="font-normal text-sm">Submission Date</Label>
            <input
              type="date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
              className="w-full h-8 px-2 py-4 text-sm border border-[#D9D9E0] rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submitted Bills Table */}
          <div className="flex flex-col gap-4">
            <div className="flex w-full gap-2 table-wrapper">
              <SubmitDataTable
                columns={getColumns(handleRemoveBill)}
                data={tableData}
              />
            </div>
            {tableData.length === 0 && (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <span>No bills remaining to submit</span>
              </div>
            )}
          </div>

          {/* Cover Letter, Submission Ref, and Remarks */}
          <div className="flex w-full justify-between gap-4 items-center">
            {/* Cover Letter Select */}
            <div
              className="flex w-1/2 items-center space-x-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex flex-col space-y-2">
                <label
                  className="font-normal text-sm"
                  htmlFor="cover-letter-select"
                >
                  Cover Letter
                </label>
                <SelectInput
                  placeholder={coverLetterLoading ? "Loading cover letters..." : "Select Cover Letter"}
                  data={coverLetterOptions}
                  value={coverLetterId}
                  onValueChange={setCoverLetterId}
                  selValue={coverLetterId}
                  className="w-full"
                />
              </div>
            </div>

            {/* Submission Reference Number */}


            {/* Remarks Input */}
            <div
              className="flex w-1/2 flex-col gap-2 text-[#1C2024] font-normal text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <label>Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Payment received. Thank you!"
                className="w-full h-10 rounded-lg px-4 py-2 bg-white border border-[#D9D9E0] placeholder:text-sm"
              />
            </div>
          </div>

          {/* Error Display */}
          {submitError && (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <Image
                  src={"assets/icons/AlertCircle.svg"}
                  width={20}
                  height={20}
                  alt="error"
                />
                <span className="text-red-700 text-sm">
                  Error: {submitError}
                </span>
              </div>
            </div>
          )}

          {/* Success Display */}
          {submitSuccess && (
            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <Image
                  src={"assets/icons/CheckCircle.svg"}
                  width={20}
                  height={20}
                  alt="success"
                />
                <span className="text-green-700 text-sm">
                  Bills submitted successfully!
                </span>
              </div>
            </div>
          )}

          {/* Cover Letter */}
          <div
            className="w-full h-[90%] py-2 rounded-md"
            ref={wrapperRef}
            onBlur={handleBlur}
            onFocus={() => setIsEditingCoverLetter(true)}
          >
            {contentLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading cover letter content...</span>
                </div>
              </div>
            ) : contentError ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-red-600 mb-2">Error loading cover letter content</div>
                  <div className="text-sm text-gray-500">{contentError}</div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-300 rounded-md p-0 overflow-hidden relative">
                <CustomToolbar
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  _onCut={() => document.execCommand('cut')}
                  _onCopy={() => document.execCommand('copy')}
                  onAttachment={handleAttachment}
                  onAddLink={handleAddLink}
                  onRemoveLink={handleRemoveLink}
                  _quillRef={quillRef}
                />
                <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50 border-b border-gray-200">
                  Type / to view and insert available fields. Click outside the dropdown and press escape to close.
                </div>
                <div className="react-quill-wrapper">
                  <ReactQuill
                    theme="snow"
                    ref={quillRef}
                    modules={modules}
                    formats={formats}
                    value={coverLetterContents}
                    onChange={(content) => {
                      setCoverLetterContents(content);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '/') {
                        e.preventDefault(); // Prevent the / from being typed
                        const editor = quillRef.current?.getEditor();
                        if (editor) {
                          try {
                            const range = editor.getSelection();
                            const currentIndex = range?.index || 0;
                            const bounds = editor.getBounds(currentIndex);

                            setCursorPosition(currentIndex);
                            setFieldPickerPosition({
                              x: bounds.left,
                              y: bounds.top + bounds.height
                            });
                            setShowFieldPicker(true);
                            setSearchTerm('');
                          } catch {
                          }
                        }
                      } else if (e.key === 'Escape' && showFieldPicker) {
                        e.preventDefault();
                        setShowFieldPicker(false);
                        setCursorPosition(null);
                      }
                    }}
                    className="min-h-[300px] text-sm"
                    readOnly={false}
                    preserveWhitespace={false}
                  />
                </div>
                {showFieldPicker && (
                  <div
                    className="field-picker absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto min-w-64"
                    style={{
                      left: `${fieldPickerPosition.x}px`,
                      top: `${fieldPickerPosition.y}px`
                    }}
                  >
                    <div className="p-2 border-b border-gray-200 bg-gray-50">
                      <div className="text-xs text-gray-600 mb-1">Available fields</div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search fields..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2">
                      <div className="max-h-48 overflow-y-auto">
                        {coverLetterFilter.fields.length > 0 ? (
                          coverLetterFilter.fields
                            .filter(field =>
                              field.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              field.value?.toLowerCase() === searchTerm.toLowerCase()
                            )
                            .map((field, _index) => (
                              <div
                                key={field.key}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                                onClick={() => {
                                  const editor = quillRef.current?.getEditor();
                                  if (editor && cursorPosition !== null) {
                                    try {
                                      const fieldText = `[${field.value}]`;
                                      editor.insertText(cursorPosition, fieldText);
                                      setShowFieldPicker(false);
                                      setCursorPosition(null);
                                    } catch {
                                    }
                                  }
                                }}
                              >
                                {field.value}
                              </div>
                            ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            {coverLetterFilter.loading ? "Loading fields..." : "No fields available"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative w-full px-6 py-3 flex justify-end items-center border-t border-[#D9D9E0] gap-4">
          {showGradient && (
            <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-[rgba(217,217,217,0.42)] to-transparent pointer-events-none z-50" />
          )}
          <Buttons
            size="button-small"
            type="secondary-button"
            variant="button"
            onClick={onClose}
            className={undefined}
            disabled={submitLoading}
          >
            Cancel
          </Buttons>
          <Buttons
            size="button-small"
            type="primary-button"
            variant="button"
            onClick={async () => {
              try {
                // Check if there are any bills remaining to submit
                if (tableData.length === 0) {
                  alert('No bills remaining for submission');
                  return;
                }

                // Convert BillRow[] to SelectedBill[] format for API submission
                const billsToSubmit = tableData.map(bill => ({
                  billId: bill.billId,
                  priorAuthId: bill.priorAuthId || '',
                  billNo: bill.billNo,
                }));

                await submitBills({
                  selectedBills: billsToSubmit,
                  company: selectedBills[0]?.companyId || '',
                  submissionRefNo,
                  remarks,
                  coverLetterContents,
                  coverLetterId: coverLetterId,
                  submissionDate: submissionDate,
                });

                // If successful, close modal and show success alert
                if (setAlertType) setAlertType("submit");
                onClose();
              } catch {
                // Error is already handled by the hook and displayed in the UI
              }
            }}
            className={undefined}
            disabled={submitLoading || tableData.length === 0}
          >
            {submitLoading ? 'Submitting...' : 'Submit Bills'}
          </Buttons>
        </div>
      </div>
    </div>
  );
};

export default SubmitBillModal;
