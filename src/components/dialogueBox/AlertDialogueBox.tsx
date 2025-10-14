"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "@/components/buttons/Button";

type AlertDialogBoxProps = {
  // setOpen: (val: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  cancelButtonText: string;
  confirmButtonText: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
};

export default function AlertDialogBox({
  title,
  description,
  cancelButtonText,
  confirmButtonText,
  onConfirm,
  trigger,
}: AlertDialogBoxProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-[300]" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[310] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-start">
            <AlertDialog.Title className="text-base font-semibold text-[#1C2024]">
              {title}
            </AlertDialog.Title>
            <AlertDialog.Cancel asChild>
              <button className="text-gray-500 hover:text-black">✕</button>
            </AlertDialog.Cancel>
          </div>

          <AlertDialog.Description className="mt-3 text-sm text-[#60646C]">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button type="secondary-button" size="button-medium">
                {cancelButtonText}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                type="danger-button"
                size="button-medium"
                onClick={() => {
                  onConfirm();
                }}
              >
                {confirmButtonText}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
