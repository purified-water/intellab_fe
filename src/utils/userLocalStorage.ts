const getUserIdFromLocalStorage = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};

const userLocalStorageCleanUp = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("dontShowUploadGuideModal");
};

export { getUserIdFromLocalStorage, userLocalStorageCleanUp };
