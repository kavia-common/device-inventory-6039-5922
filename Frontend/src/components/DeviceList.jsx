import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function DeviceList({ devices, onDelete }) {
  /**
   * Devices table with Edit and Delete actions.
   * onDelete(name) should trigger confirmation and deletion.
   */
  if (!devices?.length) {
    return <div className="card" role="status" aria-live="polite">No devices found.</div>;
    }
  return (
    <div className="card" role="region" aria-label="Device list">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">IP Address</th>
            <th scope="col">Type</th>
            <th scope="col">Location</th>
            <th scope="col"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={d.name}>
              <td><Link to={`/devices/${encodeURIComponent(d.name)}`} aria-label={`View ${d.name}`}>{d.name}</Link></td>
              <td>{d.ip_address}</td>
              <td>{d.type}</td>
              <td>{d.location}</td>
              <td>
                <div className="actions">
                  <Link className="btn" to={`/devices/${encodeURIComponent(d.name)}`}>Edit</Link>
                  <button className="btn btn-danger" onClick={() => onDelete(d.name)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
