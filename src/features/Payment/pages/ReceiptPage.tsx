import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaymentBlock } from "../components";
import { TIntellabPayment } from "../types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils";
import { paymentAPI } from "@/lib/api";
import { Spinner } from "@/components/ui";

export const ReceiptPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [payment, setPayment] = useState<TIntellabPayment | null>(null);

  const getReceiptDetail = async () => {
    try {
      setLoading(true);
      if (!id) {
        throw new Error("Invalid receipt ID");
      }
      const response = await paymentAPI.getIntellabPayment(id);
      console.log("Receipt detail: ", response);
      setPayment(response.result);
      setLoading(false);
    } catch (error) {
      console.log(error);
      showToastError({ toast: toast.toast, title: "Failed to fetch receipt detail", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReceiptDetail();
  }, []);

  return (
    <div className="container px-8 py-8 mx-auto sm:px-24">
      <h1
        className="flex items-center mb-8 text-2xl font-bold cursor-pointer hover:text-appPrimary"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1" />
        Receipt
      </h1>

      <div className="flex justify-center">
        {!loading && payment ? <PaymentBlock payment={payment} loading={loading} /> : <Spinner loading={loading} />}
      </div>
    </div>
  );
};
