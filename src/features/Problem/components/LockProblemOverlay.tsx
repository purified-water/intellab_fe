import { LockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LockProblemOverlay = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center bg-black/30">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
        <LockIcon className="mb-4 size-14" />
        <h2 className="text-xl font-semibold">Subscribe to unlock this problem</h2>
        <p className="mt-2 text-sm text-gray3">
          Thanks for using Intellab. To view this question, you must go premium.
        </p>
        <button
          onClick={() => navigate("/pricing")}
          className="px-4 py-2 mt-4 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};
