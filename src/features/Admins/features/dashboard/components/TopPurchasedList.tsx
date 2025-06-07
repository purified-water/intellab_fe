import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/shadcn/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/shadcn/pagination";
import { Funnel } from "lucide-react";
import { transactionAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui";
import { EmptyList } from "@/components/ui/EmptyList";

interface TopPurchasedItem {
  name: string;
  email: string;
  amount: string;
  date?: string;
  status?: string;
  type: "Course" | "Plan";
}

interface TopPurchasedListProps {
  title?: string;
  items?: TopPurchasedItem[];
  limit?: number;
}

export function TopPurchasedList({
  title = "Top Purchased Items",
  items: initialItems,
  limit = 5
}: TopPurchasedListProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<"Course" | "Plan" | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<"Completed" | "Pending" | "Failed" | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to descending for top items
  const [items, setItems] = useState<TopPurchasedItem[]>(initialItems || []);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const itemsPerPage = 10;

  const loadTopPurchased = async (itemLimit?: number) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      console.log("Loading top purchased items");
      const apiItems = await transactionAPI.getTopPurchased(itemLimit);

      if (apiItems.length === 0) {
        setErrorMessage("No purchased items found.");
      } else {
        const formattedItems = apiItems.map((item) => ({
          name: item.user.displayName || `${item.user.firstName} ${item.user.lastName}`,
          email: item.user.email,
          amount: `$${item.amount.toLocaleString()}`,
          date: new Date(item.date).toLocaleDateString(),
          status: item.status,
          type: item.type === "COURSE" ? "Course" : ("Plan" as "Course" | "Plan")
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error("Failed to fetch top purchased items:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    // if (!initialItems) {
    //   loadTopPurchased(open ? undefined : limit);
    // }
    loadTopPurchased(open ? undefined : limit);
  }, [initialItems, open, limit]);

  // Filter items based on search query, type, and status
  const filteredItems = items.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedType === "All" || item.type === selectedType) &&
      (selectedStatus === "all" || item.status === selectedStatus)
  );

  // Sort items by amount
  const sortedItems = [...filteredItems].sort((a, b) => {
    const amountA = parseFloat(a.amount.replace(/[$,]/g, ""));
    const amountB = parseFloat(b.amount.replace(/[$,]/g, ""));
    return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => setOpen(true)}>
            View all &gt;
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: limit }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-16 h-4" />
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {paginatedItems.slice(0, limit).map((item, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                    </div>
                  </div>
                  <div className="text-sm">{item.amount}</div>
                </li>
              ))}
              {items.length === 0 && !isLoading && (
                <EmptyList message={errorMessage || "No purchased items found"} size="sm" />
              )}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => loadTopPurchased()}
              disabled={isLoading}
            >
              {isLoading ? <Skeleton className="w-4 h-4 mr-2" /> : null}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="overflow-hidden border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, idx) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="overflow-hidden border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">User</TableHead>
                    {items[0]?.date && <TableHead>Date</TableHead>}
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <span>Amount</span>
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
                    {items[0]?.status && (
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <span>Status</span>
                          <Select
                            value={selectedStatus}
                            onValueChange={(value) =>
                              setSelectedStatus(value as "Completed" | "Pending" | "Failed" | "all")
                            }
                          >
                            <SelectTrigger className="w-auto h-auto p-0 border-none shadow-none">
                              <Funnel className="w-4 h-4 cursor-pointer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableHead>
                    )}
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <span>Type</span>
                        <Select
                          value={selectedType}
                          onValueChange={(value) => setSelectedType(value as "Course" | "Plan" | "All")}
                        >
                          <SelectTrigger className="w-auto h-auto p-0 border-none shadow-none">
                            <Funnel className="w-4 h-4 cursor-pointer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Course">Course</SelectItem>
                            <SelectItem value="Plan">Plan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, idx) => (
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
                        {item.date && <TableCell>{item.date}</TableCell>}
                        <TableCell>{item.amount}</TableCell>
                        {item.status && (
                          <TableCell>
                            <div
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status}
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === "Course" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.type}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        {errorMessage || "No purchased items found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages >= 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageToShow =
                      currentPage > 3 && totalPages > 5
                        ? currentPage - 3 + i + (currentPage + 2 > totalPages ? totalPages - currentPage - 2 : 0)
                        : i + 1;
                    return pageToShow <= totalPages ? (
                      <PaginationItem key={pageToShow}>
                        <PaginationLink
                          isActive={currentPage === pageToShow}
                          onClick={() => setCurrentPage(pageToShow)}
                        >
                          {pageToShow}
                        </PaginationLink>
                      </PaginationItem>
                    ) : null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
