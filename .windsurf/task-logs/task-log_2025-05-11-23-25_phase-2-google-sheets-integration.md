GOAL: Implement Phase 2: Google Sheets Integration for the Self-Learning AI Agent.

TASKS:
- [In Progress] Task 2.1: Google Sheets API Authentication
    - Set up Google Cloud Project and enable Google Sheets API. (DONE)
    - Configure OAuth 2.0 credentials (Service Account JSON key). (DONE)
    - Store credentials securely (JSON key in .env, .gitignore updated). (DONE)
    - Install `googleapis` library. (DONE)
    - Share Google Sheet with service account email. (DONE by USER)
    - Implement test function to read data from Google Sheet to verify auth. (PENDING)
- [ ] Task 2.2: Data Retrieval Module
- [ ] Task 2.3: Data Mapping/Query Logic
- [ ] Task 2.4: Integrate with Q&A Flow
- [ ] Task 2.5: Basic Caching Strategy

IMPLEMENTATION:
- User created a GCP project, enabled Google Sheets API, created a service account, and downloaded the JSON key file.
- Stored the JSON key file in `backend/credentials/google-sheets-creds.json`.
- Added `backend/credentials/` to `backend/.gitignore`.
- Added `GOOGLE_APPLICATION_CREDENTIALS` path to `backend/.env` and `backend/.env.example`.
- User confirmed sharing the target Google Sheet with the service account's `client_email`.
- Installed the `googleapis` npm package.

COMPLETED:
PERFORMANCE:
NEXT_STEPS: Get `spreadsheetId` and a sample `range` from the user to implement a test read function in `server.js`.
