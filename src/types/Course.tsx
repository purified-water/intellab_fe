// Course component model to retrieve dynamic data
interface Course {
  id: string;
  title: string;
  reviews: string;
  rating: number;
  description: string;
  difficulty: string;
  lessons: number;
  price: string;
  imageSrc: string;
  onClick: (id: string) => void;
}

export type { Course };
