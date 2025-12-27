# Google Sheets Integration Setup Guide

This guide explains how to integrate Google Sheets with the waiting list form.

## Prerequisites

- A Google account
- A Google Sheets spreadsheet for storing form submissions

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "OEBook Waiting List")
4. Click "Create"

### 2. Enable Google Sheets API

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 3. Create Service Account Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter a name (e.g., "waiting-list-service")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 4. Generate and Download Key File

1. Click on the created service account email
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create" - the JSON file will download automatically

### 5. Prepare Your Google Sheet

1. Create a new Google Sheet or open an existing one
2. Add headers in the first row:
   - Column A: `Timestamp`
   - Column B: `Email`
   - Column C: `Zip Code`
   - Column D: `Book Link`
   - Column E: `Receipt Filename`
   - Column F: `File Size`

3. **Important:** Share the sheet with the service account:
   - Click "Share" button
   - Paste the service account email (from the JSON file, looks like: `your-service@project.iam.gserviceaccount.com`)
   - Give "Editor" access
   - Uncheck "Notify people"
   - Click "Share"

### 6. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open the downloaded JSON key file and copy these values to `.env.local`:

   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
   ```

3. Get your Google Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
   - Copy the `SPREADSHEET_ID` part
   - Add to `.env.local`:
   ```env
   GOOGLE_SHEET_ID=your-spreadsheet-id-here
   ```

### 7. Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the waiting list form
3. Fill out all fields and submit
4. Check your Google Sheet - a new row should appear with the submission data

## Troubleshooting

### "Permission denied" error
- Make sure you shared the Google Sheet with the service account email
- Verify the service account has "Editor" access

### "Invalid credentials" error
- Check that the private key is properly formatted with `\n` characters
- Ensure there are no extra spaces in the environment variables

### "Spreadsheet not found" error
- Verify the `GOOGLE_SHEET_ID` is correct
- Check that the spreadsheet exists and is accessible

## Security Notes

- **Never commit** `.env.local` or the JSON key file to version control
- The `.env.example` file should only contain placeholder values
- Keep your service account credentials secure
- Regularly rotate your service account keys

## API Endpoint

The form data is sent to: `/api/waiting-list`

**Request Format:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Fields:
  - `email`: User's email address
  - `zipCode`: Delivery zip code
  - `link`: Link to book file
  - `file`: Receipt image file

**Response Format:**
```json
{
  "success": true,
  "message": "Successfully added to waiting list"
}
```

## Future Enhancements

Consider adding:
- File upload to Google Drive or cloud storage
- Email notifications when new submissions arrive
- Data validation and duplicate checking
- Rate limiting to prevent spam
