import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui";
import { Button } from "@/components/ui";
import { ChatbotHistoryItemType } from "@/features/MainChatBot/types";
import { History } from "lucide-react";

interface ChatHistoryDropDownProps {
  chatHistoryItems: ChatbotHistoryItemType[];
  onSelectChat: (chatItem: ChatbotHistoryItemType) => void;
}

export const ChatHistoryDropDown = ({ chatHistoryItems, onSelectChat }: ChatHistoryDropDownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sortedHistory = [...chatHistoryItems].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button onClick={() => setDropdownOpen(!dropdownOpen)} variant="ghost" className="p-1 hover:text-gray1">
            <History />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full mx-2 overflow-y-scroll shadow-lg max-w-80 scrollbar-hide max-h-80">
          <DropdownMenuLabel>Chat History</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {chatHistoryItems.length !== 0 ? sortedHistory.map((item) => (
            <DropdownMenuItem
              key={item.thread_id}
              onClick={() => onSelectChat(item)}
              className="flex items-center w-full px-2 py-1 space-x-2 cursor-pointer"
            >
              <span className="block w-full truncate">
                {item.title !== "No title available" ? item.title : "Untitled Chat"}
              </span>
            </DropdownMenuItem>
          )) :
            <DropdownMenuItem className="flex items-center w-full px-2 py-1 space-x-2 cursor-pointer" disabled>
              <span className="block w-full truncate">Not available</span>
            </DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
