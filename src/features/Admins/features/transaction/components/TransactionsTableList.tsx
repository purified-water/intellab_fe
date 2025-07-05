import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/shadcn/select";
import { Button } from "@/components/ui/Button";
// import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Funnel } from "lucide-react";
import { transactionAPI } from "@/lib/api";
import { EmptyList, Pagination } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

interface Transaction {
  id: string;
  name: string;
  email: string;
  amount: string;
  date: string;
  status: string;
  type: "Course" | "Plan" | "Problem";
}

interface TransactionsTableListProps {
  searchQuery?: string;
}

const TABLE_HEADERS = {
  PAYMENT_ID: "Payment ID",
  USER: "User",
  DATE: "Date",
  AMOUNT: "Amount",
  STATUS: "Status",
  TYPE: "Type"
};

export function TransactionsTableList({ searchQuery: externalSearchQuery = "" }: TransactionsTableListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedType, setSelectedType] = useState<"Course" | "Plan" | "Problem" | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<"Success" | "Failed" | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toast = useToast();
  const itemsPerPage = 10;

  // Update internal search query when external prop changes
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const loadTransactions = async (page: number = 0) => {
    setLoading(true);
    setErrorMessage("");
    try {
      let formattedTransactions: Transaction[] = [];
      let totalPagesCount = 0;

      // Use real API with pagination metadata
      const filters = {
        keyword: searchQuery || undefined,
        status:
          selectedStatus !== "All" ? (selectedStatus === "Success" ? "00" : selectedStatus.toLowerCase()) : undefined,
        type: selectedType !== "All" ? selectedType.toLowerCase() : undefined,
        sortBy: dateSortOrder !== "desc" ? "date" : "amount",
        order: dateSortOrder !== "desc" ? dateSortOrder : sortOrder
      };
      const apiResponse = await transactionAPI.getTransactionsWithMetadata(page, itemsPerPage, filters);

      if (!apiResponse || !apiResponse.content) {
        setErrorMessage("No transactions found.");
        setTransactions([]);
        setTotalPages(0);
        setCurrentPage(0);
        return;
      }

      // Map API response to local format
      formattedTransactions = apiResponse.content.map((transaction) => ({
        id: transaction.id,
        name: transaction.user.displayName || `${transaction.user.firstName} ${transaction.user.lastName}`,
        email: transaction.user.email,
        amount: `${transaction.amount.toLocaleString()} VND`, // Convert USD to VND (approximate rate)
        date: new Date(transaction.date).toLocaleDateString(),
        status: transaction.status === "00" ? "Success" : "Failed",
        type:
          transaction.type?.toUpperCase() === "COURSE" || transaction.type === "Course"
            ? "Course"
            : transaction.type?.toUpperCase() === "PLAN" || transaction.type === "Plan"
              ? "Plan"
              : transaction.type?.toUpperCase() === "PROBLEM" || transaction.type === "Problem"
                ? "Problem"
                : ("Course" as "Course" | "Plan" | "Problem")
      }));

      // Use server-side pagination metadata
      totalPagesCount = apiResponse.totalPages;

      setTransactions(formattedTransactions);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);

      if (formattedTransactions.length === 0 && !searchQuery && selectedType === "All" && selectedStatus === "All") {
        setErrorMessage("No transactions found.");
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");
      showToastError({ toast: toast.toast, title: "Error", message: "Failed to load transactions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to prevent multiple rapid API calls
    const timeoutId = setTimeout(() => {
      loadTransactions(0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedType, selectedStatus, sortOrder, dateSortOrder]);

  const handlePageChange = (page: number) => {
    loadTransactions(page);
  };

  const renderHeader = () => {
    return (
      <thead className="text-left border-t border-b border-gray5">
        <tr>
          <th className="py-4">
            <div className="flex items-center gap-2">{TABLE_HEADERS.PAYMENT_ID}</div>
          </th>
          <th className="py-4">
            <div className="flex items-center gap-2">{TABLE_HEADERS.USER}</div>
          </th>
          <th className="py-4">
            <div className="flex items-center gap-1">
              <span>{TABLE_HEADERS.DATE}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc")}
              >
                {dateSortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </th>
          <th className="py-4">
            <div className="flex items-center gap-1">
              <span>{TABLE_HEADERS.AMOUNT}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </th>
          <th className="py-4">
            <div className="flex items-center gap-1">
              <span>{TABLE_HEADERS.STATUS}</span>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as "Success" | "Failed" | "All")}
              >
                <SelectTrigger className="w-auto h-auto p-0 border-none shadow-none">
                  <Funnel className="w-4 h-4 cursor-pointer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </th>
          <th className="py-4">
            <div className="flex items-center gap-1">
              <span>{TABLE_HEADERS.TYPE}</span>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as "Course" | "Plan" | "Problem" | "All")}
              >
                <SelectTrigger className="w-auto h-auto p-0 border-none shadow-none">
                  <Funnel className="w-4 h-4 cursor-pointer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Plan">Plan</SelectItem>
                  <SelectItem value="Problem">Problem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </th>
        </tr>
      </thead>
    );
  };

  const renderSkeleton = () => {
    return (
      <tbody>
        {Array.from({ length: itemsPerPage }).map((_, idx) => (
          <tr key={idx} className="text-base border-b border-gray5">
            <td className="py-1">
              <Skeleton className="w-32 h-4" />
            </td>
            <td className="py-1">
              <div className="flex items-center gap-2">
                {/* <Skeleton className="w-8 h-8 rounded-full" /> */}
                <div className="space-y-1">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-40 h-3" />
                </div>
              </div>
            </td>
            <td className="py-1">
              <Skeleton className="w-20 h-4" />
            </td>
            <td className="py-1">
              <Skeleton className="w-16 h-4" />
            </td>
            <td className="py-1">
              <Skeleton className="w-16 h-6 rounded-full" />
            </td>
            <td className="py-1">
              <Skeleton className="w-16 h-6 rounded-full" />
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const renderEmpty = () => {
    return (
      <tbody>
        <tr>
          <td colSpan={6}>
            <div className="flex justify-center py-8">
              <EmptyList message={errorMessage || "No transactions found"} />
            </div>
          </td>
        </tr>
      </tbody>
    );
  };

  const renderList = () => {
    return (
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="text-base border-b border-gray5">
            <td className="py-1">{transaction.id}</td>
            <td className="py-1">
              <div className="flex items-center gap-2">
                {/* <Avatar className="w-8 h-8">
                  <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                </Avatar> */}
                <div>
                  <div className="font-medium">{transaction.name}</div>
                  <div className="text-sm text-muted-foreground">{transaction.email}</div>
                </div>
              </div>
            </td>
            <td className="py-1">
              {new Date(transaction.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
            </td>
            <td className="py-1 font-semibold">{transaction.amount}</td>
            <td className="py-1">
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {transaction.status}
              </div>
            </td>
            <td className="py-1">
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.type === "Course"
                    ? "bg-blue-100 text-blue-800"
                    : transaction.type === "Plan"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-orange-100 text-orange-800"
                }`}
              >
                {transaction.type}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const renderBody = () => {
    if (loading) {
      return renderSkeleton();
    } else if (transactions.length === 0) {
      return renderEmpty();
    } else {
      return renderList();
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    );
  };

  return (
    <div>
      <table className="w-full">
        {renderHeader()}
        {renderBody()}
      </table>

      {renderPagination()}
    </div>
  );
}
