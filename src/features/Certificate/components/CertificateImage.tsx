import { ICertificate } from "@/features/Certificate/types";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

type CertificateImageProps = {
  loading: boolean;
  certificate: ICertificate | null;
};

export function CertificateImage(props: CertificateImageProps) {
  const { loading, certificate } = props;
  let content = null;
  if (loading) {
    content = (
      <div className="flex-shrink-0">
        <Skeleton className="h-[700px] w-[900px] rounded-lg" />
      </div>
    );
  } else {
    content = (
      <div className="flex-shrink-0 border-gray3 border">
        <img className="object-contain" src={certificate?.certificateLink} alt="Certificate" />
      </div>
    );
  }

  return content;
}
