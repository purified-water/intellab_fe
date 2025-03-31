import Cookies from "js-cookie";

export const getAccessToken = () => {
  return Cookies.get("accessToken");
};

export const tokenCleanUp = () => {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
};
