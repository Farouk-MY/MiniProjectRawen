import { ApiError } from "@/types";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Dynamically resolve the API base URL:
// - Physical devices: use the dev machine's LAN IP via Expo Constants hostUri
// - Android emulator: fallback to 10.0.2.2 (maps to host localhost)
// - iOS simulator/web: fallback to localhost
const getBaseUrl = (): string => {
  // Expo provides the dev server host (e.g. "192.168.1.5:8081")
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0]; // extract IP, drop Expo port
    return `http://${host}:3000`;
  }
  // Fallback for production builds or missing hostUri
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
};

export const BASE_URL = getBaseUrl();

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      message: `Request failed: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }
  return response.json() as Promise<T>;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  return handleResponse<T>(response);
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiPatch<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error: ApiError = {
      message: `Delete failed: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }
}
