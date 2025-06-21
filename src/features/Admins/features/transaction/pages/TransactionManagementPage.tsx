import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/shadcn/tabs";
import { SearchBar } from "@/features/Problem/components/ProblemPage/SearchBar";
import { PurchasedItemsList, TransactionsTableList } from "../components";

const TABS = {
  PURCHASED: "purchased",
  TRANSACTION_LIST: "transaction-list"
};

export function TransactionManagementPage() {
  const [activeTab, setActiveTab] = useState(TABS.PURCHASED);
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

  return (
    <div className="px-2 space-y-6">
      <h1 className="text-4xl font-bold text-appPrimary">Transaction Management</h1>

      <div className="mx-auto space-y-3 justify-items-center">
        {/* Global Search Bar */}
        <div className="w-full max-w-[1100px] flex items-center justify-start">
          <SearchBar value={searchQuery} onSearch={setSearchQuery} width={1100} />
        </div>
        <div className="py-2"></div>
        <div className="min-w-[1100px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-transparent h-auto p-0 rounded-none">
              <TabsTrigger
                value={TABS.PURCHASED}
                className="rounded-none data-[state=active]:shadow-none data-[state=active]:text-appAccent data-[state=active]:border-b-2 data-[state=active]:border-appAccent py-2 px-3 font-semibold text-xl"
              >
                Purchased
              </TabsTrigger>
              <TabsTrigger
                value={TABS.TRANSACTION_LIST}
                className="rounded-none data-[state=active]:shadow-none data-[state=active]:text-appAccent data-[state=active]:border-b-2 data-[state=active]:border-appAccent py-2 px-3 font-semibold text-xl"
              >
                Transaction List
              </TabsTrigger>
            </TabsList>

            <TabsContent value={TABS.PURCHASED} className="">
              {activeTab === TABS.PURCHASED && renderTabContent()}
            </TabsContent>

            <TabsContent value={TABS.TRANSACTION_LIST} className="">
              {activeTab === TABS.TRANSACTION_LIST && renderTabContent()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
