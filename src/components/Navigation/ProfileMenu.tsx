import { Link } from "react-router-dom";
import { MdOutlinePerson, MdOutlineSettings, MdLogout } from "rocketicons/md";
import { Sun, Moon, ReceiptText } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IUser } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";

interface ProfileMenuProps {
  user: IUser | null;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  handleLogout: () => void;
  toggleDarkMode?: () => void;
  isDarkMode: boolean;
}

export const ProfileMenu = ({
  user,
  isDropdownOpen,
  toggleDropdown,
  handleLogout,
  toggleDarkMode,
  isDarkMode
}: ProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const userPoint = useSelector((state: RootState) => state.user.point);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (isDropdownOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
          toggleDropdown();
        }
      }, 150);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={menuRef} className="relative">
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-10 w-56 mt-2 bg-white rounded-lg shadow-md top-6"
          >
            <div className="flex flex-row items-center px-3">
              <img
                src={user?.photoUrl || DEFAULT_AVATAR}
                alt="User"
                className="object-contain w-8 h-8 border rounded-full border-gray4"
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              />
              <div className="flex flex-col px-4 py-2">
                <p className="text-lg font-semibold truncate max-w-[150px]">{user?.displayName ?? "User_name"}</p>
                <div className="text-gray-500 ">{userPoint ?? 0} points</div>
              </div>
            </div>

            <hr className="border-gray5" />

            <ul className="py-3 space-y-2 text-gray3">
              <li className="px-4 py-2 mx-2 rounded-lg hover:bg-gray6/50">
                <Link to={`/profile/${user?.userId}`}>
                  <div className="flex items-center space-x-2">
                    <MdOutlinePerson className="icon-base icon-gray3" />
                    <div>Profile</div>
                  </div>
                </Link>
              </li>

              <li className="px-4 py-2 mx-2 rounded-lg hover:bg-gray6/50">
                <Link to="/my-purchases">
                  <div className="flex items-center space-x-2">
                    <ReceiptText className="icon-gray3 size-5" />
                    <div>My Purchases</div>
                  </div>
                </Link>
              </li>

              <li className="px-4 py-2 mx-2 rounded-lg hover:bg-gray6/50">
                <Link to="/profile/edit">
                  <div className="flex items-center space-x-2">
                    <MdOutlineSettings className="icon-base icon-gray3" />
                    <div>Settings</div>
                  </div>
                </Link>
              </li>
              <li className="hidden px-4 py-2 mx-2 rounded-lg hover:bg-gray6/50">
                <div onClick={toggleDarkMode} className="flex items-center space-x-2 cursor-pointer">
                  {isDarkMode ? (
                    <>
                      <Moon className="icon-base icon-gray3" />
                      <div>Dark Mode</div>
                    </>
                  ) : (
                    <>
                      <Sun className="icon-base icon-gray3" />
                      <div>Light Mode</div>
                    </>
                  )}
                </div>
              </li>
              <li className="px-4 py-2 mx-2 rounded-lg text-gray3 hover:bg-gray6/50">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <MdLogout className="icon-base icon-gray3" />
                  <div onClick={handleLogout}>Logout</div>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
