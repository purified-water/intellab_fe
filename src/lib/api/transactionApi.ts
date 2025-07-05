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
  id: string;
}

export interface PurchasedItem {
  user: TransactionUser;
  date: string;
  amount: number;
  type: "Free" | "Plan";
}

export type TransactionListResponse = TApiResponse<TransactionItem[]>;
export type PurchasedListResponse = TApiResponse<PurchasedItem[]>;

// Paginated response types
export interface PaginatedTransactionResponse {
  content: TransactionItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PaginatedPurchasedResponse {
  content: PurchasedItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type PaginatedTransactionListResponse = TApiResponse<PaginatedTransactionResponse>;
export type PaginatedPurchasedListResponse = TApiResponse<PaginatedPurchasedResponse>;

const DEFAULT_PAGE_SIZE = 10;

// Search and filter parameters
export interface TransactionFilters {
  keyword?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PurchasedItemFilters {
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  order?: "asc" | "desc";
  pageable?: {
    page: number;
    size: number;
    sort: {
      string: string;
    };
  };
}

export const transactionAPI = {
  /**
   * Get transactions list for dashboard with pagination
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param filters Search and filter parameters
   * @returns Paginated array of transaction items
   */
  getTransactions: async (page: number = 0, size: number = DEFAULT_PAGE_SIZE, filters?: TransactionFilters) => {
    try {
      console.log("Fetching transactions with params:", { page, size, filters });
      const response = await apiClient.get("identity/admin/dashboard/transactions", {
        params: {
          page,
          size,
          ...filters
        }
      });
      const data: PaginatedTransactionListResponse = response.data;
      console.log("Transaction API response:", data);

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result.content || [];
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
   * Get purchased items list for dashboard with pagination
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param filters Search and filter parameters
   * @returns Paginated array of purchased items
   */
  getPurchasedItems: async (page: number = 0, size: number = DEFAULT_PAGE_SIZE, filters?: PurchasedItemFilters) => {
    try {
      console.log("Fetching purchased items with params:", { page, size, filters });
      const response = await apiClient.get("identity/admin/dashboard/purchased", {
        params: {
          page,
          size,
          ...filters
        }
      });
      const data: PaginatedPurchasedListResponse = response.data;
      console.log("Purchased items API response:", data);

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result.content || [];
      } else {
        console.error("Error fetching purchased items: API returned error code", data.code, data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching purchased items:", error);
      return [];
    }
  },

  /**
   * Get purchased items with pagination metadata
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param filters Search and filter parameters
   * @returns Full paginated response with metadata
   */
  getPurchasedItemsWithMetadata: async (
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE,
    filters?: PurchasedItemFilters
  ) => {
    try {
      // Prepare parameters for the top-purchased endpoint
      const params: Record<string, string | number> = {
        page: page,
        size: size
      };

      if (filters?.search) {
        params.search = filters.search;
      }

      if (filters?.type) {
        params.type = filters.type;
      }

      if (filters?.sortBy) {
        params.sortBy = filters.sortBy;
      } else {
        params.sortBy = "amount"; // Default sortBy
      }

      if (filters?.order) {
        params.order = filters.order;
      } else {
        params.order = "desc"; // Default order
      }

      const response = await apiClient.get("identity/admin/dashboard/top-purchased", {
        params
      });
      const data: PaginatedPurchasedListResponse = response.data;

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result;
      } else {
        console.error("Error fetching purchased items: API returned error code", data.code, data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching purchased items:", error);
      return null;
    }
  },

  /**
   * Get transactions with pagination metadata
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @param filters Search and filter parameters
   * @returns Full paginated response with metadata
   */
  getTransactionsWithMetadata: async (
    page: number = 0,
    size: number = DEFAULT_PAGE_SIZE,
    filters?: TransactionFilters
  ) => {
    try {
      // Build parameters object similar to purchased items
      const params: Record<string, string | number> = {
        page,
        size
      };

      // Add keyword parameter
      if (filters?.keyword) {
        params.keyword = filters.keyword;
      }

      // Add type filter
      if (filters?.type) {
        params.type = filters.type;
      }

      // Add status filter
      if (filters?.status) {
        params.status = filters.status;
      }

      // Add sortBy parameter
      if (filters?.sortBy) {
        params.sortBy = filters.sortBy;
      } else {
        params.sortBy = "date"; // Default sortBy for transactions
      }

      // Add order parameter
      if (filters?.order) {
        params.order = filters.order;
      } else {
        params.order = "desc"; // Default order
      }

      const response = await apiClient.get("identity/admin/dashboard/transactions", {
        params
      });
      const data: PaginatedTransactionListResponse = response.data;

      if (apiResponseCodeUtils.isSuccessCode(data.code)) {
        return data.result;
      } else {
        console.error("Error fetching transactions: API returned error code", data.code, data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return null;
    }
  },

  /**
   * Get top purchased items for dashboard
   * @param limit Number of items to retrieve (optional)
   * @returns Array of purchased items for top purchased courses/plans
   */
  getTopPurchased: async (limit?: number) => {
    try {
      console.log("Fetching top purchased items", limit ? `with limit: ${limit}` : "");
      const response = await apiClient.get("identity/admin/dashboard/top-purchased", {
        params: limit ? { limit } : {}
      });
      const data: PurchasedListResponse = response.data;
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
