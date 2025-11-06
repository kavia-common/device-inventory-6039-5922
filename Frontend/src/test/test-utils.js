import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

// Renders a given element at a specific route using a memory router
export function renderWithRouter(routes, initialEntries = ['/']) {
  const router = createMemoryRouter(routes, { initialEntries });
  return {
    ...render(<RouterProvider router={router} />),
    router,
  };
}

// Global helpers to spy on window.confirm and window.alert per test
export function mockWindowConfirm(result = true) {
  const spy = jest.spyOn(window, 'confirm').mockImplementation(() => result);
  return spy;
}
export function mockWindowAlert() {
  const spy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  return spy;
}
