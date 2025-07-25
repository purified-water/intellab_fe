import { Button } from "@/components/ui";
import { X, CircleCheck } from "lucide-react";
import { useEffect } from "react";

interface DeleteSuccessfulDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteSuccessfulDialog(props: DeleteSuccessfulDialogProps) {
  const { isOpen, onClose } = props;

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
      <div className="bg-white pt-3 pb-8 px-6 rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-end">
          <Button type="button" className="-mr-2" variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>
        <div className="text-center">
          <CircleCheck className="w-12 h-12 mx-auto mb-8 text-appEasy" />
          <h2 className="mb-2 text-2xl font-semibold text-gray2">Delete successfully</h2>
          <p className="mx-12 mb-12 text-lg text-light text-gray2">The course has been removed</p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="bg-appPrimary text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-opacity-80 w-[150px]"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
