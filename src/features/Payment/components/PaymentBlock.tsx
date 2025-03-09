import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { CircleCheck, CircleX } from "lucide-react";
import { InformationRow } from "./InformationRow";
import { TOrder } from "../types";

type PaymentBlockProps = {
  order: TOrder;
};

export function PaymentBlock(props: PaymentBlockProps) {
  const { order } = props;
  const { success, id, information, amount, responseTime } = order;

  const navigate = useNavigate();

  const onBackHomeClick = () => {
    navigate("/");
  };

  const renderStatus = () => {
    let icon = null;
    let title = null;
    let color = null;

    if (success) {
      title = "Payment Successfully!";
      color = "appEasy";
      icon = <CircleCheck size={80} className="text-appEasy" />;
    } else {
      title = "Payment Failed!";
      color = "appHard";
      icon = <CircleX size={80} className="text-appHard" />;
    }

    return (
      <div className="justify-items-center space-y-4">
        {icon}
        <p className={`text-${color} font-bold text-2xl`}>{title}</p>
      </div>
    );
  };

  const renderInformation = () => {
    return (
      <div className="w-full space-y-2 mt-10">
        <InformationRow label="Order ID" value={id} />
        <InformationRow label="Order information" value={information} />
        <InformationRow label="Payment Amount" value={amount} />
        <InformationRow label="Response time" value={responseTime} />
      </div>
    );
  };

  return (
    <div className="bg-white px-10 py-8 justify-items-center w-[500px] text-gray2 rounded-md shadow-md">
      {renderStatus()}
      <p className="font-semibold text-lg mt-4">PAYMENT DETAIL</p>
      {renderInformation()}
      <Button className="mt-16 bg-appPrimary hover:bg-appPrimary/80 font-bold" onClick={onBackHomeClick}>
        Back to Home Page
      </Button>
    </div>
  );
}
