import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../../test/test-utils';
import DeviceDetailPage from '../DeviceDetailPage';
import * as api from '../../api/devices';

jest.mock('../../api/devices');

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

const routes = [
  { path: '/devices/:name', element: <DeviceDetailPage /> },
];

test('loads device and renders edit form', async () => {
  api.getDevice.mockResolvedValue({ name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' });
  renderWithRouter(routes, ['/devices/r1']);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/edit device/i)).toBeInTheDocument();
  expect(screen.getByDisplayValue('10.0.0.1')).toBeInTheDocument();
});

test('load error 404 shows not found message', async () => {
  api.getDevice.mockRejectedValue(Object.assign(new Error('Not found'), { status: 404 }));
  renderWithRouter(routes, ['/devices/unknown']);
  expect(await screen.findByRole('alert')).toHaveTextContent(/device not found/i);
});

test('update success shows status and reloads', async () => {
  api.getDevice.mockResolvedValueOnce({ name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' })
                .mockResolvedValueOnce({ name: 'r1', ip_address: '10.0.0.2', type: 'Router', location: 'A' });
  api.updateDevice.mockResolvedValue({});
  renderWithRouter(routes, ['/devices/r1']);

  // Change IP and submit
  const ipInput = await screen.findByLabelText(/ip address/i);
  fireEvent.change(ipInput, { target: { value: '10.0.0.2' } });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() => expect(api.updateDevice).toHaveBeenCalledWith('r1', {
    ip_address: '10.0.0.2',
    type: 'Router',
    location: 'A',
  }));
  expect(await screen.findByText(/updated successfully/i)).toBeInTheDocument();
});

test('update 400 and 404 errors show correct messages', async () => {
  api.getDevice.mockResolvedValue({ name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' });
  api.updateDevice
    .mockRejectedValueOnce(Object.assign(new Error('Invalid input.'), { status: 400, data: { error: 'Invalid input.' } }))
    .mockRejectedValueOnce(Object.assign(new Error('Not found'), { status: 404 }));

  renderWithRouter(routes, ['/devices/r1']);

  // First submission -> 400
  const ipInput = await screen.findByLabelText(/ip address/i);
  fireEvent.change(ipInput, { target: { value: '10.0.0.2' } });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid input/i);

  // Second submission -> 404
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/device not found/i);
});
