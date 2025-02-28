import { TApiResponse } from "@/types";
import { IUser, IUserMe } from "@/types";
import { TProgress, TRankLanguages } from "@/types";

type TUpdateProfileResponse = TApiResponse<any>;

type TGetProfilePublicResponse = TApiResponse<IUser>;

type TUploadProfilePhotoResponse = TApiResponse<string>;

type TGetProfilesResponse = TApiResponse<IUser[]>;

type TGetProgressProblemResponse = TProgress;

type TGetProgressLevelResponse = TProgress;

type TGetProgressLanguageResponse = TRankLanguages;

type TGetProfileResponse = TApiResponse<IUser>;

type TGetProfileMeResponse = IUserMe;

export type {
  TUpdateProfileResponse,
  TGetProfilePublicResponse,
  TUploadProfilePhotoResponse,
  TGetProfilesResponse,
  TGetProgressProblemResponse,
  TGetProgressLevelResponse,
  TGetProgressLanguageResponse,
  TGetProfileResponse,
  TGetProfileMeResponse
};
