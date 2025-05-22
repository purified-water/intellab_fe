import { apiClient } from "./apiClient";
import {
  TGetDashboardOverviewParams,
  TDashboardOverviewResponse,
  TGetSubscriptionGrowthParams,
  TSubscriptionGrowthResponse,
  TGetCourseCompletionRateParams,
  TCourseCompletionRateResponse,
  TGetRevenueParams,
  TRevenueResponse,
  TGetUserGrowthParams,
  TUserGrowthResponse
} from "@/features/Admins/types/apiType";
import { HTTPS_STATUS_CODE } from "@/constants";
import { subscriptionGrowthMockData } from "@/features/Admins/features/dashboard/mock/subscriptionGrowthData";
import { courseCompletionMockData } from "@/features/Admins/features/dashboard/mock/courseCompletionData";
import { revenueMockData } from "@/features/Admins/features/dashboard/mock/revenueData";
import { userGrowthMockData } from "@/features/Admins/features/dashboard/mock/userGrowthData";

// Set to true to use mock data for development
const USE_MOCK_DATA = import.meta.env.DEV;

export const adminDashboardAPI = {
  getOverviewStats: async ({ onStart, onSuccess, onFail, onEnd }: TGetDashboardOverviewParams) => {
    const DEFAULT_ERROR = "Failed to get dashboard overview data";

    if (onStart) {
      await onStart();
    }

    try {
      const response = await apiClient.get("identity/admin/dashboard/overview");

      if (response.status === HTTPS_STATUS_CODE.OK) {
        const data: TDashboardOverviewResponse = response.data;
        if (onSuccess) {
          await onSuccess(data);
        }
      } else {
        if (onFail) {
          await onFail(DEFAULT_ERROR);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && onFail) {
        await onFail(error.message ?? DEFAULT_ERROR);
      } else if (onFail) {
        await onFail(DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getCourseCompletionRate: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetCourseCompletionRateParams) => {
    const DEFAULT_ERROR = "Failed to get course completion rate data";

    if (onStart) {
      await onStart();
    }

    try {
      if (!USE_MOCK_DATA) {
        // Use mock data in development
        const period = query?.period || "monthly";
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return mock data based on period
        if (period === "daily") {
          await onSuccess(courseCompletionMockData.daily as TCourseCompletionRateResponse);
        } else if (period === "weekly") {
          await onSuccess(courseCompletionMockData.weekly as TCourseCompletionRateResponse);
        } else if (period === "custom") {
          // Return custom mock data
          await onSuccess(courseCompletionMockData.custom as TCourseCompletionRateResponse);
        } else {
          await onSuccess(courseCompletionMockData.monthly as TCourseCompletionRateResponse);
        }
      } else {
        // Real API call for production
        const params = {
          type: query?.period || "monthly" // daily, weekly, monthly, custom
        };

        // Add start_date and end_date params for custom period
        if (query?.period === "custom") {
          Object.assign(params, {
            start_date: query?.start_date,
            end_date: query?.end_date
          });
        }

        const response = await apiClient.get("identity/admin/course-complete-rate", {
          params
        });

        if (response.status === HTTPS_STATUS_CODE.OK) {
          const data: TCourseCompletionRateResponse = response.data;
          if (onSuccess) {
            await onSuccess(data);
          }
        } else {
          if (onFail) {
            await onFail(DEFAULT_ERROR);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && onFail) {
        await onFail(error.message ?? DEFAULT_ERROR);
      } else if (onFail) {
        await onFail(DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getSubscriptionGrowth: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetSubscriptionGrowthParams) => {
    const DEFAULT_ERROR = "Failed to get subscription growth data";

    if (onStart) {
      await onStart();
    }

    try {
      if (!USE_MOCK_DATA) {
        // Use mock data in development
        const period = query?.period || "monthly";
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return mock data based on period
        if (period === "daily") {
          await onSuccess(subscriptionGrowthMockData.daily as TSubscriptionGrowthResponse);
        } else if (period === "weekly") {
          await onSuccess(subscriptionGrowthMockData.weekly as TSubscriptionGrowthResponse);
        } else if (period === "custom") {
          // Return custom mock data (using monthly as a base for simplicity)
          await onSuccess(subscriptionGrowthMockData.monthly as TSubscriptionGrowthResponse);
        } else {
          await onSuccess(subscriptionGrowthMockData.monthly as TSubscriptionGrowthResponse);
        }
      } else {
        // Real API call for production
        const params = {
          type: query?.period || "monthly" // daily, weekly, monthly, custom
        };

        // Add start_date and end_date params for custom period
        if (query?.period === "custom") {
          Object.assign(params, {
            start_date: query?.start_date,
            end_date: query?.end_date
          });
        }

        const response = await apiClient.get("identity/admin/dashboard/subscription-growth", {
          params
        });

        if (response.status === HTTPS_STATUS_CODE.OK) {
          const data: TSubscriptionGrowthResponse = response.data;
          if (onSuccess) {
            await onSuccess(data);
          }
        } else {
          if (onFail) {
            await onFail(DEFAULT_ERROR);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && onFail) {
        await onFail(error.message ?? DEFAULT_ERROR);
      } else if (onFail) {
        await onFail(DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getRevenue: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetRevenueParams) => {
    const DEFAULT_ERROR = "Failed to get revenue data";

    if (onStart) {
      await onStart();
    }

    try {
      if (!USE_MOCK_DATA) {
        // Use mock data in development
        const period = query?.period || "monthly";
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return mock data based on period
        if (period === "daily") {
          await onSuccess(revenueMockData.daily as TRevenueResponse);
        } else if (period === "weekly") {
          await onSuccess(revenueMockData.weekly as TRevenueResponse);
        } else if (period === "custom") {
          // Return custom mock data
          await onSuccess(revenueMockData.custom as TRevenueResponse);
        } else {
          await onSuccess(revenueMockData.monthly as TRevenueResponse);
        }
      } else {
        // Real API call for production
        const params = {
          type: query?.period || "monthly" // daily, weekly, monthly, custom
        };

        // Add start_date and end_date params for custom period
        if (query?.period === "custom") {
          Object.assign(params, {
            start_date: query?.start_date,
            end_date: query?.end_date
          });
        }

        const response = await apiClient.get("identity/admin/dashboard/revenue", {
          params
        });

        if (response.status === HTTPS_STATUS_CODE.OK) {
          const data: TRevenueResponse = response.data;
          if (onSuccess) {
            await onSuccess(data);
          }
        } else {
          if (onFail) {
            await onFail(DEFAULT_ERROR);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && onFail) {
        await onFail(error.message ?? DEFAULT_ERROR);
      } else if (onFail) {
        await onFail(DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  },

  getUserGrowth: async ({ query, onStart, onSuccess, onFail, onEnd }: TGetUserGrowthParams) => {
    const DEFAULT_ERROR = "Failed to get user growth data";

    if (onStart) {
      await onStart();
    }

    try {
      if (!USE_MOCK_DATA) {
        // Use mock data in development
        const period = query?.period || "monthly";
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return mock data based on period
        if (period === "daily") {
          await onSuccess(userGrowthMockData.daily as TUserGrowthResponse);
        } else if (period === "weekly") {
          await onSuccess(userGrowthMockData.weekly as TUserGrowthResponse);
        } else if (period === "custom") {
          // Return custom mock data
          await onSuccess(userGrowthMockData.custom as TUserGrowthResponse);
        } else {
          await onSuccess(userGrowthMockData.monthly as TUserGrowthResponse);
        }
      } else {
        // Real API call for production
        const params = {
          type: query?.period || "monthly" // daily, weekly, monthly, custom
        };

        // Add start_date and end_date params for custom period
        if (query?.period === "custom") {
          Object.assign(params, {
            start_date: query?.start_date,
            end_date: query?.end_date
          });
        }

        const response = await apiClient.get("identity/admin/dashboard/user-growth", {
          params
        });

        if (response.status === HTTPS_STATUS_CODE.OK) {
          const data: TUserGrowthResponse = response.data;
          if (onSuccess) {
            await onSuccess(data);
          }
        } else {
          if (onFail) {
            await onFail(DEFAULT_ERROR);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && onFail) {
        await onFail(error.message ?? DEFAULT_ERROR);
      } else if (onFail) {
        await onFail(DEFAULT_ERROR);
      }
    } finally {
      if (onEnd) {
        await onEnd();
      }
    }
  }
};
