export const capitalizeFirstLetter = (str: string) => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeChatTitleQuotes = (title: string) => {
  return title.replace(/"/g, "");
};
