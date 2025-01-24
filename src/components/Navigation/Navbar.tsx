import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import intellab_side from "@/assets/logos/intellab_side.svg";
import {
  MdNotifications,
  MdAccountCircle,
  MdClose,
  MdMenu,
  MdOutlinePerson,
  MdOutlineSettings,
  MdOutlineWbSunny,
  MdLogout
} from "rocketicons/md";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/auth/authSlice";
import { clearUser } from "@/redux/user/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileIconRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if the access token exists in cookies
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(logoutSuccess());
    Cookies.remove("accessToken");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
  };

  const isActive = (path: string) => (location.pathname === path ? "text-appAccent font-bold" : "text-gray3");

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
            <img src={intellab_side} alt="Intellab Logo" className="w-24 h-auto mr-4" />
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
            <Link
              to="/community"
              className={`text-lg font-semibold transition-colors hover:text-appAccent ${isActive("/community")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </Link>
          </div>
        </div>

        <div id="premium" className="relative flex items-center space-x-4">
          <Link to="/pricing">
            <button className="px-3 py-1 text-base font-semibold transition bg-appFadedAccent text-appAccent rounded-xl hover:bg-opacity-80">
              Premium
            </button>
          </Link>
          {isLoggedIn ? (
            <>
              <button className="p-1 transition text-gray3 hover:text-gray1">
                <MdNotifications className="icon-xl" />
              </button>
              <div
                ref={profileIconRef}
                className="p-1 transition text-gray3 hover:text-gray1 hover:cursor-pointer"
                onClick={toggleDropdown}
              >
                <MdAccountCircle className="icon-xl" />
              </div>
              {isDropdownOpen && (
                <div
                  id="dropdown"
                  ref={dropdownRef}
                  className="absolute right-0 z-10 w-56 mt-2 bg-white rounded-lg shadow-md top-10"
                >
                  <div className="flex flex-row items-center px-3">
                    <MdAccountCircle className="icon-3xl" />

                    <div className="flex flex-col px-4 py-2">
                      <div className="text-lg font-semibold">{user?.username}</div>
                      <div className="text-sm text-gray-500">100 points</div>
                    </div>
                  </div>

                  <hr className="border-gray5" />

                  <ul className="py-3 space-y-2">
                    <li className="px-4 py-2 text-gray3 hover:opacity-70">
                      <Link to="/profile">
                        <div className="flex items-center space-x-2">
                          <MdOutlinePerson className="icon-lg icon-gray3" />
                          <span>Profile</span>
                        </div>
                      </Link>
                    </li>
                    <li className="px-4 py-2 text-gray3 hover:opacity-70">
                      <Link to="/settings">
                        <div className="flex items-center space-x-2">
                          <MdOutlineSettings className="icon-lg icon-gray3" />
                          <span>Settings</span>
                        </div>
                      </Link>
                    </li>
                    <li className="px-4 py-2 text-gray3 hover:opacity-70">
                      <Link to="#">
                        <div className="flex items-center space-x-2">
                          <MdOutlineWbSunny className="icon-lg icon-gray3" />
                          <span>Light theme</span>
                        </div>
                      </Link>
                    </li>
                    <li className="px-4 py-2 text-gray3 hover:opacity-70">
                      <div className="flex items-center space-x-2">
                        <MdLogout className="icon-lg icon-gray3" />
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 text-base font-semibold transition border text-appPrimary border-appPrimary rounded-xl hover:opacity-90"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
