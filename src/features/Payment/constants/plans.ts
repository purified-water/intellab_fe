import { TPlan } from "../types";
import { PREMIUM_PACKAGES } from "@/constants";

export const PLANS: TPlan[] = [
  {
    title: "Free Plan",
    titleColor: "black1",
    monthPrice: 0,
    yearPrice: 0,
    description: "Basic plan for casual learners exploring coding!",
    requestPackage: PREMIUM_PACKAGES.REQUEST.FREE,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.FREE,
    perks: [
      "Access to public problems",
      "Access to free courses",
      "Main AI Assistant",
      "Summary course with AI",
      "Access to low-priced AI models",
      "7 messages/day with problem AI Assistant"
    ]
  },
  {
    title: "Algorithm Plan",
    titleColor: "appSecondary",
    monthPrice: 299000,
    yearPrice: 2388000,
    eachMonthPrice: 199000,
    description: "A must-have for algorithm enthusiasts!",
    requestPackage: PREMIUM_PACKAGES.REQUEST.PROBLEM,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.PROBLEM,
    perks: [
      "All perks from Free plan",
      "Access to all problems",
      "Access to all AI models",
      "Unlimited messages/day with problem AI Assistant"
    ],
    purchaseButtonText: "Get Algorithm plan"
  },
  {
    title: "Course Plan",
    titleColor: "appAccent",
    monthPrice: 299000,
    yearPrice: 2388000,
    eachMonthPrice: 199000,
    description: "Master coding with structured courses!",
    requestPackage: PREMIUM_PACKAGES.REQUEST.COURSE,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.COURSE,
    perks: [
      "All perks from Free plan",
      "Access to all courses",
      "Access to all AI models",
      "20 messages/day with problem AI Assistant"
    ],
    purchaseButtonText: "Get Course plan"
  },
  {
    title: "Premium plan",
    titleColor: "appPrimary",
    monthPrice: 499000,
    yearPrice: 4788000,
    eachMonthPrice: 399000,
    description: "The ultimate package to expand your coding expertise!",
    requestPackage: PREMIUM_PACKAGES.REQUEST.PREMIUM,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.PREMIUM,
    perks: [
      "All perks from Algorithm plan",
      "Access to all problems",
      "Access to all courses",
      "Access to all AI models",
      "Unlimited messages/day with problem AI Assistant"
    ],
    purchaseButtonText: "Get Premium plan"
  }
];
