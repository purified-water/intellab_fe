import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { intellabSideLogo, intellabSidePremiumLogo } from "@/assets";
import { MdAccountCircle, MdClose, MdMenu } from "rocketicons/md";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/auth/authSlice";
import { clearUser, clearLoginStreak } from "@/redux/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { userLocalStorageCleanUp } from "@/utils";
import { navigateWithPreviousPagePassed } from "@/utils";
import { TNavigationState } from "@/types";
import { clearPremiumStatus } from "@/redux/premiumStatus/premiumStatusSlice";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import { NotificationMenu } from "@/features/Notification/components";
import { ProfileMenu } from "./ProfileMenu";
import { PremiumStatus } from "./PremiumStatus";
import { Button } from "@/components/ui";
import { Bell } from "lucide-react";
import { selectHasUnread } from "@/redux/notifications/notificationsSlice";
interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode?: () => void;
}

const Navbar = ({ isDarkMode, toggleDarkMode }: NavbarProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Premium UI
  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const isCurrentPlanActive = reduxPremiumStatus?.status === PREMIUM_STATUS.ACTIVE;
  const isPremiumPlan = reduxPremiumStatus?.planType !== PREMIUM_PACKAGES.RESPONSE.FREE;
  const isAdmin = user?.role === "ADMIN";

  // Notifications
  const hasUnreadNotifications = useSelector(selectHasUnread);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(clearPremiumStatus());
    dispatch(clearUser());
    dispatch(clearLoginStreak()); // Clear cached login streak data
    dispatch(logoutSuccess());

    userLocalStorageCleanUp();
  };

  const handleLogin = () => {
    const state = { from: location.pathname } as TNavigationState;
    navigateWithPreviousPagePassed(navigate, state, "/login");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "text-appAccent font-semibold" : "text-muted-foreground";

  const renderUserPhoto = () => {
    const userPhoto = user?.photoUrl;
    if (userPhoto) {
      return (
        <img
          src={userPhoto}
          alt="User"
          className="object-contain border rounded-full size-8 border-gray4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = ""; // Reset src to trigger fallback
          }}
        />
      );
    }
    return <MdAccountCircle className="icon-xl" />;
  };

  return (
    <>
      <nav className="flex items-center justify-between w-full px-12 py-2 border-b border-gray5">
        <div className="flex items-center">
          <div className="flex items-center justify-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="mr-3 -ml-5 transition text-gray3 mp-2 hover:text-gray1"
            >
              {isMenuOpen ? "" : <MdMenu className="icon-lg icon-gray3" />}
            </button>
          </div>

          <Link to={isAdmin ? "/admin" : "/"}>
            {isCurrentPlanActive && isPremiumPlan ? (
              <img src={intellabSidePremiumLogo} alt="Intellab Logo" className="w-[86px] h-auto mr-2" />
            ) : (
              <img src={intellabSideLogo} alt="Intellab Logo" className="w-[86px] h-auto mr-2" />
            )}
          </Link>

          <div
            className={`text-base fixed inset-0 font-semibold z-40 flex flex-col items-center justify-center bg-white space-y-6 text-gray5 lg:static lg:flex lg:flex-row lg:space-y-0 lg:space-x-5 lg:bg-transparent lg:w-auto ${
              isMenuOpen ? "flex" : "hidden"
            }`}
          >
            <button type="button" onClick={() => setIsMenuOpen(false)} className="absolute top-3 right-3 lg:hidden">
              <MdClose className="icon-lg icon-gray3" />
            </button>
            <Link
              to="/explore"
              className={`transition-colors duration-300 hover:text-appAccent ${isActive("/explore")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/problems"
              className={`transition-colors duration-300 hover:text-appAccent ${isActive("/problems")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Problems
            </Link>
            <Link
              to="/leaderboard"
              className={`transition-colors duration-300 hover:text-appAccent ${isActive("/leaderboard")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
          </div>
        </div>

        <div id="premium" className="relative flex items-center space-x-3">
          {(!isCurrentPlanActive || !isPremiumPlan) && (
            <Link to="/pricing">
              <button
                type="button"
                className="px-3 py-1 font-medium transition rounded-lg bg-appFadedAccent/50 text-appAccent hover:bg-appFadedAccent/80"
              >
                Premium
              </button>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="relative notification-menu">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="px-2 py-1 transition text-gray3 hover:text-gray1 [&_svg]:size-5"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                >
                  <div className="relative">
                    <Bell />
                    {hasUnreadNotifications && (
                      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-appHard" />
                    )}
                  </div>
                </Button>
                {isNotificationOpen && (
                  <div className="absolute right-0">
                    <NotificationMenu isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
                  </div>
                )}
              </div>

              <div
                className="p-1 transition text-gray3 hover:text-gray1 hover:cursor-pointer profile-menu"
                onClick={toggleDropdown}
              >
                {renderUserPhoto()}
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0">
                  <ProfileMenu
                    user={user}
                    isDropdownOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                    handleLogout={handleLogout}
                    toggleDarkMode={toggleDarkMode}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}

              <PremiumStatus />
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="px-3 py-1 text-base font-medium transition border rounded-lg text-appPrimary border-appPrimary hover:bg-appPrimary hover:text-white"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
