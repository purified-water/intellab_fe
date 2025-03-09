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
        <Skeleton className="h-[550px] w-[750px] rounded-lg" />
      </div>
    );
  } else {
    content = (
      <div className="border border-gray3 max-w-[750px] min-w-[300px]">
        <img className="object-contain" src={certificate?.certificateLink} alt="Certificate" />
      </div>
    );
  }

  return content;
}
