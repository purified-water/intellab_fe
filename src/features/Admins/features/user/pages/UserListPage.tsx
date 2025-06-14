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
      <div className="px-2 space-y-4">
        <h1 className="text-4xl font-bold text-appPrimary">Users</h1>
        <div className="mx-auto space-y-3 justify-items-center">
          {renderHeader()}
          {renderUserList()}
        </div>
      </div>
    </>
  );
}
