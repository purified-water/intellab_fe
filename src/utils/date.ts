const formatDate = (
  dateStr: string,
  options: {
    yearFormat?: "numeric" | "2-digit";
    monthFormat?: "long" | "2-digit" | "short" | "narrow";
    dayFormat?: "numeric" | "2-digit";
  } = { yearFormat: "numeric", monthFormat: "long", dayFormat: "numeric" }
): string => {
  const { yearFormat = "numeric", monthFormat = "long", dayFormat = "numeric" } = options;

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: yearFormat,
    month: monthFormat,
    day: dayFormat
  });
};

export { formatDate };
