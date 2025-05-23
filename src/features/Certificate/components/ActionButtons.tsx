import { ICertificate } from "../types";
import { Button } from "@/components/ui/Button";

import jsPDF from "jspdf";
import { Download, Share } from "lucide-react";

type ActionButtonsProps = {
  loading: boolean;
  certificateId: string;
  certificate: ICertificate | null;
  showToastSuccess: (message: string) => void;
  showToastError: (message: string) => void;
};

export function ActionButtons(props: ActionButtonsProps) {
  const { loading, certificate, showToastError, showToastSuccess } = props;

  const handleShareClick = async () => {
    const link = window.location.href;
    await navigator.clipboard.writeText(link);
    showToastSuccess("Certificate link copied to clipboard");
  };

  const handleDownloadClick = async () => {
    const fileName = `${certificate?.course.name}_Certificate.pdf`;
    const link = certificate?.certificateLink;
    if (link) {
      const img = new Image();
      img.src = link;
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? "landscape" : "portrait",
          unit: "px",
          format: [img.width, img.height]
        });
        pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
        pdf.save(fileName);
      };
    } else {
      showToastError("Certificate not found");
    }
  };

  let content = null;
  if (!loading) {
    content = (
      <div className="flex space-x-3">
        <Button className="rounded-lg bg-appPrimary hover:bg-appPrimary/80" onClick={handleShareClick}>
          <Share />
          Share
        </Button>
        <Button
          className="bg-white border rounded-lg border-appPrimary text-appPrimary hover:bg-white/75 hover:text-opacity-75 hover:border-opacity-75"
          onClick={handleDownloadClick}
        >
          <Download />
          Download
        </Button>
      </div>
    );
  }

  return content;
}
