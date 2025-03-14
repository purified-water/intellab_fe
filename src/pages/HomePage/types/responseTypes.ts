import { ICourse } from "@/types/course";
import { ILesson } from "@/types/lesson";
import { IPageable } from "@/types";

export interface IGetCoursesResponse {
  code: number;
  result: {
    content: ICourse[];
    pageable: IPageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: { property: string; direction: "ASC" | "DESC" }[];
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}

export interface IGetCourseDetailResponse {
  code: number;
  result: ICourse;
}

export interface IGetCourseLessonsResponse {
  code: number;
  result: {
    content: ILesson[];
    pageable: IPageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: { property: string; direction: "ASC" | "DESC" }[];
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}

export interface IEnrollCourseResponse {
  code: number;
  result: {
    id: number;
    userUid: string;
    courseIds: string[];
  };
}

export interface IGetLessonDetailResponse {
  code: number;
  message: string;
  result: ILesson;
}

export interface IUserCourse {
  enrollId: {
    userUid: string;
    courseId: string;
  };
  progressPercent: number;
  status: string;
  lastAccessedDate: string;
}

export interface IGetUserEnrolledCoursesResponse {
  code: number;
  result: {
    content: IUserCourse[];
    pageable: IPageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: { property: string; direction: "ASC" | "DESC" }[];
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}

export interface ILeaderboardRank {
  rank: number;
  name: string;
  score: number;
}

export interface IGetLeaderboardResponse {
  code: number;
  result: {
    content: ILeaderboardRank[];
  };
}

export interface IGetCategories {
  code: number;
  result: ICategory[];
}

export interface ICategory {
  categoryId: number;
  name: string;
}
