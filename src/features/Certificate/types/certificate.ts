interface ICertificate {
  course: {
    id: string;
    name: string;
    rating: number | null;
    reviewCount: number;
    categories: ICourseCategory[];
  };
  username: string;
  completeDate: string;
  certificateLink: string;
  userUid: string;
}

interface ICourseCategory {
  category_id: string;
  category_name: string;
}

export type { ICertificate, ICourseCategory };
