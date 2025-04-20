import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationCard } from "./NotificationCard";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store"; // Import the typed dispatch
import { RootState } from "@/redux/rootReducer";
import { Button, Spinner } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markAllAsRead } from "@/redux/notifications/notificationsSlice"; // Import the fetchNotifications action
import { notificationAPI } from "@/lib/api/notificationAPI";

interface NotificationMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const NotificationMenu = ({ isOpen, setIsOpen }: NotificationMenuProps) => {
  const dispatch = useAppDispatch(); // Use the typed dispatch

  const notifications = useSelector((state: RootState) => state.notifications.list);
  const loading = useSelector((state: RootState) => state.notifications.loading);
  const error = useSelector((state: RootState) => state.notifications.error);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when the component mounts
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      dispatch(fetchNotifications({ page: 0, size: 10 }));
    }
  }, [isOpen, dispatch]); // Fetch notifications when the menu opens

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }, 150);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOpen) {
      timer = setTimeout(async () => {
        await notificationAPI.putMarkAllAsRead().then(() => {
          dispatch(markAllAsRead());
        });
      }, 5000);
    }

    return () => clearTimeout(timer); // Clear if closed early
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="notification-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 z-10 bg-white rounded-lg shadow-md w-[460px] top-3"
          >
            <div className="p-3 font-semibold border-b">Notifications</div>
            <div className="overflow-y-auto max-h-64">
              {loading && (
                <div className="flex items-center justify-center w-full h-full mt-4">
                  <Spinner loading={loading} />
                </div>
              )}
              {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
              {notifications.length > 0
                ? notifications.map((notif) => <NotificationCard key={notif.id} type="menu" notification={notif} />)
                : !loading && <div className="p-4 text-center text-gray-500">No notifications</div>}
            </div>
            <div className="flex px-4 py-1 rounded-b-lg">
              <Button
                className="px-2 py-0 hover:bg-white hover:text-gray1 text-gray3"
                variant="ghost"
                onClick={() => navigate("/notification")}
              >
                All notifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
