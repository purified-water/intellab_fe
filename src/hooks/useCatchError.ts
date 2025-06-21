import { AxiosError } from "axios";

export const useCatchError = (error: unknown, defaultMessage: string = "Something wrong happened. Please try again."): string => {
  let errorMessage = defaultMessage;

  if (error instanceof AxiosError && error.code !== "600") {
    // Check if the error response has a message from the backend
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};