import type { AxiosRequestConfig } from "axios";

import { api } from "@/lib/api";

import type {
  ApiMessage,
  ApiSuccess,
} from "@/types/auth";

/*
 * The backend always wraps successful responses in a
 * `{ success: true, data }` (or `{ success: true, message }`)
 * envelope. These helpers unwrap it so callers deal with the
 * payload directly.
 */

export async function getData<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get<ApiSuccess<T>>(
    url,
    config
  );

  return response.data.data;
}

export async function postData<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post<ApiSuccess<T>>(
    url,
    body,
    config
  );

  return response.data.data;
}

export async function patchData<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.patch<ApiSuccess<T>>(
    url,
    body,
    config
  );

  return response.data.data;
}

export async function deleteData<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.delete<ApiSuccess<T>>(
    url,
    config
  );

  return response.data.data;
}

export async function postMessage(
  url: string,
  body?: unknown
): Promise<string> {
  const response = await api.post<ApiMessage>(
    url,
    body
  );

  return response.data.message;
}

export async function patchMessage(
  url: string,
  body?: unknown
): Promise<string> {
  const response = await api.patch<ApiMessage>(
    url,
    body
  );

  return response.data.message;
}

export async function deleteMessage(
  url: string
): Promise<string> {
  const response = await api.delete<ApiMessage>(url);

  return response.data.message;
}
