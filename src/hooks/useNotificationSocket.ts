import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "@/redux/notifications/notificationsSlice";
import { NotificationType } from "@/features/Notification/types/NotificationType";
import { getUserIdFromLocalStorage } from "@/utils";

// Dispatch notifications to Redux on message receive
export const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const userId = getUserIdFromLocalStorage();
  if (!userId) {
    console.error("User ID not found in local storage");
    return;
  }

  const { lastMessage } = useWebSocket(`ws://localhost:8101/identity/ws/notification?userId=${userId}`, {
    shouldReconnect: () => true, // Automatically try to reconnect
    reconnectAttempts: 10, // Retry 10 times if disconnected
    reconnectInterval: 3000 // Retry every 3 seconds
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        // Optionally check if parsed has expected fields
        if (parsed && parsed.redirectType && parsed.message) {
          dispatch(addNotification(parsed as NotificationType));
        }
      } catch (err) {
        console.warn("Received non-JSON or invalid message:", lastMessage.data);
      }
    }
  }, [lastMessage, dispatch]);
};
