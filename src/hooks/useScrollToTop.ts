import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef("");

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
};
