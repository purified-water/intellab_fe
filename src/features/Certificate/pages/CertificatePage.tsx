import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DEFAULT_AVATAR from "@/assets/sample/avatar.png";
import { Button } from "@/components/ui/Button";
import { Category } from "../components";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { certificateAPI } from "@/lib/api";
import { IGetCertificateResponse } from "../types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { MdAccountCircle } from "rocketicons/md";
import jsPDF from "jspdf";

export const CertificatePage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<IGetCertificateResponse | null>(null);
  const navigation = useNavigate();

  const getCertificate = async () => {
    setLoading(true);
    if (courseId) {
      try {
        const response = await certificateAPI.getCertificates(courseId);
        setCertificate(response);
      } catch (error) {
        console.log("--> Error fetching certificate", error);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getCertificate();
  }, []);

  const renderProfileSection = () => {
    return (
      <div className="flex items-center text-white text-xl font-bold bg-gradient-to-r from-appPrimary to-appSecondary p-4 rounded-lg space-x-2">
        <MdAccountCircle className="w-24 h-24" />
        <div className="mb-4 space-y-1">
          <p className="text-2xl">Completed by {certificate?.finished_by}</p>
          <p>{certificate?.finished_date}</p>
        </div>
      </div>
    );
  };

  const renderCourseInformation = () => {
    const handleCouseNameClick = () => {
      navigation(`/course/${certificate?.course.id}`);
    };

    return (
      <div className="flex space-x-4 items-center text-sm">
        <p className="text-lg underline hover:text-appPrimary cursor-pointer" onClick={handleCouseNameClick}>
          {certificate?.course.name}
        </p>
        <span className="px-2 py-1 text-white bg-black rounded-full text-xs">⭐ {certificate?.course.rating}</span>
        <span> • {certificate?.course.reviews} reviews</span>
      </div>
    );
  };

  const renderLearntSection = () => {
    return (
      <div className="border border-gray4 py-4 px-8 rounded-lg space-y-4">
        <p className="font-bold text-2xl">What you have learnt</p>
        <section className="flex space-x-4 overflow-auto">
          {certificate?.course.categories.map((category, index) => (
            <Category key={index} category={category.category_name} />
          ))}
        </section>
      </div>
    );
  };

  const renderCertificateImage = () => {
    return (
      <div className="flex-shrink-0 border-gray3 border">
        <img className="object-contain" src={certificate?.certificate_file_link} alt="Certificate" />
      </div>
    );
  };

  const renderActionButtons = () => {
    const handleShareClick = () => {};

    const handleDownloadClick = async () => {
      const fileName = `${certificate?.course.name}_Certificate.pdf`;
      if (certificate?.certificate_file_link) {
        const img = new Image();
        img.src = certificate.certificate_file_link;
        img.onload = () => {
          console.log(`Image loaded: ${img.width} x ${img.height}`);
          const pdf = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "px",
            format: [img.width, img.height]
          });
          pdf.addImage(img, "PNG", 0, 0, img.width, img.height);
          pdf.save(fileName);
        };
      }
    };

    return (
      <div className="flex space-x-3">
        <Button
          className="px-5 py-6 rounded-lg bg-appPrimary font-bold text-lg hover:bg-appSecondary"
          onClick={handleShareClick}
        >
          <FontAwesomeIcon icon={faShareFromSquare} />
          Share Certificate
        </Button>
        <Button
          className="px-5 py-6 rounded-lg border border-appPrimary text-lg bg-white font-bold text-appPrimary hover:text-white"
          onClick={handleDownloadClick}
        >
          <FontAwesomeIcon icon={faDownload} />
          Download Certificate
        </Button>
      </div>
    );
  };

  let layoutStyle;
  if (width > 1100) {
    layoutStyle = "flex justify-between space-x-8";
  } else {
    layoutStyle = "justify-between space-y-4 min-w-[600px] max-w-[550px]";
  }

  let content = null;
  if (loading) {
    content = <div>Loading...</div>;
  } else {
    content = (
      <div className="py-4 px-56 space-y-4">
        <p className="text-3xl font-bold truncate">{certificate?.course.name}</p>
        <div className={layoutStyle}>
          <div className="space-y-4 min-w-[600px] max-w-[600px]">
            {renderProfileSection()}
            {renderCourseInformation()}
            {renderLearntSection()}
          </div>
          <div className="space-y-4">
            {renderCertificateImage()}
            {renderActionButtons()}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
