# Device Inventory Frontend

This React app provides UI for managing devices via a REST API.

Features
- List, add, edit, and delete devices
- Client-side validation including basic IPv4/IPv6 format check
- Accessible and responsive UI (labels, ARIA, keyboard navigable)
- Clear error and loading states
- Environment variable controls the backend base URL

Quick Start
1) Install dependencies:
   npm install

2) Configure environment:
   - Copy `.env.example` to `.env`
   - Set BACKEND_API_BASE_URL to your backend (default http://localhost:5000)
   - Lowercase backend_api_base_url is also supported for backward compatibility.

3) Run the app:
   npm start
   Open http://localhost:3000

Environment Variables
- BACKEND_API_BASE_URL (recommended): Backend API base URL. Example: http://localhost:5000
- backend_api_base_url (backward compatible): Same as above, supported for legacy setups.

Build-time and runtime notes
- The app resolves the base URL using this precedence:
  1) process.env.BACKEND_API_BASE_URL
  2) process.env.backend_api_base_url
  3) import.meta.env.VITE_BACKEND_API_BASE_URL
  4) import.meta.env.VITE_backend_api_base_url
  5) window.__ENV__.BACKEND_API_BASE_URL
  6) window.__ENV__.backend_api_base_url
- Ensure your build environment injects one of the above (recommended: BACKEND_API_BASE_URL via .env or CI variables).
- For client-side runtime injection, you can expose window.__ENV__.BACKEND_API_BASE_URL (or the lowercase variant) as a fallback.

API Endpoints (expected)
- GET    /devices
- POST   /devices
- GET    /devices/{name}
- PUT    /devices/{name}
- DELETE /devices/{name}

Routing
- /devices            -> list and create
- /devices/:name      -> edit existing

```text
src/
  api/
    client.js       # fetch wrapper using env base URL
    devices.js      # CRUD API methods
  components/
    DeviceForm.jsx  # Form with validation
    DeviceList.jsx  # Table with actions
  pages/
    DevicesPage.jsx       # List + create
    DeviceDetailPage.jsx  # Edit
  router.jsx
  index.js
  App.js
  styles.css
```

Notes
- If the backend is not running, actions will show error messages based on response or network failure.

Configuration (Important)
- BACKEND_API_BASE_URL is the canonical variable for the backend base URL.
- Lowercase backend_api_base_url remains supported for backward compatibility.
- Legacy variables such as REACT_APP_BASE_URL or REACT_APP_API_BASE_URL are not supported and should not be used anywhere in your configuration or code.
