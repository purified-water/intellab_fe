const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};

export { getUserIdFromLocalStorage };
