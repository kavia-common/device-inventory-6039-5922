import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DeviceForm from '../DeviceForm';

function fillAndSubmit({ name, ip, type = 'Router', location }) {
  if (name !== undefined) {
    fireEvent.change(screen.getByLabelText(/device name/i), { target: { value: name } });
  }
  fireEvent.change(screen.getByLabelText(/ip address/i), { target: { value: ip } });
  fireEvent.change(screen.getByLabelText(/^type$/i), { target: { value: type } });
  fireEvent.change(screen.getByLabelText(/location/i), { target: { value: location } });
  fireEvent.click(screen.getByRole('button'));
}

test('shows validation errors on empty submit in create mode', () => {
  const onSubmit = jest.fn();
  render(<DeviceForm mode="create" onSubmit={onSubmit} submitting={false} />);
  fireEvent.click(screen.getByRole('button', { name: /create device/i }));
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/ip address is required/i)).toBeInTheDocument();
  expect(screen.getByText(/location is required/i)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('validates IPv4 and IPv6 formats', () => {
  const onSubmit = jest.fn();
  render(<DeviceForm mode="create" onSubmit={onSubmit} submitting={false} />);
  fillAndSubmit({ name: 'n1', ip: 'invalid-ip', location: 'L' });
  expect(screen.getByText(/enter a valid ipv4 or ipv6 address/i)).toBeInTheDocument();
  onSubmit.mockClear();
});

test('submits payload in create mode when valid', () => {
  const onSubmit = jest.fn();
  render(<DeviceForm mode="create" onSubmit={onSubmit} submitting={false} />);
  fillAndSubmit({ name: 'core-1', ip: '10.0.0.1', type: 'Switch', location: 'DC' });
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'core-1',
    ip_address: '10.0.0.1',
    type: 'Switch',
    location: 'DC',
  });
});

test('edit mode disables name and does not include it in payload', () => {
  const onSubmit = jest.fn();
  render(
    <DeviceForm
      mode="edit"
      submitting={false}
      initialValues={{ name: 'existing', ip_address: '10.0.0.2', type: 'Router', location: 'L' }}
      onSubmit={onSubmit}
    />
  );
  const nameInput = screen.getByLabelText(/device name/i);
  expect(nameInput).toBeDisabled();
  fireEvent.change(screen.getByLabelText(/ip address/i), { target: { value: '10.0.0.3' } });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
  expect(onSubmit).toHaveBeenCalledWith({
    ip_address: '10.0.0.3',
    type: 'Router',
    location: 'L',
  });
});

test('button reflects submitting state', () => {
  const { rerender } = render(<DeviceForm mode="create" onSubmit={() => {}} submitting={false} />);
  expect(screen.getByRole('button')).toHaveTextContent(/create device/i);
  rerender(<DeviceForm mode="create" onSubmit={() => {}} submitting={true} />);
  expect(screen.getByRole('button')).toHaveTextContent(/saving…/i);
  expect(screen.getByRole('button')).toBeDisabled();
});
