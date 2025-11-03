//
// PUBLIC_INTERFACE
// Simple API client using fetch. The backend base URL is hardcoded here for simplicity.
//
// Change BACKEND_API_BASE_URL below to point to your backend for different environments.
// Example: "http://localhost:5000" (development), "https://api.example.com" (production)

// PUBLIC_INTERFACE
export const BACKEND_API_BASE_URL = "http://localhost:5000"; // Change this for your environment.

// PUBLIC_INTERFACE
export const API_BASE_URL = BACKEND_API_BASE_URL;

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /**
   * Perform a fetch to the backend API, automatically prefixing the base URL and
   * parsing JSON. Throws an error with details for non-2xx responses.
   *
   * Params:
   * - path: string - request path beginning with a slash (e.g., "/devices")
   * - options: RequestInit - fetch options such as method, headers, and body
   *
   * Returns:
   * - Parsed JSON object or null (if no body). Throws Error on non-2xx responses.
   */
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    const error = new Error('Network error');
    error.cause = err;
    throw error;
  }

  const text = await response.text();
  const maybeJson = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const error = new Error(maybeJson?.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = maybeJson;
    throw error;
  }
  return maybeJson;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
