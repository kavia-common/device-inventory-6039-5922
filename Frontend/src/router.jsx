import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailPage from './pages/DeviceDetailPage';

// PUBLIC_INTERFACE
export const router = createBrowserRouter([
  { path: '/', element: <DevicesPage /> },
  { path: '/devices', element: <DevicesPage /> },
  { path: '/devices/:name', element: <DeviceDetailPage /> },
]);
