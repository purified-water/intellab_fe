interface ICreateCertificateResponse {}

interface ICourseCategory {
  category_id: string;
  category_name: string;
}

interface IGetCertificateResponse {
  course: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    categories: ICourseCategory[];
  };
  finished_by: string;
  finished_date: string;
  certificate_file_link: string;
}

export type { ICreateCertificateResponse, IGetCertificateResponse };
