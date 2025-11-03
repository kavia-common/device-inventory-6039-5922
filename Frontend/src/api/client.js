//
//
// PUBLIC_INTERFACE
// Simple API client using fetch. Base URL is read from environment variables.
//
// We intentionally read a non-CRA-prefixed env var: process.env.backend_api_base_url.
// Note: In Create React App (CRA), only REACT_APP_* variables are automatically exposed
// to the client bundle. This project assumes the build tool (react-scripts or surrounding
// pipeline) performs string replacement for process.env.<KEY> at build time. If it does not,
// you must ensure backend_api_base_url is injected during build (e.g., via dotenv + DefinePlugin).
//
// We provide additional fallbacks (Vite import.meta.env and window.__ENV__) and emit a console
// warning when nothing is configured to help diagnose misconfigurations.
const resolveBaseUrl = () => {
  // Primary: exact key requested
  const direct = process.env.backend_api_base_url;

  // Optional fallbacks for other setups
  const vite = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || undefined;
  const win = (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.backend_api_base_url) || undefined;

  const value = direct || vite || win || '';

  if (!value) {
    // Help the developer configure the correct variable name.
    // Also detect if a legacy variable exists to guide migration.
    const legacyCRA = process.env.REACT_APP_API_BASE_URL;
    const legacyVite = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || undefined;

    // eslint-disable-next-line no-console
    console.warn(
      '[config] backend_api_base_url is not set. ' +
      'Set process.env.backend_api_base_url at build time. ' +
      (legacyCRA ? 'Found REACT_APP_API_BASE_URL, but this app now expects backend_api_base_url.' : '') +
      (!legacyCRA && legacyVite ? 'Found VITE_API_BASE_URL, but this app now expects backend_api_base_url.' : '')
    );
  }

  return value;
};

// PUBLIC_INTERFACE
export const API_BASE_URL = resolveBaseUrl();

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
