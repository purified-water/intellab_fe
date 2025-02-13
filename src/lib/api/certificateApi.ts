import { apiClient } from "./apiClient";
import { ICreateCertificateResponse, IGetCertificateResponse } from "@/features/Certificate/types";

export const certificateAPI = {
  createCertificate: async (courseId: string, userId: string) => {
    const response = await apiClient.post(`/course/${courseId}/certificates`, {
      headers: {
        "X-User-Id": userId
      }
    });
    const data: ICreateCertificateResponse = response.data;
    return data;
  },
  getCertificates: async (courseId: string, userId: string, token: string) => {
    // const response = await apiClient.get(`/course/${courseId}/certificates`, {
    //   headers: {
    //     "X-User-Id": userId
    //   },
    //   params: {
    //     token
    //   }
    // });
    // const data: IGetCertificateResponse = response.data;
    const data: IGetCertificateResponse = {
      course: {
        id: "course_id",
        name: "Linked List Data Structure Guide",
        rating: 4.5,
        reviews: 1000000,
        categories: [
          {
            category_name: "Data Structure",
            category_id: "Data_Structure"
          },
          {
            category_name: "Algorithm",
            category_id: "Algorithm"
          }
        ]
      },
      finished_by: "Hoàng Quốc",
      finished_date: "2021-07-01",
      certificate_file_link: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/476484385_3192979577509444_3268300309256068008_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeECSep_zt3U47V-0NjGYlOgKwKcCeOON4IrApwJ4443gg32WfRE9FkwXCZdTIGn8BPoCVpkSVmeegJQ8ysEFZZJ&_nc_ohc=akuen-aGNBgQ7kNvgHt0EbZ&_nc_oc=AdhVKmeMeYTVKzxHkeXoguIHv8pqNZsb9mOG3BFON9dWfjPA9dHv2B7yEVqTt_ExLM4&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=AYOICo5rRcY2p04d0DYPb0L&oh=00_AYDM6bISjk1D9ndgUJa41vHJpHNJVy6uCSklHzvi_xHV_Q&oe=67B28EB3"
    };
    return data;
  }
};
