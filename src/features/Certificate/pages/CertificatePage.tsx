import { useState, useEffect } from "react";
import { CourseInformationSection, LearnedSection, CertificateImage, ActionButtons } from "../components";
import { certificateAPI } from "@/lib/api";
import { ICertificate } from "../types";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_RESPONSE_CODE } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { getUserIdFromLocalStorage } from "@/utils";

export const CertificatePage = () => {
  const { id: certificateId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<ICertificate | null>(null);
  const { toast } = useToast();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const userId = getUserIdFromLocalStorage();

  const showToastSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message
    });
  };

  const showToastError = (message: string) => {
    toast({
      title: "Error",
      variant: "destructive",
      description: `Failed to download certificate: ${message}`
    });
  };

  const getCertificate = async () => {
    setLoading(true);
    if (certificateId) {
      try {
        const response = await certificateAPI.getCertificates(certificateId);
        const { code, result } = response;
        if (code === API_RESPONSE_CODE.SUCCESS) {
          setCertificate(result);
        } else {
          showToastError("Certificate not found");
        }
      } catch (error: any) {
        showToastError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getCertificate();
  }, []);

  const renderActionButtons = () => {
    if (isAuthenticated && userId === certificate?.userUid) {
      return (
        <ActionButtons
          loading={loading}
          certificateId={certificateId!}
          certificate={certificate}
          showToastError={showToastError}
          showToastSuccess={showToastSuccess}
        />
      );
    }
  };

  return (
    <div className="py-8">
      <div className="flex space-x-10 justify-center">
        <span className="space-y-4 w-[500px]">
          <CourseInformationSection loading={loading} certificate={certificate} />
          <LearnedSection loading={loading} certificate={certificate} />
        </span>
        <span className="space-y-4">
          <CertificateImage loading={loading} certificate={certificate} />
          {renderActionButtons()}
        </span>
      </div>
    </div>
  );
};
