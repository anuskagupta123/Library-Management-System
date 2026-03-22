import { Navigate, useLocation } from "react-router-dom";
import { isAdmin, isLoggedIn } from "../utils/auth";

export default function AdminRoute({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin()) {
    return <Navigate to="/books" replace />;
  }

  return children;
}
