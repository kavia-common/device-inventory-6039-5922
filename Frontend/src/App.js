import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './styles.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Application shell with a simple top navbar and an Outlet for route content.
   */
  return (
    <div className="app-shell">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink to="/devices" className={({ isActive }) => isActive ? 'active' : undefined}>Devices</NavLink>
        <a href="https://react.dev" target="_blank" rel="noreferrer">Docs</a>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
