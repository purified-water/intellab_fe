import { PREMIUM_PACKAGES, PREMIUM_DURATION } from "@/constants";

type TPremiumStatus = {
  startDate: string;
  endDate: string;
  status: string;
  planType: (typeof PREMIUM_PACKAGES.REQUEST)[keyof typeof PREMIUM_PACKAGES.REQUEST];
  durationEnums: (typeof PREMIUM_DURATION)[keyof typeof PREMIUM_DURATION];
  durationInDays: number;
  userUid: string;
  userUuid: string;
};

export type { TPremiumStatus };
