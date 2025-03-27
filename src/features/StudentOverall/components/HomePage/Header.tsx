import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

const DEFAULT_GREETING = "Welcome to Intellab!";

export const Header = () => {
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const userRedux = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = userRedux != null;

  useEffect(() => {
    if (isAuthenticated) {
      const userName = userRedux?.displayName;
      if (userName) {
        setGreeting(`Welcome back, ${userName}!`);
      }
    } else {
      setGreeting(DEFAULT_GREETING);
    }
  }, [isAuthenticated]);

  const renderGreeting = () => {
    return (
      <div className="mt-8 mb-6 text-left sm:mt-0 md:mb-0">
        <h1 className="mb-2 text-4xl font-bold md:text-5xl text-appPrimary">{greeting}</h1>
        <span className="mt-2 text-xl font-light text-gray3">Continue your studies or start a new course!</span>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <div className="flex justify-between w-full mt-4 space-x-2 text-center sm:w-fit md:space-y-0 md:space-x-8">
        <div id="login-streak">
          <p className="mb-2 text-xs font-semibold text-black md:mb-10">LOGIN STREAK</p>
          <p className="text-3xl font-bold text-black md:text-4xl">6</p>
          <p className="text-xs text-black">Days</p>
        </div>

        <div id="points">
          <p className="mb-2 text-xs font-semibold text-black md:mb-10">YOUR POINTS</p>
          <p className="text-3xl font-bold text-black md:text-4xl">100</p>
          <p className="text-xs text-black">Points</p>
        </div>

        <div id="courses">
          <p className="mb-2 text-xs font-semibold text-black md:mb-10">YOUR COURSES</p>
          <p className="text-3xl font-bold text-black md:text-4xl">{userRedux?.courseCount ?? 0}</p>
          <p className="text-xs text-black">Courses</p>
        </div>
      </div>
    );
  };

  return (
    <header className="flex flex-col items-start justify-between w-full h-auto px-4 mb-8 md:flex-row md:items-center md:h-56 md:pr-12">
      {renderGreeting()}
      {isAuthenticated && renderBody()}
    </header>
  );
};
