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
- Backend base URL is hardcoded in the source for simplicity

Getting Started (Frontend)
1) Install dependencies:
   cd device-inventory-6039-5922/Frontend
   npm install

2) Configure backend base URL:
   - Open device-inventory-6039-5922/Frontend/src/api/client.js
   - Set BACKEND_API_BASE_URL to your backend address (default "http://localhost:5000").

3) Run:
   npm start
   Open http://localhost:3000

Environment Variables
- Not used for the backend API base URL. Do not add REACT_APP_* for this purpose.

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
- If the backend is not yet available or the URL is incorrect, the frontend will display error messages from failed fetch calls.
