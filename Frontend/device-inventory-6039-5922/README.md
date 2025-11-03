# Device Inventory Application

This project is a lightweight web application for managing a network device inventory. It includes:
- React frontend (this repository's Frontend container)
- Python Flask backend (not included in this step)
- REST API endpoints for devices CRUD as per the provided OpenAPI spec

Frontend highlights:
- Device list, create, edit, delete
- Client-side validation including IPv4/IPv6 format sanity check
- Accessible forms and buttons with ARIA attributes
- Responsive, keyboard navigable UI
- Configurable backend base URL via environment variable

Getting Started (Frontend)
1) Install dependencies:
   cd device-inventory-6039-5922/Frontend
   npm install

2) Configure environment:
   - Copy .env.example to .env and set:
     backend_api_base_url=http://localhost:5000
   - This value must point to the backend base URL exposing:
     GET  /devices
     POST /devices
     GET  /devices/{name}
     PUT  /devices/{name}
     DELETE /devices/{name}

3) Run:
   npm start
   Open http://localhost:3000

Environment Variables
- backend_api_base_url: The base URL of the backend API. Example: http://localhost:5000

Build-time note
- The frontend reads process.env.backend_api_base_url at build time. Ensure your environment injects this variable or expose window.__ENV__.backend_api_base_url for runtime overrides.

API Endpoints (from OpenAPI)
- GET  /devices                    -> List devices
- POST /devices                    -> Create device (201, 400, 409)
- GET  /devices/{name}             -> Get device
- PUT  /devices/{name}             -> Update device (200, 400, 404)
- DELETE /devices/{name}           -> Delete device (204, 404)

Device Schema
- name: string (unique)
- ip_address: string (IPv4/IPv6)
- type: string enum ["Router","Switch","Server"]
- location: string

Notes
- If the backend is not yet available, the frontend will display error messages from failed fetch calls based on the configured base URL.

