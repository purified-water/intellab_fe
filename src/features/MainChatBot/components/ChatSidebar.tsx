import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/shadcn/sidebar";
import { ChatbotHistoryItemType } from "../types/ChatbotHistoryType";
import { format, parseISO } from "date-fns";
import { FaSpinner } from "rocketicons/fa6";

interface ChatSidebarProps {
  chatHistoryItems: ChatbotHistoryItemType[];
  isOpen: boolean;
  isLoading: boolean;
  onSelectChat: (chatItem: ChatbotHistoryItemType) => void;
}

export const ChatSidebar = ({ isOpen, isLoading, chatHistoryItems, onSelectChat }: ChatSidebarProps) => {
  // Sort chat history items by timestamp (latest first)
  const sortedHistory = [...chatHistoryItems].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group sorted history by date
  const groupedHistory = sortedHistory.reduce(
    (acc, item) => {
      const date = format(parseISO(item.timestamp), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, ChatbotHistoryItemType[]>
  );

  // Sort dates in descending order (most recent date first)
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (chatHistoryItems.length === 0) {
    return (
      <div
        className={`fixed left-0 top-0 bottom-0 h-full transition-all duration-300 ${
          isOpen ? "w-64 opacity-100" : "w-0 opacity-0"
        }`}
      >
        {isOpen && (
          <Sidebar variant="modal" className="w-64 h-full rounded-l-lg">
            <SidebarContent className="rounded-l-lg">
              <SidebarGroup>
                {isLoading ? (
                  <FaSpinner className="self-center inline-block mt-8 icon-sm animate-spin icon-gray3" />
                ) : (
                  <SidebarGroupLabel>No chat history available</SidebarGroupLabel>
                )}
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )}
      </div>
    );
  }

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 h-full transition-all duration-300 ${
        isOpen ? "w-64 opacity-100" : "w-0 opacity-0"
      }`}
    >
      {isOpen && (
        <Sidebar variant="modal" className="w-64 h-full rounded-l-lg">
          <SidebarContent className="bg-white rounded-l-lg">
            {sortedDates.map((date) => (
              <SidebarGroup key={date}>
                <SidebarGroupLabel>{format(parseISO(date), "MMMM dd, yyyy")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {groupedHistory[date].map((item) => (
                      <SidebarMenuItem key={item.thread_id}>
                        <SidebarMenuButton className="px-4 py-4" asChild>
                          <a
                            href="#"
                            className="flex items-center space-x-2"
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectChat(item); // Call function to update chatDetail
                            }}
                          >
                            <span>{item.title !== "No title available" ? item.title : "Untitled Chat"}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
      )}
    </div>
  );
};
