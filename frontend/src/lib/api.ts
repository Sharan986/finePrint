import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://labelspy-latest.onrender.com/api";

// Retry delay for when backend is waking up (Render free tier)
const RETRY_DELAYS = [0, 2000, 5000]; // Retry after 2s, then 5s

export interface IngredientInfo {
  name: string;
  eNumber?: string | null;
  category: string;
  purpose: string;
  description: string;
  alternativeNames?: string[];
  origin: string;
  safetyNote?: string;
}

export interface AnalysisResult {
  scanId: string;
  ingredients: IngredientInfo[];
  summary: string;
}

export interface ScanSummary {
  scanId: string;
  timestamp: string;
  ingredientNames: string[];
}

export interface TopIngredient {
  ingredientName: string;
  count: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  ingredientCounts: Record<string, number>;
  scanHistory?: ScanSummary[];
}

/**
 * Get the authentication token from Firebase
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No user logged in - request will be unauthenticated");
    return null;
  }
  
  try {
    const token = await user.getIdToken();
    console.log("Got Firebase token:", token ? "✓" : "✗");
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * Make an authenticated API request with Bearer token
 */
async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  // Build headers as Record<string, string> for easy manipulation
  const headers: Record<string, string> = {};

  // Copy existing headers if provided
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  // Add Authorization Bearer token if user is logged in
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    mode: "cors",
  });
}

/**
 * Fetch with retry for sleeping Render backend
 */
async function fetchWithRetry(
  endpoint: string,
  options: RequestInit = {},
  retries = RETRY_DELAYS.length
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await authenticatedFetch(endpoint, options);
      return response;
    } catch (error) {
      // If it's a network error (like CORS/connection failure), retry
      if (i < retries - 1 && error instanceof TypeError) {
        console.log(`Request failed, retrying in ${RETRY_DELAYS[i + 1] / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[i + 1]));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed to connect to server after retries");
}

/**
 * Scan an image for ingredient analysis
 */
export async function scanImage(imageFile: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetchWithRetry("/scan", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to analyze image");
  }

  return response.json();
}

/**
 * Get current user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetchWithRetry("/user/profile");

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to get user profile");
  }

  return response.json();
}

/**
 * Create or update user profile
 */
export async function updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetchWithRetry("/user/profile", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update user profile");
  }

  return response.json();
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(): Promise<void> {
  const response = await fetchWithRetry("/user/profile", {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to delete user profile");
  }
}

/**
 * Get top ingredients for user
 */
export async function getTopIngredients(): Promise<TopIngredient[]> {
  const response = await fetchWithRetry("/user/top-ingredients");

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to get top ingredients");
  }

  return response.json();
}

/**
 * Get user's scan history
 */
export async function getScanHistory(): Promise<ScanSummary[]> {
  const response = await fetchWithRetry("/user/scan-history");

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to get scan history");
  }

  return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.text();
}
