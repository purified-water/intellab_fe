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

const clearProblemCodeStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("problem_code_")) {
      localStorage.removeItem(key);
    }
  });
};

export { getUserIdFromLocalStorage, userLocalStorageCleanUp, clearProblemCodeStorage };
