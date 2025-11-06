import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithRouter, mockWindowConfirm, mockWindowAlert } from '../../test/test-utils';
import DevicesPage from '../DevicesPage';
import * as api from '../../api/devices';

jest.mock('../../api/devices');

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const routes = [{ path: '/', element: <DevicesPage /> }];

test('shows loading then renders list', async () => {
  api.listDevices.mockResolvedValue([{ name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' }]);
  renderWithRouter(routes, ['/']);
  expect(screen.getByText(/loading devices/i)).toBeInTheDocument();
  expect(await screen.findByRole('region', { name: /device list/i })).toBeInTheDocument();
  expect(screen.getByText('r1')).toBeInTheDocument();
});

test('shows list error state', async () => {
  api.listDevices.mockRejectedValue(new Error('Failed to load'));
  renderWithRouter(routes, ['/']);
  expect(await screen.findByRole('alert')).toHaveTextContent(/failed to load/i);
});

test('create device success reloads list and shows status', async () => {
  api.listDevices.mockResolvedValueOnce([]).mockResolvedValueOnce([
    { name: 'n1', ip_address: '10.0.0.1', type: 'Router', location: 'A' },
  ]);
  api.createDevice.mockResolvedValue({});

  renderWithRouter(routes, ['/']);

  // fill and submit create form
  fireEvent.change(screen.getByLabelText(/device name/i), { target: { value: 'n1' } });
  fireEvent.change(screen.getByLabelText(/ip address/i), { target: { value: '10.0.0.1' } });
  fireEvent.change(screen.getByLabelText(/^type$/i), { target: { value: 'Router' } });
  fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'A' } });
  fireEvent.click(screen.getByRole('button', { name: /create device/i }));

  expect(api.createDevice).toHaveBeenCalledWith({
    name: 'n1',
    ip_address: '10.0.0.1',
    type: 'Router',
    location: 'A',
  });

  expect(await screen.findByText(/device created successfully/i)).toBeInTheDocument();
  expect(await screen.findByText('n1')).toBeInTheDocument();
});

test('create device shows 400 validation error and 409 conflict', async () => {
  api.listDevices.mockResolvedValue([]);
  // First: 400
  api.createDevice.mockRejectedValueOnce(Object.assign(new Error('Invalid input.'), { status: 400, data: { error: 'Invalid input.' } }));
  const { rerender, router } = renderWithRouter(routes, ['/']);

  // Try invalid submit (client-side) to ensure error rendering, then valid to hit API 400
  // Enter valid to reach API layer
  fireEvent.change(screen.getByLabelText(/device name/i), { target: { value: 'n1' } });
  fireEvent.change(screen.getByLabelText(/ip address/i), { target: { value: '10.0.0.1' } });
  fireEvent.change(screen.getByLabelText(/^type$/i), { target: { value: 'Router' } });
  fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'A' } });
  fireEvent.click(screen.getByRole('button', { name: /create device/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid input/i);

  // Second: 409
  api.createDevice.mockRejectedValueOnce(Object.assign(new Error('Exists'), { status: 409, data: { error: 'Device name already exists.' } }));

  // Submit again
  fireEvent.click(screen.getByRole('button', { name: /create device/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/already exists/i);
});

test('delete device with confirm true reloads list and shows status', async () => {
  api.listDevices
    .mockResolvedValueOnce([{ name: 'x', ip_address: '10.0.0.9', type: 'Server', location: 'Z' }])
    .mockResolvedValueOnce([]); // after delete
  api.deleteDevice.mockResolvedValue(true);
  const confirmSpy = mockWindowConfirm(true);

  renderWithRouter(routes, ['/']);
  const deleteBtn = await screen.findByRole('button', { name: /delete/i });
  fireEvent.click(deleteBtn);

  expect(confirmSpy).toHaveBeenCalled();
  await waitFor(() => expect(api.deleteDevice).toHaveBeenCalledWith('x'));
  expect(await screen.findByText(/device deleted\./i)).toBeInTheDocument();
});

test('delete device with confirm false does nothing', async () => {
  api.listDevices.mockResolvedValue([{ name: 'x', ip_address: '10.0.0.9', type: 'Server', location: 'Z' }]);
  mockWindowConfirm(false);

  renderWithRouter(routes, ['/']);
  const deleteBtn = await screen.findByRole('button', { name: /delete/i });
  fireEvent.click(deleteBtn);
  expect(api.deleteDevice).not.toHaveBeenCalled();
});

test('delete device error shows alert', async () => {
  api.listDevices.mockResolvedValue([{ name: 'x', ip_address: '10.0.0.9', type: 'Server', location: 'Z' }]);
  api.deleteDevice.mockRejectedValue(Object.assign(new Error('boom'), { status: 404, data: { error: 'Not found' } }));
  const confirmSpy = mockWindowConfirm(true);
  const alertSpy = mockWindowAlert();

  renderWithRouter(routes, ['/']);
  fireEvent.click(await screen.findByRole('button', { name: /delete/i }));
  await waitFor(() => expect(alertSpy).toHaveBeenCalled());
  expect(confirmSpy).toHaveBeenCalled();
});
