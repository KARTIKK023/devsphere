import axios from "axios";

import { getApiBaseUrl } from "@/lib/api-config";

const ACCESS_TOKEN_KEY = "devsphere_access_token";

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | null
): void {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    ACCESS_TOKEN_KEY
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);

      onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);