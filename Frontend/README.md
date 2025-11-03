# Device Inventory Frontend

This React app provides UI for managing devices via a REST API.

Features
- List, add, edit, and delete devices
- Client-side validation including basic IPv4/IPv6 format check
- Accessible and responsive UI (labels, ARIA, keyboard navigable)
- Clear error and loading states
- Backend API base URL is hardcoded in the source for simplicity

Quick Start
1) Install dependencies:
   npm install

2) Configure backend base URL:
   - Open src/api/client.js
   - Change the value of BACKEND_API_BASE_URL (default "http://localhost:5000") to match your backend environment.

3) Run the app:
   npm start
   Open http://localhost:3000

Environment Variables
- Not used for the backend API base URL. Do not set REACT_APP_* or other env vars for this purpose.

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
    client.js       # fetch wrapper using a hardcoded BACKEND_API_BASE_URL
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
- If the backend is not running or the URL is incorrect, actions will show error messages based on response or network failure.

Configuration (Important)
- The backend base URL is now hardcoded. Change it in src/api/client.js by editing BACKEND_API_BASE_URL.
- Do not reintroduce environment variables such as REACT_APP_* for the API base URL.
