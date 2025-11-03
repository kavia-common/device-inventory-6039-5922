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
   - Set REACT_APP_API_BASE_URL to your backend (default http://localhost:5000)

3) Run the app:
   npm start
   Open http://localhost:3000

Environment Variables
- REACT_APP_API_BASE_URL: Backend API base URL. Example: http://localhost:5000

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
- This project uses Create React App (CRA).
