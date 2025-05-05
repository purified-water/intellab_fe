import { Button } from "@/components/ui/shadcn/Button";
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
    <div className="fixed inset-0 bg-gray2 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white pt-3 pb-8 px-6 rounded-lg shadow-lg w-[500px]">
        <div className="flex justify-end">
          <Button className="-mr-2" variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>
        <div className="text-center">
          <CircleCheck className="h-12 w-12 text-appEasy mx-auto mb-8" />
          <h2 className="text-2xl font-semibold mb-2 text-gray2">Delete successfully</h2>
          <p className="text-light text-lg text-gray2 mb-12 mx-12">The course has been removed</p>
          <div className="flex justify-center space-x-4">
            <button
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
