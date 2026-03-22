const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_KEY = "role";
const USERNAME_KEY = "username";
const CLOCK_SKEW_MS = 5000;

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const extractRoleFromPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  const directRole = payload.role || payload.roles;
  if (typeof directRole === "string") return directRole.replace(/^ROLE_/, "");

  if (Array.isArray(directRole) && directRole.length > 0) {
    const firstRole = directRole.find((r) => typeof r === "string");
    return firstRole ? firstRole.replace(/^ROLE_/, "") : null;
  }

  if (Array.isArray(payload.authorities) && payload.authorities.length > 0) {
    const firstAuthority = payload.authorities.find((r) => typeof r === "string");
    return firstAuthority ? firstAuthority.replace(/^ROLE_/, "") : null;
  }

  return null;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getTokenPayload = () => decodeJwtPayload(getToken());

export const getTokenExpirationMs = (token = getToken()) => {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp * 1000;
};

export const isTokenExpired = (token = getToken(), skewMs = CLOCK_SKEW_MS) => {
  const expiresAt = getTokenExpirationMs(token);
  if (!expiresAt) return true;
  return Date.now() + skewMs >= expiresAt;
};

export const getRole = () => {
  const savedRole = localStorage.getItem(ROLE_KEY);
  if (savedRole) return savedRole;

  const roleFromToken = extractRoleFromPayload(getTokenPayload());
  if (roleFromToken) {
    localStorage.setItem(ROLE_KEY, roleFromToken);
  }
  return roleFromToken;
};

export const isAdmin = () => getRole() === "ADMIN";

export const isLoggedIn = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

export const setSession = ({ token, refreshToken, role, username }) => {
  if (!token) return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken || token);

  const tokenPayload = decodeJwtPayload(token);
  const resolvedRole = role || extractRoleFromPayload(tokenPayload);
  if (resolvedRole) {
    localStorage.setItem(ROLE_KEY, resolvedRole);
  }

  const resolvedUsername = username || tokenPayload?.sub || tokenPayload?.username;
  if (resolvedUsername) {
    localStorage.setItem(USERNAME_KEY, resolvedUsername);
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  window.dispatchEvent(new Event("auth:logout"));
};
