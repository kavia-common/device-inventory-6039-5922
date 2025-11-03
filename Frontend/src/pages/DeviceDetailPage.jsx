import React, { useEffect, useState } from 'react';
import { getDevice, updateDevice } from '../api/devices';
import DeviceForm from '../components/DeviceForm';
import { useParams, Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function DeviceDetailPage() {
  /** Page for viewing/updating a single device by name */
  const { name } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getDevice(name);
      setDevice(data);
    } catch (e) {
      if (e.status === 404) setLoadError('Device not found.');
      else setLoadError(e?.message || 'Failed to load device.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [name]);

  const handleUpdate = async (payload) => {
    setSaveError('');
    setStatusMessage('');
    setSaving(true);
    try {
      await updateDevice(name, payload);
      setStatusMessage('Device updated successfully.');
      await load();
    } catch (e) {
      if (e.status === 400) setSaveError(e?.data?.error || 'Invalid input.');
      else if (e.status === 404) setSaveError('Device not found.');
      else setSaveError(e?.message || 'Failed to update device.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar" aria-label="Breadcrumb">
        <Link to="/devices">Devices</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{name}</span>
      </nav>

      <h1>Edit Device</h1>

      {loading ? (
        <div className="status info" role="status" aria-live="polite">Loading…</div>
      ) : loadError ? (
        <div className="status error" role="alert">{loadError}</div>
      ) : (
        <>
          {saveError && <div className="status error" role="alert">{saveError}</div>}
          {statusMessage && <div className="status info" role="status" aria-live="polite">{statusMessage}</div>}
          <div className="card">
            <DeviceForm
              mode="edit"
              initialValues={device}
              onSubmit={handleUpdate}
              submitting={saving}
            />
          </div>
        </>
      )}
    </div>
  );
}
