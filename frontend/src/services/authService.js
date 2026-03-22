import api from "./api";

const getAlternateAuthBaseUrl = () => {
  const currentBaseUrl = api.defaults.baseURL || "";
  return currentBaseUrl.replace(/\/api\/?$/, "");
};

const tryAuthPost = async (endpoints, payloadVariants) => {
  let lastError;

  for (const endpoint of endpoints) {
    for (const payload of payloadVariants) {
      try {
        const res = await api.post(endpoint, payload);
        return res.data;
      } catch (error) {
        lastError = error;

        // Preserve real backend errors (validation, bad credentials, etc.)
        // instead of masking them with fallback endpoint attempts.
        if (error.response && error.response.status !== 404) {
          throw error;
        }

        // Retry without "/api" when backend exposes auth endpoints at root.
        if (error.response?.status === 404) {
          const alternateBaseUrl = getAlternateAuthBaseUrl();
          const currentBaseUrl = api.defaults.baseURL || "";

          if (alternateBaseUrl && alternateBaseUrl !== currentBaseUrl) {
            try {
              const res = await api.post(`${alternateBaseUrl}${endpoint}`, payload, {
                baseURL: ""
              });
              return res.data;
            } catch (fallbackError) {
              lastError = fallbackError;
            }
          }
        }
      }
    }
  }

  throw lastError;
};

export const getAuthErrorMessage = (error, fallbackMessage) => {
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) return serverMessage;

  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach server. Check backend URL/port and make sure backend is running.";
  }

  if (error?.response?.status === 404) {
    return "Auth API endpoint not found. Verify backend route and API base URL.";
  }

  return fallbackMessage;
};

/* ================= LOGIN ================= */
export const login = async (data) => {
  const username = data?.username || "";
  const password = data?.password || "";

  return tryAuthPost(["/auth/login"], [
    { username, password },
    { userName: username, password },
    { email: username, password },
    { username, userName: username, password }
  ]);
};

/* ================= REGISTER ================= */
export const register = async (data) => {
  const username = data?.username || "";
  const password = data?.password || "";

  return tryAuthPost(["/auth/register"], [
    { username, password },
    { userName: username, password },
    { email: username, password },
    { username, userName: username, password }
  ]);
};
