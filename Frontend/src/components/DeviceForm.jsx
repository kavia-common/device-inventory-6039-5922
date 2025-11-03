import React, { useEffect, useMemo, useState } from 'react';

const TYPES = ['Router', 'Switch', 'Server'];

function isValidIP(ip) {
  // Basic IPv4/IPv6 check (not exhaustive)
  const ipv4 = /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;
  const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1)$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

// PUBLIC_INTERFACE
export default function DeviceForm({ mode = 'create', initialValues, onSubmit, submitting }) {
  /**
   * Accessible device form. In 'edit' mode, name is read-only.
   * Emits payload via onSubmit({ name?, ip_address, type, location }).
   */
  const [values, setValues] = useState({
    name: '',
    ip_address: '',
    type: 'Router',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialValues) setValues(v => ({ ...v, ...initialValues }));
  }, [initialValues]);

  const validation = useMemo(() => {
    const e = {};
    if (mode === 'create') {
      if (!values.name.trim()) e.name = 'Name is required.';
    }
    if (!values.ip_address.trim()) e.ip_address = 'IP address is required.';
    else if (!isValidIP(values.ip_address.trim())) e.ip_address = 'Enter a valid IPv4 or IPv6 address.';
    if (!values.type) e.type = 'Type is required.';
    if (!values.location.trim()) e.location = 'Location is required.';
    return e;
  }, [values, mode]);

  useEffect(() => { setErrors(validation); }, [validation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, ip_address: true, type: true, location: true });
    if (Object.keys(validation).length === 0) {
      const payload = {
        ...(mode === 'create' ? { name: values.name.trim() } : {}),
        ip_address: values.ip_address.trim(),
        type: values.type,
        location: values.location.trim(),
      };
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby="form-errors">
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="name">Device Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
            placeholder="e.g., core-router-1"
            disabled={mode === 'edit'}
          />
          {touched.name && errors.name && (
            <div id="name-error" className="status error" role="alert">{errors.name}</div>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="ip_address">IP Address</label>
          <input
            id="ip_address"
            name="ip_address"
            type="text"
            value={values.ip_address}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!(touched.ip_address && errors.ip_address)}
            aria-describedby={touched.ip_address && errors.ip_address ? 'ip-error' : undefined}
            placeholder="e.g., 10.0.0.1"
          />
          {touched.ip_address && errors.ip_address && (
            <div id="ip-error" className="status error" role="alert">{errors.ip_address}</div>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!(touched.type && errors.type)}
            aria-describedby={touched.type && errors.type ? 'type-error' : undefined}
          >
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {touched.type && errors.type && (
            <div id="type-error" className="status error" role="alert">{errors.type}</div>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!(touched.location && errors.location)}
            aria-describedby={touched.location && errors.location ? 'location-error' : undefined}
            placeholder="e.g., Data Center A"
          />
          {touched.location && errors.location && (
            <div id="location-error" className="status error" role="alert">{errors.location}</div>
          )}
        </div>
      </div>

      <div className="actions" style={{ marginTop: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={submitting} aria-busy={submitting}>
          {submitting ? 'Saving…' : (mode === 'create' ? 'Create Device' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
}
