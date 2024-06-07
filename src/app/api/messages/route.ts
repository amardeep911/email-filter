"use server";
import type { NextApiRequest, NextApiResponse } from "next";

interface GmailMessage {
  id: string;
  threadId: string;
}

interface GmailResponse {
  messages: GmailMessage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const messages = await fetchGmailMessages(accessToken);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function fetchGmailMessages(
  accessToken: string
): Promise<GmailMessage[]> {
  const response = await fetch(
    "https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Gmail messages");
  }

  const data: GmailResponse = await response.json();
  return data.messages || [];
}
