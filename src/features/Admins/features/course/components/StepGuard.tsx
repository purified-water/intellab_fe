import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";
import { showToastDefault } from "@/utils";
import { useToast } from "@/hooks";

interface StepGuardProps {
  checkValid: (state: RootState) => boolean;
  redirectTo: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const StepGuard = ({ checkValid, redirectTo, children, disabled = false }: StepGuardProps) => {
  const isValid = useSelector(checkValid);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!disabled && !isValid) {
      navigate(redirectTo, { replace: true });
      showToastDefault({ toast: toast, title: "Heads up", message: "Please complete the current steps first." });
    }
  }, [isValid, navigate, redirectTo, disabled]);

  return disabled || isValid ? <>{children}</> : null;
};
