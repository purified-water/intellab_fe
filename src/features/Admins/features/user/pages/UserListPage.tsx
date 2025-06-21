import { useState } from "react";
import { SearchBar } from "@/features/Problem/components";
import { UserList } from "../components";
import { SEO } from "@/components/SEO";

export function UserListPage() {
  const [keyword, setKeyword] = useState("");

  const renderHeader = () => {
    return (
      <div>
        <SearchBar value={keyword} onSearch={setKeyword} width={1100} />
      </div>
    );
  };

  const renderUserList = () => {
    return (
      <div className="w-[1100px]">
        <UserList keyword={keyword} />
      </div>
    );
  };

  return (
    <>
      <SEO title="User Management | Intellab" />
      <div className="container max-w-[1200px] mx-auto space-y-8 mb-12">
        <h1 className="mx-4 text-4xl font-bold text-appPrimary">User Management</h1>
        <div className="space-y-3 justify-items-center">
          {renderHeader()}
          {renderUserList()}
        </div>
      </div>
    </>
  );
}
