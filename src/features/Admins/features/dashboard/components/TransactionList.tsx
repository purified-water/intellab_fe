import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/shadcn/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/shadcn/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/shadcn/pagination";
import { Funnel } from "lucide-react"; // Import the funnel icon

interface Transaction {
  name: string;
  email: string;
  amount: string;
  date?: string;
  status?: string;
  type: "Course" | "Plan";
}

interface TransactionsListProps {
  title?: string;
  transactions: Transaction[];
  limit?: number;
}

export function TransactionsList({ title = "Recent Transactions", transactions, limit = 3 }: TransactionsListProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<"Course" | "Plan" | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<"Completed" | "Pending" | "Failed" | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  // Filter transactions based on search query, type, and status
  const filteredTransactions = transactions.filter(
    (transaction) =>
      (transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedType === "All" || transaction.type === selectedType) &&
      (selectedStatus === "all" || transaction.status === selectedStatus)
  );

  // Sort transactions by amount
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const amountA = parseFloat(a.amount.replace(/,/g, ""));
    const amountB = parseFloat(b.amount.replace(/,/g, ""));
    return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <Button variant="link" className="text-xs p-0 h-auto" onClick={() => setOpen(true)}>
            View all &gt;
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {paginatedTransactions.slice(0, limit).map((transaction, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{transaction.name}</div>
                    <div className="text-xs text-muted-foreground">{transaction.email}</div>
                  </div>
                </div>
                <div className="text-sm">{transaction.amount}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">User</TableHead>
                  {transactions[0]?.date && <TableHead>Date</TableHead>}
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <span>Amount</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </Button>
                    </div>
                  </TableHead>
                  {transactions[0]?.status && (
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <Select
                          value={selectedStatus}
                          onValueChange={(value) =>
                            setSelectedStatus(value as "Completed" | "Pending" | "Failed" | "all")
                          }
                        >
                          <SelectTrigger className="w-auto p-0 h-auto border-none shadow-none">
                            <Funnel className="h-4 w-4 cursor-pointer" />
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
                        <SelectTrigger className="w-auto p-0 h-auto border-none shadow-none">
                          <Funnel className="h-4 w-4 cursor-pointer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="plan">Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{transaction.name}</div>
                            <div className="text-sm text-muted-foreground">{transaction.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      {transaction.date && <TableCell>{transaction.date}</TableCell>}
                      <TableCell>{transaction.amount}</TableCell>
                      {transaction.status && (
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.status}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "Course"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {transaction.type}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4">
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
                      <PaginationLink isActive={currentPage === pageToShow} onClick={() => setCurrentPage(pageToShow)}>
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
