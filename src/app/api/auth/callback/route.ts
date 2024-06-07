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

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  console.log("code", code);
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!tokens.access_token) {
      return NextResponse.json(
        { error: "No access token received" },
        { status: 500 }
      );
    }

    // Store the access token in a cookie
    const response = NextResponse.redirect("http://localhost:3000/emails");
    response.cookies.set("accessToken", tokens.access_token, {
      httpOnly: true,
    });

    // Fetch user info using the access token
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });
    const userInfoResponse = await oauth2.userinfo.get();

    console.log("User Info", userInfoResponse.data);

    console.log("tokens", tokens);
    return response;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json(
      { error: "Error exchanging code for tokens" },
      { status: 500 }
    );
  }
}
