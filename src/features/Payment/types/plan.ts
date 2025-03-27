import { PACKAGES } from "../constants";

type TPlan = {
  isFreePlan: boolean;
  title: string;
  titleColor: string;
  monthPrice: number;
  yearPrice: number;
  eachMonthPrice?: number;
  description: string;
  perks: string[];
  planPackage?: (typeof PACKAGES)[keyof typeof PACKAGES];
  purchaseButtonText?: string;
};

export type { TPlan };
