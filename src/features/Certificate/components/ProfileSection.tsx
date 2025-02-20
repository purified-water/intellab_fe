import { ICertificate } from "../types";
import { MdAccountCircle } from "rocketicons/md";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { formatDate } from "@/utils";

type ProfileSectionProps = {
  loading: boolean;
  certificate: ICertificate | null;
};

export function ProfileSection(props: ProfileSectionProps) {
  const { loading, certificate } = props;

  let content = null;
  if (loading) {
    content = (
      <div className="flex items-center p-4 space-x-2 text-lg font-bold text-white rounded-lg bg-gray5">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="mb-4 space-y-1">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex items-center p-4 space-x-2 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appSecondary">
        <MdAccountCircle className="w-24 h-24" />
        <div className="mb-4 space-y-1">
          <p className="text-xl font-bold">Completed by {certificate?.username}</p>
          <p className="text-base font-semibold">{formatDate(certificate?.completeDate ?? "")}</p>
        </div>
      </div>
    );
  }

  return content;
}
