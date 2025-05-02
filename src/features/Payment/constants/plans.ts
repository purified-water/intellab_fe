import { TPlan } from "../types";
import { PREMIUM_DURATION, PREMIUM_PACKAGES } from "@/constants";

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
    description: "Improve coding  with premium problems and unlimited AI Assistant",
    requestPackage: PREMIUM_PACKAGES.REQUEST.PROBLEM,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.PROBLEM,
    perks: [
      "All perks from Free Plan",
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
    description: "Master coding with structured courses and extended AI Assistant",
    requestPackage: PREMIUM_PACKAGES.REQUEST.COURSE,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.COURSE,
    perks: [
      "All perks from Free Plan",
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
    description: "The ultimate package with all perks to expand your coding expertise!",
    requestPackage: PREMIUM_PACKAGES.REQUEST.PREMIUM,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.PREMIUM,
    perks: [
      "All perks from Free Plan",
      "Access to all problems",
      "Access to all courses",
      "Access to all AI models",
      "Unlimited messages/day with problem AI Assistant"
    ],
    purchaseButtonText: "Get Premium plan"
  }
];

export const PRICING_PLANS = [
  {
    id: "monthly",
    title: "Monthly",
    subtitle: "billed monthly",
    description: "Our monthly plan grants access to all premium features, the best plan for short-term subscribers.",
    price: "499.000 VNĐ",
    priceUnit: "/month",
    isPopular: false,
    isHighlighted: false,
    requestPackage: PREMIUM_PACKAGES.REQUEST.PREMIUM,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.PREMIUM,
    duration: PREMIUM_DURATION.MONTHLY,
  },
  {
    id: "yearly",
    title: "Yearly",
    subtitle: "billed yearly (3.588.000 VNĐ)",
    description: "This plan saves you over 40% in comparison to the monthly plan.",
    price: "299.000 VNĐ",
    priceUnit: "/month",
    isPopular: true,
    isHighlighted: true,
    requestPackage: PREMIUM_PACKAGES.REQUEST.PREMIUM,
    responsePackage: PREMIUM_PACKAGES.RESPONSE.PREMIUM,
    duration: PREMIUM_DURATION.YEARLY,
  }
];


export const PLAN_FEATURES = [
  { title: "Access to All Problems" as const, 
    description: "Challenge yourself with exclusive problems crafted to mirror real-world interviews and industry-level assessments." 
  },

  { title: "Access to All Courses" as const, 
    description: "Enhance your programming knowledge with structured courses" 

  },
  { title: "Intellab AI Assistant" as const,
    description: "Get real-time support and learning path recommendation from our AI Assistant" 
  },
  { title: "AI-Powered Course Summarization" as const, 
    description: "Save time and study smarter with comprehensive, AI-generated summaries that distill key insights from every lessons." 
  },
  { title: "Unlimited Interaction with the AI Assistant for Problem Solving" as const, 
    description: "Ask as many questions as needed—there’s no cap on your curiosity. Enjoy uninterrupted learning with limitless AI support each day." 
  },
  { title: "Access to Cutting-Edge AI Models" as const, 
    description: "Leverage the power of advanced AI technologies to enhance your learning experience, including access to premium large language models." 
  },
  { title: "Real-time AI Explainer Within Lessons" as const,
    description: "Instantly receive AI-powered explanations of technical terms and related concepts directly within the lesson interface—empowering you to learn without losing focus." 
  },
];