import { NavigateFunction } from "react-router-dom";
import { TNavigationState } from "@/types";

export const navigateWithPreviousPagePassed = (navigate: NavigateFunction, state: TNavigationState, to: string) => {
  navigate(to, { state: state });
};

export const navigateToPreviousPage = (navigate: NavigateFunction, state: TNavigationState) => {
  let previousPage = "/";
  if (state && state.from) {
    previousPage = state.from;
  }
  navigate(previousPage);
};
