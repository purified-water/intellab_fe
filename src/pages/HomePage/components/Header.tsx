import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

const DEFAULT_GREETING = "Welcome to Intellab!";

export const Header = () => {
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (isAuthenticated) {
      const userName = user?.username;
      if (userName) {
        setGreeting(`Welcome back, ${userName}!`);
      }
    } else {
      setGreeting(DEFAULT_GREETING);
    }
  }, [isAuthenticated]);

  const renderGreeting = () => {
    return (
      <div className="mb-6 text-left md:mb-0">
        <h1 className="text-4xl font-bold md:text-5xl text-appPrimary">{greeting}</h1>
        <p className="font-normal text-md md:text-lg text-gray1">Continue your studies or start a new course!</p>
      </div>
    );
  };

  const renderBody = () => {
    return (
      <div className="flex mt-4 space-x-2 text-center w-fit md:justify-between md:space-y-0 md:space-x-8">
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
          <p className="text-3xl font-bold text-black md:text-4xl">6</p>
          <p className="text-xs text-black">Courses</p>
        </div>
      </div>
    );
  };

  return (
    <header className="flex flex-col items-start justify-between w-full h-auto px-4 mb-8 md:flex-row md:items-center md:h-56 md:pr-20">
      {renderGreeting()}
      {isAuthenticated && renderBody()}
    </header>
  );
};
