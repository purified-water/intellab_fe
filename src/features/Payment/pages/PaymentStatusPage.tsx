import { PaymentBlock } from "../components";
import { TOrder } from "../types";

const SAMPLE_ORDER: TOrder = {
  success: true,
  id: "123456",
  information: "Certificate for React Developer",
  amount: "1,000,000 VND",
  responseTime: "2025-12-31 23:59:59"
};

export function PaymentStatusPage() {
  return (
    <div className="flex justify-center h-screen bg-gray5 pt-20">
      <div>
        <PaymentBlock order={SAMPLE_ORDER} />
      </div>
    </div>
  );
}
