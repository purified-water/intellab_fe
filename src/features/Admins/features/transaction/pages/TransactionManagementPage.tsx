import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/shadcn/tabs";
import { SearchBar } from "@/features/Problem/components/ProblemPage/SearchBar";
import { PurchasedItemsList, TransactionsTableList } from "../components";

const TABS = {
  PURCHASED: "purchased",
  TRANSACTION_LIST: "transaction-list"
};

export function TransactionManagementPage() {
  const [activeTab, setActiveTab] = useState(TABS.TRANSACTION_LIST);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Transaction Management | Intellab";
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.PURCHASED:
        return (
          <div className="space-y-6">
            {/* <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Purchased Items</h2>
            </div> */}
            <PurchasedItemsList searchQuery={searchQuery} />
          </div>
        );
      case TABS.TRANSACTION_LIST:
        return (
          <div className="space-y-6">
            {/* <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
            </div> */}
            <TransactionsTableList searchQuery={searchQuery} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderSearchBar = () => {
    return (
      <div className="w-full max-w-[1100px] flex items-center justify-start">
        <SearchBar
          value={searchQuery}
          onSearch={setSearchQuery}
          width={1100}
          placeHolderText="Searching with Payment ID"
        />
      </div>
    );
  };

  return (
    <div className="container max-w-[1200px] mx-auto space-y-8 mb-12">
      <h1 className="mx-4 text-4xl font-bold text-appPrimary">Payment Management</h1>

      <div className="space-y-3 justify-items-center">
        {/* Global Search Bar */}
        {activeTab === TABS.TRANSACTION_LIST && renderSearchBar()}

        {/* Tabs for Transaction List and Purchased Items */}

        <div className="min-w-[1100px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-transparent h-auto p-0 rounded-none">
              <TabsTrigger
                value={TABS.TRANSACTION_LIST}
                className="rounded-none data-[state=active]:shadow-none data-[state=active]:text-appAccent data-[state=active]:border-b-2 data-[state=active]:border-appAccent py-2 px-3 font-semibold text-xl"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger
                value={TABS.PURCHASED}
                className="rounded-none data-[state=active]:shadow-none data-[state=active]:text-appAccent data-[state=active]:border-b-2 data-[state=active]:border-appAccent py-2 px-3 font-semibold text-xl"
              >
                Top Purchases
              </TabsTrigger>
            </TabsList>

            <TabsContent value={TABS.TRANSACTION_LIST} className="">
              {renderTabContent()}
            </TabsContent>
            <TabsContent value={TABS.PURCHASED} className="">
              {renderTabContent()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
