import React, { useEffect, useState } from 'react';
import { createDevice, deleteDevice, listDevices } from '../api/devices';
import DeviceForm from '../components/DeviceForm';
import DeviceList from '../components/DeviceList';

// PUBLIC_INTERFACE
export default function DevicesPage() {
  /** Page showing list of devices and a create form */
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setListError('');
    try {
      const data = await listDevices();
      setDevices(data || []);
    } catch (e) {
      setListError(e?.message || 'Failed to load devices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    setCreateError('');
    setStatusMessage('');
    setCreating(true);
    try {
      await createDevice(payload);
      setStatusMessage('Device created successfully.');
      await load();
    } catch (e) {
      if (e.status === 400) setCreateError(e?.data?.error || 'Invalid input.');
      else if (e.status === 409) setCreateError(e?.data?.error || 'Device name already exists.');
      else setCreateError(e?.message || 'Failed to create device.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (name) => {
    const confirmed = window.confirm(`Delete device "${name}"? This action cannot be undone.`);
    if (!confirmed) return;
    setStatusMessage('');
    try {
      await deleteDevice(name);
      setStatusMessage('Device deleted.');
      await load();
    } catch (e) {
      alert(e?.data?.error || e?.message || 'Failed to delete device.');
    }
  };

  return (
    <div className="app-shell">
      <h1>Device Inventory</h1>

      {loading ? (
        <div className="status info" role="status" aria-live="polite">Loading devices…</div>
      ) : listError ? (
        <div className="status error" role="alert">{listError}</div>
      ) : (
        <DeviceList devices={devices} onDelete={handleDelete} />
      )}

      <section aria-labelledby="create-heading" style={{ marginTop: 16 }}>
        <h2 id="create-heading">Add a new device</h2>
        {createError && <div className="status error" role="alert">{createError}</div>}
        {statusMessage && <div className="status info" role="status" aria-live="polite">{statusMessage}</div>}
        <div className="card">
          <DeviceForm mode="create" onSubmit={handleCreate} submitting={creating} />
        </div>
      </section>
    </div>
  );
}
