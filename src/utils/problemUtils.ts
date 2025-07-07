import { LanguageCodes } from "@/features/Problem/constants/LanguageCodes";
import { LanguageCodeType } from "@/features/Problem/types";

// Utility function to find language by name with proper matching logic
export const findLanguageByName = (languageName: string): LanguageCodeType | undefined => {
  if (!languageName) return undefined;

  const normalizedInput = languageName.toLowerCase().trim();

  return LanguageCodes.find((lang) => {
    const langName = lang.name.toLowerCase();

    // Handle different cases for precise matching
    if (normalizedInput.includes("java") && !normalizedInput.includes("javascript")) {
      return langName.includes("java") && !langName.includes("javascript");
    } else if (normalizedInput.includes("javascript")) {
      return langName.includes("javascript");
    } else if (normalizedInput.includes("python")) {
      return langName.includes("python");
    } else if (normalizedInput.includes("c++")) {
      return langName.includes("c++");
    } else if (normalizedInput.includes("c#")) {
      return langName.includes("c#");
    } else if (normalizedInput === "c" || normalizedInput.includes("c (")) {
      return langName.includes("c (");
    } else if (normalizedInput.includes("typescript")) {
      return langName.includes("typescript");
    }

    // Fallback to exact name match or contains
    return langName === normalizedInput || langName.includes(normalizedInput);
  });
};
