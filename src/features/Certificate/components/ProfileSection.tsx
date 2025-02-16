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
      <div className="flex items-center text-white text-lg font-bold bg-gray5 p-4 rounded-lg space-x-2">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="mb-4 space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex items-center text-white text-lg font-bold bg-gradient-to-r from-appPrimary to-appSecondary p-4 rounded-lg space-x-2">
        <MdAccountCircle className="w-24 h-24" />
        <div className="mb-4 space-y-1">
          <p className="text-xl">Completed by {certificate?.username}</p>
          <p>{formatDate(certificate?.completeDate ?? "")}</p>
        </div>
      </div>
    );
  }

  return content;
}
