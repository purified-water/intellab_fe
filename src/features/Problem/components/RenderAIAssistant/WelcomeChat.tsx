import { aiOrbLogo } from "@/assets";

export const renderWelcomeChat = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center">
      <div className="w-20 h-20 mb-4">
        <img src={aiOrbLogo} alt="AI Orb Logo" className="object-cover w-full h-full" />
      </div>
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-appPrimary to-appAccent">
        How can I help you today?
      </h1>
      <p className="mt-2 text-base text-gray3">Ask me anything about the problem you're working on.</p>
    </div>
  );
};
