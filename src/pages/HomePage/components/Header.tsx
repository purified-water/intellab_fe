export const Header = () => {
  return (
    <header className="flex items-center justify-between w-full h-56 pr-20 mb-8">
      <div>
        <h1 className="text-5xl font-bold text-appPrimary">Welcome, Username!</h1>
        <p className="text-lg font-normal text-gray1">Continue your studies or start a new course!</p>
      </div>

      <div className="flex mt-4 space-x-8 text-center">
        <div id="login-streak">
          <p className="mb-10 text-xs font-semibold text-black">LOGIN STREAK</p>
          <p className="text-4xl font-bold text-black">6</p>
          <p className="text-xs text-black">Days</p>
        </div>

        <div id="points">
          <p className="mb-10 text-xs font-semibold text-black">YOUR POINTS</p>
          <p className="text-4xl font-bold text-black">100</p>
          <p className="text-xs text-black">Points</p>
        </div>

        <div id="courses">
          <p className="mb-10 text-xs font-semibold text-black">YOUR COURSES</p>
          <p className="text-4xl font-bold text-black">6</p>
          <p className="text-xs text-black">Courses</p>
        </div>
      </div>
    </header>
  );
};
