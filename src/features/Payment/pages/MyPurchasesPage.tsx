import { useEffect, useState } from "react";
import { PurchaseList } from "../components";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MyPurchasesPage = () => {
  const [activeTab, setActiveTab] = useState("COURSE");
  const navigate = useNavigate();

  const TAB_BUTTONS: { [key: string]: string } = {
    "Payment History": "COURSE",
    "Subscription History": "SUBSCRIPTION"
  };

  useEffect(() => {
    document.title = "My Purchases | Intellab";
  }, []);

  const renderTabButton = (label: string, key: number) => {
    return (
      <button
        key={key}
        onClick={() => setActiveTab(TAB_BUTTONS[label])}
        className={`text-xs sm:text-base ${activeTab === TAB_BUTTONS[label] ? "text-appAccent underline" : "text-gray3 hover:text-appAccent/80"}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="container px-8 py-8 mx-auto sm:px-24">
      <h1
        className="flex items-center mb-8 text-2xl font-bold cursor-pointer hover:text-appPrimary"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="mr-1" />
        My Purchases
      </h1>
      <div className="flex justify-center gap-8 mb-8 ml-8 text-base font-bold sm:justify-normal">
        {Object.keys(TAB_BUTTONS).map((label, index) => renderTabButton(label, index))}
      </div>
      <PurchaseList paymentFor={activeTab} />
    </div>
  );
};
