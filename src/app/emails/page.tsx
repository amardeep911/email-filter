"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import axios from "axios";
interface GmailMessage {
  id: string;
  threadId: string;
}

const Page = () => {
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [isKeyExists, setIsKeyExists] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [YOUR_ACCESS_TOKEN, setYOUR_ACCESS_TOKEN] = useState<string>("");

  const handleSaveKey = (enteredKey: string) => {
    localStorage.setItem("openApiKey", enteredKey);
    setIsKeyExists(true);
    setKey(enteredKey);
  };

  //fetch the access token from localstorage

  const fetchEmails = async () => {
    try {
      const res = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`, // Replace with your method of getting the access token
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch emails");
      }

      const data: GmailMessage[] = await res.json();
      setEmails(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-screen h-screen ">
      {!isKeyExists ? (
        <Dialog open={true}>
          <DialogTrigger asChild>
            <button className="hidden" />
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col items-center">
              <p>Please enter your Open API Key</p>
              <input
                type="text"
                onChange={(e) => setKey(e.target.value)}
                value={key}
                className="border p-2 rounded-md"
              />
              <button
                onClick={() => handleSaveKey(key)}
                className="bg-blue-500 text-white p-2 rounded-md mt-2"
              >
                Save Key
              </button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <Navbar />
          <div className="w-full h-full flex flex-col justify-center items-center">
            <p>Dashboard</p>
            <button onClick={fetchEmails}>Fetch Emails</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
