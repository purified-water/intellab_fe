import { useState, useEffect } from "react";
import { ProfileSection, CourseInfomationSection, LearntSection, CertificateImage, ActionButtons } from "../components";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { certificateAPI } from "@/lib/api";
import { ICertificate } from "../types";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_RESPONSE_CODE } from "@/constants";

export const CertificatePage = () => {
  const { id: certificateId } = useParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<ICertificate | null>(null);
  const { toast } = useToast();

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

  const renderCourseName = () => {
    let content = null;
    if (loading) {
      content = <div className="h-12" />;
    } else {
      content = <p className="text-3xl font-bold truncate">{certificate?.course.name}</p>;
    }
    return content;
  };

  let layoutStyle;
  if (width > 1350) {
    layoutStyle = "flex justify-between space-x-8";
  } else {
    layoutStyle = "justify-between space-y-4 min-w-[600px] max-w-[550px]";
  }

  return (
    <div className="py-4 px-56 space-y-4 min-w-[600px]">
      {renderCourseName()}
      <div className={layoutStyle}>
        <div className="space-y-4 min-w-[600px] max-w-[600px]">
          <ProfileSection loading={loading} certificate={certificate} />
          <CourseInfomationSection loading={loading} certificate={certificate} />
          <LearntSection loading={loading} certificate={certificate} />
        </div>
        <div className="space-y-4">
          <CertificateImage loading={loading} certificate={certificate} />
          <ActionButtons
            loading={loading}
            certificateId={certificateId!}
            certificate={certificate}
            showToastError={showToastError}
            showToastSuccess={showToastSuccess}
          />
        </div>
      </div>
    </div>
  );
};
