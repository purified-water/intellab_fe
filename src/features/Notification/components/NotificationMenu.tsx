import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationType } from "../types/NotificationType";
import { NotificationCard } from "./NotificationCard";

interface NotificationMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const NotificationMenu = ({ isOpen, setIsOpen }: NotificationMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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

  const notifications: NotificationType[] = [
    { id: 1, type: "comment", user: "@hoangquoc2106", content: "commented on Two Sum", modifiedDate: "2023-10-01" },
    { id: 2, type: "achievement", content: "Completed a course!", modifiedDate: "2023-10-02" },
    {
      id: 3,
      type: "alert",
      content: "Please verify your account to continue using the app",
      modifiedDate: "2023-10-03"
    },
    { id: 2, type: "achievement", content: "Completed a course!", modifiedDate: "2023-10-02" },
    {
      id: 3,
      type: "alert",
      content: "Please verify your account to continue using the app",
      modifiedDate: "2023-10-03"
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 z-10 bg-white rounded-lg shadow-md w-[460px] top-3"
          >
            <div className="p-3 font-semibold border-b">Notifications</div>
            <div className="overflow-y-auto max-h-64">
              {notifications.map((notif) => (
                <NotificationCard key={notif.id} notification={notif} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
