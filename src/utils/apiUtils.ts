import { API_RESPONSE_CODE } from "@/constants";

const apiResponseCodeUtils = {
  isSuccessCode: (code: number) => {
    const successCodes = [
      API_RESPONSE_CODE.SUCCESS,
      API_RESPONSE_CODE.NO_CONTENT,
      API_RESPONSE_CODE.OK,
      API_RESPONSE_CODE.CREATED
    ];
    return successCodes.includes(code);
  },
  isAcceptedErrorCode: (code: number | undefined) => {
    if (code === undefined) {
      return false;
    }

    const acceptedCodes = [
      API_RESPONSE_CODE.BAD_REQUEST,
      API_RESPONSE_CODE.UNAUTHORIZED,
      API_RESPONSE_CODE.NOT_FOUND,
      API_RESPONSE_CODE.CONFLICT,
      API_RESPONSE_CODE.INTERNAL_SERVER_ERROR
    ];
    return acceptedCodes.includes(code);
  }
};

export { apiResponseCodeUtils };
