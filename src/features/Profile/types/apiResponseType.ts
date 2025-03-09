import { TApiResponse, IUser, IUser, TProgress, TRankLanguages, ICompletedCourse } from "@/types";
import { SendSubmissionType } from "@/features/Problem/types/SubmissionType";

type TGetProfilePublicResponse = TApiResponse<IUser>;

type TUploadProfilePhotoResponse = TApiResponse<string>;

type TGetProfilesResponse = TApiResponse<IUser[]>;

type TGetProgressLevelResponse = TProgress;

type TGetProgressLanguageResponse = TRankLanguages;

type TGetProfileResponse = TApiResponse<IUser>;

type TGetProfileMeResponse = IUser;

type TGetSubmissionListMeResponse = SendSubmissionType[];

type TGetCompletedCourseListMeResponse = TApiResponse<ICompletedCourse[]>;

export type {
  TGetProfilePublicResponse,
  TUploadProfilePhotoResponse,
  TGetProfilesResponse,
  TGetProgressLevelResponse,
  TGetProgressLanguageResponse,
  TGetProfileResponse,
  TGetProfileMeResponse,
  TGetSubmissionListMeResponse,
  TGetCompletedCourseListMeResponse
};
