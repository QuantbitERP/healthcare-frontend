import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/buttons/Button";

interface DeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
}

export function DeleteDialog({
  open,
  setOpen,
  onConfirm,
  message = "This action will delete 1 row. This action cannot be undone",
  title = "Delete Confirmation",
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
          <DialogTitle>{title}?</DialogTitle>
       
        <div className="mb-4 text-sm opacity-50">{message}</div>
        <DialogFooter>
          <Button type="secondary-button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="danger-button" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 