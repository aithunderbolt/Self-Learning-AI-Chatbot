GOAL: Implement Phase 2: Google Sheets Integration for the Self-Learning AI Agent.

TASKS:
- [X] Task 2.1: Google Sheets API Authentication
    - Set up Google Cloud Project and enable Google Sheets API. (DONE)
    - Configure OAuth 2.0 credentials (Service Account JSON key). (DONE)
    - Store credentials securely (JSON key in .env, .gitignore updated). (DONE)
    - Install `googleapis` library. (DONE)
    - Share Google Sheet with service account email. (DONE by USER)
    - Implement test function to read data from Google Sheet to verify auth. (DONE - successfully tested on server startup)
- [X] Task 2.2: Data Retrieval Module
    - Create `googleSheetsService.js` module. (DONE)
    - Implement initial `getSheetData(spreadsheetId, range)` function. (DONE)
- [X] Task 2.3: Data Mapping/Query Logic
    - Implemented in-memory Map (`faqDataMap`) for FAQ data. (DONE)
    - Added `loadFaqData` function to populate map on startup using `getSheetData`. (DONE)
    - Normalized questions to lowercase for matching. (DONE)
- [X] Task 2.4: Integrate with Q&A Flow
    - Modified `/chat` endpoint to check `faqDataMap` before NLU call. (DONE)
    - If match found, use sheet answer and skip NLU. (DONE)
    - If no match, proceed to NLU as before. (DONE)
    - Updated Supabase logging to indicate if response came from 'FAQ' or NLU model. (DONE)
- [ ] Task 2.5: Basic Caching Strategy
    - Currently loads data only on server startup.

IMPLEMENTATION:
- User created a GCP project, enabled Google Sheets API, created a service account, and downloaded the JSON key file.
- Stored the JSON key file in `backend/credentials/google-sheets-creds.json`.
- Added `backend/credentials/` to `backend/.gitignore`.
- Added `GOOGLE_APPLICATION_CREDENTIALS` path to `backend/.env` and `backend/.env.example`.
- User confirmed sharing the target Google Sheet with the service account's `client_email`.
- Installed the `googleapis` npm package.
- Added `testGoogleSheetsConnection` function to `server.js` (later removed) to authenticate and read a sample range (`Sheet1!A2:B16`) from the user-provided `spreadsheetId` on server startup.
- Confirmed successful connection and data retrieval from Google Sheets via server logs.
- Created `backend/googleSheetsService.js` module.
- Defined and exported an async function `getSheetData(spreadsheetId, range)` within `googleSheetsService.js` to handle authentication and retrieve data from the specified sheet range.
- Created `faqDataMap` (Map object) in `server.js` to hold FAQ data.
- Implemented `loadFaqData` function in `server.js` to call `getSheetData` on startup and populate `faqDataMap`, normalizing questions to lowercase.
- Removed the dedicated `testGoogleSheetsConnection` function.
- Modified `/chat` endpoint to first check for a match (case-insensitive) in `faqDataMap`. If found, the predefined answer is returned directly, skipping the OpenRouter API call.
- Updated conversation logging in Supabase to set `model_used` to 'google_sheet_faq' when an answer comes from the sheet.

COMPLETED:
- Tasks 2.1, 2.2, 2.3, 2.4 completed as of 2025-05-12.
PERFORMANCE:
- FAQ lookup and NLU fallback tested successfully by USER.
NEXT_STEPS: Decide whether to implement Task 2.5 (Caching/Refresh Strategy for Google Sheet data) or move to Phase 3 (Website Chat Widget).
