"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ToolbarItem {
  icon: string;
  command: string;
  value?: string;
  id: string;
}

interface RichTextEditorProps {
  showToolbar: boolean;
  company: string;
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ showToolbar, company, onContentChange, initialContent }) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input

  const [activeCommands, setActiveCommands] = useState<Record<string, boolean>>({});
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateUndoRedoState = useCallback(() => {
    if (typeof document !== "undefined" && document.queryCommandEnabled) {
      setCanUndo(document.queryCommandEnabled("undo"));
      setCanRedo(document.queryCommandEnabled("redo"));
    }
},[]);

  const handleInput = useCallback(() => {
    updateUndoRedoState();
    // Get the current content and call the callback
    if (contentEditableRef.current && onContentChange) {
      const content = contentEditableRef.current.innerHTML;
      onContentChange(content);
    }
  }, [updateUndoRedoState, onContentChange]); // add dependencies if needed
  

  useEffect(() => {
    updateUndoRedoState();
    const div = contentEditableRef.current;
    if (div) {
      div.addEventListener("input", handleInput);
      // Call onContentChange with initial content
      if (onContentChange) {
        onContentChange(div.innerHTML);
      }
    }
    return () => {
      if (div) {
        div.removeEventListener("input", handleInput);
      }
    };
  }, [handleInput, updateUndoRedoState, onContentChange]);

  // Effect to set initial content when it changes
  useEffect(() => {
    if (initialContent && contentEditableRef.current) {
      contentEditableRef.current.innerHTML = initialContent;
      if (onContentChange) {
        onContentChange(initialContent);
      }
    }
  }, [initialContent, onContentChange]);

  const toolbarItems: ToolbarItem[] = [
    { id: "fontSize", icon: "/assets/icons/TextSize.svg", command: "fontSize", value: "3" },
    { id: "underline", icon: "/assets/icons/Underline.svg", command: "underline" },
    { id: "bold", icon: "/assets/icons/Bold.svg", command: "bold" },
    { id: "italic", icon: "/assets/icons/Italic.svg", command: "italic" },
    { id: "link", icon: "/assets/icons/Link.svg", command: "createLink", value: "https://example.com" },
    { id: "attachment", icon: "/assets/icons/Attachment.svg", command: "custom-attachment" },
    { id: "cut", icon: "/assets/icons/CutText.svg", command: "cut" },
    { id: "copy", icon: "/assets/icons/CopyText.svg", command: "copy" },
    { id: "undo", icon: "/assets/icons/Undo.svg", command: "undo" },
    { id: "redo", icon: "/assets/icons/Redo.svg", command: "redo" },
  ];

  const handleCommandClick = (item: ToolbarItem) => {
    const { id, command, value } = item;

    if (command === "undo" || command === "redo") {
      if ((command === "undo" && !canUndo) || (command === "redo" && !canRedo)) return;
      document.execCommand(command);
      updateUndoRedoState();
      setActiveCommands((prev) => ({
        ...Object.fromEntries(Object.keys(prev).map(k => [k, false])),
        [id]: true,
      }));
      return;
    }

    if (command === "custom-attachment") {
      // Trigger hidden file input click
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return;
    }

    const isToggleCommand = ["bold", "italic", "underline"].includes(command);

    setActiveCommands((prev) => {
      const currentlyActive = prev[id] || false;
      let newState = { ...prev };

      if (isToggleCommand) {
        newState[id] = !currentlyActive;
      } else {
        newState = Object.fromEntries(Object.keys(prev).map(k => [k, false]));
        newState[id] = true;
      }
      return newState;
    });

    document.execCommand(command, false, value ?? undefined);
    updateUndoRedoState();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Example: Just read the first file name and insert it as text at caret
      const file = files[0];
      // You can customize: insert file name, or upload & insert an image etc.
      if (contentEditableRef.current) {
        const fileName = file.name;
        // Insert file name as plain text at cursor position
        document.execCommand("insertText", false, `[Attachment: ${fileName}]`);
      }
    }

    // Reset input value so same file can be selected again if needed
    e.target.value = "";
  };

  return (
    <div className="border border-[#D9D9E0] rounded-md overflow-hidden">
      {showToolbar && (
        <div className="flex flex-wrap items-center bg-[#F8F9FB] px-3 py-2 gap-2 border-b-0" onClick={(e) => e.stopPropagation()}>
          {toolbarItems.map((item) => (
            <ToolbarIcon
              key={item.id}
              icon={item.icon}
              command={item.command}
              value={item.value}
              active={!!activeCommands[item.id]}
              disabled={
                (item.command === "undo" && !canUndo) ||
                (item.command === "redo" && !canRedo)
              }
              onClick={() => handleCommandClick(item)}
            />
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div
        ref={contentEditableRef}
        contentEditable
        onClick={(e) => e.stopPropagation()}
        suppressContentEditableWarning
        className="p-4 min-h-[300px] outline-none whitespace-pre-wrap text-sm text-[#1C2024]"
      >
        {`To: ${company}
From: ABC Health Insurance Pvt. Ltd.
Subject: Confirmation of Medical Coverage

Dear Sir,

This letter serves as confirmation that [Patient’s Name] is covered under the [Insurance Plan Name] with Policy No. [XXXXXX]. The coverage includes [brief coverage details, e.g., hospitalization, outpatient care, etc.].

For any claims or further assistance, please contact us at [Contact Details] or visit [Website].

Sincerely,
Priya Deshmukh
Claims Manager
ABC Health Insurance Pvt. Ltd.`}
      </div>
    </div>
  );
};

interface ToolbarIconProps {
  icon: string;
  command: string;
  value?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const ToolbarIcon: React.FC<ToolbarIconProps> = ({
  icon,
  command,
  // value,
  disabled,
  active,
  onClick,
}) => {
  const baseClasses = "p-1 rounded cursor-pointer transition-colors duration-200";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const activeClasses = active ? "bg-gray-200" : "";

  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      aria-label={command}
      onClick={handleClick}
      className={`${baseClasses} ${disabledClasses} ${activeClasses} hover:bg-gray-200`}
      disabled={disabled}
    >
      <Image src={icon} alt={command} width={16} height={16} />
    </button>
  );
};

export default RichTextEditor;
