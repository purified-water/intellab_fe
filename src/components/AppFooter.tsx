import { facebookLogo, intellabDefaultLogo, linkedinLogo } from "@/assets";

export const AppFooter = () => {
  return (
    <footer className="w-full px-6 py-12 mt-32 border-t bg-gray6/30 text-gray1 border-gray6/50">
      <div className="grid gap-12 mx-auto max-w-7xl md:grid-cols-3">
        {/* Logo & Intro */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <img src={intellabDefaultLogo} alt="Intellab Logo" className="w-12 h-12 md:w-16 md:h-16" />
            <div>
              <p className="text-2xl font-bold text-appPrimary">Intellab</p>
              <p className="text-sm md:text-base opacity-80">Master Coding Skills at Your Own Pace</p>
            </div>
          </div>
        </div>

        {/* Services & About */}
        <div className="flex justify-between gap-8">
          <div>
            <p className="mb-3 text-lg font-semibold">Services</p>
            <ul className="space-y-2 text-sm font-medium opacity-90">
              <li>
                <a href="/explore" className="hover:underline hover:text-appAccent">
                  Courses
                </a>
              </li>
              <li>
                <a href="/problems" className="hover:underline hover:text-appAccent">
                  Algorithms
                </a>
              </li>
              <li>
                <a href="/leaderboard" className="hover:underline hover:text-appAccent">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:underline hover:text-appAccent">
                  Premium
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-lg font-semibold">About Us</p>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <a href="#" className="hover:underline hover:text-appAccent">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-appAccent">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-appAccent">
                  Report a Problem
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-start gap-4">
          <p className="text-lg font-semibold">Follow Us</p>
          <div className="flex space-x-5">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-appAccent"
            >
              <img src={facebookLogo} alt="Facebook" className="size-5" loading="lazy" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-appAccent"
            >
              <img src={linkedinLogo} alt="Linkedin" className="size-5" loading="lazy" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="pt-6 mt-4 text-xs text-center border-t border-white/20 md:text-sm opacity-70">
        © Intellab 2024. All rights reserved.
      </div>
    </footer>
  );
};
