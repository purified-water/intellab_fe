import { PREMIUM_PACKAGES, PREMIUM_DURATION } from "@/constants";

type TPremiumStatus = {
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  planType: (typeof PREMIUM_PACKAGES.REQUEST)[keyof typeof PREMIUM_PACKAGES.REQUEST];
  durationEnums: (typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION] | null;
  durationInDays: number | null;
  userUid: string;
  userUuid: string;
};

export type { TPremiumStatus };
