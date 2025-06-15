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
import { mockTransactions, MOCK_CONFIG, simulateDelay } from "../mockData/transactionMockData";

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
      console.log("Loading transactions for page:", page);

      let formattedTransactions: Transaction[] = [];

      if (MOCK_CONFIG.USE_MOCK_DATA) {
        // Use mock data
        console.log("Using mock data for transactions");
        await simulateDelay();

        // Apply filters to mock data
        const filteredMockTransactions = mockTransactions.filter(
          (transaction) =>
            (transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              transaction.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedType === "All" || transaction.type === selectedType) &&
            (selectedStatus === "All" || transaction.status === selectedStatus)
        );

        // Sort transactions
        const sortedTransactions = [...filteredMockTransactions].sort((a, b) => {
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

        formattedTransactions = sortedTransactions;
      } else {
        // Use real API
        const apiTransactions = await transactionAPI.getTransactions(page, itemsPerPage);

        if (apiTransactions.length === 0) {
          setErrorMessage("No transactions found.");
          setTransactions([]);
          setTotalPages(0);
          return;
        }

        formattedTransactions = apiTransactions.map((transaction, index) => ({
          id: `${transaction.user.userId}-${index}`,
          name: transaction.user.displayName || `${transaction.user.firstName} ${transaction.user.lastName}`,
          email: transaction.user.email,
          amount: `${(transaction.amount * 25000).toLocaleString()} VND`, // Convert USD to VND (approximate rate)
          date: new Date(transaction.date).toLocaleDateString(),
          status: transaction.status,
          type: transaction.type === "COURSE" ? "Course" : ("Plan" as "Course" | "Plan")
        }));

        // Apply filters
        const filteredTransactions = formattedTransactions.filter(
          (transaction) =>
            (transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              transaction.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedType === "All" || transaction.type === selectedType) &&
            (selectedStatus === "All" || transaction.status === selectedStatus)
        );

        // Sort transactions
        const sortedTransactions = [...filteredTransactions].sort((a, b) => {
          const amountA = parseFloat(a.amount.replace(/[VND,\s]/g, ""));
          const amountB = parseFloat(b.amount.replace(/[VND,\s]/g, ""));
          return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
        });

        formattedTransactions = sortedTransactions;
      }

      // Pagination
      const totalPages = Math.ceil(formattedTransactions.length / itemsPerPage);
      const startIndex = page * itemsPerPage;
      const paginatedTransactions = formattedTransactions.slice(startIndex, startIndex + itemsPerPage);

      setTransactions(paginatedTransactions);
      setTotalPages(totalPages);
      setCurrentPage(page);

      if (formattedTransactions.length === 0) {
        setErrorMessage("No transactions found.");
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");
      if (!MOCK_CONFIG.USE_MOCK_DATA) {
        showToastError({ toast: toast.toast, message: "Failed to load transactions" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(0);
  }, [searchQuery, selectedType, selectedStatus, sortOrder, dateSortOrder]);

  const handlePageChange = (page: number) => {
    loadTransactions(page);
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
          <Button variant="outline" size="sm" onClick={() => loadTransactions(currentPage)} disabled={loading}>
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
          <TableHead className="w-[15%]">
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
          <TableHead className="w-[15%]">
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
          </TableHead>
          <TableHead className="w-[15%]">
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
                <Skeleton className="w-20 h-6 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-16 h-6 rounded-full" />
              </TableCell>
            </TableRow>
          ))
        ) : transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center">
              <EmptyList message={errorMessage || "No transactions found"} />
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="text-sm text-muted-foreground">{transaction.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell className="font-semibold">{transaction.amount}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.status}
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === "Course"
                      ? "bg-blue-100 text-blue-800"
                      : transaction.type === "Plan"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.type}
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
