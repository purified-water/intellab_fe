export const capitalizeFirstLetter = (str: string) => {
  if (str === null || str === undefined) return "";
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeChatTitleQuotes = (title: string) => {
  return title.replace(/"/g, "");
};

export const isEmptyString = (str: string) => {
  return str.trim().length === 0;
};
