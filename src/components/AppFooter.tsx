export const AppFooter = () => {
  return (
    <div className="flex flex-col w-full p-8 mt-20 space-y-6 text-white self:end md:h-64 bg-appPrimary md:space-y-0 md:flex-row md:space-x-12">
      <div id="app-name" className="flex flex-col">
        <p className="text-2xl font-bold md:text-3xl">Intellab</p>
        <p className="text-md md:text-base">Let your learning journey begin!</p>
      </div>

      <div id="app-services" className="flex flex-col">
        <p className="mt-4 mb-2 text-lg font-bold md:mt-0">Services</p>
        <a href="/explore" className="text-sm md:text-base">
          Courses
        </a>
        <a href="/problems" className="mt-2 text-sm md:text-base">
          Algorithms
        </a>
      </div>

      <div id="app-about" className="flex flex-col w-32">
        <p className="mt-4 mb-2 text-lg font-bold md:mt-0">About us</p>
        <a href="#" className="text-sm md:text-base">
          Team
        </a>
        <a href="#" className="mt-2 text-sm md:text-base">
          Contact
        </a>
      </div>

      <div id="copyright" className="flex self-end justify-end w-full mt-4 text-center md:mt-0 md:text-right">
        <p className="text-sm md:text-base">Copyright © Intellab 2024</p>
      </div>
    </div>
  );
};
