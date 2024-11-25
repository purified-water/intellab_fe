import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import intellab_side from "@/assets/logos/intellab_side.svg";
import { MdNotifications, MdAccountCircle, MdClose, MdMenu } from "rocketicons/md";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => (location.pathname === path ? "text-appAccent font-bold" : "text-gray3");

  return (
    <>
      <nav className="flex items-center justify-between w-full px-12 py-2 border-b border-gray5">
        <div className="flex items-center">
          <div className="flex items-center justify-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="mr-3 -ml-5 text-gray-600 transition mp-2 hover:text-gray-800"
            >
              {isMenuOpen ? "" : <MdMenu className="icon-lg" />}
            </button>
          </div>

          <Link to="/">
            <img src={intellab_side} alt="Intellab Logo" className="w-24 h-auto mr-4" />
          </Link>

          <div
            className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-white space-y-6 text-gray-600 lg:static lg:flex lg:flex-row lg:space-y-0 lg:space-x-6 lg:bg-transparent lg:w-auto ${
              isMenuOpen ? "flex" : "hidden"
            }`}
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-3 right-3 lg:hidden">
              <MdClose className="icon-lg" />
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

        <div id="premium" className="flex items-center space-x-4">
          <button className="px-3 py-1 text-base font-semibold transition bg-[#cbafe0] text-appPrimary rounded-xl hover:bg-appFadedPrimary">
            Premium
          </button>
          <button className="p-1 text-gray-600 transition hover:text-gray-800">
            <MdNotifications />
          </button>
          <button className="p-1 text-gray-600 transition hover:text-gray-800">
            <MdAccountCircle />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
