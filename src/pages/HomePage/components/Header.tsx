export const Header = () => {
  return (
    <header className="flex flex-col items-start justify-between w-full h-auto px-4 mb-8 md:flex-row md:items-center md:h-56 md:pr-20">
      <div className="mb-6 text-left md:mb-0">
        <h1 className="text-4xl font-bold md:text-5xl text-appPrimary">Welcome, Username!</h1>
        <p className="font-normal text-md md:text-lg text-gray1">Continue your studies or start a new course!</p>
      </div>

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
    </header>
  );
};
