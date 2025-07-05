export const PLAGIARISM_THRESHOLDS = {
  // Threshold for considering a submission as potential plagiarism
  SUSPICIOUS: 30,

  // Threshold for flagging as likely plagiarism
  HIGH_RISK: 60,

  // Threshold for definitive plagiarism
  CONFIRMED: 80,

  // Below this threshold is considered false positive/coincidental similarity
  FALSE_POSITIVE: 15
} as const;

export const PLAGIARISM_STATUS = {
  CLEAN: "clean",
  SUSPICIOUS: "suspicious",
  HIGH_RISK: "high_risk",
  CONFIRMED: "confirmed"
} as const;

export type PlagiarismStatus = (typeof PLAGIARISM_STATUS)[keyof typeof PLAGIARISM_STATUS];

export const getPlagiarismStatus = (similarityPercentage: number): PlagiarismStatus => {
  if (similarityPercentage < PLAGIARISM_THRESHOLDS.FALSE_POSITIVE) {
    return PLAGIARISM_STATUS.CLEAN;
  } else if (similarityPercentage < PLAGIARISM_THRESHOLDS.SUSPICIOUS) {
    return PLAGIARISM_STATUS.CLEAN; // Still considered clean but worth noting
  } else if (similarityPercentage < PLAGIARISM_THRESHOLDS.HIGH_RISK) {
    return PLAGIARISM_STATUS.SUSPICIOUS;
  } else if (similarityPercentage < PLAGIARISM_THRESHOLDS.CONFIRMED) {
    return PLAGIARISM_STATUS.HIGH_RISK;
  } else {
    return PLAGIARISM_STATUS.CONFIRMED;
  }
};

export const getPlagiarismStatusColor = (status: PlagiarismStatus): string => {
  switch (status) {
    case PLAGIARISM_STATUS.CLEAN:
      return "text-appEasy"; // Green
    case PLAGIARISM_STATUS.SUSPICIOUS:
      return "text-appMedium"; // Yellow/Orange
    case PLAGIARISM_STATUS.HIGH_RISK:
      return "text-appHard"; // Red
    case PLAGIARISM_STATUS.CONFIRMED:
      return "text-red-700"; // Dark Red
    default:
      return "text-gray-500";
  }
};

export const getPlagiarismStatusBgColor = (status: PlagiarismStatus): string => {
  switch (status) {
    case PLAGIARISM_STATUS.CLEAN:
      return "bg-green-50 border-appEasy";
    case PLAGIARISM_STATUS.SUSPICIOUS:
      return "bg-yellow-50 border-appMedium";
    case PLAGIARISM_STATUS.HIGH_RISK:
      return "bg-orange-50 border-bronze";
    case PLAGIARISM_STATUS.CONFIRMED:
      return "bg-red-50 border-appHard";
    default:
      return "bg-gray-50 border-gray2";
  }
};

export const getPlagiarismStatusText = (status: PlagiarismStatus): string => {
  switch (status) {
    case PLAGIARISM_STATUS.CLEAN:
      return "Clean";
    case PLAGIARISM_STATUS.SUSPICIOUS:
      return "Suspicious";
    case PLAGIARISM_STATUS.HIGH_RISK:
      return "High Risk";
    case PLAGIARISM_STATUS.CONFIRMED:
      return "Confirmed Plagiarism";
    default:
      return "Unknown";
  }
};
