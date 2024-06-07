import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_ID!;
const CLIENT_SECRET = process.env.GOOGLE_SECRET!;
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL!;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// Add the Gmail scopes here.
const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

export async function GET(req: NextRequest) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  return NextResponse.redirect(url);
}
