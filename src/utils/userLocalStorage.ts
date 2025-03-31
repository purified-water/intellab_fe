const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};

const userLocalStorageCleanUp = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export { getUserIdFromLocalStorage, userLocalStorageCleanUp };
