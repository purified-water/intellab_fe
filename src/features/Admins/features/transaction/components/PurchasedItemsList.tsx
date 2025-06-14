import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/shadcn/table";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/shadcn/select";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Funnel } from "lucide-react";
import { transactionAPI } from "@/lib/api";
import { EmptyList, Pagination } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { mockPurchasedItems, MOCK_CONFIG, simulateDelay } from "../mockData/transactionMockData";

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

  const loadPurchasedItems = async (page: number = 0) => {
    setLoading(true);
    setErrorMessage("");
    try {
      console.log("Loading purchased items for page:", page);

      let formattedItems: PurchasedItem[] = [];

      if (MOCK_CONFIG.USE_MOCK_DATA) {
        // Use mock data
        console.log("Using mock data for purchased items");
        await simulateDelay();

        // Apply filters to mock data
        const filteredMockItems = mockPurchasedItems.filter(
          (item) =>
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedType === "All" || item.type === selectedType)
        );

        // Sort items
        const sortedItems = [...filteredMockItems].sort((a, b) => {
          const amountA = parseFloat(a.amount.replace(/[$,]/g, ""));
          const amountB = parseFloat(b.amount.replace(/[$,]/g, ""));
          return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
        });

        formattedItems = sortedItems;
      } else {
        // Use real API
        const apiItems = await transactionAPI.getTopPurchased();

        if (apiItems.length === 0) {
          setErrorMessage("No purchased items found.");
          setItems([]);
          setTotalPages(0);
          return;
        }

        formattedItems = apiItems.map((item) => ({
          name: item.user.displayName || `${item.user.firstName} ${item.user.lastName}`,
          email: item.user.email,
          amount: `${(item.amount * 25000).toLocaleString()} VND`, // Convert USD to VND (approximate rate)
          date: new Date(item.date).toLocaleDateString(),
          type: item.type === "COURSE" ? "Free" : ("Plan" as "Free" | "Plan")
        }));

        // Apply filters
        const filteredItems = formattedItems.filter(
          (item) =>
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedType === "All" || item.type === selectedType)
        );

        // Sort items
        const sortedItems = [...filteredItems].sort((a, b) => {
          if (dateSortOrder !== "desc") {
            // Sort by date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateSortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
          } else {
            // Sort by amount
            const amountA = parseFloat(a.amount.replace(/[VND,\s]/g, ""));
            const amountB = parseFloat(b.amount.replace(/[VND,\s]/g, ""));
            return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
          }
        });

        formattedItems = sortedItems;
      }

      // Pagination
      const totalPages = Math.ceil(formattedItems.length / itemsPerPage);
      const startIndex = page * itemsPerPage;
      const paginatedItems = formattedItems.slice(startIndex, startIndex + itemsPerPage);

      setItems(paginatedItems);
      setTotalPages(totalPages);
      setCurrentPage(page);

      if (formattedItems.length === 0) {
        setErrorMessage("No purchased items found.");
      }
    } catch (error) {
      console.error("Failed to fetch purchased items:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");
      if (!MOCK_CONFIG.USE_MOCK_DATA) {
        showToastError({ toast: toast.toast, message: "Failed to load purchased items" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchasedItems(0);
  }, [searchQuery, selectedType, sortOrder, dateSortOrder]);

  const handlePageChange = (page: number) => {
    loadPurchasedItems(page);
  };

  const renderHeader = () => {
    return (
      <div className="space-y-4 mb-6">
        {MOCK_CONFIG.USE_MOCK_DATA && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-md text-sm">
            <strong>Mock Mode:</strong> Using simulated data for testing
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => loadPurchasedItems(currentPage)} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>
    );
  };

  const renderTableHeader = () => {
    return (
      <TableHeader>
        <TableRow>
          <TableHead className="w-[35%]">{TABLE_HEADERS.USER}</TableHead>
          <TableHead className="w-[20%]">
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
          </TableHead>
          <TableHead className="w-[20%]">
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
          </TableHead>
          <TableHead className="w-[25%]">
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
          </TableHead>
        </TableRow>
      </TableHeader>
    );
  };

  const renderTableBody = () => {
    return (
      <TableBody>
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-40 h-3" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-16 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-16 h-6 rounded-full" />
              </TableCell>
            </TableRow>
          ))
        ) : items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="py-8 text-center">
              <EmptyList message={errorMessage || "No purchased items found"} />
            </TableCell>
          </TableRow>
        ) : (
          items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell className="font-semibold">{item.amount}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === "Free" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {item.type}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
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
    <div className="space-y-6">
      {renderHeader()}
      <div className="border rounded-md">
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </div>
      {renderPagination()}
    </div>
  );
}
