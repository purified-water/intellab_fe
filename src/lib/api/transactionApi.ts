import { apiClient } from "./apiClient";
import { TApiResponse } from "@/types/apiType";
import { apiResponseCodeUtils } from "@/utils/apiUtils";

// Transaction types
export interface TransactionUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  photoUrl: string;
  role: string;
  lastSignIn: string;
  courseCount: number;
  disabled: boolean;
}

export interface TransactionItem {
  user: TransactionUser;
  date: string;
  amount: number;
  status: string;
  type: string;
}

export type TransactionListResponse = TApiResponse<TransactionItem[]>;

const DEFAULT_PAGE_SIZE = 10;

export const transactionAPI = {
  /**
   * Get transactions list for dashboard
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @returns Array of transaction items
   */
  getTransactions: async (page: number = 0, size: number = DEFAULT_PAGE_SIZE) => {
    try {
      console.log("Fetching transactions with params:", { page, size });
      const response = await apiClient.get("identity/admin/dashboard/transactions", {
        params: {
          page,
          size
        }
      });
      const data: TransactionListResponse = response.data;
      console.log("Transaction API response:", data);

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result || [];
      } else {
        console.error("Error fetching transactions: API returned error code", data.code, data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },

  /**
   * Get top purchased items for dashboard
   * @param limit Number of items to retrieve (optional)
   * @returns Array of transaction items for top purchased courses/plans
   */
  getTopPurchased: async (limit?: number) => {
    try {
      console.log("Fetching top purchased items", limit ? `with limit: ${limit}` : "");
      const response = await apiClient.get("identity/admin/dashboard/top-purchased", {
        params: limit ? { limit } : {}
      });
      const data: TransactionListResponse = response.data;
      console.log("Top purchased API response:", data);

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result || [];
      } else {
        console.error("Error fetching top purchased items: API returned error code", data.code, data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching top purchased items:", error);
      return [];
    }
  },

  /**
   * Get transaction details by ID
   * @param transactionId Transaction ID
   * @returns Transaction details or null if not found
   */
  getTransactionById: async (transactionId: string) => {
    try {
      const response = await apiClient.get(`identity/admin/dashboard/transactions/${transactionId}`);
      const data = response.data;

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result;
      } else {
        console.error("Error fetching transaction details: API returned error code", data.code, data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
  }
};
