const amountTransformer = (amount: number): string => {
  let result = "";
  if (amount < 1000) {
    result = amount.toString();
  } else if (amount < 1000000) {
    result = (amount / 1000).toFixed(1) + "k";
  } else {
    result = (amount / 1000000).toFixed(1) + "m";
  }
  return result;
};

export { amountTransformer };
