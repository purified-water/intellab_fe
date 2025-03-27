import { TPlan } from "../types";
import { PACKAGES } from "./premiumValues";

export const PLANS: TPlan[] = [
  {
    isFreePlan: true,
    title: "Free Plan",
    titleColor: "black1",
    monthPrice: 0,
    yearPrice: 0,
    description: "Basic plan for casual learners exploring coding!",
    planPackage: PACKAGES.FREE,
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
    isFreePlan: false,
    title: "Algorithm Plan",
    titleColor: "appSecondary",
    monthPrice: 299000,
    yearPrice: 2388000,
    eachMonthPrice: 199000,
    description: "A must-have for algorithm enthusiasts!",
    perks: [
      "All perks from Free plan",
      "Access to all problems",
      "Access to all AI models",
      "Unlimited messages/day with problem AI Assistant"
    ],
    planPackage: PACKAGES.PROBLEM,
    purchaseButtonText: "Get Algorithm plan"
  },
  {
    isFreePlan: false,
    title: "Course Plan",
    titleColor: "appAccent",
    monthPrice: 299000,
    yearPrice: 2388000,
    eachMonthPrice: 199000,
    description: "Master coding with structured courses!",
    perks: [
      "All perks from Free plan",
      "Access to all courses",
      "Access to all AI models",
      "20 messages/day with problem AI Assistant"
    ],
    planPackage: PACKAGES.COURSE,
    purchaseButtonText: "Get Course plan"
  },
  {
    isFreePlan: false,
    title: "Premium plan",
    titleColor: "appPrimary",
    monthPrice: 499000,
    yearPrice: 4788000,
    eachMonthPrice: 399000,
    description: "The ultimate package to expand your coding expertise!",
    perks: [
      "All perks from Algorithm plan",
      "Access to all problems",
      "Access to all courses",
      "Access to all AI models",
      "Unlimited messages/day with problem AI Assistant"
    ],
    planPackage: PACKAGES.PREMIUM,
    purchaseButtonText: "Get Premium plan"
  }
];
