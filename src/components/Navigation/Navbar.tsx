import { Link, useLocation } from "react-router-dom";
import intellab_side from "@/assets/logos/intellab_side.svg";
import { MdNotifications, MdAccountCircle } from "rocketicons/md";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => (location.pathname === path ? "text-appAccent font-bold" : "text-gray3");

  return (
    <>
      <nav className="flex items-center justify-between w-full px-12 py-2 border-b border-gray5">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={intellab_side} alt="Intellab Logo" className="w-24 h-auto" />
          </Link>

          <div id="links" className="flex space-x-6 text-gray-600">
            <Link
              to="/explore"
              className={`text-lg font-semibold transition-colors hover:text-appAccent ${isActive("/explore")}`}
            >
              Explore
            </Link>
            <Link
              to="/problems"
              className={`text-lg font-semibold transition-colors hover:text-appAccent ${isActive("/problems")}`}
            >
              Problems
            </Link>
            <Link
              to="/community"
              className={`text-lg font-semibold transition-colors hover:text-appAccent ${isActive("/community")}`}
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
