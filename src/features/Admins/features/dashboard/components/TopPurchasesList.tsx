import { useState } from "react";
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

interface Purchase {
  name: string;
  email: string;
  amount: string;
  plan: "Free" | "Premium";
}

interface TopPurchasesListProps {
  title?: string;
  purchases: Purchase[];
  limit?: number;
}

export function TopPurchasesList({ title = "Top Purchases", purchases, limit = 3 }: TopPurchasesListProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<"amount">("amount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedPlan, setSelectedPlan] = useState<"Free" | "Premium" | "all">("all");
  const itemsPerPage = 10;

  // Filter purchases based on search query and plan
  const filteredPurchases = purchases.filter(
    (purchase) =>
      (purchase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        purchase.amount.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedPlan === "all" || purchase.plan === selectedPlan)
  );

  // Sort purchases by the selected column
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    const valueA = parseFloat(a.amount.replace(/,/g, ""));
    const valueB = parseFloat(b.amount.replace(/,/g, ""));
    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = sortedPurchases.slice(startIndex, startIndex + itemsPerPage);

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
            {purchases.slice(0, limit).map((purchase, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{purchase.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{purchase.name}</div>
                    <div className="text-xs text-muted-foreground">{purchase.email}</div>
                  </div>
                </div>
                <div className="text-sm">{purchase.amount}</div>
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
              placeholder="Search purchases..."
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
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <span>Amount</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs"
                        onClick={() => {
                          setSortColumn("amount");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                      >
                        {sortColumn === "amount" && sortOrder === "asc" ? "↑" : "↓"}
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <span>Plan</span>
                      <Select
                        value={selectedPlan}
                        onValueChange={(value) => setSelectedPlan(value as "Free" | "Premium" | "all")}
                      >
                        <SelectTrigger className="w-auto p-0 h-auto border-none shadow-none">
                          <Funnel className="h-4 w-4 cursor-pointer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPurchases.length > 0 ? (
                  paginatedPurchases.map((purchase, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{purchase.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{purchase.name}</div>
                            <div className="text-sm text-muted-foreground">{purchase.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{purchase.amount}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            purchase.plan === "Premium" ? "bg-appPrimary text-white" : "bg-white text-appPrimary"
                          }`}
                        >
                          {purchase.plan}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No purchases found
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
