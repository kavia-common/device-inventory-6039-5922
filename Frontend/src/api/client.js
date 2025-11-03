//
//
// PUBLIC_INTERFACE
// Simple API client using fetch. Base URL is read from environment variables.
//
// We intentionally read non-CRA-prefixed env vars: process.env.BACKEND_API_BASE_URL and process.env.backend_api_base_url.
// This project assumes the build tool (react-scripts or surrounding pipeline) performs
// string replacement for process.env.<KEY> at build time. If it does not, ensure
// BACKEND_API_BASE_URL (preferred) or backend_api_base_url is injected during build (e.g., via dotenv + DefinePlugin).
//
// We provide additional fallbacks (Vite import.meta.env for VITE_BACKEND_API_BASE_URL and VITE_backend_api_base_url,
// and window.__ENV__) and emit a console warning when nothing is configured to help diagnose misconfigurations.
const resolveBaseUrl = () => {
  // Preferred and aliases in order of precedence:
  const fromNodeEnvUpper = typeof process !== 'undefined' ? process.env.BACKEND_API_BASE_URL : undefined;
  const fromNodeEnvLower = typeof process !== 'undefined' ? process.env.backend_api_base_url : undefined;

  // Optional fallbacks for other setups (Vite)
  // Note: we check both uppercase and lowercase Vite keys to support prior conventions.
  const fromViteUpper =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_API_BASE_URL) || undefined;
  const fromViteLower =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_backend_api_base_url) || undefined;

  // Runtime injection via global window.__ENV__
  const fromWindowUpper =
    (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.BACKEND_API_BASE_URL) || undefined;
  const fromWindowLower =
    (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.backend_api_base_url) || undefined;

  const value =
    fromNodeEnvUpper ||
    fromNodeEnvLower ||
    fromViteUpper ||
    fromViteLower ||
    fromWindowUpper ||
    fromWindowLower ||
    '';

  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(
      '[config] BACKEND_API_BASE_URL/backend_api_base_url is not set. ' +
        'Configure one of the following (in precedence order): ' +
        'process.env.BACKEND_API_BASE_URL, process.env.backend_api_base_url, ' +
        'import.meta.env.VITE_BACKEND_API_BASE_URL, import.meta.env.VITE_backend_api_base_url, ' +
        'window.__ENV__.BACKEND_API_BASE_URL, window.__ENV__.backend_api_base_url.'
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
