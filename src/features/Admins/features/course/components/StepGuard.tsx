import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";

interface StepGuardProps {
  checkValid: (state: RootState) => boolean;
  redirectTo: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const StepGuard = ({ checkValid, redirectTo, children, disabled = false }: StepGuardProps) => {
  const isValid = useSelector(checkValid);
  const navigate = useNavigate();

  useEffect(() => {
    if (!disabled && !isValid) {
      navigate(redirectTo, { replace: true });
    }
  }, [isValid, navigate, redirectTo, disabled]);

  return disabled || isValid ? <>{children}</> : null;
};
