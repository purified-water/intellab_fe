import { TApiResponse } from "@/types";
import { IUser, IUserMe } from "@/types";
import { TProgress, TRankLanguages } from "@/types";

type TGetProfilePublicResponse = TApiResponse<IUser>;

type TUploadProfilePhotoResponse = TApiResponse<string>;

type TGetProfilesResponse = TApiResponse<IUser[]>;

type TGetProgressLevelResponse = TProgress;

type TGetProgressLanguageResponse = TRankLanguages;

type TGetProfileResponse = TApiResponse<IUser>;

type TGetProfileMeResponse = IUserMe;

export type {
  TGetProfilePublicResponse,
  TUploadProfilePhotoResponse,
  TGetProfilesResponse,
  TGetProgressLevelResponse,
  TGetProgressLanguageResponse,
  TGetProfileResponse,
  TGetProfileMeResponse
};
