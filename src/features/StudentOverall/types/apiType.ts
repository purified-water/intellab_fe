import { ICourse, ILesson, IPageable, TCategory, TGetApiParams, TPremiumStatus } from "@/types";

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

export interface IGetCategories {
  code: number;
  result: TCategory[];
}

export type TGetPremiumStatusResponse = TPremiumStatus;

export type TGetPremiumStatusParams = TGetApiParams<
  {
    uid: string;
  },
  TGetPremiumStatusResponse
>;
