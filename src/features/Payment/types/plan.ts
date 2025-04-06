import { PREMIUM_PACKAGES } from "@/constants";

type TPlan = {
  title: string;
  titleColor: string;
  monthPrice: number;
  yearPrice: number;
  eachMonthPrice?: number;
  description: string;
  perks: string[];
  requestPackage: (typeof PREMIUM_PACKAGES.REQUEST)[keyof typeof PREMIUM_PACKAGES.REQUEST];
  responsePackage: (typeof PREMIUM_PACKAGES.RESPONSE)[keyof typeof PREMIUM_PACKAGES.RESPONSE];
  purchaseButtonText?: string;
};

export type { TPlan };
