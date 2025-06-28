import {
  TApiResponse,
  TGetApiParams,
  IUser,
  TProgress,
  TRankLanguages,
  ICompletedCourse,
  TPostApiParams
} from "@/types";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";

type TGetProfilePublicResponse = TApiResponse<IUser>;

type TUploadProfilePhotoResponse = TApiResponse<string>;

type TGetProfilesResponse = TApiResponse<IUser[]>;

type TGetProgressLevelResponse = TProgress;

type TGetProgressLanguageResponse = TRankLanguages;

type TGetProfileResponse = TApiResponse<IUser>;

type TGetProfileMeResponse = IUser;

type TGetSubmissionListMeResponse = {
  number: number;
  totalPages: number;
  content: SendSubmissionType[];
};

type TGetCompletedCourseListMeResponse = TApiResponse<ICompletedCourse[]>;

type TGetProfileMeParams = TGetApiParams<undefined, IUser>;

type TGetMyPointResponse = number;

type TGetMyPointParams = TGetApiParams<undefined, number>;

type TSetPublicProfileParams = TPostApiParams<null, { isPublic: boolean }, IUser>;

type TSetPublicProfileResponse = TApiResponse<IUser>;

export type {
  TGetProfilePublicResponse,
  TUploadProfilePhotoResponse,
  TGetProfilesResponse,
  TGetProgressLevelResponse,
  TGetProgressLanguageResponse,
  TGetProfileResponse,
  TGetProfileMeResponse,
  TGetSubmissionListMeResponse,
  TGetCompletedCourseListMeResponse,
  TGetProfileMeParams,
  TGetMyPointResponse,
  TGetMyPointParams,
  TSetPublicProfileParams,
  TSetPublicProfileResponse
};
