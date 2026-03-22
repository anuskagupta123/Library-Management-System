import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken, getTokenExpirationMs, isTokenExpired, logout } from "../utils/auth";

export default function AuthSessionManager() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timerId;

    const publicPaths = new Set(["/", "/login", "/register"]);

    const redirectToLogin = () => {
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true, state: { from: location.pathname, reason: "expired" } });
      }
    };

    const validateSession = () => {
      if (timerId) {
        window.clearTimeout(timerId);
        timerId = undefined;
      }

      const token = getToken();
      if (!token) {
        if (!publicPaths.has(location.pathname)) {
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
        return;
      }

      if (isTokenExpired(token)) {
        logout();
        redirectToLogin();
        return;
      }

      const expiresAt = getTokenExpirationMs(token);
      if (!expiresAt) return;

      const remainingMs = Math.max(0, expiresAt - Date.now());
      timerId = window.setTimeout(() => {
        logout();
        redirectToLogin();
      }, remainingMs);
    };

    validateSession();

    const handleAuthLogout = () => redirectToLogin();
    const handleVisibilityOrFocus = () => {
      if (!document.hidden) {
        validateSession();
      }
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    window.addEventListener("storage", validateSession);
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      if (timerId) window.clearTimeout(timerId);
      window.removeEventListener("auth:logout", handleAuthLogout);
      window.removeEventListener("storage", validateSession);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [navigate, location.pathname]);

  return null;
}
