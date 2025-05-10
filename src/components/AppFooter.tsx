import { intellabDefaultLogo } from "@/assets";
import { Facebook, Linkedin } from "lucide-react";

export const AppFooter = () => {
  return (
    <footer className="w-full px-6 py-12 mt-40 text-white bg-appPrimary">
      <div className="flex flex-col items-center justify-between mx-12 px-auto md:flex-row max-w-7xl">
        {/* Logo and App Info */}
        <div className="flex items-center gap-6 md:gap-12">
          <img src={intellabDefaultLogo} alt="Intellab Logo" className="object-contain w-12 h-12 md:w-16 md:h-16" />
          <div>
            <p className="text-2xl font-bold">Intellab</p>
            <p className="text-sm md:text-base opacity-80">Let your learning journey begin!</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-x-16 md:flex-row">
          <div>
            <p className="mb-2 text-lg font-semibold">Services</p>
            <ul className="space-y-2 text-sm opacity-90">
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
            <p className="mb-2 text-lg font-semibold">About Us</p>
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

        {/* Social Media Icons */}
        <div className="flex mt-6 space-x-6 md:mt-0">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-appAccent"
          >
            <Facebook />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg hover:text-appAccent"
          >
            <Linkedin />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-xs text-center md:text-sm opacity-70">© Intellab 2024. All rights reserved.</div>
    </footer>
  );
};
