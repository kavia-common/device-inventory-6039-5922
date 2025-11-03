import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import App from './App';

// We render App as the layout using a wrapper router at runtime via RouterProvider.
// The router definitions already point to page components.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Provide a top-level app shell by embedding routes within App via RouterProvider fallback */}
    <RouterProvider router={router} fallbackElement={<div className="status info">Loading…</div>} />
  </React.StrictMode>
);
