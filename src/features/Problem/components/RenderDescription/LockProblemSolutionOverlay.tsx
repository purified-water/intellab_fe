import { MdLock } from "rocketicons/md";
import { AlertDialog, Button } from "@/components/ui";

interface LockProblemSolutionOverlayProps {
  unlockBeforeSolved: () => void;
}
export const LockProblemSolutionOverlay = ({ unlockBeforeSolved }: LockProblemSolutionOverlayProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-2 text-center">
      <MdLock className="mb-4 size-12" />
      <h2 className="text-xl font-semibold">Try solving first before checking the solutions!</h2>
      <p className="mt-2 text-sm text-gray3">
        Unlocking the solutions before passing will remove points from this problem.
      </p>

      <AlertDialog
        title={"View Solutions"}
        message={"Are you sure you want to view the solutions? This will remove points from this problem."}
        onConfirm={unlockBeforeSolved}
      >
        <Button className="px-4 py-2 mt-4 font-semibold text-white transition rounded-lg bg-appPrimary hover:bg-appPrimary/80">
          View Solutions
        </Button>
      </AlertDialog>
    </div>
  );
};
