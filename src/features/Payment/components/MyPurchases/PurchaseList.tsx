import { useNavigate } from "react-router-dom";
import { TIntellabPayment } from "../../types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { paymentAPI } from "@/lib/api";
import { shortenDate, showToastError } from "@/utils";
import { VNPAY_TRANSACTION_CODE } from "../../constants";
import { EmptyList, Pagination } from "@/components/ui";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface PurchaseListProps {
  paymentFor: string;
}

export const PurchaseList = ({ paymentFor }: PurchaseListProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [purchases, setPurchases] = useState<TIntellabPayment[]>([]);
  const [loading, setLoading] = useState(false);

  const getPaymentHistory = async (page: number = 0) => {
    setLoading(true);
    try {
      const response = await paymentAPI.getPaymentMe(paymentFor, page);
      setTotalPages(response.result.totalPages);
      setCurrentPage(response.result.number);
      setPurchases(response.result.content);
    } catch (error) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, title: "Failed to fetch payment history", message: error.message });
      }
      showToastError({
        toast: toast.toast,
        title: "Failed to fetch payment history",
        message: "An unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentHistory();
    document.title = "My Purchases | Intellab";
  }, [paymentFor]);

  return (
    <div className="flex flex-col items-center justify-center overflow-x-auto">
      <table className="min-w-fit w-[1000px] table-auto">
        <thead className="border-b">
          <tr className="text-xs sm:text-base">
            {["Date Issued", "Description", "Amount", "Status"].map((header, index) => (
              <th key={index} className="px-4 py-2 text-center cursor-pointer text-gray2">
                <div className="flex items-center">
                  <p>{header}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="px-4 py-3">
                <Skeleton className="w-12 h-4" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="w-1/2 h-4" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="w-1/2 h-4" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="w-1/2 h-4" />
              </td>
            </tr>
          ) : (
            purchases.map((row, index) => (
              <tr
                key={index}
                className={`cursor-pointer text-xs sm:text-base ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
                onClick={() => {
                  navigate(`/my-purchases/receipt/${row.paymentId}`);
                }}
              >
                <td className="w-12 py-2 pl-4 text-left">{shortenDate(row.createdAt)}</td>
                <td className="w-2/6 px-4 py-2 font-semibold hover:text-appPrimary">{row.orderDescription}</td>
                <td className="w-20 px-4 py-2 text-left">{`${row?.totalPaymentAmount.toLocaleString()} ${row?.currency}`}</td>
                <td
                  className={`px-4 py-2 w-28 font-semibold ${
                    row.transactionStatus === VNPAY_TRANSACTION_CODE.SUCCESS ? "text-appEasy" : "text-appHard"
                  }`}
                >
                  {row.responseCodeDescription ? row.responseCodeDescription : row.transactionStatusDescription}
                </td>
              </tr>
            ))
          )}

          {!loading && purchases.length === 0 && (
            <tr>
              <td colSpan={4}>
                <EmptyList message="No purchases found" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mb-16">
        {totalPages != 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => getPaymentHistory(page)}
          />
        )}
      </div>
    </div>
  );
};
