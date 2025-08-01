import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/shadcn/select";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Funnel } from "lucide-react";
import { transactionAPI } from "@/lib/api";
import { EmptyList, Pagination } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

interface PurchasedItem {
  name: string;
  email: string;
  amount: string;
  date: string;
  type: "Free" | "Plan";
}

interface PurchasedItemsListProps {
  searchQuery?: string;
}

const TABLE_HEADERS = {
  USER: "User",
  DATE: "Date",
  AMOUNT: "Amount",
  TYPE: "Type"
};

export function PurchasedItemsList({ searchQuery: externalSearchQuery = "" }: PurchasedItemsListProps) {
  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedType, setSelectedType] = useState<"Free" | "Plan" | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateSortOrder, _setDateSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toast = useToast();
  const itemsPerPage = 10;

  // Update internal search query when external prop changes and load data
  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const loadPurchasedItems = async (page: number = 0) => {
    setLoading(true);
    setErrorMessage("");
    try {
      let formattedItems: PurchasedItem[] = [];
      let paginationInfo = {
        totalPages: 0,
        totalElements: 0
      };

      const filters = {
        type: selectedType !== "All" ? selectedType.toLowerCase() : undefined,
        sortBy: dateSortOrder !== "desc" ? "date" : "amount",
        order: dateSortOrder !== "desc" ? dateSortOrder : sortOrder
      };

      const apiResponse = await transactionAPI.getPurchasedItemsWithMetadata(page, itemsPerPage, filters);

      if (!apiResponse || apiResponse.content.length === 0) {
        setErrorMessage("No purchased items found.");
        setItems([]);
        setTotalPages(0);
        return;
      }

      formattedItems = apiResponse.content.map((item) => ({
        name: item.user.displayName || `${item.user.firstName} ${item.user.lastName}`,
        email: item.user.email,
        amount: `${item.amount.toLocaleString()} VND`, // Convert USD to VND (approximate rate)
        date: new Date(item.date).toLocaleDateString(),
        type: item.type?.toUpperCase() === "FREE" || item.type === "Free" ? "Free" : ("Plan" as "Free" | "Plan")
      }));

      paginationInfo = {
        totalPages: apiResponse.totalPages,
        totalElements: apiResponse.totalElements
      };

      setItems(formattedItems);
      setTotalPages(paginationInfo.totalPages);
      setCurrentPage(page);

      if (formattedItems.length === 0) {
        setErrorMessage("No purchased items found.");
      }
    } catch (error) {
      console.error("Failed to fetch purchased items:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");

      showToastError({ toast: toast.toast, title: "Error", message: "Failed to load purchased items." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to prevent multiple rapid API calls
    const timeoutId = setTimeout(() => {
      loadPurchasedItems(0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedType, sortOrder, dateSortOrder]);

  const handlePageChange = (page: number) => {
    loadPurchasedItems(page);
  };

  const renderHeader = () => {
    return (
      <thead className="text-left border-t border-b border-gray5">
        <tr>
          <th className="py-4">
            <div className="flex items-center gap-2">{TABLE_HEADERS.USER}</div>
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
              <span>{TABLE_HEADERS.TYPE}</span>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as "Free" | "Plan" | "All")}>
                <SelectTrigger className="w-auto h-auto p-0 border-none shadow-none">
                  <Funnel className="w-4 h-4 cursor-pointer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Plan">Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </th>
        </tr>
      </thead>
    );
  };

  const renderBody = () => {
    return (
      <tbody>
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, idx) => (
            <tr key={idx} className="text-base border-b border-gray5">
              <td className="py-1">
                <div className="flex items-center gap-2">
                  {/* <Skeleton className="w-8 h-8 rounded-full" /> */}
                  <div className="space-y-1">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-40 h-3" />
                  </div>
                </div>
              </td>
              {/* <td className="py-1">
                <Skeleton className="w-20 h-4" />
              </td> */}
              <td className="py-1">
                <Skeleton className="w-16 h-4" />
              </td>
              <td className="py-1">
                <Skeleton className="w-16 h-6 rounded-full" />
              </td>
            </tr>
          ))
        ) : items.length === 0 ? (
          <tr>
            <td colSpan={4}>
              <div className="flex justify-center py-8">
                <EmptyList message={errorMessage || "No purchased items found"} />
              </div>
            </td>
          </tr>
        ) : (
          items.map((item, idx) => (
            <tr key={idx} className="text-base border-b border-gray5">
              <td className="py-1">
                <div className="flex items-center gap-2">
                  {/* <Avatar className="w-8 h-8">
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar> */}
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.email}</div>
                  </div>
                </div>
              </td>
              {/* <td className="py-1">{item.date}</td> */}
              <td className="py-1 font-semibold">{item.amount}</td>
              <td className="py-1">
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === "Free" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {item.type}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    );
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
