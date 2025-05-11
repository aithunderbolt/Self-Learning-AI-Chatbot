GOAL: Implement Phase 2: Google Sheets Integration for the Self-Learning AI Agent.

TASKS:
- [In Progress] Task 2.1: Google Sheets API Authentication
    - Set up Google Cloud Project and enable Google Sheets API. (DONE)
    - Configure OAuth 2.0 credentials (Service Account JSON key). (DONE)
    - Store credentials securely (JSON key in .env, .gitignore updated). (DONE)
    - Install `googleapis` library. (DONE)
    - Share Google Sheet with service account email. (DONE by USER)
    - Implement test function to read data from Google Sheet to verify auth. (DONE - added to server.js, pending test by user)
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
- Added `testGoogleSheetsConnection` function to `server.js` to authenticate and read a sample range (`Sheet1!A2:B16`) from the user-provided `spreadsheetId` on server startup.

COMPLETED:
PERFORMANCE:
NEXT_STEPS: User to restart the server (`npm start`) and check console logs for successful Google Sheets connection and data retrieval, or any errors.
