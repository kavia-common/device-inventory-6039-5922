import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DeviceList from '../DeviceList';

test('renders empty state when no devices', () => {
  render(<DeviceList devices={[]} onDelete={() => {}} />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
  expect(screen.getByText(/no devices found/i)).toBeInTheDocument();
});

test('renders table rows and edit links', () => {
  const devices = [
    { name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' },
    { name: 's1', ip_address: '10.0.0.2', type: 'Server', location: 'B' },
  ];
  render(<DeviceList devices={devices} onDelete={() => {}} />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /view r1/i })).toBeInTheDocument();
  expect(screen.getByText('10.0.0.2')).toBeInTheDocument();
});

test('calls onDelete when clicking delete', () => {
  const devices = [{ name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' }];
  const onDelete = jest.fn();
  render(<DeviceList devices={devices} onDelete={onDelete} />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });
  fireEvent.click(screen.getByRole('button', { name: /delete/i }));
  expect(onDelete).toHaveBeenCalledWith('r1');
});
