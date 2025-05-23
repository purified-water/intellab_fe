import { TApiParams, TGetApiParams } from "@/types/apiType";

export interface OverviewStatItem {
  title: string;
  value: number;
  change: string;
  changeNote: string;
  changeType: "increase" | "decrease" | "neutral";
}

export interface TDashboardOverviewResponse {
  code: number;
  result: OverviewStatItem[];
}

export interface SubscriptionGrowthItem {
  label: string; // day, week, or month label
  value: number; // subscription count
}

export interface TSubscriptionGrowthResponse {
  code: number;
  result: SubscriptionGrowthItem[];
}

export interface TSubscriptionGrowthQuery {
  period?: "daily" | "weekly" | "monthly" | "custom";
  start_date?: string; // YYYY-MM-DD format for custom range
  end_date?: string; // YYYY-MM-DD format for custom range
}

export interface CourseCompletionRateItem {
  label: string; // day, week, or month label
  value: number; // completion rate percentage
}

export interface TCourseCompletionRateResponse {
  code: number;
  result: CourseCompletionRateItem[];
}

export interface TCourseCompletionRateQuery {
  period?: "daily" | "weekly" | "monthly" | "custom";
  start_date?: string; // YYYY-MM-DD format for custom range
  end_date?: string; // YYYY-MM-DD format for custom range
}

export interface RevenueItem {
  label: string; // day, week, or month label
  value: number; // revenue amount
}

export interface TRevenueResponse {
  code: number;
  result: RevenueItem[];
}

export interface TRevenueQuery {
  period?: "daily" | "weekly" | "monthly" | "custom";
  start_date?: string; // YYYY-MM-DD format for custom range
  end_date?: string; // YYYY-MM-DD format for custom range
}

export interface UserGrowthItem {
  label: string; // day, week, or month label
  value: number; // user count
}

export interface TUserGrowthResponse {
  code: number;
  result: UserGrowthItem[];
}

export interface TUserGrowthQuery {
  period?: "daily" | "weekly" | "monthly" | "custom";
  start_date?: string; // YYYY-MM-DD format for custom range
  end_date?: string; // YYYY-MM-DD format for custom range
}

export type TGetDashboardOverviewParams = TApiParams<TDashboardOverviewResponse>;
export type TGetSubscriptionGrowthParams = TGetApiParams<TSubscriptionGrowthQuery, TSubscriptionGrowthResponse>;
export type TGetCourseCompletionRateParams = TGetApiParams<TCourseCompletionRateQuery, TCourseCompletionRateResponse>;
export type TGetRevenueParams = TGetApiParams<TRevenueQuery, TRevenueResponse>;
export type TGetUserGrowthParams = TGetApiParams<TUserGrowthQuery, TUserGrowthResponse>;
