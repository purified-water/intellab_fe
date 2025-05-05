import { Outlet } from "react-router-dom";
import { WizardStepperHeader } from "./WizardStepperHeader";

export const CourseWizardLayout = () => {
  return (
    <div className="h-full p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-center">
        <WizardStepperHeader />
      </div>

      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};
