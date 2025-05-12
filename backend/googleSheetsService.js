require('dotenv').config(); // Ensure environment variables are loaded
const { google } = require('googleapis');

// Reusable function to authenticate and get the Sheets API client
async function getSheetsClient() {
    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const authClient = await auth.getClient();
    return google.sheets({ version: 'v4', auth: authClient });
}

/**
 * Fetches data from a specified Google Sheet range.
 * @param {string} spreadsheetId The ID of the Google Sheet.
 * @param {string} range The A1 notation range to fetch (e.g., 'Sheet1!A1:B10').
 * @returns {Promise<Array<Array<string>> | null>} A promise that resolves to a 2D array of the data, or null if no data/error.
 * @throws Will throw an error if the API call fails.
 */
async function getSheetData(spreadsheetId, range) {
    if (!spreadsheetId || !range) {
        console.error('getSheetData: spreadsheetId and range are required.');
        return null;
    }

    try {
        const sheets = await getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values;
        if (rows && rows.length) {
            console.log(`getSheetData: Successfully fetched ${rows.length} rows from ${spreadsheetId} range ${range}.`);
            return rows;
        } else {
            console.log(`getSheetData: No data found in ${spreadsheetId} range ${range}.`);
            return []; // Return empty array if no data found
        }
    } catch (error) {
        console.error(`getSheetData: Error fetching data from ${spreadsheetId} range ${range}:`);
        console.error('Error Message:', error.message);
        if (error.response && error.response.data && error.response.data.error) {
            console.error('Google API Error Details:', JSON.stringify(error.response.data.error, null, 2));
        }
        // Rethrow the error so the caller can handle it if needed
        throw new Error(`Failed to fetch sheet data: ${error.message}`); 
    }
}

module.exports = {
    getSheetData,
};
