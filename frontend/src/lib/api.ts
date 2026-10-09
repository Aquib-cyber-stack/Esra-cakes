import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Attach a stored admin token as a fallback for environments where the
// httpOnly cookie isn't available (e.g. cross-site preview deployments).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("esra_admin_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    return data?.error || fallback;
  }
  return fallback;
}

export function fieldErrors(err: unknown): Record<string, string[]> | undefined {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { details?: Record<string, string[]> } | undefined;
    return data?.details;
  }
  return undefined;
}
