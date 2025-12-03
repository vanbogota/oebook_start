import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { env } from "process";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const zipCode = formData.get("zipCode") as string;
    const link = formData.get("link") as string;
    const file = formData.get("file") as File;

    // Validation
    if (!email || !zipCode || !link || !file) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if(process.env.GOOGLE_APP_SCRIPT_URL === undefined) {
      return NextResponse.json(
        { error: "Google Apps Script URL is not defined" },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = buffer.toString("base64");
    const fileName = file.name;

    const res = await fetch(
      process.env.GOOGLE_APP_SCRIPT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          zipCode,
          link,
          fileName,
          fileBase64: base64File,
        }),
      }
    );

    console.log("Google Apps Script response status:", res.status);
    const responseText = await res.text();
    console.log("Google Apps Script response body:", responseText);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Failed to save data to Google Sheets",
          details: `Status ${res.status}: ${responseText}`,
        },
        { status: 500 }
      );
    }
    // Initialize Google Sheets API
    // const auth = new google.auth.GoogleAuth({
    //   credentials: {
    //     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    //   },
    //   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    // });

    // const sheets = google.sheets({ version: "v4", auth });
    // const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Upload file to a storage service (optional)
    // For now, we'll just save the filename
    // const fileName = file.name;
    // const fileSize = file.size;

    // Prepare data for Google Sheets
    // const timestamp = new Date().toISOString();
    // const values = [[timestamp, email, zipCode, link, fileName, fileSize]];

    // Append data to Google Sheet
    // await sheets.spreadsheets.values.append({
    //   spreadsheetId,
    //   range: "Sheet1!A:F", // Adjust range as needed
    //   valueInputOption: "USER_ENTERED",
    //   requestBody: {
    //     values,
    //   },
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully added to waiting list",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to waiting list:", error);
    return NextResponse.json(
      {
        error: "Failed to add to waiting list",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
