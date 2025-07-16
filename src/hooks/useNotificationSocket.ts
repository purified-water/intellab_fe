import useWebSocket from "react-use-websocket";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "@/redux/notifications/notificationsSlice";
import { NotificationType } from "@/features/Notification/types/NotificationType";
import { getUserIdFromLocalStorage } from "@/utils";
import { showToastDefault } from "@/utils";
import { useToast } from "./use-toast";
import { RootState } from "@/redux/rootReducer";

// Dispatch notifications to Redux on message receive
export const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const userId = getUserIdFromLocalStorage();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Keep track of notification IDs that have already been shown as toast
  const shownNotificationIds = useRef(new Set<string>());

  const { lastMessage } = useWebSocket(`${import.meta.env.VITE_SOCKET_URL}/identity/ws/notification?userId=${userId}`, {
    shouldReconnect: () => true, // Automatically try to reconnect
    reconnectAttempts: 10, // Retry 10 times if disconnected
    reconnectInterval: 3000 // Retry every 3 seconds
  });

  useEffect(() => {
    if (!userId || !isAuthenticated || lastMessage === null) return;

    if (lastMessage !== null) {
      // Check if the message is a welcome/connection message
      if (typeof lastMessage.data === 'string' && lastMessage.data.startsWith('Welcome')) {
        console.log("WebSocket connection established:", lastMessage.data);
        return;
      }

      try {
        const parsed = JSON.parse(lastMessage.data);
        
        // Validate that this is a proper notification with required fields
        if (parsed && 
            parsed.id && 
            parsed.title && 
            parsed.message && 
            parsed.redirectType && 
            typeof parsed.timestamp === 'number') {
          
          const notification = parsed as NotificationType;
          
          // Add notification to Redux store
          dispatch(addNotification(notification));
          
          // Only show toast if this notification hasn't been shown before
          if (!shownNotificationIds.current.has(notification.id)) {
            shownNotificationIds.current.add(notification.id);
            showToastDefault({
              toast: toast.toast,
              title: "New Notification",
              message: notification.title,
              duration: 4000
            });
          }
        }
      } catch (err) {
        console.warn("Received non-JSON or invalid message:", lastMessage.data);
      }
    }
  }, [lastMessage, dispatch, toast.toast, userId, isAuthenticated]);

  // Clear shown notification IDs when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      shownNotificationIds.current.clear();
    }
  }, [isAuthenticated]);
};
