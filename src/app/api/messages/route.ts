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
  const accessToken = req.cookies.get("accessToken");
  console.log("accessToken", accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token not found in cookie" },
      { status: 400 }
    );
  }

  try {
    oauth2Client.setCredentials({ access_token: accessToken.value });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10, // Adjust maxResults as needed
    });
    const messages = response.data.messages;
    const emails = [];

    if (messages && messages.length > 0) {
      // Iterate through each message and fetch its title and content
      for (const message of messages) {
        const params = {
          userId: "me",
          id: message.id ?? "",
        };
        const messageDetails = await gmail.users.messages.get(params);

        const subject = messageDetails?.data?.payload?.headers?.find(
          (header) => header.name === "Subject"
        )?.value;

        // Extract email content
        let content = "";
        if (messageDetails?.data?.payload?.parts) {
          const bodyPart = messageDetails.data.payload.parts.find(
            (part) => part.mimeType === "text/plain"
          );
          if (bodyPart) {
            const bodyData = Buffer.from(
              bodyPart?.body?.data ?? "",
              "base64"
            ).toString();
            // Extract the first 10 lines of the email body
            const bodyLines = bodyData.split("\n").slice(0, 10); // Adjust the number of lines as needed
            content = bodyLines.join("\n");
          }
        }

        // Push email title and content to the array
        emails.push({ title: subject, content });
      }
    } else {
      console.log("No emails found.");
    }
    // Respond with success message
    return NextResponse.json({
      message: "Emails fetched successfully",
      emails: emails,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    // Respond with error message
    return NextResponse.json(
      { error: "Error fetching emails" },
      { status: 500 }
    );
  }
}
