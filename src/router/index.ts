import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { useEffect, useRef } from "react";
import { routes } from "./config";

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;
let resolved = false;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  const resolvedRef = useRef(resolved);
  
  useEffect(() => {
    if (!resolvedRef.current) {
      resolvedRef.current = true;
      resolved = true;
      window.REACT_APP_NAVIGATE = navigate;
      navigateResolver(navigate);
    } else {
      window.REACT_APP_NAVIGATE = navigate;
    }
  }, [navigate]);

  return element;
}