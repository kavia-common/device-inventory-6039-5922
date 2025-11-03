import { apiFetch, API_BASE_URL } from './client';

// PUBLIC_INTERFACE
export async function listDevices() {
  /** List all devices */
  return apiFetch('/devices', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createDevice(payload) {
  /** Create a new device. Returns created device or throws with status 400/409 */
  return apiFetch('/devices', { method: 'POST', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function getDevice(name) {
  /** Get a device by name */
  return apiFetch(`/devices/${encodeURIComponent(name)}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function updateDevice(name, payload) {
  /** Update a device by name (except name itself) */
  return apiFetch(`/devices/${encodeURIComponent(name)}`, { method: 'PUT', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function deleteDevice(name) {
  /** Delete a device by name (204 expected, no body) */
  const url = `${API_BASE_URL}/devices/${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }
    const err = new Error(data?.error || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return true;
}
