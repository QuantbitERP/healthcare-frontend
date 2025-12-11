"use client";
import Image from "next/image";
import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
// import { Skeleton } from "@/components/ui/skeleton";
import { useAlert } from "@/components/AlertContext/AlertContext";
import Button from "@/components/buttons/Button"; // Import the Button component

interface DocumentProps {
  setOpen: (value: boolean) => void;
  onFileSelect: (file: File) => void; // Function to pass the file back
}

const Document: React.FC<DocumentProps> = ({ setOpen, onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();

  // --- File Validation and Selection ---
  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;

    // 1. Validate Type - Accept all file types
    // No file type restrictions - accept all files

    // 2. Validate Size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      showAlert("warning", "File Too Large", "Maximum file size is 10 MB.");
      return;
    }

    // 3. Set the file
    setSelectedFile(file);
  };

  // --- Event Handlers ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0]);
    if (e.target) e.target.value = ""; // Reset input
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  // --- Submission Handler ---
  const handleDoneClick = () => {
    if (selectedFile) {
      onFileSelect(selectedFile); // Pass the file back
      setOpen(false); // Close the modal
    }
  };


  return (
    <div className="w-[640px] h-fit rounded-lg flex flex-col bg-[#FFF] border border-[#D9D9E0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.10),0px_10px_10px_0px_rgba(0,0,0,0.04)]">
      {/* Header */}
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

      {/* Main Content Area */}
      <div className="w-full flex p-6 flex-col gap-6">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="*/*"
          className="hidden"
        />

        {/* Dropzone (shown if NO file is selected) */}
        {!selectedFile && (
          <div
            className={`w-full h-fit border border-dashed border-[#D9D9E0] rounded-lg px-10 py-6 flex items-center justify-center cursor-pointer transition-colors
                        ${isDragging ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col gap-2 items-center justify-center pointer-events-none">
              <Image src={'/assets/icons/UploadDoc.svg'} width={20} height={20} alt="Upload Icon" />
              <div className="flex flex-row gap-1 text-[#1C2024] text-xs font-medium">
                <span>Drag & Drop or</span>
                <span className="text-[#0D74CE] font-semibold">Choose File</span>
                <span>to Upload</span>
              </div>
              <span className="text-[#60646C] text-[10px] font-normal">All file types supported</span>
              <span className="text-[#60646C] text-[10px] font-normal">Maximum file size 10 MB</span>
            </div>
          </div>
        )}

        {/* Selected File Info (shown if a file IS selected) */}
        {selectedFile && (
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Image
              src={'/assets/icons/CloseIcon.svg'}
              width={20}
              height={20}
              alt="Remove File"
              className="cursor-pointer p-1 rounded-full hover:bg-gray-200"
              onClick={handleRemoveFile}
            />
          </div>
        )}
      </div>

      {/* Footer with buttons */}
      <div className="w-full px-6 py-4 border-t border-t-[#D9D9E0] flex justify-end gap-3">
        <Button
          type="secondary-button"
          size="button-medium"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="primary-button"
          size="button-medium"
          onClick={handleDoneClick}
          disabled={!selectedFile} // Disable "Done" if no file is selected
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default Document;