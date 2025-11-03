//
// PUBLIC_INTERFACE
// Simple API client using fetch. Base URL is read from environment variables.
//
const getEnvBaseUrl = () => {
  // Prefer CRA variable; fallback to Vite style if present
  const cra = process.env.REACT_APP_API_BASE_URL;
  const vite = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL;
  return cra || vite || '';
};

// PUBLIC_INTERFACE
export const API_BASE_URL = getEnvBaseUrl();

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /**
   * Perform a fetch to the backend API, automatically prefixing the base URL and
   * parsing JSON. Throws an error with details for non-2xx responses.
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
