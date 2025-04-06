import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { intellabSideLogo, intellabSidePremiumLogo } from "@/assets";
import { MdNotifications, MdAccountCircle, MdClose, MdMenu } from "rocketicons/md";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/auth/authSlice";
import { clearUser } from "@/redux/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { userLocalStorageCleanUp } from "@/utils";
import { navigateWithPreviousPagePassed } from "@/utils";
import { TNavigationState } from "@/types";
import { clearPremiumStatus } from "@/redux/premiumStatus/premiumStatusSlice";
import { PREMIUM_PACKAGES, PREMIUM_STATUS } from "@/constants";
import { NotificationMenu } from "@/features/Notification/components";
import { ProfileMenu } from "./ProfileMenu";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(clearPremiumStatus());
    dispatch(clearUser());
    dispatch(logoutSuccess());

    userLocalStorageCleanUp();
  };

  const handleLogin = () => {
    const state = { from: location.pathname } as TNavigationState;
    navigateWithPreviousPagePassed(navigate, state, "/login");
  };

  const isActive = (path: string) => (location.pathname === path ? "text-appAccent font-bold" : "text-gray3");

  const renderUserPhoto = () => {
    let content = <MdAccountCircle className="icon-xl" />;
    const userPhoto = user?.photoUrl;
    if (userPhoto) {
      content = <img src={userPhoto} alt="User" className="object-contain w-8 h-8 border rounded-full border-gray4" />;
    }
    return content;
  };

  return (
    <>
      <nav className="flex items-center justify-between w-full px-12 py-2 border-b border-gray5">
        <div className="flex items-center">
          <div className="flex items-center justify-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="mr-3 -ml-5 transition text-gray3 mp-2 hover:text-gray1"
            >
              {isMenuOpen ? "" : <MdMenu className="icon-lg icon-gray3" />}
            </button>
          </div>

          <Link to="/">
            {isCurrentPlanActive && isPremiumPlan ? (
              <img src={intellabSidePremiumLogo} alt="Intellab Logo" className="h-auto mr-2 w-44" />
            ) : (
              <img src={intellabSideLogo} alt="Intellab Logo" className="w-24 h-auto mr-2" />
            )}
          </Link>

          <div
            className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-white space-y-6 text-gray5 lg:static lg:flex lg:flex-row lg:space-y-0 lg:space-x-6 lg:bg-transparent lg:w-auto ${
              isMenuOpen ? "flex" : "hidden"
            }`}
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-3 right-3 lg:hidden">
              <MdClose className="icon-lg icon-gray3" />
            </button>
            <Link
              to="/explore"
              className={`text-lg font-semibold transition-colors hover:text-appAccent ${isActive("/explore")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/problems"
              className={`text-lg font-semibold transition-colors hover:text-appAccent ${isActive("/problems")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Problems
            </Link>
          </div>
        </div>

        <div id="premium" className="relative flex items-center space-x-4">
          {(!isCurrentPlanActive || !isPremiumPlan) && (
            <Link to="/pricing">
              <button className="px-3 py-1 text-base font-semibold transition bg-appFadedAccent text-appAccent rounded-xl hover:bg-opacity-80">
                Premium
              </button>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <div className="relative notification-menu">
                <button
                  className="p-1 transition text-gray3 hover:text-gray1"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                >
                  <MdNotifications className="icon-xl" />
                </button>
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
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-3 py-1 text-base font-semibold transition border text-appPrimary border-appPrimary rounded-xl hover:opacity-90"
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
