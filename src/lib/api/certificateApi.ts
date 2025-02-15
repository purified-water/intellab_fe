import { apiClient } from "./apiClient";
import { IGetCertificateResponse } from "@/features/Certificate/types";

export const certificateAPI = {
  getCertificates: async (certificateId: string) => {
    const response = await apiClient.get(`/course/courses/${certificateId}/certificate`);
    const data: IGetCertificateResponse = response.data;
    return data;
  }
};
