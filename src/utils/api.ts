import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Outbound interceptor: secure token injection
// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
  const token = Cookies.get("mpms_auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Inbound interceptor: wipe token state on session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("mpms_user");
      // window.location.href = "/auth/login";
      console.log("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  },
);
