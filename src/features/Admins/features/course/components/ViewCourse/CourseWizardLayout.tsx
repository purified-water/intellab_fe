import { Outlet } from "react-router-dom";
import { WizardStepperHeader } from "./WizardStepperHeader";
import { AdminCourseViewTypes } from "@/features/Admins/features/course/constants";

interface CourseWizardLayoutProps {
  type?: AdminCourseViewTypes;
}

export const CourseWizardLayout = (props: CourseWizardLayoutProps) => {
  const { type = "create" } = props;

  return (
    <div className="h-full p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-center">
        <WizardStepperHeader type={type} />
      </div>

      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};
