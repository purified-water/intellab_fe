import { Button, Spinner } from "@/components/ui";
import { unavailableImage } from "@/assets";
import { X } from "lucide-react";

interface PreviewCertificateProps {
  certificateUrl: string | null;
  onClose: () => void;
  isLoading?: boolean;
}
export const PreviewCertificate = ({ certificateUrl, onClose, isLoading }: PreviewCertificateProps) => {
  return (
    <>
      {isLoading ? (
        <Spinner className="size-10" loading={isLoading} />
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-[750px]">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Certificate Preview</h2>
              <Button type="button" className="-mr-2" variant="ghost" size="icon" onClick={onClose}>
                <X />
              </Button>
            </div>
            <div className="border border-gray3 max-w-[750px] min-w-[300px]">
              <img
                className="object-contain"
                src={certificateUrl || unavailableImage}
                alt="Certificate"
                onError={(e) => (e.currentTarget.src = unavailableImage)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
