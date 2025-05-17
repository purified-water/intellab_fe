import { Button } from "@/components/ui";
import { X, CircleAlert } from "lucide-react";
import { useEffect } from "react";

interface DeleteCourseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteCourseConfirmDialog(props: DeleteCourseConfirmDialogProps) {
  const { isOpen, onClose, onDelete } = props;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray2">
      <div className="bg-white pt-3 pb-8 px-6 rounded-lg shadow-lg w-[550px]">
        <div className="flex justify-end">
          <Button className="-mr-2" variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>
        <div className="text-center">
          <CircleAlert className="w-12 h-12 mx-auto mb-8 text-appHard" />
          <h2 className="mb-2 text-2xl font-semibold text-gray2">You are about to delete the problem</h2>
          <p className="mx-12 mb-12 text-lg text-light text-gray2">
            This action is irreversible. Once the problem is deleted, it cannot be recovered.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-appPrimary text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-opacity-80 w-[150px]"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="border-appHard border text-appHard font-semibold text-lg px-4 py-2 rounded-lg hover:opacity-80 w-[150px]"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
