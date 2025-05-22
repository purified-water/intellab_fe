import { Outlet } from "react-router-dom";
import { ProblemWizardStepperHeader } from ".";

export const ProblemWizardLayout = () => {
  return (
    <div className="h-full p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-center">
        <ProblemWizardStepperHeader />
      </div>

      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};
