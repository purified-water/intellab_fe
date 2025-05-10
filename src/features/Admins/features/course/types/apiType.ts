import { TApiResponse, TSort, IPageable, TGetApiParams, ICourse, TCourseFilter } from "@/types";

type TGetCourseForAdminResponse = TApiResponse<{
  totalPages: number;
  totalElements: number;
  size: number;
  content: ICourse[];
  number: number;
  sort: TSort;
  pageable: IPageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}>;

type TGetCourseForAdminParams = TGetApiParams<
  {
    filter: TCourseFilter;
    page: number;
  },
  {
    totalPages: number;
    totalElements: number;
    size: number;
    content: ICourse[];
    number: number;
    sort: TSort;
    pageable: IPageable;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
  }
>;

type TDeleteCourseResponse = TApiResponse<boolean>;

type TDeleteCourseParams = TGetApiParams<
  {
    courseId: string;
  },
  boolean
>;

type TUpdateCourseAvailabilityResponse = TApiResponse<ICourse>;

type TUpdateCourseAvailabilityParams = TGetApiParams<
  {
    courseId: string;
    isAvailable: boolean;
  },
  ICourse
>;

export type {
  TGetCourseForAdminResponse,
  TDeleteCourseResponse,
  TGetCourseForAdminParams,
  TDeleteCourseParams,
  TUpdateCourseAvailabilityResponse,
  TUpdateCourseAvailabilityParams
};
