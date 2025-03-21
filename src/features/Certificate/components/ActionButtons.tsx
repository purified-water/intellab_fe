import { ICertificate } from "../types";
import { Button } from "@/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";

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
        <Button
          className="px-5 py-6 rounded-lg bg-appPrimary font-bold text-base hover:bg-appPrimary/80"
          onClick={handleShareClick}
        >
          <FontAwesomeIcon icon={faShareFromSquare} />
          Share Certificate
        </Button>
        <Button
          className="px-5 py-6 rounded-lg border border-appPrimary text-base bg-white font-bold text-appPrimary hover:bg-white/75 hover:text-opacity-75 hover:border-opacity-75"
          onClick={handleDownloadClick}
        >
          <FontAwesomeIcon icon={faDownload} />
          Download Certificate
        </Button>
      </div>
    );
  }

  return content;
}
