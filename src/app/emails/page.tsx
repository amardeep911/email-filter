"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import axios from "axios";
import Card from "@/components/Card/Card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
interface GmailMessage {
  title: string;
  content: string;
}

const Page = () => {
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [isKeyExists, setIsKeyExists] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [YOUR_ACCESS_TOKEN, setYOUR_ACCESS_TOKEN] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSaveKey = (enteredKey: string) => {
    localStorage.setItem("openApiKey", enteredKey);
    setIsKeyExists(true);
    setKey(enteredKey);
  };

  //fetch the access token from localstorage

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/messages", {
        headers: {
          Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to fetch emails");
      }
      console.log("res", res);
      setEmails(res.data.emails);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("emails", emails);
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
        <MaxWidthWrapper>
          <Navbar />
          <button
            onClick={() => {
              fetchEmails();
            }}
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Fetching..." : "Fetch Emails"}
          </button>

          <div className="flex flex-col">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              emails.map((email, index) => (
                <Card
                  key={index}
                  title={email?.title}
                  body={email?.content}
                  tag="Email"
                />
              ))
            )}
          </div>
        </MaxWidthWrapper>
      )}
    </div>
  );
};

export default Page;
