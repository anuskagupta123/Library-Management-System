import axios from "axios";
import { getToken, isTokenExpired, logout } from "../utils/auth";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    if (isTokenExpired(token)) {
      logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=expired";
      }

      const error = new Error("Session expired. Please login again.");
      error.code = "TOKEN_EXPIRED";
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${token}`; // ✅ FIXED
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthRequest = /\/auth\//.test(requestUrl);

    if (error.response?.status === 401 && !isAuthRequest) {
      logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;